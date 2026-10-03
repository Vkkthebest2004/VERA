import base64
import os
import re
import subprocess
import tempfile
from typing import Tuple
import httpx


class ImageExtractor:
    """Extracts raw textual and visual information from screenshots, charts, and infographics using:
    1. Native Apple Vision Neural Engine OCR (`scripts/sutra-ocr`) with Rupee normalization & overlay cleanup.
    2. Gemma 3 4B Multimodal Vision model (with Qwen 3 VL fallback) for financial reasoning.
    """

    @staticmethod
    def extract(image_bytes: bytes, filename: str = "") -> Tuple[str, dict]:
        ext = filename.split(".")[-1].lower() if "." in filename else "png"
        ocr_lines = []
        vision_model_output = ""
        model_used = "sutra_native_vision_ocr"

        # 1. Native Neural Engine OCR
        with tempfile.NamedTemporaryFile(suffix=f".{ext}", delete=False) as tmp:
            tmp.write(image_bytes)
            tmp_path = tmp.name

        try:
            ocr_tool = os.path.abspath("scripts/sutra-ocr")
            if os.path.exists(ocr_tool) and os.access(ocr_tool, os.X_OK):
                res = subprocess.run([ocr_tool, tmp_path], capture_output=True, text=True, timeout=8)
                if res.returncode == 0 and res.stdout.strip():
                    raw_lines = [line.strip() for line in res.stdout.splitlines() if line.strip()]
                    for line in raw_lines:
                        # Clean UI overlays like Google Lens "Search inside image"
                        line = re.sub(r'©?\s*Search inside image\w*\s*', '', line, flags=re.I).strip()
                        # Fix Apple Vision OCR misreading Indian Rupee symbol ₹ as 7 before monetary figures
                        line = re.sub(r'\b7(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(cr|crore|lakh|trillion|billion|bn|mn)\b', r'₹\1 \2', line, flags=re.I)
                        line = re.sub(r'\b7(\d+)\s*(cr|crore|lakh|trillion|billion|bn|mn)\b', r'₹\1 \2', line, flags=re.I)
                        if line:
                            ocr_lines.append(line)
        except Exception as e:
            print(f"[OCR Error]: {e}")
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)

        # 2. Query Multimodal Vision Model (Gemma 3 4B primary for instant response + Qwen 3 VL fallback)
        base64_img = base64.b64encode(image_bytes).decode("utf-8")
        vision_prompt = (
            "Analyze this financial document/screenshot/infographic carefully. "
            "Extract all text, numbers, company names, tickers, financial metrics, "
            "contract values, currency symbols (especially ₹/INR or $), percentages, and dates displayed in the image. "
            "Format the extracted information clearly and state any verifiable financial claims."
        )

        models_to_try = [
            ("gemma3:4b", 35.0),
            ("qwen3-vl:8b", 90.0),
            ("qwen3-vl:16k", 90.0),
        ]

        for model_name, timeout_secs in models_to_try:
            try:
                resp = httpx.post(
                    "http://localhost:11434/api/generate",
                    json={
                        "model": model_name,
                        "prompt": vision_prompt,
                        "images": [base64_img],
                        "stream": False,
                        "options": {"num_predict": 800}
                    },
                    timeout=timeout_secs,
                )
                if resp.status_code == 200:
                    resp_json = resp.json()
                    resp_text = resp_json.get("response", "").strip()
                    thinking_text = resp_json.get("thinking", "").strip()

                    if resp_text and thinking_text:
                        vision_model_output = f"{resp_text}\n\n[Visual Reasoning & Elements]:\n{thinking_text}"
                    elif resp_text:
                        vision_model_output = resp_text
                    elif thinking_text:
                        vision_model_output = thinking_text

                    if vision_model_output:
                        model_used = f"multimodal_{model_name}"
                        break
            except Exception as e:
                print(f"[Vision Model {model_name} Error]: {e}")
                continue

        # Combine OCR raw text and Multimodal model interpretation
        combined_text_parts = []
        if ocr_lines:
            combined_text_parts.append("[EXACT TEXT EXTRACTED FROM IMAGE PIXELS]:\n" + "\n".join(ocr_lines))
        if vision_model_output:
            combined_text_parts.append("\n[MULTIMODAL FINANCIAL ANALYSIS]:\n" + vision_model_output)

        if not combined_text_parts:
            combined_text_parts.append(f"Image {filename} ingested ({len(image_bytes)} bytes). No clear text detected in visual field.")

        full_text = "\n\n".join(combined_text_parts)
        metadata = {
            "format": ext,
            "size_bytes": len(image_bytes),
            "model_used": model_used,
            "ocr_lines_found": len(ocr_lines),
        }
        return full_text, metadata
