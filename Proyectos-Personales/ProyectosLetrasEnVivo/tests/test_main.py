import os
import unittest
from pathlib import Path
from unittest.mock import patch

import numpy as np
from PyQt6.QtWidgets import QApplication

os.environ.setdefault("QT_QPA_PLATFORM", "offscreen")

import app_runtime as main
import whisper_bootstrap


PROJECT_ROOT = Path(__file__).resolve().parents[1]
FIXTURES_DIR = PROJECT_ROOT / "tests" / "fixtures"


class MainModuleTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.qapp = QApplication.instance() or QApplication([])

    def test_normalize_text_removes_annotations_and_accents(self) -> None:
        text = "[Coro] Cancion (Bis), corazon!!!"
        self.assertEqual(main.normalize_text(text), "cancion corazon")

    def test_load_lyrics_json_filters_annotations(self) -> None:
        lyrics_path = FIXTURES_DIR / "lyrics_sample.json"
        document = main.load_lyrics(lyrics_path)

        self.assertEqual(document.title, "Tema")
        self.assertEqual(document.lines, ["Primera línea", "Segunda línea real"])
        self.assertEqual(document.normalized_lines, ["primera linea", "segunda linea real"])

    def test_load_lyrics_txt_supports_plain_text(self) -> None:
        lyrics_path = FIXTURES_DIR / "tema.txt"
        document = main.load_lyrics(lyrics_path)

        self.assertEqual(document.title, "tema")
        self.assertEqual(document.lines, ["Uno", "Dos"])

    def test_synchronizer_matches_near_current_position(self) -> None:
        document = main.LyricsDocument(
            title="Demo",
            lines=[
                "Hoy te vine a buscar",
                "Porque no puedo esperar",
                "Y quiero verte cantar",
            ],
            normalized_lines=[
                "hoy te vine a buscar",
                "porque no puedo esperar",
                "y quiero verte cantar",
            ],
        )
        sync = main.LyricsSynchronizer(threshold=0.4, search_back=1, search_forward=2)
        sync.set_document(document)
        sync.set_current_index(1)

        result = sync.match("no puedo esperar")

        self.assertIsNotNone(result)
        assert result is not None
        self.assertEqual(result.index, 1)
        self.assertGreaterEqual(result.score, 0.4)

    def test_synchronizer_returns_none_when_match_is_weak(self) -> None:
        document = main.LyricsDocument(
            title="Demo",
            lines=["Una linea conocida"],
            normalized_lines=["una linea conocida"],
        )
        sync = main.LyricsSynchronizer(threshold=0.9)
        sync.set_document(document)

        self.assertIsNone(sync.match("texto sin relacion"))

    def test_audio_worker_emits_initial_window_when_buffer_is_ready(self) -> None:
        worker = main.AudioInputWorker(sample_rate=4, chunk_samples=8, chunk_step_samples=8, silence_threshold=0.0)
        worker._sample_buffer = np.array([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8], dtype=np.float32)
        worker._buffered_samples = 8

        chunks = worker._pop_ready_chunks_locked()

        self.assertEqual(len(chunks), 1)
        self.assertTrue(
            np.allclose(
                chunks[0],
                np.array([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8], dtype=np.float32),
            )
        )
        self.assertTrue(worker._has_emitted_chunk)

    def test_audio_worker_emits_overlapping_windows(self) -> None:
        worker = main.AudioInputWorker(sample_rate=4, chunk_samples=8, chunk_step_samples=4, silence_threshold=0.0)
        worker._sample_buffer = np.arange(8, dtype=np.float32)
        worker._buffered_samples = 8

        first_chunks = worker._pop_ready_chunks_locked()

        self.assertEqual(len(first_chunks), 1)
        self.assertTrue(np.allclose(first_chunks[0], np.arange(8, dtype=np.float32)))

        worker._sample_buffer = np.concatenate((worker._sample_buffer, np.arange(8, 12, dtype=np.float32)))
        worker._samples_since_last_emit = 4
        worker._buffered_samples = int(worker._sample_buffer.size)

        second_chunks = worker._pop_ready_chunks_locked()

        self.assertEqual(len(second_chunks), 1)
        self.assertTrue(np.allclose(second_chunks[0], np.arange(4, 12, dtype=np.float32)))

    def test_main_window_loads_lyrics_and_allows_manual_navigation(self) -> None:
        lyrics_path = FIXTURES_DIR / "window_demo.json"
        window = main.MainWindow()
        try:
            self.qapp.processEvents()
            window._load_lyrics(lyrics_path)
            self.qapp.processEvents()

            self.assertEqual(window.title_label.text(), "Prueba")
            self.assertEqual(window.teleprompter.count(), 3)
            self.assertEqual(window.synchronizer.current_index, 0)
            self.assertIs(window.playhead_overlay.parent(), window.teleprompter.viewport())
            self.assertGreater(window.playhead_overlay.height(), 0)
            self.assertGreater(window.playhead_overlay.width(), 0)

            window._set_current_line(2, "manual")
            self.qapp.processEvents()

            self.assertEqual(window.synchronizer.current_index, 2)
            self.assertIn("Linea tres", window.status_label.text())
            self.assertIn("manual", window.status_label.text())
        finally:
            window.close()
            self.qapp.processEvents()

    def test_preload_whisper_reports_missing_dependency(self) -> None:
        with patch.object(whisper_bootstrap, "import_whisper_model_class", return_value=(None, "ImportError: av")):
            model, error = whisper_bootstrap.preload_whisper_model()

        self.assertIsNone(model)
        assert error is not None
        self.assertIn("faster-whisper", error)

    def test_transcriber_auto_mode_skips_cuda_when_not_available(self) -> None:
        transcriber = main.WhisperTranscriber(device_preference="auto")

        with patch.object(main, "detect_cuda_device_count", return_value=0):
            attempts = transcriber._build_attempts()

        self.assertEqual(attempts, [("cpu", "int8"), ("cpu", "float32")])

    def test_choose_preferred_input_device_prefers_microphone_over_stereo_mix(self) -> None:
        devices = [
            {"name": "Mezcla estereo (Realtek)", "hostapi": 1, "max_input_channels": 2, "max_output_channels": 0},
            {"name": "Microfono USB", "hostapi": 0, "max_input_channels": 2, "max_output_channels": 0},
        ]
        hostapis = {0: {"name": "MME"}, 1: {"name": "Windows WDM-KS"}}

        with patch.object(main.sd, "query_devices", return_value=devices), patch.object(
            main.sd, "query_hostapis", side_effect=lambda index: hostapis[index]
        ):
            device_id, label = main.choose_preferred_input_device()

        self.assertEqual(device_id, 1)
        assert label is not None
        self.assertIn("Microfono", label)

    def test_choose_preferred_input_device_uses_generic_input_when_no_mic_hint_exists(self) -> None:
        devices = [
            {"name": "Entrada USB", "hostapi": 0, "max_input_channels": 2, "max_output_channels": 0},
        ]
        hostapis = {0: {"name": "MME"}}

        with patch.object(main.sd, "query_devices", return_value=devices), patch.object(
            main.sd, "query_hostapis", side_effect=lambda index: hostapis[index]
        ):
            device_id, label = main.choose_preferred_input_device()

        self.assertEqual(device_id, 0)
        assert label is not None
        self.assertIn("Entrada USB", label)

    def test_build_input_device_attempts_includes_default_fallback(self) -> None:
        with patch.object(main, "choose_preferred_input_device", return_value=(5, "Microfono USB (MME)")), patch.object(
            main, "get_default_input_device_id", return_value=1
        ), patch.object(main.sd, "query_devices", return_value={"name": "Micrófono Realtek", "hostapi": 0}), patch.object(
            main, "get_hostapi_name", return_value="MME"
        ):
            attempts = main.build_input_device_attempts()

        self.assertEqual(attempts[0], (5, "Microfono USB (MME)"))
        self.assertEqual(attempts[1], (1, "Micrófono Realtek (MME)"))
        self.assertEqual(attempts[-1], (None, None))

    def test_prepare_audio_for_transcription_centers_and_boosts_signal(self) -> None:
        samples = np.array([0.05, 0.1, 0.15, 0.1], dtype=np.float32)

        prepared = main.prepare_audio_for_transcription(samples)

        self.assertAlmostEqual(float(np.mean(prepared)), 0.0, places=5)
        self.assertGreater(float(np.max(np.abs(prepared))), 0.15)

    def test_resample_audio_changes_length_for_different_sample_rate(self) -> None:
        samples = np.linspace(-0.5, 0.5, 441, dtype=np.float32)

        resampled = main.resample_audio(samples, 44100.0, 16000)

        self.assertEqual(len(resampled), 160)

    def test_transcriber_keeps_latest_chunk_while_busy(self) -> None:
        transcriber = main.WhisperTranscriber(model=object())
        transcriber._transcription_pending = True

        transcriber.transcribe_chunk(np.array([0.1], dtype=np.float32), 0.1)
        transcriber.transcribe_chunk(np.array([0.9], dtype=np.float32), 0.1)

        assert transcriber._queued_samples is not None
        expected = main.prepare_audio_for_transcription(np.array([0.9], dtype=np.float32))
        self.assertTrue(np.allclose(transcriber._queued_samples, expected))

    def test_transcriber_submits_latest_queued_chunk_after_finishing(self) -> None:
        class FakeModel:
            def transcribe(self, samples, **kwargs):
                return [], type("Info", (), {"language_probability": 1.0})()

        transcriber = main.WhisperTranscriber(model=FakeModel())
        transcriber._transcription_pending = True
        transcriber._queued_samples = np.array([0.9], dtype=np.float32)
        submissions: list[np.ndarray] = []

        with patch.object(transcriber._executor, "submit", side_effect=lambda fn, samples: submissions.append(samples)):
            transcriber._transcribe_worker(np.array([0.1], dtype=np.float32))

        self.assertEqual(len(submissions), 1)
        self.assertTrue(np.allclose(submissions[0], np.array([0.9], dtype=np.float32)))
        self.assertTrue(transcriber._transcription_pending)
        self.assertIsNone(transcriber._queued_samples)

    def test_audio_worker_falls_back_to_second_device_when_first_fails(self) -> None:
        worker = main.AudioInputWorker()
        opened_devices: list[object] = []

        class FakeStream:
            def __init__(self, device=None, **kwargs):
                opened_devices.append(device)
                if device == 5:
                    raise RuntimeError("invalid")

            def start(self):
                return None

        with patch.object(main, "build_input_device_attempts", return_value=[(5, "Mic 1"), (1, "Mic 2"), (None, None)]), patch.object(
            main.sd, "InputStream", side_effect=lambda **kwargs: FakeStream(**kwargs)
        ):
            worker.start_stream()

        self.assertTrue(worker._running)
        self.assertEqual(worker._selected_device_label, "Mic 2")
        self.assertEqual(opened_devices, [5, 1])

    def test_start_listening_handles_audio_open_exception_without_crashing(self) -> None:
        window = main.MainWindow(preloaded_model=object())
        try:
            with patch.object(window.audio_worker, "start_stream", side_effect=RuntimeError("boom")):
                window.start_listening()

            self.assertIn("boom", window.status_label.text())
            self.assertTrue(window.start_button.isEnabled())
            self.assertFalse(window.stop_button.isEnabled())
        finally:
            window.close()
            self.qapp.processEvents()


if __name__ == "__main__":
    unittest.main()
