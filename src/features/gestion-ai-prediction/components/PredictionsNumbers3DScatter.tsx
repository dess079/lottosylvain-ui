import React, { useMemo } from 'react';
import { AiPredictionListItem } from '../types/aiPrediction';
import Plot from 'react-plotly.js';

interface Props {
  items: AiPredictionListItem[];
}

/**
 * Affiche un nuage de points 3D (scatter plot) des numéros de prédiction en fonction de la date et de l'index du numéro.
 * Axe X : date de prédiction, Axe Y : index du numéro, Axe Z : valeur du numéro
 * Le composant s'intègre avec Tailwind pour la gestion automatique des thèmes dark/light.
 */
const PredictionsNumbers3DScatter: React.FC<Props> = ({ items }) => {

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
        line: { width: 1.5 }
      }
    };
  }, [items]);

  const layout = useMemo(() => ({
    autosize: true,
    margin: { l: 0, r: 0, b: 0, t: 0 },
    // Background complètement transparent pour laisser voir le viewport
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    scene: {
      xaxis: { 
        title: { text: 'Date prédiction' }, 
        tickformat: '%d/%m/%Y'
      },
      yaxis: { 
        title: { text: 'Index numéro' }
      },
      zaxis: { 
        title: { text: 'Numéro' }
      },
      bgcolor: 'rgba(0,0,0,0)', // Transparent pour voir le background du viewport
      dragmode: 'orbit',
      annotations: [],
      camera: {
        eye: { x: 1.2, y: 1.2, z: 1.2 }
      }
    }
  }), []);

  // Configuration pour les interactions de sélection
  const config = useMemo(() => ({
    displayModeBar: false, 
    responsive: true,
    plotlyServerURL: false,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d'],
    selectdirection: 'any',
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
      console.log('Sélection détectée:', eventData.points);
    }
  };

  // Affichage quand il n'y a pas de données
  if (items.length === 0) {
    return (
      <div className="w-full h-full p-2 bg-background flex items-center justify-center overflow-hidden">
        <div className="text-center space-y-3">
          <div className="text-4xl text-muted-foreground/50">🎯</div>
          <div className="text-sm text-muted-foreground font-medium">
            Aucune donnée 3D
          </div>
          <div className="text-xs text-muted-foreground">
            Les prédictions apparaîtront ici en nuage de points
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-2 bg-background overflow-hidden">
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
