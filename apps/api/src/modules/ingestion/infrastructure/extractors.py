"""
Extractors Facade.
Provides backward-compatible imports from the modular 'extractors' package:
- extractors.pdf_extractor.PDFExtractor
- extractors.image_extractor.ImageExtractor
- extractors.audio_extractor.AudioExtractor
- extractors.MultiModalExtractor
"""

from .extractors import (
    MultiModalExtractor,
    PDFExtractor,
    ImageExtractor,
    AudioExtractor,
)

__all__ = [
    "MultiModalExtractor",
    "PDFExtractor",
    "ImageExtractor",
    "AudioExtractor",
]
