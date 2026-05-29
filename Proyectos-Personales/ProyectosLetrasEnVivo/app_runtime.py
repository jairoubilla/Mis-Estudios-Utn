from __future__ import annotations

import json
import os
import re
import sys
import threading
import unicodedata
from collections import deque
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass
from difflib import SequenceMatcher
from pathlib import Path
from typing import Any

import numpy as np
import sounddevice as sd
from PyQt6.QtCore import QEvent, QEasingCurve, QObject, QPropertyAnimation, Qt, QTimer, pyqtSignal, pyqtSlot
from PyQt6.QtGui import QColor, QFont, QKeyEvent
from PyQt6.QtWidgets import (
    QApplication,
    QCheckBox,
    QFileDialog,
    QHBoxLayout,
    QLabel,
    QListWidget,
    QListWidgetItem,
    QMainWindow,
    QProgressBar,
    QPushButton,
    QVBoxLayout,
    QWidget,
)

try:
    from rapidfuzz import fuzz
except Exception:  # pragma: no cover - fallback to difflib
    fuzz = None


SAMPLE_RATE = 16_000
CHUNK_SECONDS = 2.0
CHUNK_SAMPLES = int(SAMPLE_RATE * CHUNK_SECONDS)
CHUNK_STEP_SECONDS = 0.5
CHUNK_STEP_SAMPLES = int(SAMPLE_RATE * CHUNK_STEP_SECONDS)
SILENCE_THRESHOLD = 0.015
MATCH_THRESHOLD = 0.64
SEARCH_BACK = 2
SEARCH_FORWARD = 5
DEFAULT_LYRICS_PATH = Path("letras.json")

SCORE_BONUS_FORWARD = 0.03
SCORE_PENALTY_DISTANCE = 0.015
SCORE_MAX_PENALTY = 0.12
SCORE_STAY_MARGIN = 0.05
SCORE_BACKTRACK_MARGIN = 0.08
TRANSCRIPT_HISTORY_SIZE = 3
TRANSCRIPT_HISTORY_PENALTY = 0.02
PLAYHEAD_OVERLAY_HEIGHT = 118
MICROPHONE_DEVICE_HINTS = ("microfono", "microphone", "headset", "line in", "entrada de linea", "line input")
SYSTEM_AUDIO_DEVICE_HINTS = ("mezcla estereo", "stereo mix", "what u hear", "loopback", "wave out")


_WHISPER_MODEL_CLASS: Any | None = None
_WHISPER_IMPORT_ATTEMPTED = False
_WHISPER_IMPORT_ERROR: str | None = None


def import_whisper_model_class() -> tuple[Any | None, str | None]:
    global _WHISPER_MODEL_CLASS, _WHISPER_IMPORT_ATTEMPTED, _WHISPER_IMPORT_ERROR

    if _WHISPER_IMPORT_ATTEMPTED:
        return _WHISPER_MODEL_CLASS, _WHISPER_IMPORT_ERROR

    _WHISPER_IMPORT_ATTEMPTED = True

    try:
        from faster_whisper import WhisperModel as imported_whisper_model
    except Exception as exc:  # pragma: no cover - dependency is optional at runtime
        _WHISPER_MODEL_CLASS = None
        _WHISPER_IMPORT_ERROR = f"{type(exc).__name__}: {exc}"
    else:
        _WHISPER_MODEL_CLASS = imported_whisper_model
        _WHISPER_IMPORT_ERROR = None

    return _WHISPER_MODEL_CLASS, _WHISPER_IMPORT_ERROR


def detect_cuda_device_count() -> int:
    try:
        import ctranslate2
    except Exception:  # pragma: no cover - optional runtime dependency detail
        return 0

    try:
        return int(ctranslate2.get_cuda_device_count())
    except Exception:  # pragma: no cover - hardware/runtime dependent
        return 0


def build_whisper_attempts(device_preference: str) -> list[tuple[str, str]]:
    if device_preference == "cpu":
        return [("cpu", "int8"), ("cpu", "float32")]

    cuda_attempts = [("cuda", "float16"), ("cuda", "int8_float16")]
    cpu_attempts = [("cpu", "int8"), ("cpu", "float32")]
    cuda_device_count = detect_cuda_device_count()

    if device_preference == "cuda":
        return cuda_attempts + cpu_attempts
    if cuda_device_count > 0:
        return cuda_attempts + cpu_attempts
    return cpu_attempts


def get_hostapi_name(index: int) -> str:
    try:
        return str(sd.query_hostapis(index)["name"])
    except Exception:
        return "Desconocido"


def get_default_input_device_id() -> int | None:
    try:
        default_device = sd.default.device
    except Exception:
        default_device = None

    if isinstance(default_device, (list, tuple)) and default_device:
        try:
            device_id = int(default_device[0])
        except Exception:
            device_id = -1
        if device_id >= 0:
            return device_id

    if default_device is not None:
        try:
            device_id = int(default_device)
        except Exception:
            device_id = -1
        if device_id >= 0:
            return device_id

    try:
        hostapi_index = int(sd.default.hostapi)
        hostapi_info = sd.query_hostapis(hostapi_index)
        device_id = int(hostapi_info.get("default_input_device", -1))
        return device_id if device_id >= 0 else None
    except Exception:
        return None


def choose_preferred_input_device() -> tuple[int | None, str | None]:
    try:
        devices = sd.query_devices()
    except Exception:
        return None, None

    default_input_device_id = get_default_input_device_id()
    best_score = -1
    best_device_id: int | None = None
    best_label: str | None = None

    for device_id, info in enumerate(devices):
        if int(info.get("max_input_channels", 0) or 0) <= 0:
            continue

        name = str(info.get("name", ""))
        normalized_name = normalize_text(name)
        hostapi_name = get_hostapi_name(int(info.get("hostapi", -1)))
        normalized_hostapi = normalize_text(hostapi_name)

        score = 0
        if default_input_device_id is not None and device_id == default_input_device_id:
            score += 40
        if any(hint in normalized_name for hint in MICROPHONE_DEVICE_HINTS):
            score += 90
        if any(hint in normalized_name for hint in SYSTEM_AUDIO_DEVICE_HINTS):
            score -= 120
        if "mme" in normalized_hostapi:
            score += 18
        elif "directsound" in normalized_hostapi:
            score += 12
        elif "windows wasapi" in normalized_hostapi:
            score += 8
        elif "windows wdm ks" in normalized_hostapi:
            score -= 4

        if "usb" in normalized_name:
            score += 8
        if "realtek" in normalized_name:
            score += 5
        if "altavoz" in normalized_name or "speaker" in normalized_name:
            score -= 10
        if "webcam" in normalized_name:
            score -= 8

        if score > best_score:
            best_score = score
            best_device_id = device_id
            best_label = f"{name} ({hostapi_name})"

    if best_score < 0:
        return None, None

    return best_device_id, best_label


