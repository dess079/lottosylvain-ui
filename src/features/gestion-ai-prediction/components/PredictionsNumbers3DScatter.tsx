import React, { useMemo } from 'react';
import { AiPredictionListItem } from '../types/aiPrediction';
import Plot from 'react-plotly.js';
import { useTheme } from '../../../context/ThemeContext';

interface Props {
  items: AiPredictionListItem[];
}

/**
 * Affiche un nuage de points 3D (scatter plot) des numéros de prédiction en fonction de la date et de l'index du numéro.
 * Axe X : date de prédiction, Axe Y : index du numéro, Axe Z : valeur du numéro
 * Le composant s'intègre avec Tailwind pour la gestion automatique des thèmes dark/light.
 */
const PredictionsNumbers3DScatter: React.FC<Props> = ({ items }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

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
        size: 8, // Marqueurs encore plus gros pour une meilleure visibilité dans le graphique agrandi
        color: z,
        colorscale: 'Viridis',
        opacity: 0.85,
        line: { width: 2.5 }
      }
    };
  }, [items]);

  const layout = useMemo(() => ({
    autosize: true,
    margin: { l: 50, r: 50, b: 50, t: 50 }, // Marges encore plus grandes pour l'agrandissement
    // Background complètement transparent pour laisser voir le viewport
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    scene: {
      xaxis: { 
        title: { 
          text: 'Date prédiction',
          font: { size: 20, color: isDarkMode ? '#fff' : '#000' }
        }, 
        tickformat: '%d/%m/%Y',
        tickfont: { color: isDarkMode ? '#fff' : '#000', size: 15 },
        showgrid: true,
        gridcolor: isDarkMode ? '#444' : '#ccc',
        gridwidth: 3
      },
      yaxis: { 
        title: { 
          text: 'Index numéro',
          font: { size: 20, color: isDarkMode ? '#fff' : '#000' }
        },
        tickfont: { color: isDarkMode ? '#fff' : '#000', size: 15 },
        showgrid: true,
        gridcolor: isDarkMode ? '#444' : '#ccc',
        gridwidth: 3
      },
      zaxis: { 
        title: { 
          text: 'Numéro',
          font: { size: 20, color: isDarkMode ? '#fff' : '#000' }
        },
        tickfont: { color: isDarkMode ? '#fff' : '#000', size: 15 },
        showgrid: true,
        gridcolor: isDarkMode ? '#444' : '#ccc',
        gridwidth: 3
      },
      bgcolor: 'rgba(0,0,0,0)', // Transparent pour voir le background du viewport
      dragmode: 'orbit',
      annotations: [],
      camera: {
        eye: { x: 2.5, y: 2.5, z: 2.5 }, // Position encore plus éloignée pour une vue d'ensemble maximale
        center: { x: 0, y: 0, z: 0 },
        up: { x: 0, y: 0, z: 1 }
      },
      aspectmode: 'cube', // Mode cube pour maintenir les proportions
      aspectratio: { x: 1, y: 1, z: 1 } // Ratio égal pour toutes les dimensions
    },
    font: {
      color: isDarkMode ? '#fff' : '#000',
      size: 16
    }
  }), [isDarkMode]);

  // Configuration pour les interactions de sélection avec taille optimisée
  const config = useMemo(() => ({
    displayModeBar: true, // Affiche la barre d'outils pour plus d'interactivité
    responsive: true,
    plotlyServerURL: false,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d'],
    selectdirection: 'any',
    hovermode: 'closest',
    toImageButtonOptions: {
      format: 'png',
      filename: 'plotly-3d-scatter',
      height: 700, // Hauteur augmentée pour l'export
      width: 900,  // Largeur augmentée pour l'export
      scale: 2
    },
    scrollZoom: true, // Active le zoom avec la molette
    doubleClick: 'reset+autosize' // Double-clic pour reset et autosize
  }), []);

  // Gestion des événements de sélection
  const handleSelection = (eventData: any) => {
    if (eventData && eventData.points) {
      console.log('Sélection détectée:', eventData.points);
    }
  };

  // Affichage quand il n'y a pas de données - version agrandie
  if (items.length === 0) {
    return (
      <div className="w-full h-full bg-background flex items-center justify-center overflow-hidden">
        <div className="text-center space-y-4">
          <div className="text-6xl text-muted-foreground/50">🎯</div>
          <div className="text-lg text-muted-foreground font-medium">
            Aucune donnée 3D disponible
          </div>
          <div className="text-sm text-muted-foreground">
            Les prédictions apparaîtront ici en nuage de points 3D agrandi
          </div>
          <div className="text-xs text-muted-foreground">
            Visualisation optimisée pour une meilleure analyse des données
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-background overflow-hidden">
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
