import React, { useState } from 'react';
import PredictionsTable from './PredictionsTable';
import PredictionsPagination from './PredictionsPagination';
import PredictionDetailModal from './PredictionDetailModal';
import FilterSheet from './FilterSheet';
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

  // Hauteur dynamique: soustraire header + footer + padding (approximativement 12rem)
  const dynamicHeightClass = 'h-[calc(100vh-12rem)]';

  return (
    <div className={`flex flex-col flex-1 min-h-0 gap-3 p-3 bg-background ${dynamicHeightClass}`}>
      {/* Header - hauteur fixe compacte */}
      <div className="flex items-center justify-between flex-wrap gap-2 bg-card/30 backdrop-blur-sm rounded-lg p-2 border flex-shrink-0">
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
            size="sm"
            onClick={() => {
              setRefreshSpin(true);
              resetFilters();
              setTimeout(() => setRefreshSpin(false), 500);
            }}
            aria-label="Réinitialiser"
            title="Réinitialiser"
            className="bg-background/50 h-8 w-8"
          >
            <RotateCcw className={`h-3 w-3 transition-transform ${refreshSpin ? 'animate-spin-slow' : ''}`} />
          </Button>
          <Button
            variant={fullScreen ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setFullScreen(v => !v)}
            aria-label={fullScreen ? 'Quitter plein écran' : 'Plein écran'}
            title={fullScreen ? 'Quitter plein écran' : 'Plein écran'}
            className="bg-background/50 h-8 w-8"
          >
            {fullScreen ? (
              <Minimize2 className="h-3 w-3" />
            ) : (
              <Maximize2 className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>

      {/* Zone de contenu principal avec graphiques - prend tout l'espace restant */}
      <div className="flex flex-1 min-h-0 gap-3">
        <div className="flex flex-col flex-1 min-h-0">
          <Card className="flex flex-col flex-1 min-h-0 bg-card border shadow-sm">
            <CardHeader className="pb-1 bg-card/50 flex-shrink-0">
              <CardTitle className="text-sm text-card-foreground">Résultats ({data?.totalElements ?? 0})</CardTitle>
              <p className="text-xs text-muted-foreground min-h-4">
                {buildSummary() || 'Aucun filtre spécifique (ensemble complet).'}
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-0 overflow-hidden p-0 pt-0 flex-1 bg-card">
              <div className="flex-1 relative overflow-auto">
                <div className="min-h-full flex flex-col bg-background/50">
                  {loading && (
                    <div className="flex-1 flex items-center justify-center p-4">
                      <div className="text-center space-y-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                        <p className="text-muted-foreground text-sm">Chargement des prédictions...</p>
                      </div>
                    </div>
                  )}
                  {error && !loading && (
                    <div className="flex-1 flex items-center justify-center p-4">
                      <div className="text-center space-y-2">
                        <div className="text-destructive text-lg">⚠️</div>
                        <p className="text-destructive text-sm">Erreur: {error}</p>
                      </div>
                    </div>
                  )}
                  {!loading && !error && (
                    <PredictionsTable
                      items={items}
                      loading={loading}
                      error={error}
                      onSelect={id => setSelectedId(id)}
                      onDelete={handleDelete}
                    />
                  )}
                  {data && (
                    <div className="sticky bottom-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t px-3 py-1 shadow-sm flex-shrink-0">
                      <PredictionsPagination page={data.page} size={data.size} totalPages={data.totalPages} onChange={handlePageChange} />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques à droite - hauteur fixe optimisée */}
        <div className="flex flex-col gap-3 w-[400px] flex-shrink-0">
          <div className="bg-card rounded-lg border shadow-sm h-[45%] min-h-0">
            <PredictionsNumbersGraph items={items} />
          </div>
          <div className="bg-card rounded-lg border shadow-sm h-[45%] min-h-0">
            <PredictionsNumbers3DScatter items={items} />
          </div>
        </div>
      </div>

      <PredictionDetailModal id={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
};

export default PredictionsTab;
