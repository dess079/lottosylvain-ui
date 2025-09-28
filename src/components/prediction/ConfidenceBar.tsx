import React, { useCallback } from 'react';

/**
 * Barre d'indice de confiance pour une prédiction.
 * @param score Score de confiance (0-1)
 */
const ConfidenceBar: React.FC<{ score: number }> = ({ score }) => {
  const scorePercentage = score * 100;

  const getColor = useCallback(() => {
    if (scorePercentage > 80) return 'bg-emerald-500';
    if (scorePercentage > 60) return 'bg-teal-500';
    if (scorePercentage > 40) return 'bg-blue-500';
    if (scorePercentage > 20) return 'bg-amber-500';
    return 'bg-red-500';
  }, [scorePercentage]);

  // convertir le score en texte avec une précision de 0 chiffres après la virgule
  const formattedScore = Math.round(scorePercentage);

  return (
    <div className="w-full mb-5 mt-3">
      <div className="flex  items-center mb-2 gap-4">
        <span className="text-sm font-medium">Indice de confiance</span>
        <div className="flex items-center">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold  ${getColor()} shadow-sm`}
          >
            {formattedScore}%
          </span>
        </div>
      </div>
      <div className="w-full rounded-full h-4 bg-gray-200 dark:bg-gray-700 overflow-hidden shadow-inner confidence-bar">
        <div
          className={`h-4 ${getColor()} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${formattedScore}%` }}
        />
      </div>
    </div>
  );
};

export default ConfidenceBar;
