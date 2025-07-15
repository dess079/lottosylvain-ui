import React, { useState, useEffect } from 'react';
import { LottoBall } from '../shadcn';
import { fetchAIRecommendation } from '../../services/api';
import type { PredictionData } from '../../types';
import './PredictionTab.css';

interface PredictionTabProps {
  isActive: boolean;
}

/**
 * Composant pour afficher la prédiction IA
 * Charge les données seulement quand l'onglet est actif
 */
const PredictionTab: React.FC<PredictionTabProps> = ({ isActive }) => {
  const [aiPrediction, setAIPrediction] = useState<PredictionData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);

  // Charger les données seulement quand l'onglet devient actif
  useEffect(() => {
    if (isActive && !hasLoaded) {
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
      <p className="text-lg opacity-70 mb-8">Découvrez les numéros prédits par l'IA pour le prochain tirage</p>
      
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
      
      {/* Prédiction IA */}
      {!isLoading && aiPrediction && (
        <div className="flex flex-wrap justify-center gap-8">
          {aiPrediction.numbers.map((num, index) => (
            <LottoBall key={index} number={num} size="lg" type="prediction" animated />
          ))}
        </div>
      )}
      
      {isLoading && (
        <p className="text-center text-lg">Chargement des prédictions IA...</p>
      )}
    </section>
  );
};

export default PredictionTab;
