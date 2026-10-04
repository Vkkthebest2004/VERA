from __future__ import annotations
import os
from functools import lru_cache
from typing import List
import numpy as np


@lru_cache(maxsize=1)
def get_embedding_model():
    """
    Lazy load and cache the SentenceTransformer model.
    Defaults to 384-dimensional multilingual MiniLM.
    """
    from sentence_transformers import SentenceTransformer
    model_name = os.getenv(
        "VERA_EMBEDDING_MODEL",
        "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
    )
    return SentenceTransformer(model_name)


def create_embedding(text: str) -> List[float]:
    """
    Convert text into a normalized 384-dimensional semantic embedding.
    """
    if not text or not text.strip():
        raise ValueError("Cannot create an embedding for empty text.")

    model = get_embedding_model()
    vector = model.encode(
        text,
        normalize_embeddings=True,
        convert_to_numpy=True,
    )
    vector = np.asarray(vector, dtype=np.float32)
    return vector.tolist()
