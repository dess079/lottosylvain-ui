import React from 'react';

/**
 * JsonBlock
 * Composant réutilisable et cohérent pour afficher du JSON formaté.
 * - Unifie le style entre toutes les sections (pas de divergence p-3/p-4, pas de border spécifique)
 * - Permet d'ajouter une classe supplémentaire via props.className
 * - Préserve les retours de ligne et l'indentation (whitespace-pre-wrap)
 */
export interface JsonBlockProps {
  /** Objet ou valeur à sérialiser en JSON */
  data: unknown;
  /** Classes CSS additionnelles optionnelles */
  className?: string;
}

const JsonBlock: React.FC<JsonBlockProps> = ({ data, className }) => {
  return (
    <pre
      className={[
        'bg-gray-100 rounded p-3 text-xs overflow-x-auto break-words whitespace-pre-wrap font-mono leading-snug',
        className ?? ''
      ].join(' ').trim()}
    >
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};

export default JsonBlock;
