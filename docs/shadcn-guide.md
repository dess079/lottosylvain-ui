# Guide d'utilisation de shadcn/ui sans modifier les composants existants

Ce guide explique comment utiliser les composants shadcn/ui dans le projet lottosylvain-ui sans modifier les composants personnalisés existants.

## Structure des composants

Le projet utilise deux ensembles de composants UI :

1. **Composants personnalisés originaux** : `/src/components/ui/`
2. **Composants shadcn/ui** : `/src/components/shadcn/`

## Ajout de composants shadcn/ui

Pour ajouter un nouveau composant shadcn/ui sans modifier les composants existants :

1. Utilisez la commande CLI shadcn/ui :

```bash
npm run shadcn:add [nom-du-composant]
```

Par exemple :

```bash
npm run shadcn:add button
```

Cela ajoutera le composant dans `/src/components/shadcn/` sans toucher aux composants existants.

## Utilisation des composants shadcn/ui

Pour utiliser les composants shadcn/ui dans vos fichiers :

```tsx
// Importer les composants shadcn/ui
import { Button as ShadcnButton } from '@/components/shadcn';
// Importer les composants personnalisés originaux
import { Button } from '@/components/ui';

export default function MyComponent() {
  return (
    <div>
      {/* Utiliser le composant shadcn/ui */}
      <ShadcnButton variant="default">Button shadcn/ui</ShadcnButton>
      
      {/* Utiliser le composant personnalisé original */}
      <Button variant="primary">Button original</Button>
    </div>
  );
}
```

## Composants disponibles

À mesure que vous ajoutez des composants shadcn/ui, ils seront disponibles via `@/components/shadcn`.

## Conseils d'utilisation

- Utilisez les alias d'importation pour éviter les conflits de noms (comme `ShadcnButton` dans l'exemple)
- Pour les nouveaux composants, préférez les composants shadcn/ui
- Pour les composants existants, vous pouvez continuer à utiliser les originaux ou migrer progressivement vers shadcn/ui selon vos besoins

## Avantages de cette approche

- Pas de modification des composants existants
- Intégration progressive des composants shadcn/ui
- Flexibilité pour choisir les composants à utiliser selon le contexte
- Pas de risque de régressions dans le code existant
