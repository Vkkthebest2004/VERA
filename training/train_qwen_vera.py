"""
VERA Qwen Fine-Tuning Script.
Trains Qwen 2.5 / 3 (3B-4B class) on VERA financial verification & statutory evidence datasets.
Uses HuggingFace Transformers, PEFT (LoRA/QLoRA), and TRL SFTTrainer.
"""

import os
import sys
import json
import logging
import argparse
from typing import Dict, Any

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("train_qwen_vera")


def check_dependencies():
    """Verify required machine learning libraries or provide guidance."""
    missing = []
    for pkg in ["torch", "transformers", "peft", "datasets", "trl"]:
        try:
            __import__(pkg)
        except ImportError:
            missing.append(pkg)
    return missing


def train_qwen_lora(
    base_model_name: str = "Qwen/Qwen2.5-3B-Instruct",
    dataset_dir: str = "training/dataset",
    output_dir: str = "models/qwen_vera_lora",
    num_epochs: int = 3,
    batch_size: int = 2,
    gradient_accumulation_steps: int = 4,
    learning_rate: float = 2e-4,
    lora_r: int = 16,
    lora_alpha: int = 32,
    lora_dropout: float = 0.05,
    max_seq_length: int = 2048,
):
    """
    Fine-tunes Qwen model with Low-Rank Adaptation (LoRA) on VERA canonical training data.
    """
    missing_deps = check_dependencies()
    if missing_deps:
        logger.warning(
            f"Missing fine-tuning packages: {', '.join(missing_deps)}.\n"
            f"To run full LoRA GPU training, install: pip install torch transformers peft datasets trl bitsandbytes accelerate\n"
            f"Alternatively, you can compile and run via Ollama using: 'bash training/build_ollama_qwen.sh'"
        )
        return False

    import torch
    from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments
    from peft import LoraConfig, get_peft_model, TaskType
    from datasets import load_dataset
    from trl import SFTTrainer

    logger.info(f"Loading Base Tokenizer: {base_model_name}")
    tokenizer = AutoTokenizer.from_pretrained(base_model_name, trust_remote_code=True)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    # Check device availability (CUDA / Apple Silicon MPS / CPU)
    if torch.cuda.is_available():
        device_map = "auto"
        torch_dtype = torch.bfloat16
        logger.info("Using NVIDIA CUDA acceleration (bfloat16)")
    elif torch.backends.mps.is_available():
        device_map = {"": "mps"}
        torch_dtype = torch.float16
        logger.info("Using Apple Silicon MPS acceleration (float16)")
    else:
        device_map = {"": "cpu"}
        torch_dtype = torch.float32
        logger.info("Using CPU execution")

    logger.info(f"Loading Base Model: {base_model_name}")
    model = AutoModelForCausalLM.from_pretrained(
        base_model_name,
        torch_dtype=torch_dtype,
        device_map=device_map,
        trust_remote_code=True,
    )

    # Configure LoRA adapters
    peft_config = LoraConfig(
        task_type=TaskType.CAUSAL_LM,
        r=lora_r,
        lora_alpha=lora_alpha,
        lora_dropout=lora_dropout,
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
        bias="none",
    )

    model = get_peft_model(model, peft_config)
    model.print_trainable_parameters()

    # Load datasets
    train_path = os.path.join(dataset_dir, "train.jsonl")
    val_path = os.path.join(dataset_dir, "val.jsonl")

    if not os.path.exists(train_path):
        from dataset_generator import generate_training_datasets
        logger.info("Generating training datasets...")
        generate_training_datasets(dataset_dir)

    dataset = load_dataset(
        "json",
        data_files={"train": train_path, "validation": val_path},
    )

    # Set up training arguments
    training_args = TrainingArguments(
        output_dir=output_dir,
        num_train_epochs=num_epochs,
        per_device_train_batch_size=batch_size,
        gradient_accumulation_steps=gradient_accumulation_steps,
        learning_rate=learning_rate,
        weight_decay=0.01,
        warmup_ratio=0.1,
        lr_scheduler_type="cosine",
        logging_steps=5,
        save_strategy="epoch",
        evaluation_strategy="epoch",
        save_total_limit=2,
        fp16=(torch_dtype == torch.float16),
        bf16=(torch_dtype == torch.bfloat16),
        report_to="none",
    )

    logger.info("Initializing SFT Trainer...")
    trainer = SFTTrainer(
        model=model,
        train_dataset=dataset["train"],
        eval_dataset=dataset["validation"],
        peft_config=peft_config,
        dataset_text_field="messages",
        max_seq_length=max_seq_length,
        tokenizer=tokenizer,
        args=training_args,
    )

    logger.info("Starting training loop...")
    trainer.train()

    logger.info(f"Saving fine-tuned VERA LoRA weights to: {output_dir}")
    model.save_pretrained(output_dir)
    tokenizer.save_pretrained(output_dir)

    logger.info("Training complete!")
    return True


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train Qwen model on VERA statutory dataset")
    parser.add_argument("--model", default="Qwen/Qwen2.5-3B-Instruct", help="Base model identifier")
    parser.add_argument("--dataset_dir", default="training/dataset", help="Directory with train.jsonl & val.jsonl")
    parser.add_argument("--output_dir", default="models/qwen_vera_lora", help="Output directory for adapters")
    parser.add_argument("--epochs", type=int, default=3, help="Training epochs")
    args = parser.parse_args()

    train_qwen_lora(
        base_model_name=args.model,
        dataset_dir=args.dataset_dir,
        output_dir=args.output_dir,
        num_epochs=args.epochs,
    )
