/**
 * Déclarations de types globaux pour le projet Lotto-Sylvain UI
 */

declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

/**
 * Extension de la configuration window pour le thème
 */
interface Window {
  __theme: 'light' | 'dark';
  __setPreferredTheme: (theme: 'light' | 'dark') => void;
}

/**
 * Extension de l'API Webanimation pour les propriétés CSS
 */
interface KeyframeEffect {
  pseudoElement: string | null;
}
