# Lotto-Sylvain UI

Une interface utilisateur moderne et intuitive pour explorer les prédictions de la Lotto 6/49, construite avec React, TypeScript et TailwindCSS.

## Fonctionnalités

- Affichage des résultats précédents du tirage de la Lotto 6/49
- Prédictions pour le prochain tirage
- Visualisation des statistiques et des tendances
- Personnalisation des prédictions avec des paramètres configurables
- Interface réactive pour mobile et ordinateur

## Technologies utilisées

- React 19
- TypeScript
- TailwindCSS
- Framer Motion pour les animations
- React Router v7
- Fetch API pour les requêtes backend

## Structure du projet

```
src/
  ├── components/         # Composants React
  │   ├── ui/             # Composants d'interface réutilisables
  │   ├── PredictionSection.tsx
  │   └── PreviousResults.tsx
  ├── lib/                # Utilitaires et fonctions helpers
  │   └── utils.ts
  ├── services/           # Services API et logique métier
  │   └── api.ts
  ├── App.tsx             # Composant principal
  ├── index.css           # Styles globaux
  └── index.tsx           # Point d'entrée
```

## Installation

```bash
# Cloner le repository
git clone <repo-url>

# Accéder au dossier du projet
cd lottosylvain-ui

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

## API Backend

Le projet consomme des API depuis le répertoire `essais` du projet Lottoquebec, qui contient les classes Java exploitant les données du tirage de la Lotto 6/49.

Les points d'API principaux utilisés sont :
- `/api/essais/lotto-matrix/previous-results` - Résultats du dernier tirage
- `/api/essais/lotto-matrix/predictions` - Prédictions pour le prochain tirage
- `/api/essais/lotto-matrix/statistics` - Statistiques sur les tirages passés
- `/api/essais/lotto-matrix/custom-predictions` - Prédictions personnalisées

## Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Compile le projet pour la production
- `npm start` - Lance le projet compilé
- `npm run test` - Exécute les tests

## Licence

Ce projet est sous licence privée.
