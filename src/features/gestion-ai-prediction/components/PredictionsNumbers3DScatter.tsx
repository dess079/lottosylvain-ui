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
    // Détecte si on est en mode dark ou light
    const isDark = document.documentElement.classList.contains('dark') || 
                   !document.documentElement.classList.contains('light');
    
    // Couleurs selon le thème
    const fontColor = isDark ? '#ffffff' : '#000000';  // Blanc en dark, noir en light
    const axisColor = isDark ? '#ffffff' : '#000000';  // Blanc en dark, noir en light
    const gridColor = 'rgba(128, 128, 128, 0.3)';     // Gris pâle pour les deux modes
    
    // Couleurs de sélection selon le mode
    const selectionColor = isDark ? '#ffffff' : 'rgba(128, 128, 128, 0.6)'; // Blanc en dark, gris en light
    
    return { gridColor, fontColor, axisColor, selectionColor, isDark };
  }, []);

  const layout = useMemo(() => ({
    autosize: true,
    margin: { l: 0, r: 0, b: 0, t: 0 },
    // Background complètement transparent pour laisser voir le viewport
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { color: plotVars.fontColor, size: 12 },
    scene: {
      xaxis: { 
        title: { text: 'Date prédiction', font: { color: plotVars.axisColor, size: 14 } }, 
        tickformat: '%d/%m/%Y', 
        gridcolor: plotVars.gridColor, 
        zerolinecolor: plotVars.gridColor,
        tickfont: { color: plotVars.axisColor, size: 10 },
        titlefont: { color: plotVars.axisColor, size: 14 }
      },
      yaxis: { 
        title: { text: 'Index numéro', font: { color: plotVars.axisColor, size: 14 } }, 
        gridcolor: plotVars.gridColor,
        tickfont: { color: plotVars.axisColor, size: 10 },
        titlefont: { color: plotVars.axisColor, size: 14 }
      },
      zaxis: { 
        title: { text: 'Numéro', font: { color: plotVars.axisColor, size: 14 } }, 
        gridcolor: plotVars.gridColor,
        tickfont: { color: plotVars.axisColor, size: 10 },
        titlefont: { color: plotVars.axisColor, size: 14 }
      },
      bgcolor: 'rgba(0,0,0,0)', // Transparent pour voir le background du viewport
      // Configuration de la sélection
      dragmode: 'orbit',
      // Couleurs de sélection selon le mode
      annotations: [],
      // Style de sélection pour les interactions
      camera: {
        eye: { x: 1.2, y: 1.2, z: 1.2 }
      }
    }
  }), [plotVars]);

  // Configuration pour les interactions de sélection
  const config = useMemo(() => ({
    displayModeBar: false, 
    responsive: true,
    // Configuration de sélection selon le thème
    plotlyServerURL: false,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d'],
    // Couleurs de sélection pour les zones
    selectdirection: 'any',
    // Couleur de surbrillance selon le mode
    hovermode: 'closest',
    toImageButtonOptions: {
      format: 'png',
      filename: 'plotly-3d-scatter',
      height: 350,
      width: 600,
      scale: 1
    }
  }), []);

  // Gestion des événements de sélection
  const handleSelection = (eventData: any) => {
    if (eventData && eventData.points) {
      // Applique la couleur de sélection selon le mode
      console.log('Sélection détectée:', eventData.points);
    }
  };

  return (
    <div className="w-full h-[350px] p-2">
      <style>{`
        /* Style pour la zone de sélection du graphique 3D */
        .plot-container .plotly .modebar {
          display: none !important;
        }
        
        /* Couleur de sélection selon le thème */
        ${plotVars.isDark ? `
          .plot-container .drag-layer .select-outline {
            stroke: #ffffff !important;
            stroke-width: 2px !important;
            fill: rgba(255, 255, 255, 0.1) !important;
          }
          .plot-container .js-plotly-plot .plotly .scene .gl-container canvas {
            cursor: crosshair;
          }
        ` : `
          .plot-container .drag-layer .select-outline {
            stroke: rgba(128, 128, 128, 0.8) !important;
            stroke-width: 2px !important;
            fill: rgba(128, 128, 128, 0.1) !important;
          }
          .plot-container .js-plotly-plot .plotly .scene .gl-container canvas {
            cursor: crosshair;
          }
        `}
      `}</style>
      <Plot
        data={[trace]}
        layout={layout}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
        config={config}
        onSelected={handleSelection}
        onDeselect={() => console.log('Désélection')}
      />
    </div>
  );
};

export default PredictionsNumbers3DScatter;
