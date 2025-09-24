import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { fetchAIRecommendation } from '../../services/api';
import { Card, CardDescription, CardHeader, CardTitle, LottoBall, Button, Alert, AlertTitle, AlertDescription, Badge } from '../shadcn';
import './PredictionTab.css';
import { LottoAIResponse } from '@/types/LottoAIResponse';

/**
 * Composant pour afficher la prédiction IA
 * Charge les données manuellement via un bouton
 */
const PredictionTab: React.FC = () => {
  const [aiPrediction, setAIPrediction] = useState<LottoAIResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Récupère la recommandation IA
   */
  const loadAIPrediction = async () => {
    console.log('loadAIPrediction called');
    try {
      setIsLoading(true);
      setError(null);

      const prediction: LottoAIResponse = await fetchAIRecommendation();

      console.log('AI prediction loaded:', prediction);
      setAIPrediction(prediction);
    } catch (err) {
      console.error('Error loading AI prediction:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération de la recommandation IA');
    } finally {
      setIsLoading(false);
    }
  };

  return (
   
      <div className="prediction-tab-animation">
        <h2 className="text-2xl font-semibold mb-6">Prédiction IA Lotto 649</h2>
        <p className="text-lg opacity-70 mb-8">Toutes les informations retournées par l'IA pour le prochain tirage</p>

        {/* Bouton pour lancer la prédiction */}
        <div className="mb-8 text-center">
          <Button
            onClick={loadAIPrediction}
            loading={isLoading}
            variant="default"
            size="lg"
          >
            {isLoading ? 'Génération en cours...' : 'Générer Prédiction IA'}
          </Button>
        </div>

        {/* Message d'erreur si l'API ne répond pas */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="text-red-700">{error}</div>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center my-8 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
            <p className="text-center text-lg">Chargement des prédictions IA..</p>
          </div>
        )}

        {/* Bandeau d'état (déjà existante vs générée maintenant) */}
        {!isLoading && aiPrediction && (
          (() => {
            const status = aiPrediction.metadataExtra?.predictionStatus as string | undefined;
            const targetDate = aiPrediction.metadataExtra?.targetDate as string | undefined;
            const ts = aiPrediction.metadataExtra?.predictionTimestamp as string | undefined;
            const tsLabel = ts ? new Date(ts).toLocaleString() : undefined;
            if (!status) return null;
            // Statuts qui indiquent une prédiction existante (en français depuis le backend)
            const isExisting = status === 'prediction-deja-faite' || status === 'regeneree' || status === 'existante';
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
          })()
        )}

        {/* Affichage complet de la réponse IA */}
        {!isLoading && aiPrediction && (
          <div className="flex flex-col gap-8">
            {/* Métadonnées + bouton relancer */}
            <div className="mb-4 flex flex-wrap gap-6 items-center justify-between">
              <div className="flex flex-wrap gap-6 items-center">
                <span className="text-sm">Horodatage de la prédiction : <span className="font-mono">{aiPrediction.metadataExtra?.predictionTimestamp || aiPrediction.lottoPrediction.timestamp}</span></span>
                <span className="text-sm">Prochain tirage : <span className="font-mono ">{aiPrediction.metadataExtra?.targetDate || aiPrediction.lottoPrediction.nextDrawDate}</span></span>
              </div>
              <Button
                onClick={loadAIPrediction}
                loading={isLoading}
                variant="secondary"
                size="sm"
                aria-label="Rafraîchir la prédiction IA"
              >
                {isLoading ? 'Chargement...' : 'Refaire la prédiction'}
              </Button>
            </div>

            {/* Bloc IA unique */}
            <div className="flex flex-col gap-6">
              {aiPrediction && (
                <Card className="border-2 border-solid">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <CardTitle className="text-lg drop-shadow dark:drop-shadow-lg">Prédiction IA</CardTitle>
                  </CardHeader>
                  <CardDescription className="flex flex-col gap-4 px-6">
                    {/* Nombres prédits */}
                    <div className="flex gap-2 flex-wrap mt-2">
                      {aiPrediction.lottoPrediction.predictedNumbers?.map((num: number, i: number) => (
                        <div key={i} className="flex-shrink-0">
                          <LottoBall number={num} size="md" type="prediction"  />
                        </div>
                      ))}
                    </div>
                    {/* Score de confiance */}
                    <div className="text-sm">
                      Score de confiance :{' '}
                      <span className="font-mono text-green-700 dark:text-green-400">
                        {typeof aiPrediction.lottoPrediction?.confidenceScore === 'number'
                          ? `${(aiPrediction.lottoPrediction.confidenceScore * 100).toFixed(1)}%`
                          : 'N/A'}
                      </span>
                    </div>
                    {/* Description */}
                    {aiPrediction.lottoPrediction.description && (
                      <div className="text-sm">Description : <span className="font-mono text-neutral-700 dark:text-neutral-300">{aiPrediction.lottoPrediction.description}</span></div>
                    )}
                    {/* Explication IA */}
                    <div className="flex flex-col">
                      <div className="text-lg">Explication IA :</div>
                      <div className="text-sm prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown>{aiPrediction.think}</ReactMarkdown>
                      </div>
                    </div>
                    {/* Résumé Markdown */}
                    {aiPrediction.lottoPrediction.content && (
                      <div className="flex flex-col">
                        <div className="text-lg">Résumé :</div>
                        <div className="text-sm prose prose-sm max-w-none dark:prose-invert">
                          <ReactMarkdown>{aiPrediction.lottoPrediction.content}</ReactMarkdown>
                        </div>
                      </div>
                    )}
               
                    {/* Analyse détaillée si présente */}
                    {aiPrediction.metadataExtra && (
                      <details className="mt-2 px-6">
                        <summary className="cursor-pointer font-semibold text-primary-600 dark:text-primary-300">Détails de l'analyse</summary>
                        <div className="pl-4 mt-2 text-xs">
                          <pre className="rounded p-3 text-xs overflow-x-auto">{JSON.stringify(aiPrediction.metadataExtra, null, 2)}</pre>
                        </div>
                      </details>
                    )}
                  </CardDescription>
                
                </Card>
              )}
            </div>
            
          </div>
        )}
      </div>
  );
}

export default PredictionTab;

