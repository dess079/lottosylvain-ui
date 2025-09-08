import React from 'react';
import type { TooltipProps } from 'recharts';

/**
 * Interface pour les données statistiques d'un numéro
 */
export interface NumberStats {
  nst_total_appearances: number;
  nst_percentage_appearance: number;
  nst_prediction_score: number;
  nst_volatility_index: number;
  nst_last_appearance_date: string;
  nst_current_absence_days: number;
  nst_appearances_this_year: number;
  nst_trend_direction: string;
}

/**
 * Props pour le composant NumberTooltip
 */
interface NumberTooltipProps extends TooltipProps<any, any> {
  detailedStats?: Map<number, any>;
  totalDraws?: number;
}

/**
 * Composant pour afficher les statistiques détaillées d'un numéro dans un tooltip
 */
export const NumberTooltip: React.FC<NumberTooltipProps> = ({
  active,
  payload,
  label,
  detailedStats,
  totalDraws = 0
}) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;
  const numberStats = detailedStats?.get(parseInt(label));

  return (
    <div className="bg-white dark:bg-gray-800 p-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-w-xs">
      <div className="space-y-2">
        {/* Numéro principal */}
        <p className="font-bold text-xl text-gray-900 dark:text-gray-100 border-b pb-2">
          Numéro {label}
        </p>

        {/* Fréquence de base */}
        <div className="grid grid-cols-2 gap-2">
          <p className="text-base text-gray-600 dark:text-gray-400">Fréquence:</p>
          <p className="text-base font-semibold text-blue-600 dark:text-blue-400">{data.count} apparitions</p>
        </div>

        {/* Pourcentage */}
        <div className="grid grid-cols-2 gap-2">
          <p className="text-base text-gray-600 dark:text-gray-400">Pourcentage:</p>
          <p className="text-base font-semibold text-green-600 dark:text-green-400">
            {((data.count / totalDraws) * 100).toFixed(2)}%
          </p>
        </div>

        {/* Statistiques détaillées si disponibles */}
        {numberStats && (
          <>
            {/* Dernière apparition */}
            <div className="grid grid-cols-2 gap-2">
              <p className="text-base text-gray-600 dark:text-gray-400">Dernière apparition:</p>
              <p className="text-base font-semibold text-purple-600 dark:text-purple-400">
                {numberStats.nst_last_appearance_date ? new Date(numberStats.nst_last_appearance_date).toLocaleDateString('fr-FR') : 'N/A'}
              </p>
            </div>

            {/* Jours d'absence */}
            <div className="grid grid-cols-2 gap-2">
              <p className="text-base text-gray-600 dark:text-gray-400">Jours d'absence:</p>
              <p className="text-base font-semibold text-red-600 dark:text-red-400">
                {numberStats.nst_current_absence_days || 0} jours
              </p>
            </div>

            {/* Apparitions cette année */}
            <div className="grid grid-cols-2 gap-2">
              <p className="text-base text-gray-600 dark:text-gray-400">Cette année:</p>
              <p className="text-base font-semibold text-indigo-600 dark:text-indigo-400">
                {numberStats.nst_appearances_this_year || 0} apparitions
              </p>
            </div>

            {/* Score de prédiction */}
            <div className="grid grid-cols-2 gap-2">
              <p className="text-base text-gray-600 dark:text-gray-400">Score prédiction:</p>
              <p className="text-base font-semibold text-orange-600 dark:text-orange-400">
                {numberStats.nst_prediction_score ? Number(numberStats.nst_prediction_score).toFixed(3) : 'N/A'}
              </p>
            </div>

            {/* Tendance */}
            <div className="grid grid-cols-2 gap-2">
              <p className="text-base text-gray-600 dark:text-gray-400">Tendance:</p>
              <p className={`text-base font-semibold ${
                numberStats.nst_trend_direction === 'UP' ? 'text-green-600 dark:text-green-400' :
                numberStats.nst_trend_direction === 'DOWN' ? 'text-red-600 dark:text-red-400' :
                'text-gray-600 dark:text-gray-400'
              }`}>
                {numberStats.nst_trend_direction || 'STABLE'}
              </p>
            </div>

            {/* Volatilité */}
            <div className="grid grid-cols-2 gap-2">
              <p className="text-base text-gray-600 dark:text-gray-400">Volatilité:</p>
              <p className="text-base font-semibold text-yellow-600 dark:text-yellow-400">
                {numberStats.nst_volatility_index ? Number(numberStats.nst_volatility_index).toFixed(3) : 'N/A'}
              </p>
            </div>
          </>
        )}

        {/* Total des tirages */}
        <div className="border-t pt-2 mt-2">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Total des tirages analysés: {totalDraws}
          </p>
        </div>
      </div>
    </div>
  );
};
