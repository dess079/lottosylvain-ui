import React, { useState, useEffect } from 'react';
import { LottoBall } from '../shadcn';
import { fetchAIRecommendation } from '../../services/api';
import type { FrontendRecommendation, FrontendRecommendationsResponse } from '../../types/FrontendRecommendationsResponse';
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
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-red-500">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <div>
              <h3 className="text-lg font-medium text-red-500">Service indisponible</h3>
              <p className="text-sm opacity-80 mt-1">{error}</p>
              <p className="text-sm mt-2">Veuillez vérifier que le serveur backend est en cours d'exécution et réessayer.</p>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <p className="text-center text-lg">Chargement des prédictions IA...</p>
      )}

      {/* Affichage complet de la réponse IA */}
      {!isLoading && aiPrediction && (
        <div className="flex flex-col gap-8">
          {/* Métadonnées */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-6 items-center">
              <span className="text-sm text-gray-500">Horodatage de la prédiction : <span className="font-mono text-gray-700">{aiPrediction.timestamp}</span></span>
              <span className="text-sm text-gray-500">Prochain tirage : <span className="font-mono text-gray-700">{aiPrediction.nextDrawDate}</span></span>
            </div>
          </div>

          {/* Recommandations IA */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Recommandations IA</h3>
            <div className="flex flex-col gap-6">
              {Object.entries(aiPrediction.recommendations).map(([strategy, rec], idx) => (
                <div key={strategy} className="border border-gray-200 rounded-lg p-4 bg-white/60 shadow-sm">
                  <div className="flex flex-wrap items-center gap-4 mb-2">
                    <span className="font-bold text-blue-700">Stratégie :</span>
                    <span className="font-mono text-blue-900">{strategy}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mb-2">
                    <span className="font-semibold">Numéros :</span>
                    <div className="flex gap-2 flex-wrap">
                      {rec.numbers.map((num, i) => (
                        <LottoBall key={i} number={num} size="md" type="prediction" animated />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-6 mb-2">
                    <span className="text-sm text-gray-700">Score de confiance : <span className="font-mono text-green-700">{rec.confidenceScore}</span></span>
                  </div>
                  <div className="mb-2">
                    <span className="text-sm font-semibold">Explication IA :</span>
                    <span className="ml-2 text-sm text-gray-800">{rec.reasoning}</span>
                  </div>
                  {/* Analyse détaillée si présente */}
                  {rec.analysisFactors && (
                    <details className="mt-2">
                      <summary className="cursor-pointer font-semibold text-blue-600">Détails de l'analyse</summary>
                      <div className="pl-4 mt-2 text-xs text-gray-700">
                        {rec.analysisFactors.frequencyAnalysis && (
                          <div className="mb-2">
                            <span className="font-semibold">Analyse de fréquence :</span>
                            <pre className="bg-gray-100 rounded p-2 mt-1 overflow-x-auto">{JSON.stringify(rec.analysisFactors.frequencyAnalysis, null, 2)}</pre>
                          </div>
                        )}
                        {rec.analysisFactors.patternAnalysis && (
                          <div className="mb-2">
                            <span className="font-semibold">Analyse de patterns :</span>
                            <pre className="bg-gray-100 rounded p-2 mt-1 overflow-x-auto">{JSON.stringify(rec.analysisFactors.patternAnalysis, null, 2)}</pre>
                          </div>
                        )}
                        {rec.analysisFactors.historicalTrends && (
                          <div className="mb-2">
                            <span className="font-semibold">Tendances historiques :</span>
                            <pre className="bg-gray-100 rounded p-2 mt-1 overflow-x-auto">{JSON.stringify(rec.analysisFactors.historicalTrends, null, 2)}</pre>
                          </div>
                        )}
                      </div>
                    </details>
                  )}
                </div>
              ))}
            </div>
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
};

export default PredictionTab;
