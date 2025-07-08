# Lotto-Sylvain UI

Une interface utilisateur moderne et intuitive pour explorer les prédictions de la Lotto 6/49, construite avec React, TypeScript, TailwindCSS et shadcn/ui.

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
- shadcn/ui pour les composants d'interface
- Framer Motion pour les animations
- React Router v7
- Fetch API pour les requêtes backend

## Structure du projet

```
src/
  ├── components/         # Composants React
  │   ├── ui/             # Composants d'interface réutilisables personnalisés
  │   ├── shadcn/         # Composants shadcn/ui (séparés des composants originaux)
  │   ├── PredictionSection.tsx
  │   └── PreviousResults.tsx
  ├── lib/                # Utilitaires et fonctions helpers
```

## Utilisation des composants d'interface

Ce projet propose deux approches pour les composants d'interface :

1. **Composants personnalisés originaux** : disponibles via `@/components/ui`
2. **Composants shadcn/ui** : disponibles via `@/components/shadcn`

Pour plus d'informations sur l'utilisation des composants shadcn/ui sans affecter les composants existants, consultez le [guide shadcn/ui](./docs/shadcn-guide.md).

### Ajouter de nouveaux composants shadcn/ui

Pour ajouter un nouveau composant shadcn/ui à votre projet, utilisez la commande :

```bash
npm run shadcn:add [nom-du-composant]
```

Par exemple, pour ajouter le composant "Dialog" :

```bash
npm run shadcn:add dialog
```

### Exemples d'utilisation

#### Composants personnalisés originaux

```tsx
import { Button, Card, Alert } from '@/components/ui';

export default function App() {
  return (
    <Card variant="glass" hover animate>
      <Alert variant="success" title="Prédiction générée">
        Votre prédiction pour le prochain tirage a été générée avec succès.
      </Alert>
      <Button variant="primary" size="lg">
        Analyser les résultats
      </Button>
    </Card>
  );
}
```

#### Composants shadcn/ui (après installation)

```tsx
import { Button, Card, CardContent } from '@/components/shadcn';
import { Alert, AlertTitle, AlertDescription } from '@/components/shadcn';

export default function App() {
  return (
    <Card>
      <CardContent>
        <Alert variant="success">
          <AlertTitle>Prédiction générée</AlertTitle>
          <AlertDescription>
            Votre prédiction pour le prochain tirage a été générée avec succès.
          </AlertDescription>
        </Alert>
        <Button variant="default">Analyser les résultats</Button>
      </CardContent>
    </Card>
  );
}
```
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
