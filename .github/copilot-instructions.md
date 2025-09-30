# Lotto-Sylvain UI Project

## ⚠️ RÈGLE ABSOLUE - CONFIGURATIONS D'ENVIRONNEMENT

**CRITICAL** : Ce projet suit la règle fondamentale de l'écosystème :
**DEUX configurations d'environnement OBLIGATOIRES pour TOUS les projets**

1. **Local Development** (développement sur machine locale)
2. **Container Environment** (déploiement Docker)

**Fichiers requis :**
- Frontend : `.env.local`, `.env.container`, `src/lib/config.ts`
- Backend associé : `application-local.yml`, `application-container.yml`

Cette règle est NON-NÉGOCIABLE et doit être appliquée à tous les nouveaux projets.

## Project Context
This is a Lotto-Sylvain UI project built with modern web technologies. 
The `essais` directory of lottoquebec project contains the API that exploits the data.

## Project name
- lottosylvain-ui

## Always start your response
- Always start your response with the name of the project follow by a line space

## A retenir
- Jamais au grand jamais utiliser de script pour démarrer le projet
- Toujours utiliser les commandes npm ou yarn pour démarrer le projet.
- Jamais faire la création de données fictives dans le projet, si tu en vois tu dois les supprimer.
- Configurations : Il y a deux configurations pour l'API : une pour le container (utilisant .env.container ou .env.docker avec VITE_API_URL=http://lottoquebec-backend:8080/) et une pour le poste local (utilisant .env.local avec VITE_API_URL=http://localhost:8090/). Vérifier les fichiers .env.*, config.ts et api.ts pour les configurations. Pour DirectAI, s'assurer que la bonne configuration est utilisée selon l'environnement.

## Coding Preferences
- **File Size Rule**: NO FILE should exceed 300 lines. Split large files into smaller, focused modules. For components, extract hooks, types, and utilities into separate files.
- Use TypeScript for type safety
- Follow ReactJS 19 best practices and hooks patterns
- Use functional components over class components
- Prefer const over let when possible
- Use meaningful variable and function names
- Include JSDoc comments for complex functions
- Follow ESLint and Prettier configurations if present
- Fait des composant functionnel et utilise tailwindcss pour le style et les composants shadcn/ui

## Technologies
- React 19+ with functional components and hooks ([Installation](https://react.dev/learn/installation))
- TypeScript 5.8 for static typing ([Installation](https://www.typescriptlang.org/download/))
- Vite for fast development and optimized builds ([Guide](https://vite.dev/guide/))
- TailwindCSS for styling and responsive design ([Installation](https://tailwindcss.com/docs/installation))
- Shadcn/ui for reusable and accessible UI components (Documentation currently unavailable)
- Vitest for testing ([Guide](https://vitest.dev/guide/))
- React Router v7 for navigation ([Docs](https://reactrouter.com/home))
- Context API for state management
- Fetch API for backend communication

## Code Style
- Use 2-space indentation
- Use semicolons
- Use single quotes for strings
- Prefer template literals for string interpolation
- Use arrow functions for callbacks and short functions

## Testing
- Write unit tests for utility functions
- Include integration tests for components
- Use descriptive test names that explain the expected behavior

## Performance
- Optimize bundle size and loading performance
- Use React.memo() for expensive components
- Implement proper error boundaries
- Consider accessibility (a11y) in component design
