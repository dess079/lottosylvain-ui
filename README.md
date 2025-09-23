# 🎰 LottoSylvain UI

[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0.2-green.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.11-blue.svg)](https://tailwindcss.com/)

## 📋 Introduction du projet

**LottoSylvain UI** est une application web moderne et interactive dédiée à l'analyse et à la prédiction des numéros de loterie. Cette interface utilisateur sophistiquée exploite l'intelligence artificielle pour fournir des recommandations de numéros basées sur l'analyse statistique et l'apprentissage automatique.

### 🎯 Objectifs
- Fournir une interface intuitive pour l'analyse des données de loterie
- Visualiser les tendances et statistiques historiques
- Générer des prédictions intelligentes via IA
- Offrir une expérience utilisateur moderne et réactive

### 👥 Utilisateur cible
- Joueurs de loterie cherchant des analyses statistiques
- Développeurs intéressés par l'analyse de données
- Passionnés de data science et d'intelligence artificielle

---

## 📦 Dépendances / Packages

### 🚀 Technologies principales

| Package | Version | Description |
|---------|---------|-------------|
| **React** | `19.1.0` | Framework JavaScript pour l'interface utilisateur |
| **TypeScript** | `5.8.3` | Langage de programmation typé |
| **Vite** | `7.0.2` | Outil de build ultra-rapide |
| **TailwindCSS** | `4.1.11` | Framework CSS utilitaire |

### 🎨 Interface utilisateur & Design

| Package | Version | Description |
|---------|---------|-------------|
| **@radix-ui/react-*** | `~1.x-2.x` | Composants UI accessibles (Dialog, Popover, Select, etc.) |
| **shadcn-ui** | `0.9.5` | Système de composants moderne |
| **lucide-react** | `0.525.0` | Icônes vectorielles modernes |
| **framer-motion** | `12.23.0` | Animations fluides et transitions |
| **next-themes** | `0.4.6` | Gestion des thèmes sombre/clair |

### 📊 Visualisation de données

| Package | Version | Description |
|---------|---------|-------------|
| **chart.js** | `4.5.0` | Bibliothèque de graphiques |
| **react-chartjs-2** | `5.3.0` | Wrapper React pour Chart.js |
| **recharts** | `2.15.0` | Graphiques composables pour React |
| **plotly.js** | `3.1.0` | Graphiques scientifiques avancés |
| **react-plotly.js** | `2.6.0` | Wrapper React pour Plotly |

### 🔧 Gestion d'état & Formulaires

| Package | Version | Description |
|---------|---------|-------------|
| **@preact/signals** | `2.2.1` | Gestion d'état réactive |
| **@preact/signals-react** | `3.2.1` | Intégration signals avec React |
| **@tanstack/react-query** | `5.81.5` | Gestion des requêtes et cache |
| **react-hook-form** | `7.60.0` | Gestion des formulaires |
| **@hookform/resolvers** | `5.1.1` | Résolveurs de validation |
| **zod** | `3.25.75` | Validation de schémas TypeScript |

### 🛣️ Navigation & Routing

| Package | Version | Description |
|---------|---------|-------------|
| **react-router-dom** | `7.6.3` | Routage pour applications React |

### 📝 Contenu & Markdown

| Package | Version | Description |
|---------|---------|-------------|
| **react-markdown** | `10.1.0` | Rendu Markdown dans React |
| **remark-gfm** | `4.0.1` | Support GitHub Flavored Markdown |
| **rehype-highlight** | `7.0.2` | Coloration syntaxique |
| **rehype-raw** | `7.0.0` | Support HTML brut |
| **dompurify** | `3.2.6` | Nettoyage HTML sécurisé |
| **mermaid** | `11.11.0` | Diagrammes et graphiques |

### 🕒 Gestion des dates

| Package | Version | Description |
|---------|---------|-------------|
| **date-fns** | `4.1.0` | Utilitaires de manipulation de dates |
| **dayjs** | `1.11.13` | Bibliothèque de dates légère |
| **react-day-picker** | `9.8.0` | Sélecteur de date React |
| **react-calendar** | `6.0.0` | Composant calendrier |

### 🛠️ Outils de développement

| Package | Version | Description |
|---------|---------|-------------|
| **@vitejs/plugin-react** | `4.6.0` | Plugin Vite pour React |
| **@tailwindcss/vite** | `4.1.11` | Plugin Vite pour TailwindCSS |
| **@types/react** | `19.1.8` | Types TypeScript pour React |
| **@types/react-dom** | `19.1.6` | Types TypeScript pour React DOM |
| **@types/node** | `24.0.10` | Types TypeScript pour Node.js |

---

## 🏗️ Composants / Fonctionnalités

### 🎮 Structure principale

```
src/
├── components/           # Composants réutilisables
├── features/            # Fonctionnalités métier
├── hooks/               # Hooks personnalisés
├── services/            # Services API
├── types/               # Types TypeScript
├── context/             # Contextes React
└── signals/             # Gestion d'état Preact Signals
```

### 🧩 Composants clés

#### 📊 **Visualisation de données**
- **`NumberFrequencyGraph`** - Graphique de fréquence des numéros
- **`FrequencyOverTimeGraph`** - Évolution temporelle des fréquences
- **`FuturisticChartsSection`** - Section de graphiques avec design futuriste
- **`LottoTemporalGraphScreen`** - Écran d'analyse temporelle avancée

#### 🎯 **Prédictions IA**
- **`prediction/`** - Module complet de prédictions
- **`directai/`** - Intégration directe avec l'IA
- **`AnalysisMarkdownBox`** - Affichage des analyses IA en Markdown

#### 🎨 **Interface utilisateur**
- **`FuturisticToolbar`** - Barre d'outils moderne et responsive
- **`TabsLotto`** - Système d'onglets avec lazy loading
- **`FooterSection`** - Pied de page avec informations système
- **`LoadingSpinner`** - Indicateur de chargement personnalisé

#### 📅 **Sélection de dates**
- **`CalendarDateInput`** - Sélecteur de date simple
- **`CalendarRangeInput`** - Sélecteur de plage de dates
- **`ShadcnCalendarInput`** - Calendrier avec design Shadcn/ui

#### 🛠️ **Utilitaires**
- **`ErrorBoundary`** - Gestion d'erreurs React
- **`CustomSelectionSection`** - Section de sélection personnalisée
- **`NumberTooltip`** - Infobulles pour les numéros

### 🌐 **Contextes globaux**

| Contexte | Description |
|----------|-------------|
| **`ThemeContext`** | Gestion des thèmes sombre/clair |
| **`LanguageContext`** | Internationalisation |
| **`TabStyleContext`** | Styles dynamiques des onglets |

### 🚀 **Fonctionnalités principales**

#### 📈 **Analyse statistique**
- Visualisation des fréquences de numéros
- Analyse des tendances temporelles
- Statistiques en temps réel
- Graphiques interactifs multiples

#### 🤖 **Prédictions IA**
- Recommandations basées sur ML
- Streaming des prédictions en temps réel
- Analyse conforme aux algorithmes
- Intégration Spring AI

#### 🎨 **Expérience utilisateur**
- Design futuriste et moderne
- Mode sombre/clair automatique
- Interface responsive (mobile-first)
- Animations fluides avec Framer Motion
- Lazy loading des composants

#### 🔧 **Configuration environnements**
- **Local** : `localhost:8090` (développement)
- **Container** : `lottoquebec-backend:8080` (production)
- Configuration automatique basée sur l'environnement

---

## 🚀 Démarrage rapide

```bash
# Installation des dépendances
npm install

# Développement local
npm run dev:local

# Développement Docker
npm run dev:docker

# Build de production
npm run build

# Tests
npm run test
```

---

## 📱 Captures d'écran

<!-- Placeholders pour futures captures d'écran -->
![Dashboard principal](./docs/screenshots/dashboard.png)
*Interface principale avec graphiques et prédictions*

![Analyse temporelle](./docs/screenshots/temporal-analysis.png)
*Écran d'analyse temporelle avancée*

![Prédictions IA](./docs/screenshots/ai-predictions.png)
*Module de prédictions avec IA en temps réel*

---

## 🤝 Contribution

Ce projet utilise des standards modernes de développement React avec TypeScript. Respectez les conventions ESLint et Prettier en place.

---

## 📄 Licence

Projet privé - Tous droits réservés.

---

<div align="center">
  <p>Développé avec ❤️ par l'équipe LottoSylvain</p>
  <p>Propulsé par React 19, TypeScript 5.8 et Vite 7</p>
</div>
