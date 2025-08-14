import React from 'react';
import { AiPredictionListItem } from '../types/aiPrediction';
import Plot from 'react-plotly.js';

interface Props {
  items: AiPredictionListItem[];
}

/**
 * Affiche un nuage de points 3D (scatter plot) des numéros de prédiction en fonction de la date et de l'index du numéro.
 * Axe X : date de prédiction, Axe Y : index du numéro, Axe Z : valeur du numéro
 */
const PredictionsNumbers3DScatter: React.FC<Props> = ({ items }) => {
  // Prépare les données pour le nuage de points
  const dates = items.map(item => new Date(item.dateHeurePrediction).toLocaleDateString());
  const data: any[] = [];
  items.forEach((item, i) => {
    item.numbers.forEach((num, idx) => {
      data.push({
        x: item.dateHeurePrediction,
        y: idx + 1,
        z: num,
        text: `Prédiction ${item.id} - N${idx + 1}: ${num}`,
      });
    });
  });

  return (
    <div className="w-full h-[350px] p-2">
      <Plot
        data={[{
          x: data.map(d => d.x),
          y: data.map(d => d.y),
          z: data.map(d => d.z),
          text: data.map(d => d.text),
          mode: 'markers',
          type: 'scatter3d',
          marker: { size: 4, color: data.map(d => d.z), colorscale: 'Viridis', opacity: 0.8 },
        }]}
        layout={{
          autosize: true,
          margin: { l: 0, r: 0, b: 40, t: 20 },
          scene: {
            xaxis: { title: 'Date prédiction', tickformat: '%d/%m/%Y' },
            yaxis: { title: 'Index numéro' },
            zaxis: { title: 'Numéro' },
          },
        }}
        style={{ width: '100%', height: '100%' }}
        config={{ displayModeBar: false }}
      />
    </div>
  );
};

export default PredictionsNumbers3DScatter;
