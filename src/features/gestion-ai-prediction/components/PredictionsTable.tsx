import React from 'react';
import { AiPredictionListItem } from '../types/aiPrediction';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../../components/shadcn';
import { Button } from '../../../components/shadcn';
import PredictionDeleteDialog from './PredictionDeleteDialog';
import { Eye, Trash2 } from 'lucide-react';

interface Props {
  items: AiPredictionListItem[];
  loading: boolean;
  error: string | null;
  onSelect: (id: number) => void;
  onDelete?: (id: number) => Promise<void> | void; // optionnel
}

const PredictionsTable: React.FC<Props> = ({ items, loading, error, onSelect, onDelete }) => {
  const [deletingId, setDeletingId] = React.useState<number | null>(null);
  const [confirmId, setConfirmId] = React.useState<number | null>(null);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);
  const confirmButtonRef = React.useRef<HTMLButtonElement | null>(null);

  const startDelete = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onDelete) return;
    setConfirmId(id);
    setDeleteError(null);
  };

  const cancelDelete = () => {
    if (deletingId) return; // éviter annulation pendant action
    setConfirmId(null);
    setDeleteError(null);
  };

  const confirmDelete = async () => {
    if (confirmId == null || !onDelete) return;
    setDeleteError(null);
    try {
      setDeletingId(confirmId);
      await onDelete(confirmId);
      setConfirmId(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setDeletingId(null);
    }
  };

  // Focus sur le bouton confirmer après ouverture
  React.useEffect(() => {
    if (confirmId != null && confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }
  }, [confirmId]);
  return (
    <div className="w-full flex flex-row gap-6">
      <div className="flex-1">
        <Table className="table-fixed">
          <TableHeader className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
            <TableRow>
              <TableHead className="w-8">ID</TableHead>
              <TableHead className="w-30">Date prédiction</TableHead>
              <TableHead className="w-22">Date tirage</TableHead>
              <TableHead className="w-20">Numéros</TableHead>
              <TableHead className="text-right w-30">Confiance %</TableHead>
              <TableHead className="w-20">Modèle</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-sm text-muted-foreground">Chargement des prédictions...</TableCell>
              </TableRow>
            )}
            {error && !loading && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-destructive text-sm">Erreur: {error}</TableCell>
              </TableRow>
            )}
            {!loading && !error && items.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-sm text-muted-foreground italic">Aucune prédiction trouvée avec les filtres courants.</TableCell>
              </TableRow>
            )}
            {!loading && !error && items.map(it => (
              <TableRow
                key={it.id}
                className="cursor-pointer"
                onClick={(e) => {
                  // Ne pas ouvrir le détail si une action interne a preventDefault
                  if (e.defaultPrevented) return;
                  if (confirmId != null) return;
                  onSelect(it.id);
                }}
                aria-disabled={confirmId != null ? 'true' : undefined}
              >
                <TableCell>{it.id}</TableCell>
                <TableCell className="whitespace-nowrap">{new Date(it.dateHeurePrediction).toLocaleString()}</TableCell>
                <TableCell>{it.dateTirageCible}</TableCell>
                <TableCell>{it.numbers.join('-')}</TableCell>

                <TableCell className="text-right">{it.confidencePercentage != null ? (it.confidencePercentage * 100).toFixed(0) + '%' : '—'}</TableCell>
                
                <TableCell>
                  <span className="inline-flex max-w-[9rem] truncate" title={it.modelName}>{it.modelName}</span>
                </TableCell>
                <TableCell className="text-right space-x-1 relative">
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Voir les détails de la prédiction"
                    title="Détails"
                    onClick={(e) => { e.stopPropagation(); onSelect(it.id) }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Supprimer la prédiction"
                    title={onDelete ? "Supprimer" : "Suppression non disponible"}
                    disabled={deletingId === it.id || !onDelete}
                    onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onClick={(e) => {
                      // instrumentation temporaire
                      console.debug('[PredictionsTable] delete click id', it.id);
                      startDelete(e, it.id);
                    }}
                    className={`text-destructive hover:text-destructive focus:text-destructive ${!onDelete ? 'opacity-40 cursor-not-allowed' : ''}`}
                    aria-disabled={!onDelete}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {onDelete && (
          <PredictionDeleteDialog
            open={confirmId != null}
            predictionId={confirmId}
            deleting={!!deletingId}
            error={deleteError}
            onCancel={cancelDelete}
            onConfirm={confirmDelete}
          />
        )}
      </div>
    </div>
  );
};

export default PredictionsTable;
