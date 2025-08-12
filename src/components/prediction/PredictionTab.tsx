import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { fetchAIRecommendation } from '../../services/api';
import type { SpringAiPredictionResponse } from '../../types/SpringAiPredictionResponse';
import { Card, CardDescription, CardHeader, CardTitle, LottoBall, Button } from '../shadcn';
import './PredictionTab.css';

/**
 * Composant pour afficher la prédiction IA
 * Charge les données manuellement via un bouton
 */
const PredictionTab: React.FC = () => {
  const [aiPrediction, setAIPrediction] = useState<SpringAiPredictionResponse | null>(null);
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

  const prediction: SpringAiPredictionResponse = await fetchAIRecommendation();

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

        {/* Affichage complet de la réponse IA */}
        {!isLoading && aiPrediction && (
          <div className="flex flex-col gap-8">
            {/* Métadonnées + bouton relancer */}
            <div className="mb-4 flex flex-wrap gap-6 items-center justify-between">
              <div className="flex flex-wrap gap-6 items-center">
                <span className="text-sm">Horodatage de la prédiction : <span className="font-mono">{aiPrediction.timestamp}</span></span>
                <span className="text-sm">Prochain tirage : <span className="font-mono ">{aiPrediction.nextDrawDate}</span></span>
              </div>
              <Button
                onClick={loadAIPrediction}
                loading={isLoading}
                variant="outline"
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
                      {aiPrediction.numbers.map((num: number, i: number) => (
                        <div key={i} className="flex-shrink-0">
                          <LottoBall number={num} size="md" type="prediction"  />
                        </div>
                      ))}
                    </div>
                    {/* Score de confiance */}
                    <div className="text-sm">Score de confiance : <span className="font-mono text-green-700 dark:text-green-400">{aiPrediction.confidenceScore.toFixed(3)}</span></div>
                    {/* Description */}
                    {aiPrediction.description && (
                      <div className="text-sm">Description : <span className="font-mono text-neutral-700 dark:text-neutral-300">{aiPrediction.description}</span></div>
                    )}
                    {/* Explication IA */}
                    <div className="flex flex-col">
                      <div className="text-lg">Explication IA :</div>
                      <div className="text-sm prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown>{aiPrediction.think}</ReactMarkdown>
                      </div>
                    </div>
                    {/* Résumé Markdown */}
                    {aiPrediction.content && (
                      <div className="flex flex-col">
                        <div className="text-lg">Résumé :</div>
                        <div className="text-sm prose prose-sm max-w-none dark:prose-invert">
                          <ReactMarkdown>{aiPrediction.content}</ReactMarkdown>
                        </div>
                      </div>
                    )}
                    {/* Debug brut */}
                    {aiPrediction.raw && (
                      <details className="mt-2 px-6">
                        <summary className="cursor-pointer font-semibold text-amber-600 dark:text-amber-300">Réponse brute du modèle (debug)</summary>
                        <pre className="rounded p-3 text-xs overflow-x-auto whitespace-pre-wrap break-words">{aiPrediction.raw}</pre>
                      </details>
                    )}
                    {/* Analyse détaillée si présente */}
                    {aiPrediction.metadata && (
                      <details className="mt-2 px-6">
                        <summary className="cursor-pointer font-semibold text-primary-600 dark:text-primary-300">Détails de l'analyse</summary>
                        <div className="pl-4 mt-2 text-xs">
                          <pre className="rounded p-3 text-xs overflow-x-auto">{JSON.stringify(aiPrediction.metadata, null, 2)}</pre>

                        </div>
                      </details>
                    )}
                  </CardDescription>
                  {/* Nouvelle section pour afficher toutes les valeurs de metadata */}
                  {aiPrediction.metadata && (
                    <div className="p-4 border-t">
                      <div className="font-semibold mb-2">Toutes les données metadata :</div>
                      <pre className="rounded p-3 text-xs overflow-x-auto">
                        {JSON.stringify(aiPrediction.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </Card>
              )}
            </div>
            
          </div>
        )}
      </div>
  );
}

export default PredictionTab;

