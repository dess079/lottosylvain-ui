import React from 'react';

/**
 * Composant Toolbar principal pour la barre d'outils.
 * Utilise les conventions shadcn/ui et accepte les props children et className.
 */
export const Toolbar: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <div className={`flex w-full items-center ${className}`}>{children}</div>
);

/**
 * Composant pour le titre de la toolbar.
 */
export const ToolbarTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-lg sm:text-xl font-bold text-foreground">{children}</span>
);

/**
 * Composant pour séparer les groupes de boutons dans la toolbar.
 */
export const ToolbarSeparator: React.FC = () => (
  <span className="mx-2 w-px h-6 bg-border dark:bg-border/50" />
);

/**
 * Composant pour encapsuler un bouton dans la toolbar.
 * Utilise asChild pour permettre l'utilisation de Button comme enfant direct.
 */
export const ToolbarButton: React.FC<{ asChild?: boolean; children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex">{children}</span>
);
