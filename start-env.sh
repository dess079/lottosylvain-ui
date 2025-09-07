#!/bin/bash

# Script pour démarrer l'application avec différents environnements

ENV=$1

if [ "$ENV" = "local" ]; then
  echo "🚀 Démarrage en mode LOCAL"
  cp .env.local .env
  npm run dev
elif [ "$ENV" = "docker" ]; then
  echo "🐳 Démarrage en mode DOCKER"
  cp .env.docker .env
  npm run dev
else
  echo "❌ Usage: $0 {local|docker}"
  echo "   local  - Démarrage avec configuration locale"
  echo "   docker - Démarrage avec configuration Docker"
  exit 1
fi
