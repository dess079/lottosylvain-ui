import React from 'react';
import ReactMarkdown from 'react-markdown';
import './AnalysisMarkdownBox.css';

interface AnalysisMarkdownBoxProps {
  /** Titre affiché au-dessus du contenu markdown */
  title: string;
  /** Contenu markdown à afficher */
  markdown: string;
  /** Classe Tailwind pour la hauteur max (ex: 'max-h-[40vh]') */
  maxHeight?: string;
}

/**
 * Composant réutilisable pour afficher une analyse markdown avec scroll et style.
 * @param title Titre de la section
 * @param markdown Contenu markdown à afficher
 * @param maxHeight Classe Tailwind pour la hauteur max (par défaut 'max-h-[40vh]')
 */
const AnalysisMarkdownBox: React.FC<AnalysisMarkdownBoxProps> = ({
  title,
  markdown,
  maxHeight = 'max-h-[40vh]'
}) => (
  <div className={`mt-6 text-sm p-6 rounded-lg border border-gray-100/50 dark:border-gray-700/50 overflow-auto ${maxHeight} analysis-markdown-box`}>
    <h4 className="font-bold text-base mb-3">{title}</h4>
    <div className="leading-relaxed">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  </div>
);

export default AnalysisMarkdownBox;
