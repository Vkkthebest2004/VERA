import os
import tempfile
from typing import Tuple


class AudioExtractor:
    """Extracts verbatim transcription from voice notes, leaks, and earnings calls using Whisper."""

    @staticmethod
    def extract(audio_bytes: bytes, filename: str = "") -> Tuple[str, dict]:
        ext = filename.split(".")[-1].lower() if "." in filename else "wav"
        if ext not in ["wav", "mp3", "m4a", "ogg", "flac"]:
            ext = "wav"

        with tempfile.NamedTemporaryFile(suffix=f".{ext}", delete=False) as tmp:
            tmp.write(audio_bytes)
            tmp_path = tmp.name

        transcribed_text = ""
        language_detected = "unknown"
        language_prob = 0.0

        try:
            from faster_whisper import WhisperModel
            model = WhisperModel("base", device="cpu", compute_type="int8")
            segments, info = model.transcribe(tmp_path, beam_size=5)
            transcribed_text = " ".join(seg.text.strip() for seg in segments).strip()
            language_detected = info.language
            language_prob = round(info.language_probability, 3)
        except Exception as e:
            print(f"[Whisper Transcription Error]: {e}")
            transcribed_text = f"Audio transcription failed or no speech detected ({str(e)})."
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)

        metadata = {
            "format": ext,
            "size_bytes": len(audio_bytes),
            "transcriber": "faster_whisper_base_int8",
            "language": language_detected,
            "language_probability": language_prob,
        }

        full_text = f"[VERBATIM AUDIO TRANSCRIPTION ({filename})]:\n{transcribed_text}"
        return full_text, metadata