def build_input_device_attempts() -> list[tuple[int | None, str | None]]:
    attempts: list[tuple[int | None, str | None]] = []
    seen: set[int | None] = set()

    preferred_device, preferred_label = choose_preferred_input_device()
    if preferred_device is not None:
        attempts.append((preferred_device, preferred_label))
        seen.add(preferred_device)

    default_input_device_id = get_default_input_device_id()
    if default_input_device_id is not None and default_input_device_id not in seen:
        default_label = None
        try:
            device_name = str(sd.query_devices(default_input_device_id)["name"])
            default_label = f"{device_name} ({get_hostapi_name(int(sd.query_devices(default_input_device_id)['hostapi']))})"
        except Exception:
            default_label = f"Dispositivo de entrada por defecto #{default_input_device_id}"
        attempts.append((default_input_device_id, default_label))
        seen.add(default_input_device_id)

    attempts.append((None, None))
    return attempts


def prepare_audio_for_transcription(samples: np.ndarray) -> np.ndarray:
    prepared = np.asarray(samples, dtype=np.float32).flatten()
    if prepared.size == 0:
        return prepared

    prepared = prepared - float(np.mean(prepared))
    peak = float(np.max(np.abs(prepared))) if prepared.size else 0.0
    if 0.04 <= peak < 0.75:
        prepared = prepared * min(0.75 / peak, 3.0)

    return np.clip(prepared, -1.0, 1.0)


def resample_audio(samples: np.ndarray, source_rate: float, target_rate: int) -> np.ndarray:
    prepared = np.asarray(samples, dtype=np.float32).flatten()
    if prepared.size == 0:
        return prepared
    if source_rate <= 0 or int(round(source_rate)) == target_rate:
        return prepared

    target_length = max(1, int(round(prepared.size * float(target_rate) / float(source_rate))))
    source_positions = np.linspace(0.0, prepared.size - 1, num=prepared.size, dtype=np.float32)
    target_positions = np.linspace(0.0, prepared.size - 1, num=target_length, dtype=np.float32)
    return np.interp(target_positions, source_positions, prepared).astype(np.float32)


