from typing import Tuple
from .pdf_extractor import PDFExtractor
from .image_extractor import ImageExtractor
from .audio_extractor import AudioExtractor


class MultiModalExtractor:
    """Unified facade combining dedicated PDF, Image/Vision, and Audio extractors."""

    @staticmethod
    def extract_from_pdf(pdf_bytes: bytes) -> Tuple[str, dict]:
        return PDFExtractor.extract(pdf_bytes)

    @staticmethod
    def extract_from_image(image_bytes: bytes, filename: str = "") -> Tuple[str, dict]:
        return ImageExtractor.extract(image_bytes, filename)

    @staticmethod
    def extract_from_audio(audio_bytes: bytes, filename: str = "") -> Tuple[str, dict]:
        return AudioExtractor.extract(audio_bytes, filename)


__all__ = ["MultiModalExtractor", "PDFExtractor", "ImageExtractor", "AudioExtractor"]
