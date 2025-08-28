import React, { useEffect, useState } from 'react';
import FuturisticChart from './shadcn/ui/futuristic-chart';
import { fetchLottoStatistics } from '../services/api';
import { DrawStatistics } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ErrorBoundary from './ErrorBoundary';

/**
 * Composant pour afficher la fréquence d'apparition des numéros (1 à 49) sous forme de graphique en barres
 */
const NumberFrequencyBarChart2: React.FC = () => {
  const [statistics, setStatistics] = useState<DrawStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        setLoading(true);
        const stats = await fetchLottoStatistics();
        setStatistics(stats);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
        <span className="ml-2">Chargement des statistiques...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-red-500">
        <span>Erreur: {error}</span>
      </div>
    );
  }

  if (!statistics || !statistics.numbersFrequency) {
    return (
      <div className="flex items-center justify-center p-8">
        <span>Aucune donnée disponible</span>
      </div>
    );
  }

  // Préparer les données pour le graphique
  const numbers = Array.from({ length: 49 }, (_, i) => i + 1);
  const frequencies = numbers.map(num => statistics.numbersFrequency[num] || 0);
  const labels = numbers.map(num => num.toString());

  return (
    <ErrorBoundary>
      <div className="w-full space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">
            Fréquence d'apparition des numéros (1 à 49)
          </h2>
          <p className="text-muted-foreground">
            Nombre de fois que chaque numéro est sorti dans tous les tirages
          </p>
        </div>

        <div className="flex justify-center">
          <FuturisticChart
            data={frequencies}
            labels={labels}
            title="Fréquence des numéros"
            width={2000}
            variant="cosmic"
            className="w-full max-w-4xl"
          />
        </div>

        {/* Statistiques supplémentaires */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="font-semibold mb-2">Numéro le plus fréquent</h3>
            {statistics.mostFrequentNumbers && Object.keys(statistics.mostFrequentNumbers).length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-primary">
                  {Object.keys(statistics.mostFrequentNumbers)[0]}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({statistics.mostFrequentNumbers[parseInt(Object.keys(statistics.mostFrequentNumbers)[0])]} apparitions)
                </span>
              </div>
            )}
          </div>

          <div className="bg-card p-4 rounded-lg border">
            <h3 className="font-semibold mb-2">Numéro le moins fréquent</h3>
            {statistics.leastFrequentNumbers && Object.keys(statistics.leastFrequentNumbers).length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-orange-500">
                  {Object.keys(statistics.leastFrequentNumbers)[0]}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({statistics.leastFrequentNumbers[parseInt(Object.keys(statistics.leastFrequentNumbers)[0])]} apparitions)
                </span>
              </div>
            )}
          </div>

          <div className="bg-card p-4 rounded-lg border">
            <h3 className="font-semibold mb-2">Total des tirages analysés</h3>
            <div className="text-2xl font-bold text-green-500">
              {Object.values(statistics.numbersFrequency).reduce((sum: number, freq: number) => sum + freq, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Somme de toutes les apparitions
            </p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default NumberFrequencyBarChart2;
