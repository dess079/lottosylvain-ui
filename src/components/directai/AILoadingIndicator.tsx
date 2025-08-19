import React from 'react';

/**
 * Composant d'indicateur de chargement pour la génération IA
 * Affiche une animation de spinner et le texte "Génération…"
 * Utilisé dans AIResponseBox lors du streaming de réponse
 */
const AILoadingIndicator: React.FC = () => (
  <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 pl-1">
    <svg
      className="h-5 w-5 animate-spin text-blue-500 dark:text-blue-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
      />
    </svg>
    <span className="italic select-none">Génération…</span>
  </div>
);

export default AILoadingIndicator;
