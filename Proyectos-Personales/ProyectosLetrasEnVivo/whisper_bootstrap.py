from __future__ import annotations

import os
from typing import Any


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
    except Exception as exc:
        _WHISPER_MODEL_CLASS = None
        _WHISPER_IMPORT_ERROR = f"{type(exc).__name__}: {exc}"
    else:
        _WHISPER_MODEL_CLASS = imported_whisper_model
        _WHISPER_IMPORT_ERROR = None

    return _WHISPER_MODEL_CLASS, _WHISPER_IMPORT_ERROR


def detect_cuda_device_count() -> int:
    try:
        import ctranslate2
    except Exception:
        return 0

    try:
        return int(ctranslate2.get_cuda_device_count())
    except Exception:
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
        except Exception as exc:
            logging.exception(
                "Fallo precargando Whisper con device=%s compute_type=%s: %s",
                device,
                compute_type,
                exc,
            )
            last_error = exc

    message = f"No se pudo cargar Whisper al iniciar: {last_error}" if last_error else "No se pudo cargar Whisper al iniciar."
    return None, message
