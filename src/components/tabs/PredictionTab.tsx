import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { fetchAIRecommendation } from '../../services/api';
import type { FrontendRecommendationsResponse } from '../../types/FrontendRecommendationsResponse';
import { Card, CardDescription, CardHeader, CardTitle, LottoBall } from '../shadcn';
import './PredictionTab.css';

interface PredictionTabProps {
  isActive: boolean;
}

/**
 * Composant pour afficher la prédiction IA
 * Charge les données seulement quand l'onglet est actif
 */
const PredictionTab: React.FC<PredictionTabProps> = ({ isActive }) => {
  const [aiPrediction, setAIPrediction] = useState<FrontendRecommendationsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);

  // Charger les données seulement quand l'onglet devient actif
  useEffect(() => {
    console.log('PredictionTab useEffect triggered, isActive:', isActive, 'hasLoaded:', hasLoaded);
    if (isActive && !hasLoaded) {
      console.log('Fetching AI prediction..');
      loadAIPrediction();
    }
  }, [isActive]);

  /**
   * Récupère la recommandation IA
   */
  const loadAIPrediction = async () => {
    console.log('loadAIPrediction called');
    try {
      setIsLoading(true);
      setError(null);

      const prediction: FrontendRecommendationsResponse = await fetchAIRecommendation();

      console.log('AI prediction loaded:', prediction);
      setAIPrediction(prediction);
      setHasLoaded(true);
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
              <button
                className="px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={loadAIPrediction}
                disabled={isLoading}
                type="button"
                aria-label="Rafraîchir la prédiction IA"
              >
                🔄 Refaire la prédiction
              </button>
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
                      {aiPrediction.recommendations.pattern.numbers.map((num: number, i: number) => (
                        <div key={i} className="flex-shrink-0">
                          <LottoBall number={num} size="md" type="prediction"  />
                        </div>
                      ))}
                    </div>
                    {/* Date du tirage */}
                    {aiPrediction.recommendations.drawDate && (
                      <div className="text-sm">Date du tirage : <span className="font-mono text-primary-700 dark:text-primary-300">{aiPrediction.recommendations.drawDate}</span></div>
                    )}
                    {/* Score de confiance */}
                    {aiPrediction.recommendations.pattern.confidenceScore && (
                      <div className="text-sm">Score de confiance : <span className="font-mono text-green-700 dark:text-green-400">{aiPrediction.recommendations.confidenceScore}</span></div>
                    )}
                    {/* Justification */}
                    {aiPrediction.recommendations.pattern.reasoning && (
                      <div className="text-sm">Reasoning : <span className="font-mono text-neutral-700 dark:text-neutral-300">{aiPrediction.recommendations.justification}</span></div>
                    )}
                    {/* Explication IA */}
                    <div className="flex flex-col">
                      <div className="text-lg">Explication IA :</div>
                      <div className="text-sm prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown>{aiPrediction.recommendations.pattern.reasoning}</ReactMarkdown>
                      </div>
                    </div>
                    {/* Analyse détaillée si présente */}
                    {aiPrediction.recommendations.analysisFactors && (
                      <details className="mt-2 px-6">
                        <summary className="cursor-pointer font-semibold text-primary-600 dark:text-primary-300">Détails de l'analyse</summary>
                        <div className="pl-4 mt-2 text-xs">
                          {/* Fréquence */}
                          {aiPrediction.recommendations.analysisFactors.frequencyAnalysis && (
                            <div className="mb-2">
                              <div className="font-semibold">Analyse de fréquence :</div>
                              <ul>
                                {Object.entries(aiPrediction.recommendations.analysisFactors.frequencyAnalysis).map(([key, value]) => (
                                  <li key={key}>{key}: <span className="font-mono">{String(value)}</span></li>
                                ))}
                              </ul>
                            </div>
                          )}
                         
                        </div>
                      </details>
                    )}
                  </CardDescription>
                </Card>
              )}
            </div>
            {/* Méta-analyse IA */}
            <div>
              <h3 className="text-xl font-semibold mb-2 mt-6">Méta-analyse IA</h3>
              <pre className=" rounded p-3 text-xs overflow-x-auto">{JSON.stringify(aiPrediction.metaAnalysis, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
  );
}

export default PredictionTab;
            
