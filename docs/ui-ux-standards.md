# Guide des Standards UI/UX pour Lottosylvain-UI

Ce guide détaille les standards UI/UX à suivre pour le développement de l'interface utilisateur Lottosylvain.

## Principes fondamentaux

### 1. Accessibilité
- Suivre les directives WCAG 2.1 niveau AA
- Utiliser les attributs ARIA là où c'est nécessaire
- Maintenir un ratio de contraste minimum de 4.5:1
- Supporter la navigation au clavier
- Offrir des alternatives textuelles pour les éléments non textuels

### 2. Cohérence
- Utiliser les tokens de design définis dans `design-tokens.css`
- Maintenir une apparence visuelle cohérente entre les composants
- Utiliser les mêmes motifs d'interaction sur toute l'application

### 3. Réactivité
- Adapter l'interface à toutes les tailles d'écran (mobile, tablette, desktop)
- Utiliser une approche "mobile-first" pour le design
- Tester sur plusieurs appareils et résolutions

### 4. Performance
- Optimiser les temps de chargement et de réponse
- Limiter les animations et effets visuels sur les appareils à faibles ressources
- Respecter les préférences de réduction de mouvement

## Système de design

### Typographie
- Titres : Police `Syne` (font-display)
- Corps de texte : Police `Space Grotesk` (font-sans)
- Code : Police `JetBrains Mono` (font-mono)

### Palette de couleurs
- Primaire : Indigo modernisé (#6366f1)
- Secondaire : Ambre modernisé (#f59e0b)
- Accent : Émeraude 2025 (#10b981)
- Couleurs sémantiques : Success, Error, Warning, Info

### Espacement
- Suivre la grille d'espacement définie dans les tokens de design
- Utiliser les classes d'espacement de Tailwind (m-*, p-*, gap-*)

### Composants

#### Boutons
- Utiliser les classes `.btn`, `.btn-primary`, etc.
- Intégrer un retour visuel sur les interactions (hover, focus, active)
- Inclure un label explicite ou un aria-label

#### Cartes
- Utiliser `.card` pour les conteneurs de contenu
- Ajouter `.card-interactive` pour les cartes cliquables
- Utiliser des effets de hover appropriés

#### Lotto Balls
- Utiliser `.lotto-ball` avec `.lotto-ball-regular` ou `.lotto-ball-bonus`
- Appliquer `.lotto-ball-highlight` pour les boules mises en évidence
- Ajuster la taille avec `.lotto-ball-sm` ou `.lotto-ball-lg`

### Feedback visuel
- Utiliser les `.alert` pour les messages système
- Ajouter des animations subtiles pour les transitions d'état
- Fournir un feedback immédiat lors des interactions

## Modes sombre/clair
- Utiliser la classe `.dark` au niveau du HTML pour le mode sombre
- Tester les deux modes pour assurer la lisibilité et le contraste
- Adapter les ombres et effets selon le mode

## Animations et transitions
- Appliquer des animations subtiles et utiles
- Utiliser les classes d'animation (`animate-*`) avec modération
- Respecter la préférence utilisateur `prefers-reduced-motion`

## Icônes et illustrations
- Utiliser un style cohérent pour toutes les icônes
- Veiller à ce que les icônes soient suffisamment grandes et lisibles
- Ajouter des attributs `aria-label` ou `aria-hidden` selon le contexte

## Tests et validation
- Tester sur différents navigateurs (Chrome, Firefox, Safari, Edge)
- Valider l'accessibilité avec des outils comme Lighthouse ou axe
- Recueillir des retours utilisateurs pour itérer sur le design

---

En suivant ces standards UI/UX, nous assurons une expérience cohérente, accessible et agréable pour tous les utilisateurs de Lottosylvain-UI.
