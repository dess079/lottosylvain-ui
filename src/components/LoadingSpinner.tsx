import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  text?: string;
}

/**
 * Composant affichant un indicateur de chargement avec texte optionnel
 * @param text - Texte à afficher sous le spinner (optionnel)
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text }) => {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner"></div>
      {text && text.trim() && (
        <div className="loading-text">{text}</div>
      )}
    </div>
  );
};

export default LoadingSpinner;
