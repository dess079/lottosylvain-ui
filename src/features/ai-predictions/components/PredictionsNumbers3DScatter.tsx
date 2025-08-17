import React, { useEffect, useMemo, useState } from 'react';
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
  const [plotVars, setPlotVars] = useState({
    paperBg: '#0b1220',
    plotBg: '#071026',
    fontColor: '#e6eef8',
    gridColor: 'rgba(255,255,255,0.06)',
    sceneBg: '#071026'
  });

  useEffect(() => {
    const root = document.documentElement;
    const readVars = () => {
      const s = getComputedStyle(root);
      setPlotVars({
        paperBg: s.getPropertyValue('--plot-paper-bg').trim() || '#ffffff',
        plotBg: s.getPropertyValue('--plot-plot-bg').trim() || '#ffffff',
        fontColor: s.getPropertyValue('--plot-font-color').trim() || '#111827',
        gridColor: s.getPropertyValue('--plot-grid-color').trim() || 'rgba(0,0,0,0.06)',
        sceneBg: s.getPropertyValue('--plot-scene-bg').trim() || '#ffffff'
      });
    };

  // Read CSS variables once on mount. Removed MutationObserver to avoid continuous background updates.
  readVars();
  // No observer: avoid reacting to frequent class attribute changes which caused continuous bg updates.
  return () => {};
  }, []);

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
        line: { color: plotVars.plotBg || '#fff', width: 0.5 }
      }
    };
  }, [items, plotVars.plotBg]);

  const layout = useMemo(() => ({
    autosize: true,
    margin: { l: 0, r: 0, b: 40, t: 20 },
    paper_bgcolor: plotVars.paperBg,
    plot_bgcolor: plotVars.plotBg,
    font: { color: plotVars.fontColor },
    scene: {
      xaxis: { title: 'Date prédiction', tickformat: '%d/%m/%Y', gridcolor: plotVars.gridColor, zerolinecolor: plotVars.gridColor },
      yaxis: { title: 'Index numéro', gridcolor: plotVars.gridColor },
      zaxis: { title: 'Numéro', gridcolor: plotVars.gridColor },
      bgcolor: plotVars.sceneBg
    }
  }), [plotVars]);

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
