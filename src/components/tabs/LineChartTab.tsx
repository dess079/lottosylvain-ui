import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { fetchPreviousResults, fetchDetailedNumberStatistics } from '../../services/api';
import type { DrawStatistics, PreviousResult } from '../../types';
import LoadingSpinner from '../LoadingSpinner';
import { NumberTooltip, type NumberStats } from '../NumberTooltip';
import './LineChartTab.css';


/**
 * Composant pour le graphique en barres de fréquence des numéros
 */
export const NumberFrequencyBarChart: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [statistics, setStatistics] = useState<DrawStatistics | null>(null);
  const [detailedStats, setDetailedStats] = useState<Map<number, NumberStats> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour calculer les statistiques à partir des tirages
  const calculateStatistics = (previousResults: PreviousResult): DrawStatistics => {
    const numbersFrequency: Record<number, number> = {};
    const numbersLastAppearance: Record<number, string> = {};

    // Compter la fréquence de chaque numéro
    previousResults.previousResult.forEach(draw => {
      draw.resultNumbers.forEach(num => {
        numbersFrequency[num] = (numbersFrequency[num] || 0) + 1;
        numbersLastAppearance[num] = draw.previousResultDate;
      });
    });

    // Trouver les numéros les plus et moins fréquents
    const sortedNumbers = Object.entries(numbersFrequency)
      .sort(([,a], [,b]) => b - a);

    const mostFrequentNumbers: Record<number, number> = {};
    const leastFrequentNumbers: Record<number, number> = {};

    if (sortedNumbers.length > 0) {
      // Numéro le plus fréquent
      const [mostFreqNum, mostFreqCount] = sortedNumbers[0];
      mostFrequentNumbers[parseInt(mostFreqNum)] = mostFreqCount;

      // Numéro le moins fréquent
      const [leastFreqNum, leastFreqCount] = sortedNumbers[sortedNumbers.length - 1];
      leastFrequentNumbers[parseInt(leastFreqNum)] = leastFreqCount;
    }

    return {
      mostFrequentNumbers,
      leastFrequentNumbers,
      numbersFrequency,
      numbersLastAppearance
    };
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [stats, details] = await Promise.all([
          fetchPreviousResults(),
          fetchDetailedNumberStatistics()
        ]);
  // Debug: log raw responses to help diagnose missing numbers
  console.debug('[NumberFrequency] fetchPreviousResults response:', stats);
  console.debug('[NumberFrequency] fetchDetailedNumberStatistics response (Map):', details);
        if (!mounted) return;
        const calculatedStats = calculateStatistics(stats);
        setStatistics(calculatedStats);
        setDetailedStats(details);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? 'Erreur lors de la récupération des données');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (isActive) load();
    return () => { mounted = false; };
  }, [isActive]);

  if (!isActive) {
    return (
      <section>
        <h2 className="text-2xl font-semibold mb-6">Fréquence d'apparition des numéros (1 à 49) dans tous les tirages</h2>
        <div className="text-center text-base opacity-70 flex items-center justify-center min-h-96">
          Cliquez sur cet onglet pour charger le graphique de fréquence
        </div>
      </section>
    );
  }

  return (
    <section className="number-frequency-bar-chart">
      <h2 className="text-2xl text-center font-semibold mb-6">Fréquence d'apparition des numéros (1 à 49) dans tous les tirages</h2>
 
      {loading ? (
        <div className="flex items-center justify-center min-h-48">
          <LoadingSpinner text="Chargement des données..." />
        </div>
      ) : error ? (
        <div className="text-center text-base text-red-600">Erreur: {error}</div>
      ) : statistics && statistics.numbersFrequency ? (
        <div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={(() => {
                // Créer un tableau avec tous les numéros de 1 à 49.
                // Préférer les statistiques détaillées (detailedStats) si disponibles,
                // sinon retomber sur le calcul dérivé de fetchPreviousResults.
                const allNumbers = [] as { number: number; count: number }[];
                for (let i = 1; i <= 49; i++) {
                  const detail = detailedStats?.get(i);
                  // The backend detailed stats use `nst_total_appearances` (see NumberTooltip.NumberStats)
                  const count = detail?.nst_total_appearances ?? statistics.numbersFrequency[i] ?? 0;
                  allNumbers.push({ number: i, count });
                }
                // Debug: inspect final dataset used by the chart
                console.debug('[NumberFrequency] chart dataset sample:', allNumbers.slice(0, 8));
                return allNumbers;
              })()}
              margin={{ top: 20, right: 30, left: 20, bottom: 2 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="number" 
                label={{ value: 'Numéro (1-49)', position: 'insideBottom', offset: -5 }} 
                type="number"
                scale="linear"
                domain={[1, 49]}
                tickCount={49}
                interval={0}
                tick={{ fontSize: 6 }}
                angle={-90}
                textAnchor="middle"
                height={80}
                tickFormatter={(value) => value.toString()}
              />
              <YAxis label={{ value: 'Nombre de fois', angle: -90, position: 'insideLeft' }} allowDecimals={false} />
              <NumberTooltip
                detailedStats={detailedStats || undefined}
                totalDraws={Object.values(statistics.numbersFrequency).reduce((sum: number, freq: number) => sum + freq, 0)}
              />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Nombre de fois sorti" />
            </BarChart>
          </ResponsiveContainer>
          
          {/* Statistiques supplémentaires */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-card p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">Numéro le plus fréquent</h3>
              {statistics.mostFrequentNumbers && Object.keys(statistics.mostFrequentNumbers).length > 0 && (() => {
                // Trouver le numéro avec la fréquence la plus élevée
                const entries = Object.entries(statistics.mostFrequentNumbers);
                const [mostFrequentNumber, highestFrequency] = entries.reduce((max, [number, frequency]) =>
                  frequency > max[1] ? [parseInt(number), frequency] : max,
                  [0, 0]
                );
                return (
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-primary">
                      {mostFrequentNumber}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({highestFrequency} apparitions)
                    </span>
                  </div>
                );
              })()}
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
      ) : (
        <div className="text-center text-base opacity-70 flex items-center justify-center min-h-48">
          Aucune donnée disponible pour le graphique
        </div>
      )}
    </section>
  );
};

