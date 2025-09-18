import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis, Tooltip } from 'recharts';
import { fetchDetailedNumberStatistics } from '../../services/api';
import { fetchDrawCount } from '../../services/api';
import LoadingSpinner from '../LoadingSpinner';
import { NumberTooltip } from '../NumberTooltip';

/**
 * Composant pour le graphique en barres de fréquence des numéros
 */
const NumberFrequencyBarChart: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [detailedStats, setDetailedStats] = useState<Map<number, any> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drawCount, setDrawCount] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // Récupérer les statistiques détaillées
        const details = await fetchDetailedNumberStatistics();
        if (!mounted) return;
        setDetailedStats(details);
        // Récupérer le nombre total de tirages
        const count = await fetchDrawCount();
        console.info('[NumberFrequency] Total draw count fetched:', count);
        if (!mounted) return;
        setDrawCount(count);
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
        <h2 className="text-2xl font-semibold mb-6 text-center">Fréquence d'apparition des numéros (1 à 49) dans tous les tirages</h2>
        <div className="text-center text-base opacity-70 flex items-center justify-center min-h-96">
          Cliquez sur cet onglet pour charger le graphique de fréquence
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col h-full">
      <h2 className="text-2xl font-semibold mb-6 text-center flex-shrink-0">Fréquence d'apparition des numéros (1 à 49) dans tous les tirages</h2>

      {loading ? (
        <div className="flex items-center justify-center flex-1 min-h-0">
          <LoadingSpinner text="Chargement des données..." />
        </div>
      ) : error ? (
        <div className="text-center text-base text-red-600">Erreur: {error}</div>
      ) : detailedStats ? (
        <div className="flex flex-col flex-1 min-h-0">
          <div className="w-full flex justify-center items-center">
           
              <BarChart
                width={1200}
                height={500}
                data={(() => {
                  // Créer un tableau avec tous les numéros de 1 à 49.
                  // Utiliser les statistiques détaillées du backend
                  const allNumbers = [] as { number: number; count: number }[];
                  for (let i = 1; i <= 49; i++) {
                    const detail = detailedStats?.get(i);
                    // Utiliser nst_total_appearances du backend
                    const count = detail?.nst_total_appearances ?? 0;
                    allNumbers.push({ number: i, count });
                  }
                  // Debug: inspect final dataset used by the chart
                  console.debug('[NumberFrequency] chart dataset sample:', allNumbers.slice(0, 8));
                  return allNumbers;
                })()}
                
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="number"
                  type="number"
                  scale="linear"
                  domain={[1, 49]}
                  tickCount={49}
                  interval={0}
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  tickFormatter={(value) => value.toString()}
                />
                <YAxis
                  label={{ value: 'Fréquence d\'apparition', angle: -90, position: 'insideLeft', textAnchor: 'center' }}
                  allowDecimals={false}
               
                  tick={{ fontSize: 12 }}
                />
        
                <Legend />

                <Tooltip content={<NumberTooltip detailedStats={detailedStats || undefined} totalDraws={drawCount ?? 0} />} />
                   
                <Bar dataKey="count" fill="#8884d8" name="Nombre de fois sorti - Numéro (1-49)" />
              </BarChart>
          
          </div>
          
          {/* Statistiques supplémentaires */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 flex-shrink-0">
            <div className="bg-card p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">Numéro le plus fréquent</h3>
              {(() => {
                // Trouver le numéro avec la fréquence la plus élevée
                let mostFrequentNumber = 0;
                let highestFrequency = 0;
                for (let i = 1; i <= 49; i++) {
                  const detail = detailedStats?.get(i);
                  const frequency = detail?.nst_total_appearances ?? 0;
                  if (frequency > highestFrequency) {
                    highestFrequency = frequency;
                    mostFrequentNumber = i;
                  }
                }
                return mostFrequentNumber > 0 ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-primary">
                      {mostFrequentNumber}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({highestFrequency} apparitions)
                    </span>
                  </div>
                ) : null;
              })()}
            </div>

            <div className="bg-card p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">Numéro le moins fréquent</h3>
              {(() => {
                // Trouver le numéro avec la fréquence la plus basse
                let leastFrequentNumber = 0;
                let lowestFrequency = Infinity;
                for (let i = 1; i <= 49; i++) {
                  const detail = detailedStats?.get(i);
                  const frequency = detail?.nst_total_appearances ?? 0;
                  if (frequency < lowestFrequency && frequency > 0) {
                    lowestFrequency = frequency;
                    leastFrequentNumber = i;
                  }
                }
                return leastFrequentNumber > 0 ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-orange-500">
                      {leastFrequentNumber}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({lowestFrequency} apparitions)
                    </span>
                  </div>
                ) : null;
              })()}
            </div>

            <div className="bg-card p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">Total des tirages analysés</h3>
              <div className="text-2xl font-bold text-green-500">
                {drawCount !== null ? drawCount : <span className="text-gray-400">Chargement...</span>}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Tirages historiques complets
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-base opacity-70 flex items-center justify-center flex-1 min-h-0">
          Aucune donnée disponible pour le graphique
        </div>
      )}
    </section>
  );
};

export default NumberFrequencyBarChart