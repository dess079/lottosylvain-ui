import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import LottoTemporalGraphScreen from '../LottoTemporalGraphScreen';
import './GraphTab.css';

interface GraphTabProps {
  isActive: boolean;
}

// Mock data for demonstration purposes
const fetchData = async () => {
  // Replace this with an actual API call to fetch the data
  return [
    { number: 1, drawCount: 10 },
    { number: 2, drawCount: 15 },
    { number: 3, drawCount: 8 },
    { number: 4, drawCount: 20 },
    { number: 5, drawCount: 12 },
  ];
};

/**
 * Composant pour afficher le graphique temporel
 * Le composant LottoTemporalGraphScreen gère déjà son propre chargement de données
 */
const GraphTab: React.FC<GraphTabProps> = ({ isActive }) => {
  const [data, setData] = useState<{ number: number; drawCount: number }[]>([]);

  useEffect(() => {
    if (isActive) {
      // Fetch data when the tab becomes active
      fetchData().then((fetchedData) => setData(fetchedData));
    }
  }, [isActive]);

  // Ne rendre le graphique que si l'onglet est actif pour éviter les calculs inutiles
  if (!isActive) {
    return (
      <section>
        <h2 className="text-2xl font-semibold mb-6">Graphique temporel Lotto 6/49</h2>
        <div className="text-center text-base opacity-70 flex items-center justify-center min-h-96">
          Cliquez sur cet onglet pour charger le graphique temporel
        </div>
      </section>
    );
  }

  return (
    <section className="graph-tab-animation">
      <h2 className="text-2xl font-semibold mb-6">Graphique temporel Lotto 6/49</h2>
      <LottoTemporalGraphScreen />
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="number" label={{ value: 'Numéro', position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'Nombre de tirages', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Bar dataKey="drawCount" fill="#8884d8" name="Nombre de tirages" />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
};

export default GraphTab;
