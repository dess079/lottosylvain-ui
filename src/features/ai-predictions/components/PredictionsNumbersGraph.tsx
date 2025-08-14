import React from 'react';
import { AiPredictionListItem } from '../types/aiPrediction';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface Props {
  items: AiPredictionListItem[];
}

/**
 * Affiche un graphique des numéros de prédiction en fonction de la date de prédiction.
 * Chaque numéro est une ligne, l'axe X est la date de prédiction.
 */
const PredictionsNumbersGraph: React.FC<Props> = ({ items }) => {
  // Prépare les données pour le graphique
  // Chaque dateHeurePrediction devient un point, chaque numéro une série
  const graphData = items.map(item => {
    const entry: any = { date: new Date(item.dateHeurePrediction).toLocaleDateString() };
    item.numbers.forEach((num, idx) => {
      entry[`N${idx + 1}`] = num;
    });
    return entry;
  });

  // Détermine le nombre max de numéros pour les séries
  const maxNumbers = items.reduce((max, item) => Math.max(max, item.numbers.length), 0);
  const lines = Array.from({ length: maxNumbers }, (_, i) => `N${i + 1}`);

  return (
    <div className="w-full h-[350px] p-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={graphData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          {lines.map((key, idx) => (
            <Line key={key} type="monotone" dataKey={key} stroke={`hsl(${(idx * 60) % 360}, 70%, 50%)`} dot={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PredictionsNumbersGraph;
