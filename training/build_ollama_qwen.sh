#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# Build & Register VERA Custom Qwen Model in Ollama
# ─────────────────────────────────────────────────────────────────────────────

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

MODEL_NAME="qwen-vera:4b"
MODELFILE_PATH="$SCRIPT_DIR/Modelfile.qwen-vera"

echo "🏛️  VERA AI Engine: Compiling Custom Qwen Model..."
echo "Target Model: $MODEL_NAME"
echo "Modelfile: $MODELFILE_PATH"

if ! command -v ollama &> /dev/null; then
    echo "❌ Error: ollama is not installed or not in PATH."
    exit 1
fi

# Ensure base model exists or pull it
if ! ollama list | grep -q "qwen2.5:3b"; then
    echo "📦 Pulling base Qwen weights (qwen2.5:3b)..."
    ollama pull qwen2.5:3b
fi

echo "⚙️  Building $MODEL_NAME with VERA Invariants & Decision Framework..."
ollama create "$MODEL_NAME" -f "$MODELFILE_PATH"

echo "✅ Success! $MODEL_NAME is registered and ready for local inference."
echo "You can test it directly with:"
echo "  ollama run $MODEL_NAME \"Tata Power signed secret 12,500 Cr contract! Guaranteed upper circuit\""
