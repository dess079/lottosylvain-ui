#!/usr/bin/env bash

export OLLAMA_NUM_GPU=0
MODEL="sd-llama4-scout-500000"
if ! ollama list | grep -q "$MODEL"; then
  echo "Erreur : le preset '$MODEL' introuvable."
  exit 1
fi
echo "Lancement en CPU-only du modèle $MODEL..."
ollama run "$MODEL"