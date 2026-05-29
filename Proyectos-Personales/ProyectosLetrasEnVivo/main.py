from __future__ import annotations

import logging
import os
import signal
import sys

from whisper_bootstrap import preload_whisper_model


def main() -> int:
    logging.basicConfig(
        level=logging.DEBUG,
        format="%(asctime)s - %(levelname)s - %(message)s",
        handlers=[
            logging.FileHandler("letras.log"),
            logging.StreamHandler(sys.stdout),
        ],
    )

    logger = logging.getLogger(__name__)

    if os.name != "nt":
        def signal_handler(signum, frame):
            logger.error("Senal recibida: %s", signum)
            import traceback

            traceback.print_exc()
            sys.exit(1)

        signal.signal(signal.SIGINT, signal_handler)
        signal.signal(signal.SIGTERM, signal_handler)

    try:
        logger.info("Iniciando aplicacion...")
        preloaded_model, preloaded_error = preload_whisper_model()
        if preloaded_model is not None:
            logger.info("Modelo Whisper precargado antes de importar Qt")
        else:
            logger.error("Whisper no se pudo precargar: %s", preloaded_error)

        import app_runtime

        return app_runtime.main(preloaded_model=preloaded_model, preloaded_error=preloaded_error)
    except Exception as exc:
        logger.exception("Error fatal en el lanzador: %s", exc)
        import traceback

        traceback.print_exc()
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
