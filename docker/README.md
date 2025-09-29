# Docker Configuration pour Lottosylvain UI

Ce répertoire contient les fichiers de configuration Docker pour l'application Lottosylvain UI.

## Structure

- `Dockerfile` : Configuration multi-stage pour builder et servir l'application React/Vite
- `nginx.conf` : Configuration Nginx pour servir l'application en production
- `README.md` : Ce fichier de documentation

## Utilisation

### Build de l'image Docker

Depuis le répertoire racine du projet lottosylvain-ui :

```bash
docker build -f docker/Dockerfile -t lottosylvain-ui .
```

### Démarrage du container

```bash
docker run -d -p 4000:80 --name lottosylvain-ui-container lottosylvain-ui
```

### Via Docker Compose

L'application est configurée dans le fichier `docker-compose.yml` du projet dockerportail :

```bash
cd /Users/sd/dev/dockerportail
docker-compose up lottosylvain-ui
```

## Configuration

### Variables d'environnement

- `VITE_API_URL` : URL du backend API (par défaut: http://lottoquebec-backend:8080)
- `VITE_ENVIRONMENT` : Environnement d'exécution (container|local)

### Ports

- Port du container : 80
- Port exposé par défaut : 4000

### Health Check

L'image inclut un health check qui vérifie la disponibilité de l'application toutes les 30 secondes.

## Nginx

La configuration Nginx inclut :
- Serveur de fichiers statiques pour l'application React
- Proxy vers l'API backend sur `/api/*`
- Headers CORS configurés
- Compression gzip
- Headers de sécurité
- Gestion des erreurs

## Notes

- L'application est buildée avec Node 22 Alpine
- Les fichiers statiques sont servis par Nginx Alpine
- La configuration supporte le routing côté client (SPA)