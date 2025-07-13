import React, { useState, useEffect } from 'react';
import LottoTemporalGraphScreen from './components/LottoTemporalGraphScreen';
import { FuturisticToolbar, LottoBall } from './components/shadcn';
import { fetchAIRecommendation, fetchPreviousResults } from './services/api';
import { FooterSection } from './components/FooterSection';
import type { PredictionData, PreviousResult } from './types';

/**
 * Page principale montrant uniquement la prédiction basée sur l'IA
 */
const App: React.FC = () => {
  const [aiPrediction, setAIPrediction] = useState<PredictionData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Ajout pour la précédente tirage
  const [previousDraw, setPreviousDraw] = useState<PreviousResult | null>(null);
  const [drawError, setDrawError] = useState<string | null>(null);
  const [drawLoading, setDrawLoading] = useState<boolean>(true);

  // Récupérer la recommandation IA au chargement du composant
  useEffect(() => {
    const loadAIPrediction = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const prediction = await fetchAIRecommendation();
        setAIPrediction(prediction);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors de la récupération de la recommandation IA');
      } finally {
        setIsLoading(false);
      }
    };
    loadAIPrediction();
  }, []);

  // Récupérer la précédente tirage au chargement du composant
  useEffect(() => {
    const loadPreviousDraw = async () => {
      try {
        setDrawLoading(true);
        setDrawError(null);
        const previousResult: PreviousResult = await fetchPreviousResults();

        console.info('Données du dernier tirage récupérées:', previousResult);

        setPreviousDraw(previousResult);
      } catch (err) {
        setDrawError(err instanceof Error ? err.message : 'Erreur lors de la récupération du dernier tirage');
      } finally {
        setDrawLoading(false);
      }
    };
    loadPreviousDraw();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden flex flex-col">
      {/* Barre d'outils futuriste */}
      <FuturisticToolbar />
      <main className="container-2025 py-8 flex-grow">
        {/* Section précédente tirage */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold mb-3">Dernier tirage officiel</h2>
          {drawLoading && (
            <p className="text-center text-base">Chargement du dernier tirage...</p>
          )}
          {drawError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <span className="text-red-500">{drawError}</span>
            </div>
          )}
          {!drawLoading && previousDraw && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-wrap justify-center gap-4 mb-2">
                {previousDraw.drawResult.map((num, idx) => (
                  <LottoBall key={idx} number={num} size="md" type="regular" />
                ))}
                {previousDraw.bonusNumber !== undefined && (
                  <LottoBall number={previousDraw.bonusNumber} size="md" type="bonus" />
                )}
              </div>
              <div className="text-sm opacity-70">
                Tirage en date du {previousDraw.previousResultDate}
              </div>
            </div>
          )}
        </section>

        {/* Accès au graphique temporel */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Graphique temporel Lotto 6/49</h2>
          <LottoTemporalGraphScreen />
        </section>
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Prédiction IA Lotto 649</h1>
          <p className="text-lg opacity-70">Découvrez les numéros prédits par l'IA pour le prochain tirage</p>
        </div>
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
      </main>
      <FooterSection />
    </div>
  );
};

export default App;
