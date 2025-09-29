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

// Composant pour une ligne de prédiction
interface PredictionRowProps {
  prediction: AiPredictionListItem;
  onSelect: (id: number) => void;
  onDelete?: (id: number) => void;
  deletingId: number | null;
  confirmId: number | null;
  startDelete: (e: React.MouseEvent, id: number) => void;
  nextDrawResult?: number[];
}

// Composant pour les en-têtes de table
const TableHeaders: React.FC = () => (
  <TableHeader className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
    <TableRow>
      <TableHead className="w-30">Date prédiction</TableHead>
      <TableHead className="w-22">Date tirage</TableHead>
      <TableHead className="w-30">Numéros</TableHead>
      <TableHead className="w-16 text-center">Hit</TableHead>
      <TableHead className="w-30">Résultat du Tirage</TableHead>
      <TableHead className="text-right w-30">Confiance %</TableHead>
      <TableHead className="w-20">Modèle</TableHead>
      <TableHead className="w-24 text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
);

// Composant pour une ligne de chargement
const LoadingRow: React.FC = () => (
  <TableRow>
    <TableCell colSpan={9} className="text-center py-8 text-sm text-muted-foreground">
      Chargement des prédictions...
    </TableCell>
  </TableRow>
);

// Composant pour une ligne d'erreur
const ErrorRow: React.FC<{ error: string }> = ({ error }) => (
  <TableRow>
    <TableCell colSpan={9} className="text-center py-6 text-destructive text-sm">
      Erreur: {error}
    </TableCell>
  </TableRow>
);

// Composant pour une ligne vide
const EmptyRow: React.FC = () => (
  <TableRow>
    <TableCell colSpan={9} className="text-center py-6 text-sm text-muted-foreground italic">
      Aucune prédiction trouvée avec les filtres courants.
    </TableCell>
  </TableRow>
);

// Composant pour les actions d'une ligne
interface TableRowActionsProps {
  prediction: AiPredictionListItem;
  onSelect: (id: number) => void;
  onDelete?: (id: number) => void;
  deletingId: number | null;
  startDelete: (e: React.MouseEvent, id: number) => void;
}

const TableRowActions: React.FC<TableRowActionsProps> = ({
  prediction,
  onSelect,
  onDelete,
  deletingId,
  startDelete
}) => (
  <TableCell className="text-right space-x-1 relative">
    <Button
      size="icon"
      variant="ghost"
      aria-label="Voir les détails de la prédiction"
      title="Détails"
      onClick={(e) => { e.stopPropagation(); onSelect(prediction.id) }}
    >
      <Eye className="h-4 w-4" />
    </Button>
    <Button
      size="icon"
      variant="ghost"
      aria-label="Supprimer la prédiction"
      title={onDelete ? "Supprimer" : "Suppression non disponible"}
      disabled={deletingId === prediction.id || !onDelete}
      onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
      onClick={(e) => {
        console.debug('[PredictionsTable] delete click id', prediction.id);
        startDelete(e, prediction.id);
      }}
      className={`text-destructive hover:text-destructive focus:text-destructive ${!onDelete ? 'opacity-40 cursor-not-allowed' : ''}`}
      aria-disabled={!onDelete}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  </TableCell>
);

// Composant pour une ligne de prédiction
interface PredictionRowProps {
  prediction: AiPredictionListItem;
  onSelect: (id: number) => void;
  onDelete?: (id: number) => void;
  deletingId: number | null;
  confirmId: number | null;
  startDelete: (e: React.MouseEvent, id: number) => void;
  nextDrawResult?: number[];
}

const PredictionRow: React.FC<PredictionRowProps> = ({
  prediction,
  onSelect,
  onDelete,
  deletingId,
  confirmId,
  startDelete
}) => (
  <TableRow
    key={prediction.id}
    className="cursor-pointer"
    onClick={(e) => {
      if (e.defaultPrevented) return;
      if (confirmId != null) return;
      onSelect(prediction.id);
    }}
    aria-disabled={confirmId != null ? 'true' : undefined}
  >
    <TableCell className="whitespace-nowrap">
      {new Date(prediction.dateHeurePrediction).toISOString().slice(0, 16).replace('T', ' ')}
    </TableCell>
    <TableCell>{prediction.dateTirageCible}</TableCell>
    <TableCell>
      {prediction.numbers.map((num, index) => (
        <span
          key={index}
          className={prediction.drawResult && prediction.drawResult.includes(num) ? 'font-bold text-green-600' : ''}
        >
          {num}
          {index < prediction.numbers.length - 1 ? '-' : ''}
        </span>
      ))}
    </TableCell>
    <TableCell className="text-center font-semibold">
      {prediction.drawResult && prediction.drawResult.length > 0
        ? (() => {
            const hitCount = prediction.numbers.filter(num => prediction.drawResult.includes(num)).length;
            const totalNumbers = prediction.numbers.length;
            return (
              <span className={hitCount > 0 ? 'text-green-600' : ''}>
                {hitCount}/{totalNumbers}
              </span>
            );
          })()
        : '—'
      }
    </TableCell>
    <TableCell>
      {prediction.drawResult && prediction.drawResult.length > 0 ? prediction.drawResult.join('-') : '—'}
    </TableCell>
    <TableCell className="text-right">
      {prediction.confidencePercentage != null
        ? prediction.confidencePercentage.toFixed(0) + '%'
        : '—'
      }
    </TableCell>
    <TableCell>
      <span className="inline-flex max-w-[9rem] truncate" title={prediction.modelName}>
        {prediction.modelName}
      </span>
    </TableCell>
    <TableRowActions
      prediction={prediction}
      onSelect={onSelect}
      onDelete={onDelete}
      deletingId={deletingId}
      startDelete={startDelete}
    />
  </TableRow>
);

// Composant principal de la table
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
    if (deletingId) return;
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

  React.useEffect(() => {
    if (confirmId != null && confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }
  }, [confirmId]);

  return (
    <div className="w-full flex flex-row gap-6">
      <div className="flex-1">
        <Table className="table-fixed">
          <TableHeaders />
          <TableBody>
            {loading && <LoadingRow />}
            {error && !loading && <ErrorRow error={error} />}
            {!loading && !error && items.length === 0 && <EmptyRow />}
            {!loading && !error && items.map(prediction => (
              <PredictionRow
                key={prediction.id}
                prediction={prediction}
                onSelect={onSelect}
                onDelete={onDelete}
                deletingId={deletingId}
                confirmId={confirmId}
                startDelete={startDelete}
              />
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
