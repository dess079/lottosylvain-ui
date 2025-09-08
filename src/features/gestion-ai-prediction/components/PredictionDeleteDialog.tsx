import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Button } from '../../../components/shadcn';

interface PredictionDeleteDialogProps {
  open: boolean;
  predictionId: number | null;
  deleting: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * PredictionDeleteDialog
 * Dialogue de confirmation pour la suppression d'une prédiction AI.
 * Utilise le composant Dialog shadcn (overlay configurable via overlayStrength).
 */
const PredictionDeleteDialog: React.FC<PredictionDeleteDialogProps> = ({
  open,
  predictionId,
  deleting,
  error,
  onCancel,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o && !deleting) onCancel(); }}>
      <DialogContent size="sm" overlayStrength="strong" showCloseButton={!deleting} className="w-full max-w-sm">
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription>
            Supprimer définitivement la prédiction #{predictionId} ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        {error && <div className="text-destructive text-sm" role="alert">{error}</div>}
        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={onCancel} disabled={deleting}>Annuler</Button>
          <Button variant="outline" onClick={onConfirm} disabled={deleting}>
            {deleting ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PredictionDeleteDialog;
