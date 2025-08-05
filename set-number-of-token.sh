#!/bin/bash

MODEL_PRESET="sd-llama4-scout-400000"
MODEL_BASE="llama4:scout"

# 1. Lance Ollama avec le modèle de base et configure le contexte à 400000 tokens
echo "Lancement interactif pour configurer num_ctx à 400000..."
ollama run $MODEL_BASE << EOF
/set parameter num_ctx 400000
/save $MODEL_PRESET
/bye
EOF

# 2. Lance Ollama avec le preset sauvegardé (contexte réduit)
echo "Lancement Ollama avec preset $MODEL_PRESET..."
ollama run $MODEL_PRESET &
OLLAMA_PID=$!

# 3. Surveille l'utilisation mémoire toutes les 5 secondes
echo "Surveillance mémoire Ollama (PID $OLLAMA_PID)... (Ctrl+C pour arrêter)"
while kill -0 $OLLAMA_PID 2>/dev/null; do
  ps -p $OLLAMA_PID -o %mem,rss,vsz,cmd
  sleep 5
done

echo "Ollama terminé."