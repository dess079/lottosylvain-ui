# Docker Configuration pour Lottosylvain UI

Ce répertoire contient les fichiers de configuration Docker pour l'application Lottosylvain UI.

## Structure

- `Dockerfile` : Configuration multi-stage pour builder et servir l'application React/Vite
Note: nginx configuration removed; Dockerfile now uses Node + Vite preview to serve built assets.
- `README.md` : Ce fichier de documentation

## Utilisation

### Build de l'image Docker

Depuis le répertoire racine du projet lottosylvain-ui :

```bash
docker build -f docker/Dockerfile -t lottosylvain-ui .
```

### Démarrage du container

```bash
# The container now serves the app via Vite preview on port 3000
docker run -d -p 4000:3000 --name lottosylvain-ui-container lottosylvain-ui
```

### Via Docker Compose

L'application est configurée dans le fichier `docker-compose.yml` du projet dockerportail :

```bash
cd /Users/sd/dev/dockerportail
docker-compose up lottosylvain-ui
```

## Configuration

### Variables d'environnement

- `VITE_API_URL` : URL du backend API (par défaut: http://lottoquebec-backend:8090)
- `VITE_ENVIRONMENT` : Environnement d'exécution (container|local)

### Ports

- Internal serve port: 3000 (Vite preview)
- Exposed host port in docker-compose: 4000

### Health Check

L'image inclut un health check qui vérifie la disponibilité de l'application toutes les 30 secondes.

## Static serving
The Docker image serves the built static files using Vite preview. API calls should be routed directly to the backend service configured via `VITE_API_URL`.

## Notes

- L'application est buildée avec Node 22 Alpine
- Les fichiers statiques sont servis par Vite preview (Node)
- La configuration supporte le routing côté client (SPA)