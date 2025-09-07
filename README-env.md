# Configuration des Environnements

Ce projet supporte deux environnements de développement :

## Environnements Disponibles

### 1. Environnement Local
- **Backend** : `http://localhost:8080`
- **Base de données** : PostgreSQL sur `localhost:5432`
- **Ollama** : `http://localhost:11434`

### 2. Environnement Docker
- **Backend** : `http://localhost:8080` (via conteneur)
- **Base de données** : PostgreSQL dans conteneur
- **Ollama** : `http://host.docker.internal:11434`

## Démarrage

### Avec npm scripts (recommandé)

```bash
# Pour l'environnement local
npm run dev:local

# Pour l'environnement Docker
npm run dev:docker
```

### Manuellement

```bash
# Copier le fichier d'environnement approprié
cp .env.local .env    # Pour local
cp .env.docker .env   # Pour Docker

# Démarrer le serveur de développement
npm run dev
```

### Avec le script shell

```bash
# Rendre le script exécutable
chmod +x start-env.sh

# Démarrage local
./start-env.sh local

# Démarrage Docker
./start-env.sh docker
```

## Configuration des Variables d'Environnement

### .env.local
```env
VITE_API_URL=http://localhost:8080/
```

### .env.docker
```env
VITE_API_URL=http://localhost:8080/
```

## Architecture

Le proxy Vite est configuré pour rediriger automatiquement toutes les requêtes `/api/*` vers l'URL définie dans `VITE_API_URL`.

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: process.env.VITE_API_URL || 'http://localhost:8080/',
      changeOrigin: true,
      secure: false,
    },
  },
},
```

## Dépannage

### Erreur de connexion à l'API
1. Vérifiez que le backend est démarré sur le bon port
2. Vérifiez que le fichier `.env` contient la bonne URL
3. Redémarrez le serveur de développement après changement d'environnement

### Changement d'environnement
Après avoir changé d'environnement, redémarrez toujours le serveur de développement :
```bash
# Arrêter (Ctrl+C)
npm run dev:local  # ou dev:docker
```
