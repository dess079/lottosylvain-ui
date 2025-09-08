import React, { useEffect, useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface ScatterPlotTabProps {
  isActive: boolean;
}

// Mock data for demonstration purposes
const fetchScatterPlotData = async () => {
  // Replace this with an actual API call to fetch the data
  return [
    { number: 1, range: 5 },
    { number: 2, range: 10 },
    { number: 3, range: 15 },
    { number: 4, range: 20 },
    { number: 5, range: 25 },
  ];
};

/**
 * Composant pour afficher le graphique de dispersion des plages de numéros
 */
const ScatterPlotTab: React.FC<ScatterPlotTabProps> = ({ isActive }) => {
  const [data, setData] = useState<{ number: number; range: number }[]>([]);

  useEffect(() => {
    if (isActive) {
      // Fetch data when the tab becomes active
      fetchScatterPlotData().then((fetchedData) => setData(fetchedData));
    }
  }, [isActive]);

  if (!isActive) {
    return (
      <section>
        <h2 className="text-2xl font-semibold mb-6">Graphique de dispersion des plages de numéros</h2>
        <div className="text-center text-base opacity-70 flex items-center justify-center min-h-96">
          Cliquez sur cet onglet pour charger le graphique de dispersion
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col h-full">
      <h2 className="text-2xl font-semibold mb-6 flex-shrink-0">Graphique de dispersion des plages de numéros</h2>
      <div className="flex-1 min-h-0 flex justify-center items-center">
        <ScatterChart width={1000} height={500} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid />
          <XAxis dataKey="number" name="Numéro" label={{ value: 'Numéro', position: 'insideBottom', offset: -5 }} />
          <YAxis dataKey="range" name="Plage" label={{ value: 'Plage', angle: -90, position: 'insideLeft', textAnchor: 'middle' }} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Plage de numéros" data={data} fill="#8884d8" />
        </ScatterChart>
      </div>
    </section>
  );
};

export default ScatterPlotTab;
