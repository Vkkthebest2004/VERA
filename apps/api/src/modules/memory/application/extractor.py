from __future__ import annotations
import json
import os
import re
from typing import List
import httpx
from apps.api.src.modules.memory.domain.extractor_models import (
    MemoryCandidate,
    MemoryExtractionResult,
)


class MemoryExtractor:
    def __init__(self) -> None:
        self.ollama_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        self.model = os.getenv("VERA_MEMORY_MODEL", "qwen-vera:4b")

    async def extract(
        self,
        user_message: str,
        assistant_message: str,
    ) -> List[MemoryCandidate]:
        """
        Analyze a conversation turn to extract permanent facts or preferences about the user.
        Ignores ephemeral queries (e.g. 'what is the price of Reliance?').
        """
        # Skip extraction on trivial or short messages
        if len(user_message.strip()) < 10:
            return []

        prompt = f"""You are the Memory Extraction Engine for VERA, a financial intelligence platform.
Your task is to analyze the conversation turn between a User and VERA, and decide if there is any long-term fact, preference, persona, or project constraint worth remembering about the user.

USER MESSAGE:
\"\"\"{user_message}\"\"\"

VERA RESPONSE SUMMARY:
\"\"\"{assistant_message[:400]}\"\"\"

CRITERIA:
1. Remember user preferences (e.g. "I prefer simple explanations with chai analogies", "I am a CFA student", "I only invest in large caps").
2. Remember user portfolio / holdings / watchlist interests (e.g. "I hold Tata Power shares").
3. DO NOT remember ephemeral questions, statutory lookups, or random chat (e.g. "What did Reliance report?", "Hi").
4. If nothing is worth remembering, return {{"memories": []}}.

Output strictly valid JSON matching this schema:
{{
  "memories": [
    {{
      "should_remember": true,
      "memory_type": "preference | project | financial_interest | fact | constraint",
      "content": "Concise statement of the persistent fact",
      "importance": 0.8
    }}
  ]
}}
"""
        models_to_try = [self.model, "qwen2.5:3b", "gemma3:4b"]

        for model_name in models_to_try:
            try:
                async with httpx.AsyncClient(timeout=10.0) as client:
                    resp = await client.post(
                        f"{self.ollama_url}/api/generate",
                        json={
                            "model": model_name,
                            "prompt": prompt,
                            "stream": False,
                            "format": "json",
                            "options": {
                                "temperature": 0.1,
                                "num_predict": 300,
                            },
                        },
                    )
                    if resp.status_code == 200:
                        raw = resp.json().get("response", "{}")
                        match = re.search(r"\{.*\}", raw, re.DOTALL)
                        if match:
                            parsed = json.loads(match.group(0))
                            result = MemoryExtractionResult(**parsed)
                            return [m for m in result.memories if m.should_remember and m.content.strip()]
            except Exception:
                continue

        return []
