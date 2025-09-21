import { RotateCcw } from 'lucide-react';
import React, { useState } from 'react';
import { Button, Card, CardHeader, CardTitle } from '../../../components/shadcn';
import { invalidateAiPredictionsCache, useAiPredictions } from '../hooks/useAiPredictions';
import { deletePrediction } from '../services/aiPredictionsApi';
import { AiPredictionFilters } from '../types/aiPrediction';
import FilterSheet from './FilterSheet';
import PredictionsNumbers3DScatter from './PredictionsNumbers3DScatter';
import PredictionsNumbersGraph from './PredictionsNumbersGraph';
import PredictionsTable from './PredictionsTable';
import PredictionDetailModal from './PredictionDetailModal';

const PredictionsTab: React.FC = () => {
  // Filtres appliqués (ceux réellement envoyés à l'API)
  const [appliedFilters, setAppliedFilters] = useState<AiPredictionFilters>({ page: 0, size: 10 });
  // Données des prédictions
  const { data, loading, error } = useAiPredictions(appliedFilters);
  // ID de la prédiction sélectionnée pour le détail
  const [selectedId, setSelectedId] = useState<number | null>(null);
  async function handleDelete(id: number) {
    await deletePrediction(id);
    invalidateAiPredictionsCache();
    // Recharger en ré-utilisant setAppliedFilters pour déclencher useEffect
    setAppliedFilters(f => ({ ...f }));
    if (selectedId === id) setSelectedId(null);
  }

  const items = data?.content || [];
  // Les drawResults sont maintenant inclus dans les items du backen
  /** Réinitialise les filtres (exemple d'action future) */
  const [resetSignal, setResetSignal] = useState(0);
  const resetFilters = () => {
    setAppliedFilters(prev => ({ page: 0, size: prev.size }));
    setResetSignal(s => s + 1); // informe le composant enfant de réinitialiser son état local
  };

  const [refreshSpin, setRefreshSpin] = useState(false);

  // Résumé lisible des filtres appliqués
  const buildSummary = () => {
    const parts: string[] = [];
    if (appliedFilters.datePredictionFrom || appliedFilters.datePredictionTo) {
      parts.push(`Prédictions: ${appliedFilters.datePredictionFrom?.replace('T',' ' ) || '…'} → ${appliedFilters.datePredictionTo?.replace('T',' ') || '…'}`);
    }
    if (appliedFilters.dateTirageFrom || appliedFilters.dateTirageTo) {
      parts.push(`Tirages: ${appliedFilters.dateTirageFrom || '…'} → ${appliedFilters.dateTirageTo || '…'}`);
    }
    if (appliedFilters.modelCsv) {
      parts.push(`Modèles: ${appliedFilters.modelCsv.split(',').length}`);
    }
    return parts.join(' | ');
  };

  // Hauteur calculée pour tenir compte du padding et garantir que tout est visible
  const dynamicHeightClass = 'h-[calc(100vh-1.5rem)]';

  return (
    <div className={`flex flex-col flex-1 min-h-0 gap-3 bg-background ${dynamicHeightClass}`}>
      {/* Header - hauteur fixe compacte */}
      <div className="flex items-center justify-between flex-wrap gap-2 bg-card/30 backdrop-blur-sm rounded-lg p-2 border flex-shrink-0 mx-3 mt-3">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">Gestion des Prédictions AI</h1>
        <div className="flex gap-2">
          <FilterSheet
            onApply={f => setAppliedFilters(prev => ({ ...prev, ...f, page: 0 }))}
            resetSignal={resetSignal}
            currentFilters={appliedFilters}
            totalResults={data?.totalElements}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setRefreshSpin(true);
              resetFilters();
              setTimeout(() => setRefreshSpin(false), 500);
            }}
            aria-label="Réinitialiser"
            title="Réinitialiser"
            className="bg-background/50"
          >
            <RotateCcw className={`h-3 w-3 transition-transform ${refreshSpin ? 'animate-spin-slow' : ''}`} />
          </Button>
         
        </div>
      </div>
      
      {/* Zone de contenu principal avec graphiques - prend tout l'espace restant */}
      <div className="flex flex-1 min-h-0 gap-3 h-full mx-3 mb-3">
        <div className="flex flex-col gap-3 flex-1 min-h-0 h-full">
          <Card className="flex flex-col flex-1 min-h-0 bg-card border shadow-sm h-full">
            <PredictionsTable
              items={items}
              loading={loading}
              error={error}
              onSelect={id => setSelectedId(id)}
            onDelete={handleDelete}/>
          </Card>

          <Card className="flex flex-col flex-1 min-h-0 bg-card border shadow-sm h-full">
            <CardHeader className="pb-1 bg-card/50 flex-shrink-0">
              <CardTitle className="text-sm text-card-foreground">Résultats ({data?.totalElements ?? 0})</CardTitle>
              <p className="text-xs text-muted-foreground min-h-4">
                {buildSummary() || 'Aucun filtre spécifique (ensemble complet).'}
              </p>
            </CardHeader>
          </Card>
        </div>

        {/* Graphiques à droite - premier graph hauteur fixe, second graph prend tout l'espace restant */}
        <div className="flex flex-col gap-3 w-[40%] ">
          <div className="bg-card rounded-lg border shadow-sm h-[50%]">
            <PredictionsNumbersGraph items={items} />
          </div>
          <div className="bg-card rounded-lg border shadow-sm h-[50%]">
            <PredictionsNumbers3DScatter items={items} />
          </div>
        </div>
      </div>
      <PredictionDetailModal id={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
};

export default PredictionsTab;
