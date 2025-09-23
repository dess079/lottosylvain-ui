import { getNextDrawDate } from '@/lib/utils';
import type { LottoAIResponse } from '@/types/LottoAIResponse';
import { useSignals } from '@preact/signals-react/runtime';
import { formatDate } from 'date-fns';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { fetchSpringAIPrediction } from '../../services/api';
import { aiPredictionStateSignal } from '../../signals/predictionSignal';
import { Button, Alert, AlertTitle, AlertDescription, Badge } from '../shadcn';
import ConfidenceBar from './ConfidenceBar';
import ErrorMessage from './ErrorMessage';
import ExpandableCard from './ExpandableCard';
import JsonBlock from './JsonBlock';
import PredictionBalls from './PredictionBalls';
import './PredictionSection.css';


/**
 * Main PredictionSection component
 * Affiche les prédictions IA et personnalisées, la grille de sélection, et la gestion d'état.
 */
const PredictionSection: React.FC = () => {
  useSignals();

  // États pour gérer l'ouverture des sections collapsibles
  const [isMetadataExtraOpen, setIsMetadataExtraOpen] = useState(false);
  const [isMetadataOpen, setIsMetadataOpen] = useState(false);
  const [isFullResponseOpen, setIsFullResponseOpen] = useState(false);
  const [isThinkOpen, setIsThinkOpen] = useState(false);
  const nextDrawDate = getNextDrawDate();

  /**
   * Charge la recommandation IA principale
   */
  const loadAiPredictionSignal = async () => {
    aiPredictionStateSignal.value = {
      lottoAIResponse: null,
      isAILoading: true,
      error: null,
    };

    try {

      const data: LottoAIResponse = await fetchSpringAIPrediction(getNextDrawDate());
      console.log('API Prediction Response:', data);
      
      // Adapte selon la vraie structure de la réponse
      aiPredictionStateSignal.value = {
        ...aiPredictionStateSignal.value,
        lottoAIResponse: data,
        isAILoading: false,
        error: null,
      };
    } catch (err) {
      aiPredictionStateSignal.value = {
        ...aiPredictionStateSignal.value,
        isAILoading: false,
        error: 'Erreur lors de la récupération de la prédiction IA.',
      };
      throw err;
    }
  };

  // // On force le typage du state pour éviter les erreurs de compatibilité
  // const { isAILoading, lottoAIResponse, error }: {
  //   isAILoading: boolean;
  //   lottoAIResponse?: import('@/types/LottoAIResponse').LottoAIResponse;
  //   error?: string | null;
  // } = aiPredictionStateSignal.value;

  const { isAILoading, lottoAIResponse, error } = aiPredictionStateSignal.value;

  return (
  <div className='flex flex-col w-full h-full items-center'>
      <h2 className="text-4xl font-bold text-center gradient-text">Prédiction pour le prochain tirage</h2>
      <h3 className="text-lg text-center font-semibold text-primary-600">
        {formatDate(nextDrawDate, 'yyyy-MM-dd')}
      </h3>
      <h3 className="text-xl font-semibold mb-6 text-primary-600 text-center">Prédiction IA principale</h3>
      

      {/* Affichage du message d'erreur si présent */}
      {error && (
        <ErrorMessage error={error} />
      )}

      {/* Affichage de la prédiction IA principale */}
  <div className="block min-h-0 px-3 md:px-6 pb-4 flex-1 w-full max-w-5xl">{/* Conteneur centré avec largeur max fixe pour stabilité */}
     
        {/* Bouton pour lancer la prédiction IA */}
        <div className="mb-6 text-center">
          <Button
            onClick={loadAiPredictionSignal}
            disabled={isAILoading}
            variant="default"
            size="lg"
          >
            {isAILoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isAILoading ? 'Génération en cours...' : 'Générer Prédiction IA'}
          </Button>
        </div>

        {/* Bandeau d'état (déjà existante vs générée maintenant) */}
        {!isAILoading && lottoAIResponse && (() => {
          const status = lottoAIResponse.metadataExtra?.['predictionStatus'] as string | undefined;
          const targetDate = lottoAIResponse.metadataExtra?.['targetDate'] as string | undefined;
          const ts = lottoAIResponse.metadataExtra?.['predictionTimestamp'] as string | undefined;
          const tsLabel = ts ? formatDate(new Date(ts), 'yyyy-MM-dd hh:mm') : undefined;
          if (!status) return null;
          const isExisting = status === 'already-exists';
          const title = isExisting ? 'Prédiction déjà existante' : 'Nouvelle prédiction générée';
          const desc = isExisting
            ? `La prédiction pour le tirage du ${targetDate ?? '—'} existe déjà. Dernière génération: ${tsLabel ?? '—'}`
            : `Prédiction générée pour le tirage du ${targetDate ?? '—'} à ${tsLabel ?? '—'}`;
          return (
            <div className="mb-6">
              <Alert className={isExisting ? 'border-amber-400/60' : 'border-emerald-500/60'}>
                <AlertTitle className="flex items-center gap-2">
                  <Badge variant="outline" className={isExisting ? 'border-amber-400 text-amber-600' : 'border-emerald-500 text-emerald-600'}>
                    {status}
                  </Badge>
                  {title}
                </AlertTitle>
                <AlertDescription>{desc}</AlertDescription>
              </Alert>
            </div>
          );
        })()}

        {lottoAIResponse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="prediction-motion flex flex-col gap-4">
           
            <PredictionBalls prediction={lottoAIResponse.lottoPrediction?.predictedNumbers || []} />
            <ConfidenceBar score={lottoAIResponse.lottoPrediction?.confidenceScore as number} />

            {/* Affichage des champs supplémentaires */}
            <div className="flex flex-wrap gap-4 text-sm mt-2">
              {lottoAIResponse.lottoPrediction?.modelVersion && (
                <span className="font-mono">Modèle : {lottoAIResponse.lottoPrediction.modelVersion}</span>
              )}
              {lottoAIResponse.lottoPrediction?.analysisDepth && (
                <span className="font-mono">Nombre de tirages analysés : {lottoAIResponse.lottoPrediction.analysisDepth}</span>
              )}
              {lottoAIResponse.lottoPrediction?.dataPointsAnalyzed !== undefined && (
                <span className="font-mono">Points analysés : {lottoAIResponse.lottoPrediction.dataPointsAnalyzed}</span>
              )}
            </div>

            {lottoAIResponse.lottoPrediction?.justification && (
              <div className="text-sm mt-1"><b>Justification :</b> {lottoAIResponse.lottoPrediction.justification}</div>
            )}

            {/* Affichage du detail de l'analyse */}
            {lottoAIResponse.lottoPrediction.detailAnalysis && (
              <ExpandableCard
                title="Analyse détaillée"
                colorClass="text-primary-600"
                open={isMetadataOpen}
                onToggle={() => setIsMetadataOpen(o => !o)}
              >
                 <ReactMarkdown>{lottoAIResponse.lottoPrediction.detailAnalysis}</ReactMarkdown>
              </ExpandableCard>
            )}

            {/* Affichage du detail de l'analyse */}
            {lottoAIResponse.think && (
              <ExpandableCard
                title="Raisonnement de l'IA"
                colorClass="text-primary-600"
                open={isThinkOpen}
                onToggle={() => setIsThinkOpen(o => !o)}
              >
                <ReactMarkdown>{lottoAIResponse.think}</ReactMarkdown>
              </ExpandableCard>
            )}

            {/* Affichage de metadataExtra si présent */}
            {lottoAIResponse.metadataExtra && (
              <ExpandableCard
                title="Métadonnées supplémentaires"
                colorClass="text-amber-600"
                open={isMetadataExtraOpen}
                onToggle={() => setIsMetadataExtraOpen(o => !o)}
              >
                <JsonBlock data={lottoAIResponse.metadataExtra} />
              </ExpandableCard>
            )}

            {/* Analyse détaillée si présente */}
            {lottoAIResponse.lottoPrediction?.metadata && (
              <ExpandableCard
                title="Détails de l'analyse"
                colorClass="text-primary-600"
                open={isMetadataOpen}
                onToggle={() => setIsMetadataOpen(o => !o)}
              >
                <JsonBlock data={lottoAIResponse.lottoPrediction.metadata} />
              </ExpandableCard>
            )}
            
            {/* Réponse complète de l'AI en JSON */}
            <ExpandableCard
              title="Réponse complète de l'AI (JSON)"
              colorClass="text-green-600"
              open={isFullResponseOpen}
              onToggle={() => setIsFullResponseOpen(o => !o)}
            >
              <JsonBlock data={lottoAIResponse} className="mt-1" />
            </ExpandableCard>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PredictionSection;