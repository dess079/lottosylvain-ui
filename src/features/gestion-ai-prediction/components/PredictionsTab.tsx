import React, { useState } from 'react';
import PredictionsFilters from './PredictionsFilters';
import PredictionsTable from './PredictionsTable';
import PredictionsPagination from './PredictionsPagination';
import PredictionDetailModal from './PredictionDetailModal';
import { useAiPredictions, invalidateAiPredictionsCache } from '../hooks/useAiPredictions';
import { deletePrediction } from '../services/aiPredictionsApi';
import { AiPredictionFilters } from '../types/aiPrediction';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/shadcn';
import { Button } from '../../../components/shadcn';
import { RotateCcw, Maximize2, Minimize2 } from 'lucide-react';
import PredictionsNumbersGraph from './PredictionsNumbersGraph';
import PredictionsNumbers3DScatter from './PredictionsNumbers3DScatter';

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

  /** Met à jour la page courante */
  const handlePageChange = (p: number) => setAppliedFilters(f => ({ ...f, page: p }));

  /** Réinitialise les filtres (exemple d'action future) */
  const [resetSignal, setResetSignal] = useState(0);
  const resetFilters = () => {
    setAppliedFilters(prev => ({ page: 0, size: prev.size }));
    setResetSignal(s => s + 1); // informe le composant enfant de réinitialiser son état local
  };

  // Mode plein écran (masque les filtres)
  const [fullScreen, setFullScreen] = useState(false);
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

  // Hauteur dynamique: soustraire marge/padding externe éventuel (ici 1rem top + 1rem bottom approx)
  const dynamicHeightClass = 'h-[calc(100vh-2rem)]';

  return (
  <div className={`flex flex-col flex-1 min-h-0 gap-4 p-4 ${dynamicHeightClass}`}>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-xl font-semibold tracking-tight">Gestion des Prédictions AI</h1>
        <div className="flex gap-2">
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
          >
            <RotateCcw className={`h-4 w-4 transition-transform ${refreshSpin ? 'animate-spin-slow' : ''}`} />
          </Button>
          <Button
            variant={fullScreen ? 'secondary' : 'outline'}
            size="icon"
            onClick={() => setFullScreen(v => !v)}
            aria-label={fullScreen ? 'Quitter plein écran' : 'Plein écran'}
            title={fullScreen ? 'Quitter plein écran' : 'Plein écran'}
          >
            {fullScreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <div className="flex flex-1 min-h-0 gap-4">
        {!fullScreen && (
          <aside className="w-full max-w-xs flex-shrink-0 flex flex-col min-h-0">
            <Card className="flex flex-col flex-1 min-h-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Filtres</CardTitle>
              </CardHeader>
              <CardContent className="overflow-auto pr-2 flex-1">
                <PredictionsFilters
                  onApply={f => setAppliedFilters(prev => ({ ...prev, ...f, page: 0 }))}
                  resetSignal={resetSignal}
                />
              </CardContent>
            </Card>
          </aside>
        )}
        <div className={`flex flex-col flex-1 min-h-0 ${fullScreen ? '' : ''}`}>
          <Card className="flex flex-col flex-1 min-h-0">
            <CardHeader className="pb-2">
            
              <CardTitle className="text-base">Résultats ({data?.totalElements ?? 0})</CardTitle>
            
              <p className="text-xs text-muted-foreground min-h-4">
                {buildSummary() || 'Aucun filtre spécifique (ensemble complet).'}
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-0 overflow-hidden p-0 pt-0 flex-1">
              <div className="flex-1 relative overflow-auto">
                <div className="min-h-full flex flex-col">
                  <PredictionsTable
                    items={items}
                    loading={loading}
                    error={error}
                    onSelect={id => setSelectedId(id)}
                    onDelete={handleDelete}
                  />
                  {data && (
                    <div className="sticky bottom-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t px-4 py-2 shadow-sm">
                      <PredictionsPagination page={data.page} size={data.size} totalPages={data.totalPages} onChange={handlePageChange} />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
        <div className="">
          <PredictionsNumbersGraph items={items} />
        </div>
        <div className="">
          <PredictionsNumbers3DScatter items={items} />
        </div>
        
      </div>
      </div>
    

      <PredictionDetailModal id={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
};

export default PredictionsTab;
