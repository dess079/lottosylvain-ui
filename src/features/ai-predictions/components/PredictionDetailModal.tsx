import React from 'react';
import { useAiPredictionDetail } from '../hooks/useAiPredictionDetail';
import DOMPurify from 'dompurify';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../components/shadcn';
import { Separator } from '../../../components/shadcn';
import { Button } from '../../../components/shadcn';
import AnalysisMarkdownBox from '../../../components/AnalysisMarkdownBox';

interface Props { id: number | null; onClose: () => void; }

const PredictionDetailModal: React.FC<Props> = ({ id, onClose }) => {
  const { data, loading, error } = useAiPredictionDetail(id);
  const open = id != null;
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
  <DialogContent size="6xl" className="w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Prédiction #{id}</DialogTitle>
          <DialogDescription>Détails complets de la prédiction AI sélectionnée.</DialogDescription>
        </DialogHeader>
        {loading && <p className="text-sm text-muted-foreground">Chargement...</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {data && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-3 text-xs md:text-sm">
              <div><span className="font-semibold">Date prédiction:</span> {new Date(data.dateHeurePrediction).toLocaleString()}</div>
              <div><span className="font-semibold">Date tirage cible:</span> {data.dateTirageCible}</div>
              <div><span className="font-semibold">Modèle:</span> {data.modelName}</div>
              <div className="font-mono"><span className="font-semibold">Numéros:</span> {data.numbers.join('-')} <span className="text-muted-foreground">(triés: {data.sortedNumbers.join('-')})</span></div>
            </div>
            <Separator />
            <div className="space-y-2">
              <AnalysisMarkdownBox title="Analyse Détaillée" markdown={data.thinkText} />
            </div>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={onClose}>Fermer</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PredictionDetailModal;
