import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import './PieChartTab.css';

interface PieChartTabProps {
  isActive: boolean;
}

// Mock data for demonstration purposes
const fetchPieChartData = async () => {
  // Replace this with an actual API call to fetch the data
  return [
    { name: 'Odd Numbers', value: 60 },
    { name: 'Even Numbers', value: 40 },
  ];
};

const COLORS = ['#0088FE', '#FF8042'];

/**
 * Composant pour afficher le graphique en secteurs des nombres pairs/impairs
 */
const PieChartTab: React.FC<PieChartTabProps> = ({ isActive }) => {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    if (isActive) {
      // Fetch data when the tab becomes active
      fetchPieChartData().then((fetchedData) => setData(fetchedData));
    }
  }, [isActive]);

  if (!isActive) {
    return (
      <section>
        <h2 className="text-2xl font-semibold mb-6">Graphique en secteurs des nombres pairs/impairs</h2>
        <div className="text-center text-base opacity-70 flex items-center justify-center min-h-96">
          Cliquez sur cet onglet pour charger le graphique en secteurs
        </div>
      </section>
    );
  }

  return (
    <section className="pie-chart-tab">
      <h2 className="text-2xl font-semibold mb-6">Graphique en secteurs des nombres pairs/impairs</h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </section>
  );
};

export default PieChartTab;
