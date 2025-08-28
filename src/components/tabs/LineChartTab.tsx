import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { fetchLottoStatistics } from '../../services/api';
import { DrawStatistics } from '../../types';
import LoadingSpinner from '../LoadingSpinner';
import './LineChartTab.css';


/**
 * Composant pour le graphique en barres de fréquence des numéros
 */
export const NumberFrequencyBarChart: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [statistics, setStatistics] = useState<DrawStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const stats = await fetchLottoStatistics();
        if (!mounted) return;
        setStatistics(stats);
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
      <h2 className="text-2xl font-semibold mb-6">Fréquence d'apparition des numéros (1 à 49) dans tous les tirages</h2>
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
              data={Object.entries(statistics.numbersFrequency)
                .map(([number, count]) => ({ number: parseInt(number), count }))
                .sort((a, b) => a.number - b.number)} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="number" label={{ value: 'Numéro', position: 'insideBottom', offset: -5 }} interval={0} tick={{ fontSize: 10 }} />
              <YAxis label={{ value: 'Nombre de fois', angle: -90, position: 'insideLeft' }} allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Nombre de fois sorti" />
            </BarChart>
          </ResponsiveContainer>
          
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
      ) : (
        <div className="text-center text-base opacity-70 flex items-center justify-center min-h-48">
          Aucune donnée disponible pour le graphique
        </div>
      )}
    </section>
  );
};

