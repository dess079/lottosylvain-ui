import React from 'react';
import AnalysisMarkdownBox from '../../../components/AnalysisMarkdownBox';
import { Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Separator, LottoBall, Alert, AlertDescription } from '../../../components/shadcn';
import { useAiPredictionDetail } from '../hooks/useAiPredictionDetail';

interface Props { id: number | null; onClose: () => void; }

/**
 * Formate une date en YYYY-MM-DD HH:mm
 * @param dateString La date à formater
 * @returns string formaté
 */
const formatDate = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

/**
 * Formate une date en YYYY-MM-DD (sans heure/minute)
 * @param dateString La date à formater
 * @returns string formaté
 */
const formatDateOnly = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const PredictionDetailModal: React.FC<Props> = ({ id, onClose }) => {
  const { data, loading, error } = useAiPredictionDetail(id);
  const open = id != null;
  return (
  <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
     <DialogContent size="6xl" className="w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {data
              ? `Prédiction pour le tirage ${formatDateOnly(data.dateTirageCible)}`
              : `Prédiction`}
          </DialogTitle>
          <DialogDescription className="mb-2 text-base text-muted-foreground">
            Détails complets de la prédiction AI sélectionnée.
          </DialogDescription>
        </DialogHeader>
        {loading && <p className="text-sm text-muted-foreground">Chargement...</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {data && (
          <div className="space-y-6">
            {/* Bloc d'informations principales */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 rounded-lg border shadow-sm">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Date de la prédiction</span>
                <span className="font-semibold">{formatDate(data.dateHeurePrediction)}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Confiance</span>
                <span className="font-semibold">{data.confidencePercentage != null ? `${data.confidencePercentage.toFixed(2)} %` : '—'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Modèle</span>
                <span className="font-semibold">{data.modelName}</span>
              </div>
            </div>
            
            {/* Alerte si prédiction déjà calculée */}
            {data.metadata?.alreadyCalculated && (
              <Alert className="border-blue-200 bg-blue-50">
                <AlertDescription className="text-blue-800">
                  ℹ️ {data.metadata.message || "Cette prédiction avait déjà été calculée par l'IA"}
                  {data.metadata.originalCreateDate && (
                    <span className="block text-sm mt-1">
                      Créée le {new Date(data.metadata.originalCreateDate).toLocaleString('fr-FR')}
                      {data.metadata.originalCreateUser && ` par ${data.metadata.originalCreateUser}`}
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            )}
            
            {/* Bloc comparatif des numéros prédiction/tirage */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 p-4 rounded-lg border shadow-sm">
              <div className="flex flex-col gap-1 md:mr-6">
                <span className="font-semibold text-center w-full">Numéros de la prédiction</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {data.numbers.map((num: number, idx: number) => {
                    const isInDraw = Array.isArray(data.winningNumbers) && data.winningNumbers.includes(num);
                    return (
                      <LottoBall
                        key={idx}
                        number={num}
                        size="md"
                        type={isInDraw ? 'prediction' : 'regular'}
                      />
                    );
                  })}
                </div>
              </div>
              {Array.isArray(data.winningNumbers) && data.winningNumbers.length > 0 && (
                <div className="flex flex-col gap-1 md:ml-6">
                  <span className="font-semibold text-center w-full">Numéros du tirage</span>
                  <div className="flex flex-wrap gap-2 mt-1 items-center">
                    {/* Affichage des 6 numéros principaux en vert */}
                    {data.winningNumbers.map((num: number, idx: number) => (
                      <LottoBall key={"draw-"+idx} number={num} size="md" type="prediction" />
                    ))}
                    {/* Affichage du numéro bonus s'il existe */}
                    {data.bonusNumber != null && (
                      <>
                        <span className="text-sm text-muted-foreground mx-2">+</span>
                        <LottoBall number={data.bonusNumber} size="md" type="bonus" />
                      </>
                    )}
                  </div>
                </div>
              )}
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
