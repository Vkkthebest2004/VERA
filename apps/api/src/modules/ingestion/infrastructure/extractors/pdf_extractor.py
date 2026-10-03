from typing import Tuple
import fitz  # PyMuPDF


class PDFExtractor:
    """Extracts raw text and metadata from PDF statutory documents using PyMuPDF."""

    @staticmethod
    def extract(pdf_bytes: bytes) -> Tuple[str, dict]:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        text_chunks = []
        page_count = len(doc)

        for page_num in range(page_count):
            page = doc[page_num]
            page_text = page.get_text()
            if page_text.strip():
                text_chunks.append(f"--- [Page {page_num + 1}] ---\n{page_text.strip()}")

        full_text = "\n\n".join(text_chunks)
        metadata = {
            "page_count": page_count,
            "title": doc.metadata.get("title", ""),
            "author": doc.metadata.get("author", ""),
            "creation_date": doc.metadata.get("creationDate", ""),
        }
        return full_text, metadata
