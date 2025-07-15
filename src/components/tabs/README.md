# Package Tabs

Ce package contient tous les composants liés aux onglets de l'application Lotto 649 avec chargement paresseux.

## Architecture

```
tabs/
├── index.ts              # Export centralisé du package
├── TabsLotto.tsx         # Composant principal d'onglets
├── TabsLotto.css         # Styles et animations pour les onglets
├── PreviousDrawTab.tsx   # Onglet du dernier tirage officiel
├── PreviousDrawTab.css   # Styles pour l'onglet précédent
├── GraphTab.tsx          # Onglet du graphique temporel
├── GraphTab.css          # Styles pour l'onglet graphique
├── PredictionTab.tsx     # Onglet des prédictions IA
├── PredictionTab.css     # Styles pour l'onglet prédiction
└── README.md            # Documentation du package
```

## Composants

### TabsLotto
Composant principal qui gère :
- ✅ État des onglets actifs
- ✅ Navigation entre les onglets
- ✅ Chargement paresseux des données
- ✅ Interface utilisateur des onglets

### PreviousDrawTab
- ✅ Affichage du dernier tirage officiel
- ✅ Chargement des données API
- ✅ Gestion des erreurs et états de chargement

### GraphTab
- ✅ Affichage du graphique temporel
- ✅ Rendu conditionnel pour les performances
- ✅ Intégration avec LottoTemporalGraphScreen

### PredictionTab
- ✅ Affichage des prédictions IA
- ✅ Chargement des recommandations API
- ✅ Interface d'erreur robuste

## Utilisation

```tsx
import { TabsLotto } from './components/tabs';

function App() {
  return (
    <div>
      <TabsLotto />
    </div>
  );
}
```

## Fonctionnalités

### Chargement paresseux
- Les données ne sont chargées que lorsque l'onglet devient actif
- Évite les appels API inutiles au chargement initial
- Améliore les performances de l'application

### Gestion d'état
- État centralisé dans TabsLotto
- Props `isActive` transmises aux composants enfants
- Flag `hasLoaded` pour éviter les rechargements

### Animations
- Transitions fluides entre les onglets
- Animations d'entrée pour le contenu
- Effets hover sur les boutons d'onglets

## Technologies

- **React 19** avec hooks fonctionnels
- **TypeScript** pour la sécurité des types
- **Tailwind CSS** pour le styling
- **Shadcn/ui** pour les composants d'onglets
