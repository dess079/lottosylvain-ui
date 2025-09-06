import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { fetchDetailedNumberStatistics } from '../services/api';
import { NumberTooltip } from './NumberTooltip';
import { FuturisticChart } from './shadcn';
import ErrorBoundary from './ErrorBoundary';

/**
 * Interface pour les statistiques d'un numéro
 */
interface NumberStats {
  number: number;
  frequency: number;
  lastDraw: string;
  averagePosition: number;
  hotStreak: number;
  coldStreak: number;
  standardDeviation: number;
  trend: 'up' | 'down' | 'stable';
  probability: number;
}

/**
 * Composant pour afficher le graphique en barres de fréquence des numéros
 */
const NumberFrequencyBarChart2: React.FC = () => {
  const [data, setData] = useState<NumberStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const statsMap = await fetchDetailedNumberStatistics();
        
        // Créer un tableau avec tous les numéros de 1 à 49
        const statsArray: NumberStats[] = [];
        for (let i = 1; i <= 49; i++) {
          const existingStats = statsMap.get(i);
          statsArray.push({
            number: i,
            frequency: existingStats?.frequency || 0,
            lastDraw: existingStats?.lastDraw || '',
            averagePosition: existingStats?.averagePosition || 0,
            hotStreak: existingStats?.hotStreak || 0,
            coldStreak: existingStats?.coldStreak || 0,
            standardDeviation: existingStats?.standardDeviation || 0,
            trend: existingStats?.trend || 'stable',
            probability: existingStats?.probability || 0
          });
        }
        
        setData(statsArray);
      } catch (err) {
        setError('Erreur lors du chargement des statistiques');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <ErrorBoundary>
      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
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
            <YAxis />
            <Tooltip content={<NumberTooltip />} />
            <Bar dataKey="frequency" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <FuturisticChart 
        data={data.map(item => Math.max(item.frequency, 0.1))} // Assurer une hauteur minimale visible
        labels={data.map(item => item.number.toString())}
        title="Fréquence de tous les numéros (1-49)"
      />
    </ErrorBoundary>
  );
};

export default NumberFrequencyBarChart2;
