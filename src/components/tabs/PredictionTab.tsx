import React, { useState, useEffect } from 'react';
import { LottoBall, Card, CardHeader, CardTitle, CardDescription } from '../shadcn';
import { fetchAIRecommendation } from '../../services/api';
import type { FrontendRecommendationsResponse } from '../../types/FrontendRecommendationsResponse';
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
    if (isActive && !hasLoaded) {
      console.log('Fetching AI prediction...');
      loadAIPrediction();
    }
  }, [isActive, hasLoaded]);

  /**
   * Récupère la recommandation IA
   */
  const loadAIPrediction = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const prediction = await fetchAIRecommendation();
      setAIPrediction(prediction);
      setHasLoaded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération de la recommandation IA');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="prediction-tab-animation">
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
          <p className="text-center text-lg">Chargement des prédictions IA...</p>
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
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
            {aiPrediction.recommendations && aiPrediction.recommendations['AI'] && (
              <Card className="border-2 border-solid">
                <CardHeader className="flex flex-row items-center gap-4">
                  <CardTitle className="text-lg drop-shadow dark:drop-shadow-lg">Prédiction IA</CardTitle>
                </CardHeader>
                <CardDescription className="flex flex-col gap-4 px-6">
                  <div className="flex gap-2 flex-wrap mt-2">
                    {aiPrediction.recommendations['AI'].numbers.map((num, i) => (
                      <LottoBall key={i} number={num} size="md" type="prediction" animated />
                    ))}
                  </div>
                  {/* Ajout de la date du tirage */}
                  {aiPrediction.recommendations['AI'].drawDate && (
                    <div className="text-sm">Date du tirage : <span className="font-mono text-blue-700 dark:text-blue-300">{aiPrediction.recommendations['AI'].drawDate}</span></div>
                  )}
                  <div className="text-sm">Score de confiance : <span className="font-mono text-green-700 dark:text-green-400">{aiPrediction.recommendations['AI'].confidenceScore}</span></div>
                  <div className="flex flex-col">
                    <div className="text-lg">Explication IA :</div>
                    <div className="text-sm">{aiPrediction.recommendations['AI'].reasoning}</div>
                  </div>
                  {/* Analyse détaillée si présente */}
                  {aiPrediction.recommendations['AI'].analysisFactors && (
                    <details className="mt-2 px-6">
                      <summary className="cursor-pointer font-semibold text-blue-600 dark:text-blue-300">Détails de l'analyse</summary>
                      <div className="pl-4 mt-2 text-xs text-gray-700 dark:text-blue-100">
                        {/* ...affichage des facteurs d'analyse... */}
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
            <pre className="bg-gray-100 rounded p-3 text-xs overflow-x-auto">{JSON.stringify(aiPrediction.metaAnalysis, null, 2)}</pre>
          </div>
        </div>
      )}
    </section>
  );
}

export default PredictionTab;
            
