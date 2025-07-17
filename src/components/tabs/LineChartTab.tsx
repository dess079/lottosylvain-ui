import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import './LineChartTab.css';

interface LineChartTabProps {
  isActive: boolean;
}

// Mock data for demonstration purposes
const fetchLineChartData = async () => {
  // Replace this with an actual API call to fetch the data
  return [
    { date: '2025-07-01', drawCount: 10 },
    { date: '2025-07-02', drawCount: 15 },
    { date: '2025-07-03', drawCount: 8 },
    { date: '2025-07-04', drawCount: 20 },
    { date: '2025-07-05', drawCount: 12 },
  ];
};

/**
 * Composant pour afficher le graphique linéaire des tirages
 */
const LineChartTab: React.FC<LineChartTabProps> = ({ isActive }) => {
  const [data, setData] = useState<{ date: string; drawCount: number }[]>([]);

  useEffect(() => {
    if (isActive) {
      // Fetch data when the tab becomes active
      fetchLineChartData().then((fetchedData) => setData(fetchedData));
    }
  }, [isActive]);

  if (!isActive) {
    return (
      <section>
        <h2 className="text-2xl font-semibold mb-6">Graphique linéaire des tirages</h2>
        <div className="text-center text-base opacity-70 flex items-center justify-center min-h-96">
          Cliquez sur cet onglet pour charger le graphique linéaire
        </div>
      </section>
    );
  }

  return (
    <section className="line-chart-tab">
      <h2 className="text-2xl font-semibold mb-6">Graphique linéaire des tirages</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" label={{ value: 'Date', position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'Nombre de tirages', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type="monotone" dataKey="drawCount" stroke="#82ca9d" name="Nombre de tirages" />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
};

export default LineChartTab;
