# LottoSylvain-UI - Configuration d'Environnement

## ⚠️ RÈGLE IMPORTANTE POUR L'IA

Ce projet suit la **RÈGLE ABSOLUE** de l'écosystème : 
**Deux configurations d'environnement OBLIGATOIRES**

1. **Local Development** (développement sur machine)
2. **Container Environment** (déploiement Docker)

## Configuration Actuelle

### Frontend (React + Vite)
- **Local** : Port 5174 - `VITE_API_URL=http://localhost:8090/`
- **Container** : Port 3002 - `VITE_API_URL=http://lottoquebec-backend:8090/`

### Backend (Utilise LottoQuebec)
- Se connecte au backend LottoQuebec selon l'environnement

### Fichiers de Configuration
```
Frontend:
├── .env.local           # Variables pour développement local
├── .env.container       # Variables pour environnement Docker
└── src/lib/config.ts    # Configuration centralisée
```

## Utilisation

### Mode Local
```bash
# Frontend
cp .env.local .env && npm run dev
```

### Mode Container
```bash
# Frontend
cp .env.container .env && npm run build
```

Cette configuration est OBLIGATOIRE et doit être maintenue pour tous les projets.