def preload_whisper_model(
    model_name: str = "base",
    device_preference: str = "auto",
) -> tuple[Any | None, str | None]:
    import logging

    whisper_model_class, import_error = import_whisper_model_class()
    if whisper_model_class is None:
        message = "faster-whisper no está instalado o no pudo importarse."
        if import_error:
            message = f"{message} Detalle: {import_error}"
        return None, message

    last_error: Exception | None = None
    for device, compute_type in build_whisper_attempts(device_preference):
        try:
            logging.info("Precargando Whisper con device=%s compute_type=%s", device, compute_type)
            model = whisper_model_class(
                model_name,
                device=device,
                compute_type=compute_type,
                cpu_threads=max(1, (os.cpu_count() or 4) // 2),
            )
            logging.info("Whisper precargado correctamente con device=%s compute_type=%s", device, compute_type)
            return model, None
        except Exception as exc:  # pragma: no cover - dependency/hardware dependent
            logging.exception(
                "Fallo precargando Whisper con device=%s compute_type=%s: %s",
                device,
                compute_type,
                exc,
            )
            last_error = exc

    message = f"No se pudo cargar Whisper al iniciar: {last_error}" if last_error else "No se pudo cargar Whisper al iniciar."
    return None, message


@dataclass(slots=True)
class LyricsDocument:
    title: str
    lines: list[str]
    normalized_lines: list[str]
    source_path: Path | None = None

    @classmethod
    def empty(cls) -> "LyricsDocument":
        return cls(title="Sin letra cargada", lines=[], normalized_lines=[], source_path=None)


@dataclass(slots=True)
class MatchResult:
    index: int
    score: float
    transcript: str
    matched_text: str


def normalize_text(value: str) -> str:
    lowered = value.lower()
    without_accents = "".join(
        char for char in unicodedata.normalize("NFD", lowered) if unicodedata.category(char) != "Mn"
    )
    without_annotations = re.sub(r"\[[^\]]*\]|\([^)]*\)", " ", without_accents)
    alphanumeric = re.sub(r"[^a-z0-9\s]", " ", without_annotations)
    return re.sub(r"\s+", " ", alphanumeric).strip()


def clean_lyric_line(line: str) -> str:
    line = re.sub(r"\[[^\]]*\]|\([^)]*\)", " ", line)
    return re.sub(r"\s+", " ", line).strip()


def similarity_score(a: str, b: str) -> float:
    if not a or not b:
        return 0.0
    if fuzz is not None:
        ratio = fuzz.ratio(a, b) / 100.0
        partial = fuzz.partial_ratio(a, b) / 100.0
        token = fuzz.token_set_ratio(a, b) / 100.0
        return max(ratio, partial, token)
    return SequenceMatcher(None, a, b).ratio()


def load_lyrics(path: Path) -> LyricsDocument:
    if not path.exists():
        raise FileNotFoundError(f"No existe el archivo de letra: {path}")

    if path.suffix.lower() == ".json":
        payload = json.loads(path.read_text(encoding="utf-8"))
        title = "Letra en vivo"
        lines: list[str] = []

        if isinstance(payload, dict):
            title = str(payload.get("title") or payload.get("titulo") or title)
            raw_lines = payload.get("lines") or payload.get("lyrics") or payload.get("letra") or []
        elif isinstance(payload, list):
            raw_lines = payload
        else:
            raise ValueError("El JSON debe ser una lista de líneas o un objeto con 'lines'.")

        for entry in raw_lines:
            if isinstance(entry, str):
                lines.append(entry)
            elif isinstance(entry, dict):
                candidate = entry.get("text") or entry.get("line") or entry.get("lyrics")
                if candidate:
                    lines.append(str(candidate))
    else:
        title = path.stem
        lines = path.read_text(encoding="utf-8").splitlines()

    cleaned_lines = [clean_lyric_line(line) for line in lines]
    pairs = [(line, normalize_text(line)) for line in cleaned_lines if line]
    filtered_pairs = [(line, normalized_line) for line, normalized_line in pairs if normalized_line]
    final_lines = [line for line, _ in filtered_pairs]
    normalized = [normalized_line for _, normalized_line in filtered_pairs]

    if not final_lines:
        raise ValueError("No quedaron líneas utilizables después del pre-procesamiento.")

    return LyricsDocument(title=title, lines=final_lines, normalized_lines=normalized, source_path=path)


class LyricsSynchronizer:
    def __init__(
        self,
        threshold: float = MATCH_THRESHOLD,
        search_back: int = SEARCH_BACK,
        search_forward: int = SEARCH_FORWARD,
        transcript_history_size: int = TRANSCRIPT_HISTORY_SIZE,
    ) -> None:
        self.threshold = threshold
        self.search_back = search_back
        self.search_forward = search_forward
        self.document = LyricsDocument.empty()
        self.current_index = 0
        self._recent_transcripts: deque[str] = deque(maxlen=max(1, transcript_history_size))

    def set_document(self, document: LyricsDocument) -> None:
        self.document = document
        self.current_index = 0
        self._recent_transcripts.clear()

    def set_current_index(self, index: int) -> None:
        if not self.document.lines:
            self.current_index = 0
            return
        self.current_index = max(0, min(index, len(self.document.lines) - 1))

    def _remember_transcript(self, transcript: str) -> None:
        if not transcript:
            return
        if self._recent_transcripts and self._recent_transcripts[-1] == transcript:
            return
        self._recent_transcripts.append(transcript)

    def _build_transcript_variants(self) -> list[tuple[str, float]]:
        variants: list[tuple[str, float]] = []
        seen: set[str] = set()
        history = list(self._recent_transcripts)

        for size in range(1, len(history) + 1):
            joined = " ".join(history[-size:]).strip()
            if not joined or joined in seen:
                continue
            seen.add(joined)
            penalty = max(0, size - 1) * TRANSCRIPT_HISTORY_PENALTY
            variants.append((joined, penalty))

        return variants

    def _candidate_texts(self, index: int) -> list[str]:
        texts = [self.document.normalized_lines[index]]

        if index > 0:
            texts.append(f"{self.document.normalized_lines[index - 1]} {self.document.normalized_lines[index]}")
        if index + 1 < len(self.document.normalized_lines):
            texts.append(f"{self.document.normalized_lines[index]} {self.document.normalized_lines[index + 1]}")
        if 0 < index < len(self.document.normalized_lines) - 1:
            texts.append(
                " ".join(
                    [
                        self.document.normalized_lines[index - 1],
                        self.document.normalized_lines[index],
                        self.document.normalized_lines[index + 1],
                    ]
                )
            )

        return texts

    def _score_anchor(self, index: int, transcript_variants: list[tuple[str, float]]) -> float:
        best_score = 0.0

        for candidate_text in self._candidate_texts(index):
            for transcript, penalty in transcript_variants:
                score = similarity_score(transcript, candidate_text) - penalty
                if transcript in candidate_text or candidate_text in transcript:
                    score += 0.03
                best_score = max(best_score, min(score, 1.0))

        return best_score

    def match(self, transcript: str) -> MatchResult | None:
        normalized_transcript = normalize_text(transcript)
        if len(normalized_transcript) < 4 or not self.document.normalized_lines:
            return None

        self._remember_transcript(normalized_transcript)
        transcript_variants = self._build_transcript_variants()

        if self.current_index == 0:
            start = 0
            end = min(len(self.document.lines), max(self.search_forward + 6, 10))
        else:
            start = max(0, self.current_index - self.search_back)
            end = min(len(self.document.lines), self.current_index + self.search_forward + 1)

        score_by_index: dict[int, float] = {}

        for index in range(start, end):
            score = self._score_anchor(index, transcript_variants)
            if index >= self.current_index:
                score += SCORE_BONUS_FORWARD
            score -= min(abs(index - self.current_index) * SCORE_PENALTY_DISTANCE, SCORE_MAX_PENALTY)
            score_by_index[index] = score

        if not score_by_index:
            return None

        best_index = max(score_by_index, key=score_by_index.get)
        best_score = score_by_index[best_index]

        if best_score < self.threshold:
            return None

        current_score = score_by_index.get(self.current_index, 0.0)
        selected_index = best_index
        selected_score = best_score

        if best_index > self.current_index:
            if current_score >= self.threshold and current_score >= best_score - SCORE_STAY_MARGIN:
                selected_index = self.current_index
                selected_score = current_score
        elif best_index < self.current_index:
            if current_score >= self.threshold and current_score >= best_score - SCORE_BACKTRACK_MARGIN:
                selected_index = self.current_index
                selected_score = current_score

        self.current_index = selected_index
        return MatchResult(
            index=selected_index,
            score=selected_score,
            transcript=transcript,
            matched_text=self.document.lines[selected_index],
        )


class AudioInputWorker(QObject):
    audio_chunk_ready = pyqtSignal(object, float)
    input_level_changed = pyqtSignal(float)
    status_changed = pyqtSignal(str)
    error_occurred = pyqtSignal(str)
    stream_started = pyqtSignal()
    stream_stopped = pyqtSignal()

    def __init__(
        self,
        sample_rate: int = SAMPLE_RATE,
        chunk_samples: int = CHUNK_SAMPLES,
        chunk_step_samples: int = CHUNK_STEP_SAMPLES,
        silence_threshold: float = SILENCE_THRESHOLD,
    ) -> None:
        super().__init__()
        self.sample_rate = sample_rate
        self.chunk_samples = chunk_samples
        self.chunk_step_samples = max(1, min(chunk_step_samples, chunk_samples))
        self.silence_threshold = silence_threshold
        self.blocksize = 1024
        self._stream: sd.InputStream | None = None
        self._capture_sample_rate = float(sample_rate)
        self._lock = threading.Lock()
        self._sample_buffer = np.empty(0, dtype=np.float32)
        self._buffered_samples = 0
        self._samples_since_last_emit = 0
        self._has_emitted_chunk = False
        self._running = False
        self._selected_device_label: str | None = None

    @pyqtSlot()
    def start_stream(self) -> None:
        import logging
        logger = logging.getLogger(__name__)
        logger.info("start_stream() llamado")
        
        if self._running:
            logger.info("Stream ya está corriendo, retornando")
            return

        self._sample_buffer = np.empty(0, dtype=np.float32)
        self._buffered_samples = 0
        self._samples_since_last_emit = 0
        self._has_emitted_chunk = False
        logger.info("Inicializando segmentos y buffer")

        self._selected_device_label = None
        last_error: Exception | None = None
        for device_id, device_label in build_input_device_attempts():
            stream_kwargs: dict[str, Any] = {
                "samplerate": self.sample_rate,
                "channels": 1,
                "dtype": "float32",
                "latency": "high",
                "callback": self._audio_callback,
            }
            if device_id is not None:
                stream_kwargs["device"] = device_id

            logger.info("Creando InputStream con device=%s", device_label or "predeterminado")

            try:
                selected_info = sd.query_devices(device_id) if device_id is not None else sd.query_devices(kind="input")
                self._capture_sample_rate = float(selected_info.get("default_samplerate") or self.sample_rate)
                stream_kwargs["samplerate"] = self._capture_sample_rate
                self._stream = sd.InputStream(**stream_kwargs)
                self._stream.start()
            except Exception as exc:
                last_error = exc
                self._stream = None
                logger.exception("Fallo abriendo device=%s: %s", device_label or "predeterminado", exc)
                continue

            self._selected_device_label = device_label or "Microfono predeterminado"
            self._running = True
            logger.info("Estado _running establecido a True")
            self.status_changed.emit(f"Entrada de audio activa: {self._selected_device_label}")
            self.stream_started.emit()
            logger.info("Senal status_changed.emit enviada")
            return

        message = f"No se pudo abrir la entrada de audio. Ultimo error: {last_error}"
        logger.error(message)
        self._running = False
        self.error_occurred.emit(message)
        logger.error("Senal error_occurred.emit enviada")
        return

        try:
            preferred_device, preferred_label = choose_preferred_input_device()
            self._selected_device_label = preferred_label
            stream_kwargs: dict[str, Any] = {
                "samplerate": self.sample_rate,
                "channels": 1,
                "dtype": "float32",
                "blocksize": self.blocksize,
                "latency": "low",
                "callback": self._audio_callback,
            }
            if preferred_device is not None:
                stream_kwargs["device"] = preferred_device

            logger.info("Creando InputStream con device=%s", preferred_label or "predeterminado")
            self._stream = sd.InputStream(
                **stream_kwargs,
            )
            logger.info("InputStream creado exitosamente")
            
            logger.info("Iniciando stream...")
            self._stream.start()
            logger.info("Stream iniciado")
            
            self._running = True
            logger.info("Estado _running establecido a True")
            
            if preferred_label is not None:
                self.status_changed.emit(f"Entrada de audio activa: {preferred_label}")
            else:
                self.status_changed.emit("Entrada de audio activa")
            self.stream_started.emit()
            logger.info("Señal status_changed.emit enviada")
            
        except Exception as exc:  # pragma: no cover - hardware dependent
            import logging
            logger = logging.getLogger(__name__)
            logger.exception(f"Error al abrir entrada de audio: {exc}")
            self._running = False
            self.error_occurred.emit(f"No se pudo abrir la entrada de audio: {exc}")
            logger.error("Señal error_occurred.emit enviada")

    @pyqtSlot()
    def stop_stream(self) -> None:
        self._running = False
        with self._lock:
            self._sample_buffer = np.empty(0, dtype=np.float32)
            self._buffered_samples = 0
            self._samples_since_last_emit = 0
            self._has_emitted_chunk = False

        if self._stream is not None:
            try:
                self._stream.stop()
                self._stream.close()
            except Exception:
                pass
            self._stream = None

        self.status_changed.emit("Entrada de audio detenida")
        self.stream_stopped.emit()

    def _audio_callback(self, indata: np.ndarray, frames: int, time_info: Any, status: sd.CallbackFlags) -> None:
        try:
            if status:
                # Enviar señal de forma segura desde el thread de audio
                self.status_changed.emit(str(status))

            mono = np.copy(indata[:, 0])
            mono = resample_audio(mono, self._capture_sample_rate, self.sample_rate)
            live_rms = float(np.sqrt(np.mean(np.square(mono)))) if mono.size else 0.0
            # Enviar señal de forma segura
            self.input_level_changed.emit(live_rms)

            if not self._running:
                return

            with self._lock:
                if self._sample_buffer.size == 0:
                    self._sample_buffer = mono
                else:
                    self._sample_buffer = np.concatenate((self._sample_buffer, mono))
                self._buffered_samples = int(self._sample_buffer.size)
                self._samples_since_last_emit += len(mono)
                chunks = self._pop_ready_chunks_locked()

            for chunk in chunks:
                rms = float(np.sqrt(np.mean(np.square(chunk)))) if chunk.size else 0.0
                if rms >= self.silence_threshold:
                    # Enviar señal de forma segura
                    self.audio_chunk_ready.emit(chunk.astype(np.float32), rms)
        except Exception as exc:
            import logging
            logger = logging.getLogger(__name__)
            logger.exception(f"Error en _audio_callback: {exc}")
            # Enviar señal de error de forma segura
            self.error_occurred.emit(f"Error en callback de audio: {exc}")

    def _pop_ready_chunks_locked(self) -> list[np.ndarray]:
        ready_chunks: list[np.ndarray] = []

        if self._sample_buffer.size < self.chunk_samples:
            self._buffered_samples = int(self._sample_buffer.size)
            return ready_chunks

        if not self._has_emitted_chunk:
            ready_chunks.append(np.copy(self._sample_buffer[-self.chunk_samples :]))
            self._has_emitted_chunk = True
            self._samples_since_last_emit = 0

        while self._samples_since_last_emit >= self.chunk_step_samples:
            ready_chunks.append(np.copy(self._sample_buffer[-self.chunk_samples :]))
            self._samples_since_last_emit -= self.chunk_step_samples

        max_buffer = self.chunk_samples + self.chunk_step_samples
        if self._sample_buffer.size > max_buffer:
            self._sample_buffer = self._sample_buffer[-max_buffer:]

        self._buffered_samples = int(self._sample_buffer.size)

        return ready_chunks


class WhisperTranscriber(QObject):
    transcript_ready = pyqtSignal(str, float)
    status_changed = pyqtSignal(str)
    error_occurred = pyqtSignal(str)
    model_ready = pyqtSignal()

    def __init__(
        self,
        model_name: str = "base",
        language: str = "es",
        device_preference: str = "auto",
        model: Any | None = None,
        startup_error: str | None = None,
    ) -> None:
        super().__init__()
        self.model_name = model_name
        self.language = language
        self.device_preference = device_preference
        self.model: Any = model
        self.startup_error = startup_error
        self.loading = False
        self._executor = ThreadPoolExecutor(max_workers=1, thread_name_prefix="whisper-worker")
        self._executor_lock = threading.Lock()
        self._transcription_pending = False
        self._queued_samples: np.ndarray | None = None

    @pyqtSlot()
    def load_model(self) -> None:
        if self.model is not None or self.loading:
            return

        self.loading = True
        self._executor.submit(self._load_model_worker)

    def _build_attempts(self) -> list[tuple[str, str]]:
        return build_whisper_attempts(self.device_preference)

    @pyqtSlot(object, float)
    def transcribe_chunk(self, audio_chunk: object, rms: float) -> None:
        if self.model is None or self.loading:
            return

        samples = prepare_audio_for_transcription(np.asarray(audio_chunk, dtype=np.float32))
        if samples.size == 0:
            return

        with self._executor_lock:
            if self._transcription_pending:
                self._queued_samples = samples
                return
            self._transcription_pending = True

        self._executor.submit(self._transcribe_worker, samples)

    def shutdown(self) -> None:
        self._executor.shutdown(wait=False, cancel_futures=False)

    def _load_model_worker(self) -> None:
        import logging

        self.status_changed.emit("Preparando motor de transcripción...")
        whisper_model_class, import_error = import_whisper_model_class()

        if whisper_model_class is None:
            self.loading = False
            message = "faster-whisper no está instalado o no pudo importarse."
            if import_error:
                message = f"{message} Detalle: {import_error}"
            self.error_occurred.emit(message)
            return

        self.status_changed.emit(f"Cargando modelo Whisper '{self.model_name}'...")
        attempts = self._build_attempts()
        last_error: Exception | None = None

        for device, compute_type in attempts:
            try:
                logging.info("Intentando cargar Whisper con device=%s compute_type=%s", device, compute_type)
                self.model = whisper_model_class(
                    self.model_name,
                    device=device,
                    compute_type=compute_type,
                    cpu_threads=max(1, (os.cpu_count() or 4) // 2),
                )
                logging.info("Whisper cargado correctamente con device=%s compute_type=%s", device, compute_type)
                self.status_changed.emit(f"Modelo listo en {device} ({compute_type})")
                self.loading = False
                self.model_ready.emit()
                return
            except Exception as exc:  # pragma: no cover - dependency/hardware dependent
                logging.exception(
                    "Fallo cargando Whisper con device=%s compute_type=%s: %s",
                    device,
                    compute_type,
                    exc,
                )
                last_error = exc

        self.loading = False
        message = f"No se pudo cargar Whisper: {last_error}" if last_error else "No se pudo cargar Whisper."
        self.error_occurred.emit(message)

    def _transcribe_worker(self, samples: np.ndarray) -> None:
        try:
            segments, info = self.model.transcribe(
                samples,
                language=self.language,
                beam_size=3,
                best_of=3,
                temperature=0.0,
                vad_filter=True,
                condition_on_previous_text=False,
                word_timestamps=False,
            )
            text = " ".join(segment.text.strip() for segment in segments).strip()
            if text:
                confidence = float(getattr(info, "language_probability", 1.0) or 1.0)
                self.transcript_ready.emit(text, confidence)
        except Exception as exc:  # pragma: no cover - dependency/runtime dependent
            self.error_occurred.emit(f"Fallo al transcribir chunk: {exc}")
        finally:
            next_samples: np.ndarray | None = None
            with self._executor_lock:
                if self._queued_samples is not None:
                    next_samples = self._queued_samples
                    self._queued_samples = None
                else:
                    self._transcription_pending = False

            if next_samples is not None:
                self._executor.submit(self._transcribe_worker, next_samples)


class TeleprompterList(QListWidget):
    def __init__(self) -> None:
        super().__init__()
        self.setFrameShape(self.Shape.NoFrame)
        self.setVerticalScrollMode(self.ScrollMode.ScrollPerPixel)
        self.setHorizontalScrollBarPolicy(Qt.ScrollBarPolicy.ScrollBarAlwaysOff)
        self.setSelectionMode(self.SelectionMode.NoSelection)
        self.setFocusPolicy(Qt.FocusPolicy.NoFocus)
        self.setSpacing(14)
        self.setWordWrap(True)
        self.setStyleSheet(
            """
            QListWidget {
                background: #020202;
                color: #d9d9d9;
                border: none;
                padding: 28px 36px;
            }
            QListWidget::item {
                border: none;
                padding: 10px 14px;
                margin: 2px 0;
            }
            """
        )


class MainWindow(QMainWindow):
    load_model_requested = pyqtSignal()

    def __init__(self, preloaded_model: Any | None = None, preloaded_error: str | None = None) -> None:
        super().__init__()
        self.setWindowTitle("Letras en Vivo")
        self.resize(1280, 820)

        self.document = LyricsDocument.empty()
        self.synchronizer = LyricsSynchronizer()
        self.auto_follow = True
        self._pending_audio_start = False
        self._audio_active = False
        self._scroll_animation: QPropertyAnimation | None = None

        self.audio_worker = AudioInputWorker()
        self.transcriber = WhisperTranscriber(model=preloaded_model, startup_error=preloaded_error)

        self._build_ui()
        self._connect_workers()
        if self.transcriber.model is not None:
            self._set_status("Modelo Whisper listo. Puedes empezar a escuchar.")
        elif self.transcriber.startup_error:
            self._set_status(self.transcriber.startup_error)
        # Cargar el modelo de forma lazy cuando el usuario lo necesite
        QTimer.singleShot(0, self._load_default_lyrics_if_available)
        
        # Para debugging: intentar iniciar audio automáticamente después de 2 segundos

    def _build_ui(self) -> None:
        central = QWidget()
        self.setCentralWidget(central)

        root = QVBoxLayout(central)
        root.setContentsMargins(22, 22, 22, 22)
        root.setSpacing(14)

        controls = QHBoxLayout()
        controls.setSpacing(10)
        root.addLayout(controls)

        self.load_button = QPushButton("Cargar letra")
        self.start_button = QPushButton("Escuchar")
        self.stop_button = QPushButton("Detener")
        self.stop_button.setEnabled(False)
        self.auto_checkbox = QCheckBox("Auto-follow")
        self.auto_checkbox.setChecked(True)
        self.input_meter = QProgressBar()
        self.input_meter.setRange(0, 100)
        self.input_meter.setFixedWidth(170)
        self.input_meter.setFormat("Nivel %p%")

        for button in (self.load_button, self.start_button, self.stop_button):
            button.setCursor(Qt.CursorShape.PointingHandCursor)
            button.setMinimumHeight(42)

        controls.addWidget(self.load_button)
        controls.addWidget(self.start_button)
        controls.addWidget(self.stop_button)
        controls.addWidget(self.auto_checkbox)
        controls.addStretch(1)
        controls.addWidget(self.input_meter)

        self.title_label = QLabel("Sin letra cargada")
        self.title_label.setObjectName("titleLabel")
        self.title_label.setWordWrap(True)

        self.status_label = QLabel("Listo. Carga una letra y empieza a escuchar.")
        self.status_label.setObjectName("statusLabel")
        self.status_label.setWordWrap(True)

        self.transcript_label = QLabel("Transcripción en espera...")
        self.transcript_label.setObjectName("transcriptLabel")
        self.transcript_label.setWordWrap(True)

        self.hint_label = QLabel("Flechas Arriba/Abajo: corrección manual")
        self.hint_label.setObjectName("hintLabel")

        info_panel = QVBoxLayout()
        info_panel.setSpacing(4)
        info_panel.addWidget(self.title_label)
        info_panel.addWidget(self.status_label)
        info_panel.addWidget(self.transcript_label)
        info_panel.addWidget(self.hint_label)
        root.addLayout(info_panel)

        self.teleprompter = TeleprompterList()
        root.addWidget(self.teleprompter, 1)

        self.playhead_overlay = QWidget(self.teleprompter.viewport())
        self.playhead_overlay.setObjectName("playheadOverlay")
        self.playhead_overlay.setAttribute(Qt.WidgetAttribute.WA_TransparentForMouseEvents, True)
        self.teleprompter.viewport().installEventFilter(self)

        self.setStyleSheet(
            """
            QMainWindow, QWidget {
                background: #020202;
                color: #f5f5f5;
            }
            QPushButton {
                background: #111111;
                color: #f5f5f5;
                border: 1px solid #2c2c2c;
                border-radius: 12px;
                padding: 8px 16px;
                font-size: 14px;
            }
            QPushButton:hover {
                background: #1b1b1b;
                border-color: #6d5b13;
            }
            QPushButton:disabled {
                color: #7c7c7c;
                border-color: #1f1f1f;
            }
            QCheckBox {
                font-size: 14px;
                color: #f0d96a;
                spacing: 8px;
            }
            QProgressBar {
                background: #111111;
                border: 1px solid #2c2c2c;
                border-radius: 10px;
                text-align: center;
                padding: 2px;
                color: #f5f5f5;
            }
            QProgressBar::chunk {
                background: #f0d96a;
                border-radius: 8px;
            }
            QLabel#titleLabel {
                color: #f0d96a;
                font-size: 24px;
                font-weight: 700;
            }
            QLabel#statusLabel {
                color: #d6d6d6;
                font-size: 14px;
            }
            QLabel#transcriptLabel {
                color: #9ecfff;
                font-size: 16px;
                padding-bottom: 6px;
            }
            QLabel#hintLabel {
                color: #949494;
                font-size: 12px;
            }
            QWidget#playheadOverlay {
                background: rgba(240, 217, 106, 0.13);
                border: 2px solid rgba(255, 229, 140, 0.75);
                border-radius: 20px;
            }
            """
        )

        self.load_button.clicked.connect(self.open_lyrics_dialog)
        self.start_button.clicked.connect(self.start_listening)
        self.stop_button.clicked.connect(self.stop_listening)
        self.auto_checkbox.toggled.connect(self._toggle_auto_follow)
        self._position_playhead_overlay()

    def _connect_workers(self) -> None:
        # Conectar señales directamente sin threads para evitar problemas
        self.load_model_requested.connect(self.transcriber.load_model)

        self.audio_worker.audio_chunk_ready.connect(self.transcriber.transcribe_chunk)
        self.audio_worker.input_level_changed.connect(self._update_input_meter)
        self.audio_worker.status_changed.connect(self._set_status)
        self.audio_worker.error_occurred.connect(self._handle_audio_error)
        self.audio_worker.stream_started.connect(self._handle_audio_started)
        self.audio_worker.stream_stopped.connect(self._handle_audio_stopped)

        self.transcriber.transcript_ready.connect(self._handle_transcript)
        self.transcriber.status_changed.connect(self._set_status)
        self.transcriber.error_occurred.connect(self._handle_transcriber_error)
        self.transcriber.model_ready.connect(self._handle_model_ready)

    def _load_default_lyrics_if_available(self) -> None:
        if DEFAULT_LYRICS_PATH.exists() and DEFAULT_LYRICS_PATH.stat().st_size > 0:
            try:
                self._load_lyrics(DEFAULT_LYRICS_PATH)
            except Exception as exc:
                self._set_status(f"No se pudo cargar la letra por defecto: {exc}")

    def _test_audio_start(self) -> None:
        import logging
        logger = logging.getLogger(__name__)
        logger.info("Iniciando prueba automática de audio...")
        try:
            self.start_listening()
            logger.info("start_listening() ejecutado exitosamente")
        except Exception as exc:
            logger.exception(f"Error en start_listening(): {exc}")

    def _start_threads(self) -> None:
        import logging
        logger = logging.getLogger(__name__)
        logger.info("Audio worker inicializado en el hilo principal")

    def open_lyrics_dialog(self) -> None:
        file_path, _ = QFileDialog.getOpenFileName(
            self,
            "Selecciona la letra",
            str(Path.cwd()),
            "Letras (*.json *.txt);;Todos los archivos (*.*)",
        )
        if file_path:
            self._load_lyrics(Path(file_path))

    def _load_lyrics(self, path: Path) -> None:
        document = load_lyrics(path)
        self.document = document
        self.synchronizer.set_document(document)
        self.title_label.setText(document.title)
        self._render_lyrics()
        self._set_status(f"Letra cargada desde {path.name}. Líneas útiles: {len(document.lines)}")
        self.transcript_label.setText("Transcripción en espera...")

    def _render_lyrics(self) -> None:
        self.teleprompter.clear()
        for line in self.document.lines:
            item = QListWidgetItem(line)
            item.setTextAlignment(Qt.AlignmentFlag.AlignHCenter)
            self.teleprompter.addItem(item)
        self._refresh_line_styles()
        self._position_playhead_overlay()
        self._center_current_line(animated=False)

    def _position_playhead_overlay(self) -> None:
        viewport = self.teleprompter.viewport()
        overlay_width = max(260, viewport.width() - 40)
        overlay_height = min(PLAYHEAD_OVERLAY_HEIGHT, max(88, viewport.height() - 24))
        overlay_y = max(12, (viewport.height() // 2) - (overlay_height // 2))
        self.playhead_overlay.setGeometry(20, overlay_y, overlay_width, overlay_height)
        self.playhead_overlay.raise_()

    def eventFilter(self, watched: QObject, event: QEvent) -> bool:
        if watched is self.teleprompter.viewport() and event.type() in (QEvent.Type.Resize, QEvent.Type.Show):
            self._position_playhead_overlay()
        return super().eventFilter(watched, event)

    def _refresh_line_styles(self) -> None:
        current = self.synchronizer.current_index

        for index in range(self.teleprompter.count()):
            item = self.teleprompter.item(index)
            distance = abs(index - current)
            font = QFont("Segoe UI", 22)

            if index == current:
                font.setPointSize(32)
                font.setBold(True)
                item.setForeground(QColor("#fff7d1"))
                item.setBackground(QColor("#6c4300"))
            elif distance == 1:
                font.setPointSize(24)
                item.setForeground(QColor("#ffefb6"))
                item.setBackground(QColor("#17110a"))
            elif distance <= 3:
                item.setForeground(QColor("#cacaca"))
                item.setBackground(QColor("#060606"))
            else:
                item.setForeground(QColor("#5f5f5f"))
                item.setBackground(QColor("#020202"))

            item.setFont(font)
            item.setSizeHint(item.sizeHint())

    def _center_current_line(self, animated: bool = True) -> None:
        if self.teleprompter.count() == 0:
            return

        current_item = self.teleprompter.item(self.synchronizer.current_index)
        self.teleprompter.scrollToItem(current_item, self.teleprompter.ScrollHint.PositionAtCenter)

        rect = self.teleprompter.visualItemRect(current_item)
        scrollbar = self.teleprompter.verticalScrollBar()
        target_value = scrollbar.value() + rect.center().y() - (self.teleprompter.viewport().height() // 2)
        target_value = max(scrollbar.minimum(), min(target_value, scrollbar.maximum()))

        if not animated:
            scrollbar.setValue(target_value)
            return

        if self._scroll_animation is not None:
            self._scroll_animation.stop()
            self._scroll_animation = None

        animation = QPropertyAnimation(scrollbar, b"value", self)
        animation.setDuration(260)
        animation.setStartValue(scrollbar.value())
        animation.setEndValue(target_value)
        animation.setEasingCurve(QEasingCurve.Type.OutCubic)
        animation.start()
        self._scroll_animation = animation

    def _set_current_line(self, index: int, origin: str) -> None:
        if not self.document.lines:
            return

        previous = self.synchronizer.current_index
        self.synchronizer.set_current_index(index)
        if previous != self.synchronizer.current_index or origin == "manual":
            self._refresh_line_styles()
            self._center_current_line(animated=True)

        if self.synchronizer.current_index < len(self.document.lines):
            line = self.document.lines[self.synchronizer.current_index]
            self._set_status(f"Línea {self.synchronizer.current_index + 1}: {line} ({origin})")

    @pyqtSlot(str, float)
    def _handle_transcript(self, text: str, confidence: float) -> None:
        self.transcript_label.setText(f"Escuchado: {text}")

        if not self.auto_follow or not self.document.lines:
            return

        result = self.synchronizer.match(text)
        if result is None:
            self._set_status(f"Sin coincidencia clara para: '{text}'")
            return

        self._set_current_line(result.index, origin=f"IA {result.score:.2f}")

    @pyqtSlot(float)
    def _update_input_meter(self, level: float) -> None:
        normalized = min(100, int(level * 1400))
        self.input_meter.setValue(normalized)

    @pyqtSlot(str)
    def _set_status(self, text: str) -> None:
        self.status_label.setText(text)

    @pyqtSlot(str)
    def _handle_audio_error(self, message: str) -> None:
        self._pending_audio_start = False
        self._audio_active = False
        self.start_button.setEnabled(True)
        self.stop_button.setEnabled(False)
        self.input_meter.setValue(0)
        self.status_label.setText(message)

    @pyqtSlot(str)
    def _handle_transcriber_error(self, message: str) -> None:
        self._pending_audio_start = False
        if not self._audio_active:
            self.start_button.setEnabled(True)
            self.stop_button.setEnabled(False)
        self.status_label.setText(message)

    def _toggle_auto_follow(self, checked: bool) -> None:
        self.auto_follow = checked
        state = "activado" if checked else "desactivado"
        self._set_status(f"Seguimiento automático {state}")

    @pyqtSlot()
    def _handle_model_ready(self) -> None:
        if self._pending_audio_start:
            self._request_audio_start()

    @pyqtSlot()
    def _handle_audio_started(self) -> None:
        self._audio_active = True
        self.start_button.setEnabled(False)
        self.stop_button.setEnabled(True)
        if self.audio_worker._selected_device_label is not None:
            self._set_status(f"Escuchando desde {self.audio_worker._selected_device_label}")
        else:
            self._set_status("Escuchando audio en vivo...")

    @pyqtSlot()
    def _handle_audio_stopped(self) -> None:
        self._audio_active = False
        self._pending_audio_start = False
        self.start_button.setEnabled(True)
        self.stop_button.setEnabled(False)
        self.input_meter.setValue(0)

    def _request_audio_start(self) -> None:
        import logging

        logging.info("Solicitando inicio de audio...")
        self._pending_audio_start = False
        self.start_button.setEnabled(False)
        self.stop_button.setEnabled(False)
        self._set_status("Abriendo entrada de audio...")
        try:
            self.audio_worker.start_stream()
        except Exception as exc:
            logging.exception("Fallo inesperado al iniciar el audio: %s", exc)
            self._handle_audio_error(f"No se pudo abrir la entrada de audio: {exc}")

    def start_listening(self) -> None:
        import logging
        logging.info("start_listening() llamado")
        try:
            if self._audio_active or self._pending_audio_start:
                logging.info("Ya hay una operacion de audio en curso")
                return

            if self.transcriber.model is None:
                logging.error("Whisper no disponible al iniciar escucha: %s", self.transcriber.startup_error)
                self._pending_audio_start = False
                self.start_button.setEnabled(True)
                self.stop_button.setEnabled(False)
                self._set_status(self.transcriber.startup_error or "Whisper no esta disponible. Reinicia la aplicacion.")
                return

            self._request_audio_start()
            return
        except Exception as exc:
            logging.exception("Error no controlado en start_listening(): %s", exc)
            self._handle_audio_error(f"Fallo al iniciar la escucha: {exc}")
            return
        
        # Cargar el modelo la primera vez que se presione el botón
        if self._audio_active or self._pending_audio_start:
            logging.info("Ya hay una operaciÃ³n de audio en curso")
            return

        if self.transcriber.model is None:
            logging.error("Whisper no disponible al iniciar escucha: %s", self.transcriber.startup_error)
            self._pending_audio_start = False
            self.start_button.setEnabled(True)
            self.stop_button.setEnabled(False)
            self._set_status(self.transcriber.startup_error or "Whisper no está disponible. Reinicia la aplicación.")
            return
        
        self._request_audio_start()

    def stop_listening(self) -> None:
        try:
            self._pending_audio_start = False
            if not self._audio_active:
                self.start_button.setEnabled(True)
                self.stop_button.setEnabled(False)
                self.input_meter.setValue(0)
                self._set_status("Escucha detenida")
                return

            self.audio_worker.stop_stream()
            self._set_status("Escucha detenida")
            return
        except Exception as exc:
            import logging

            logging.exception("Fallo inesperado al detener el audio: %s", exc)
            self._handle_audio_error(f"Fallo al detener la escucha: {exc}")
            return

        self._pending_audio_start = False
        if not self._audio_active:
            self.start_button.setEnabled(True)
            self.stop_button.setEnabled(False)
            self.input_meter.setValue(0)
            self._set_status("Escucha detenida")
            return

        self._set_status("Escucha detenida")

    def keyPressEvent(self, event: QKeyEvent) -> None:
        if not self.document.lines:
            return super().keyPressEvent(event)

        if event.key() == Qt.Key.Key_Up:
            self._set_current_line(self.synchronizer.current_index - 1, origin="manual")
            event.accept()
            return
        if event.key() == Qt.Key.Key_Down:
            self._set_current_line(self.synchronizer.current_index + 1, origin="manual")
            event.accept()
            return

        super().keyPressEvent(event)

    def closeEvent(self, event) -> None:
        import logging
        logger = logging.getLogger(__name__)
        logger.info("closeEvent llamado - cerrando aplicación")
        
        try:
            self.stop_listening()
            logger.info("stop_listening ejecutado")

            self.transcriber.shutdown()
            logger.info("transcriber.shutdown() ejecutado")
            
        except Exception as exc:
            logger.exception(f"Error en closeEvent: {exc}")
        
        super().closeEvent(event)
        logger.info("closeEvent completado")


def main(preloaded_model: Any | None = None, preloaded_error: str | None = None) -> int:
    import logging
    import signal
    import sys
    
    # Configurar logging para capturar errores
    logging.basicConfig(
        level=logging.DEBUG,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler('letras.log'),
            logging.StreamHandler(sys.stdout)
        ]
    )
    
    logger = logging.getLogger(__name__)

    def log_unhandled_exception(exc_type, exc_value, exc_traceback):
        if issubclass(exc_type, KeyboardInterrupt):
            sys.__excepthook__(exc_type, exc_value, exc_traceback)
            return
        logger.exception(
            "Excepcion no controlada",
            exc_info=(exc_type, exc_value, exc_traceback),
        )

    sys.excepthook = log_unhandled_exception
    
    # Capturar señales del sistema
    if os.name != "nt":
        def signal_handler(signum, frame):
            logger.error(f"Señal recibida: {signum}")
            import traceback
            traceback.print_exc()
            sys.exit(1)

        signal.signal(signal.SIGINT, signal_handler)
        signal.signal(signal.SIGTERM, signal_handler)
    
    try:
        app = QApplication(sys.argv)
        logger.info("QApplication creado")
        
        window = MainWindow(preloaded_model=preloaded_model, preloaded_error=preloaded_error)
        logger.info("MainWindow creado")
        
        window.show()
        logger.info("Ventana mostrada")
        
        logger.info("Entrando al event loop")
        result = app.exec()
        logger.info(f"Event loop finalizado con código: {result}")
        return result
        
    except Exception as exc:
        logger.exception(f"Error fatal en main(): {exc}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
