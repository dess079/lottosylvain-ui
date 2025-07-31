import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import './AIResponseBox.css';

/**
 * Composant pour afficher la réponse IA avec interprétation Markdown et défilement automatique
 * @param {string[]} chunks - Liste des chunks de réponse IA
 */
const AIResponseBox: React.FC<{ chunks: string[] }> = ({ chunks }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll automatique vers le bas à chaque nouveau chunk
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [chunks]);

  return (
    <div className="ai-response-box" ref={containerRef}>
      <ReactMarkdown>{chunks.join('')}</ReactMarkdown>
    </div>
  );
};

export default AIResponseBox;
