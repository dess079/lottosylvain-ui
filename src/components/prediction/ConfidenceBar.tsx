import React, { useCallback } from 'react';

/**
 * Barre d'indice de confiance pour une prédiction.
 * @param score Score de confiance (0-1)
 */
const ConfidenceBar: React.FC<{ score: number }> = ({ score }) => {
  const scorePercentage = score * 100;

  const getColor = useCallback(() => {
    if (scorePercentage > 80) return 'from-emerald-400 via-green-500 to-emerald-600';
    if (scorePercentage > 60) return 'from-teal-400 via-cyan-500 to-teal-600';
    if (scorePercentage > 40) return 'from-blue-400 via-indigo-500 to-blue-600';
    if (scorePercentage > 20) return 'from-amber-400 via-yellow-500 to-amber-600';
    return 'from-red-400 via-rose-500 to-red-600';
  }, [scorePercentage]);

  // convertir le score en texte avec une précision de 0 chiffres après la virgule
  const formattedScore = Math.round(scorePercentage);

  return (
    <div className="w-full mb-5 mt-3">
      <div className="flex  items-center mb-2 gap-4">
        <span className="text-sm font-medium">Indice de confiance</span>
        <div className="flex items-center">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold  bg-gradient-to-r ${getColor()} shadow-sm`}
          >
            {formattedScore}%
          </span>
        </div>
      </div>
      <div className="w-full rounded-full h-4 bg-gray-200 dark:bg-gray-700 overflow-hidden shadow-inner confidence-bar">
        <div
          className={`h-4 bg-gradient-to-r ${getColor()} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${formattedScore}%` }}
        />
      </div>
    </div>
  );
};

export default ConfidenceBar;
