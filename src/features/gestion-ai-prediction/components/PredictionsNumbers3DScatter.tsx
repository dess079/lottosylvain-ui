import React, { useMemo } from 'react';
import { AiPredictionListItem } from '../types/aiPrediction';
import Plot from 'react-plotly.js';

interface Props {
  items: AiPredictionListItem[];
}

/**
 * Affiche un nuage de points 3D (scatter plot) des numéros de prédiction en fonction de la date et de l'index du numéro.
 * Axe X : date de prédiction, Axe Y : index du numéro, Axe Z : valeur du numéro
 * Les couleurs / background sont lues depuis des variables CSS (définies dans `src/index.css`) afin de suivre
 * le thème Tailwind (dark / light).
 */
const PredictionsNumbers3DScatter: React.FC<Props> = ({ items }) => {
  // Le background est maintenant géré par TailwindCSS via la classe du conteneur principal.

  const trace = useMemo(() => {
    const x: (string | number)[] = [];
    const y: number[] = [];
    const z: number[] = [];
    const text: string[] = [];

    items.forEach(item => {
      item.numbers.forEach((num, idx) => {
        x.push(item.dateHeurePrediction);
        y.push(idx + 1);
        z.push(num);
        text.push(`Prédiction ${item.id} - N${idx + 1}: ${num}`);
      });
    });

    return {
      x,
      y,
      z,
      text,
      mode: 'markers' as const,
      type: 'scatter3d' as const,
      marker: {
        size: 4,
        color: z,
        colorscale: 'Viridis',
        opacity: 0.9,
        line: { color: '#fff', width: 1.5 }
      }
    };
  }, [items]);

  // Récupère dynamiquement les couleurs du thème via CSS variables pour supporter le dark mode
  const plotVars = useMemo(() => {
    const root = document.documentElement;
    const gridColor = getComputedStyle(root).getPropertyValue('--plot-grid-color')?.trim() || 'rgba(0,0,0,0';
    const sceneBg = getComputedStyle(root).getPropertyValue('--plot-scene-bg')?.trim() || 'rgba(0,0,0,0)';
    return { gridColor, sceneBg };
  }, []);

  const layout = useMemo(() => ({
    autosize: true,
    margin: { l: 0, r: 0, b: 0, t: 0 },
    // Le background est géré par Tailwind, donc on laisse Plotly transparent
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { color: '#111827' },
    scene: {
      xaxis: { title: 'Date prédiction', tickformat: '%d/%m/%Y', gridcolor: plotVars.gridColor, zerolinecolor: plotVars.gridColor },
      yaxis: { title: 'Index numéro', gridcolor: plotVars.gridColor },
      zaxis: { title: 'Numéro', gridcolor: plotVars.gridColor },
      bgcolor: plotVars.sceneBg
    }
  }), []);

  return (
    <div className="w-full h-[350px] p-2">
      <Plot
        data={[trace]}
        layout={layout}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
        config={{ displayModeBar: false, responsive: true }}
      />
    </div>
  );
};

export default PredictionsNumbers3DScatter;
