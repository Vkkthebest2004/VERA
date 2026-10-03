import httpx
from typing import Optional
from ..domain.entities import ChannelType, FactCheckDossier
from ..domain.services import FinancialInformationDehypingService
from ..infrastructure.extractors import MultiModalExtractor


class IngestFinancialInformationUseCase:
    """Orchestrates intake, extraction, and fact-check dossier generation."""

    def __init__(self, dehyping_service: Optional[FinancialInformationDehypingService] = None):
        self.dehyping_service = dehyping_service or FinancialInformationDehypingService()
        self.extractor = MultiModalExtractor()

    def process_text(self, text: str, channel: ChannelType = ChannelType.TEXT) -> FactCheckDossier:
        return self.dehyping_service.analyze_content(text, channel)

    def process_file(self, file_bytes: bytes, filename: str, content_type: str) -> FactCheckDossier:
        lower_name = filename.lower()
        
        if lower_name.endswith(".pdf") or "pdf" in content_type:
            raw_text, meta = self.extractor.extract_from_pdf(file_bytes)
            channel = ChannelType.PDF
        elif any(lower_name.endswith(ext) for ext in [".png", ".jpg", ".jpeg", ".webp"]) or "image" in content_type:
            raw_text, meta = self.extractor.extract_from_image(file_bytes, filename)
            channel = ChannelType.INSTAGRAM  # Often Instagram or WhatsApp screenshot
        elif any(lower_name.endswith(ext) for ext in [".mp3", ".wav", ".m4a", ".ogg"]) or "audio" in content_type:
            raw_text, meta = self.extractor.extract_from_audio(file_bytes, filename)
            channel = ChannelType.AUDIO
        else:
            raw_text = file_bytes.decode("utf-8", errors="replace")
            meta = {"filename": filename}
            channel = ChannelType.TEXT

        dossier = self.dehyping_service.analyze_content(raw_text, channel)
        dossier.metadata.update(meta)
        dossier.metadata["filename"] = filename
        return dossier

    async def process_url(self, url: str) -> FactCheckDossier:
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
            resp = await client.get(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
            raw_html = resp.text
            
        # Basic text strip
        import re
        text = re.sub(r"<script.*?</script>", "", raw_html, flags=re.DOTALL | re.IGNORECASE)
        text = re.sub(r"<style.*?</style>", "", text, flags=re.DOTALL | re.IGNORECASE)
        text = re.sub(r"<[^>]+>", " ", text)
        clean_text = " ".join(text.split())[:5000]  # First 5000 chars
        
        dossier = self.dehyping_service.analyze_content(clean_text, ChannelType.URL)
        dossier.metadata["source_url"] = url
        return dossier
