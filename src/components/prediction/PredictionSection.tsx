import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchPredictions, fetchCustomPredictions, fetchAIRecommendation } from '../../services/api';
import { Card, Tabs, TabsList, TabsTrigger, TabsContent, Button } from '../shadcn';
import { formatDate, getNextDrawDate } from '../../lib/utils';
import { APP_CONFIG, LOTTO_CONFIG } from '../../config';
import type { PredictionData } from '../../types';
import { Loader2 } from 'lucide-react';
import ErrorMessage from './ErrorMessage';
import PredictionBalls from './PredictionBalls';
import ConfidenceBar from './ConfidenceBar';
import NumberGrid from './NumberGrid';

/**
 * Main PredictionSection component
 * Affiche les prédictions IA et personnalisées, la grille de sélection, et la gestion d'état.
 */
const PredictionSection: React.FC = () => {
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [customPredictions, setCustomPredictions] = useState<PredictionData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCustomLoading, setIsCustomLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [excludedNumbers, setExcludedNumbers] = useState<number[]>([]);
  const [historicalWeight, setHistoricalWeight] = useState(50);
  const [aiRecommendation, setAIRecommendation] = useState<null | import('../../types/FrontendRecommendationsResponse').FrontendRecommendationsResponse>(null);
  const [isAILoading, setIsAILoading] = useState(false);
  const nextDrawDate = getNextDrawDate();

  // Fetch predictions and AI recommendation on mount
  useEffect(() => {
    loadPredictions();
    loadAIRecommendation();
  }, []);

  /**
   * Charge la recommandation IA principale
   */
  const loadAIRecommendation = async () => {
    setIsAILoading(true);
    try {
      const data = await fetchAIRecommendation();
      setAIRecommendation(data);
    } catch (err) {
      setError('Erreur lors de la récupération de la prédiction IA.');
    } finally {
      setIsAILoading(false);
    }
  };

  /**
   * Charge les prédictions standard
   */
  const loadPredictions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Loading predictions...');
      const data = await fetchPredictions();
      setPredictions(data);
    } catch (err) {
      setError('Failed to load predictions. Please try again later.');
      console.error('Error loading predictions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Charge les prédictions personnalisées
   */
  const loadCustomPredictions = async () => {
    setIsCustomLoading(true);
    setError(null);
    try {
      const data = await fetchCustomPredictions({
        includeNumbers: selectedNumbers.length > 0 ? selectedNumbers : undefined,
        excludeNumbers: excludedNumbers.length > 0 ? excludedNumbers : undefined,
        weightHistorical: historicalWeight,
      });
      setCustomPredictions(data);
    } catch (err) {
      setError('Failed to load custom predictions. Please try again later.');
      console.error('Error loading custom predictions:', err);
    } finally {
      setIsCustomLoading(false);
    }
  };

  /**
   * Sélectionne ou désélectionne un numéro à inclure
   */
  const toggleNumberSelection = (number: number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== number));
    } else if (excludedNumbers.includes(number)) {
      setExcludedNumbers(excludedNumbers.filter(n => n !== number));
      setSelectedNumbers([...selectedNumbers, number]);
    } else {
      if (selectedNumbers.length < APP_CONFIG.MAX_SELECTED_NUMBERS) {
        setSelectedNumbers([...selectedNumbers, number]);
      }
    }
  };

  /**
   * Sélectionne ou désélectionne un numéro à exclure
   */
  const toggleNumberExclusion = (number: number) => {
    if (excludedNumbers.includes(number)) {
      setExcludedNumbers(excludedNumbers.filter(n => n !== number));
    } else if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== number));
      setExcludedNumbers([...excludedNumbers, number]);
    } else {
      setExcludedNumbers([...excludedNumbers, number]);
    }
  };

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:bg-gray-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-16">
        <Card className="p-12 sm:p-16 lg:p-20 rounded-3xl shadow-3xl border-2 border-primary-200 dark:border-gray-800 bg-gradient-to-br from-white via-gray-50 to-gray-200 dark:bg-gray-900 transition-colors duration-300 mb-12">
          <div className="flex flex-col items-center">
            <h2 className="text-4xl font-bold mb-6 text-center gradient-text">Prédiction pour le prochain tirage</h2>
            <p className="text-lg text-gray-700 dark:text-gray-200 mb-10">
              Date du prochain tirage: <span className="font-semibold">{formatDate(nextDrawDate)}</span>
            </p>

            {/* Affichage de la prédiction IA principale */}
            <div className="w-full mb-12">
              <h3 className="text-xl font-semibold mb-6 text-primary-600 dark:text-white text-center">Prédiction IA principale</h3>
              {isAILoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <span>Chargement de la prédiction IA...</span>
                </div>
              ) : aiRecommendation && aiRecommendation.recommendations && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {Object.entries(aiRecommendation.recommendations).map(([strategy, rec], idx) => (
                    <motion.div
                      key={strategy}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.15 }}
                      className="p-10 border-2 border-primary-200 dark:border-gray-700 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-3xl hover:translate-y-[-5px] bg-white dark:bg-gray-900 relative overflow-hidden"
                    >
                      <h3 className="text-2xl font-bold mb-6 text-primary-600 dark:text-white">
                        Stratégie : {strategy}
                      </h3>
                      <PredictionBalls prediction={{ numbers: rec.numbers, confidenceScore: rec.confidenceScore, reasoning: (rec.reasoning ?? rec.justification) ?? '' }} />
                      <ConfidenceBar score={rec.confidenceScore} />
                      <div className="mt-6 text-sm text-gray-700 dark:text-gray-200 bg-gray-50/80 dark:bg-gray-900/60 p-6 rounded-lg border border-gray-100/50 dark:border-gray-800/50">
                        <h4 className="font-bold text-base mb-3 text-gray-800 dark:text-white">Analyse IA:</h4>
                        <p className="leading-relaxed">{(rec.reasoning ?? rec.justification) ?? ''}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <Tabs defaultValue="standard" className="w-full mb-12">
              <TabsList className="flex w-full border-b-2 border-primary-200 dark:border-primary-700 mb-8">
                <TabsTrigger
                  value="standard"
                  className="flex-1 px-8 py-4 font-bold text-lg border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:text-primary-600 dark:data-[state=active]:text-white transition-colors"
                >
                  Prédictions standard
                </TabsTrigger>
                <TabsTrigger
                  value="custom"
                  className="flex-1 px-8 py-4 font-bold text-lg border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:text-primary-600 dark:data-[state=active]:text-primary-400 transition-colors"
                >
                  Prédictions personnalisées
                </TabsTrigger>
              </TabsList>

              <TabsContent value="standard">
                <h3 className="text-xl font-semibold mb-8 text-primary-600 dark:text-primary-400 text-center">
                  Prédictions standard
                </h3>
                <div className="w-full">
                  <div className="flex justify-center mb-10">
                    <Button
                      onClick={loadPredictions}
                      disabled={isLoading}
                      size="lg"
                      className="relative px-12 py-8 text-lg font-bold shadow-xl hover:shadow-2xl transition-shadow"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          <span>Chargement...</span>
                        </>
                      ) : (
                        <>
                          <span>Générer des prédictions</span>
                          <svg
                            className="ml-2 h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            ></path>
                          </svg>
                        </>
                      )}
                    </Button>
                  </div>

                  <ErrorMessage error={error} />

                  {!isLoading && predictions.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {predictions.map((prediction, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.15 }}
                          className="p-10 border-2 border-gray-200 dark:border-gray-400 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-3xl hover:translate-y-[-5px] bg-white dark:bg-gray-800 relative overflow-hidden before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/10 before:to-transparent before:content-[''] dark:before:from-gray-800/10 dark:before:to-transparent"
                        >
                          <h3 className="text-2xl font-bold mb-6 text-primary-600 dark:text-primary-400">
                            Combinaison #{index + 1}
                          </h3>
                          <PredictionBalls prediction={prediction} />
                          <ConfidenceBar score={prediction.confidenceScore} />

                          <div className="mt-6 text-sm text-gray-700 dark:text-gray-300 bg-gray-50/80 dark:bg-gray-700/30 p-6 rounded-lg border border-gray-100/50 dark:border-gray-700/50">
                            <h4 className="font-bold text-base mb-3 text-gray-800 dark:text-gray-200">Analyse:</h4>
                            <p className="leading-relaxed">{prediction.reasoning}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {!isLoading && !predictions.length && !error && (
                    <p className="text-center text-gray-500">
                      Cliquez sur le bouton ci-dessus pour générer des prédictions.
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="custom">
                <h3 className="text-xl font-semibold mb-8 text-primary-600 dark:text-primary-400 text-center">
                  Prédictions personnalisées
                </h3>
                <div className="w-full">
                  <div className="mb-12 p-12 sm:p-16 bg-gray-50/90 dark:bg-gray-800/60 rounded-2xl shadow-inner border-2 border-gray-200 dark:border-gray-700 analysis-box">
                    <h3 className="text-xl font-bold mb-10 text-gray-800 dark:text-gray-200">Personnalisez vos prédictions</h3>

                    <div className="mb-8">
                      <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-5">
                        Sélectionnez des numéros à inclure (clic gauche) ou exclure (clic droit):
                      </label>
                    <NumberGrid
                      selectedNumbers={selectedNumbers}
                      excludedNumbers={excludedNumbers}
                      onSelect={toggleNumberSelection}
                      onExclude={toggleNumberExclusion}
                      minNumber={LOTTO_CONFIG.MIN_NUMBER}
                      maxNumber={LOTTO_CONFIG.MAX_NUMBER}
                    />
                    </div>

                    <div className="mb-10">
                      <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-4">
                        Importance des données historiques:{' '}
                        <span className="font-bold text-primary-600 dark:text-primary-400">{historicalWeight}%</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={historicalWeight}
                        onChange={(e) => setHistoricalWeight(Number(e.target.value))}
                        className="w-full h-3 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary-500 shadow-inner confidence-bar"
                      />
                      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-3">
                        <span>Aléatoire</span>
                        <span>Équilibré</span>
                        <span>Historique</span>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <Button
                        onClick={loadCustomPredictions}
                        disabled={isCustomLoading}
                        variant="secondary"
                        size="lg"
                        className="relative px-12 py-8 text-lg font-bold shadow-xl hover:shadow-2xl transition-shadow bg-gradient-to-r from-primary-600 to-primary-700 text-white"
                      >
                        {isCustomLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            <span>Chargement...</span>
                          </>
                        ) : (
                          <>
                            <span>Générer des prédictions personnalisées</span>
                            <svg
                              className="ml-2 h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5l7 7-7 7"
                              ></path>
                            </svg>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <ErrorMessage error={error} />

                  {!isCustomLoading && customPredictions.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {customPredictions.map((prediction, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.15 }}
                          className="p-10 border-2 border-gray-200 dark:border-gray-400 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-3xl hover:translate-y-[-5px] bg-white dark:bg-gray-800 relative overflow-hidden before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/10 before:to-transparent before:content-[''] dark:before:from-gray-800/10 dark:before:to-transparent"
                        >
                          <h3 className="text-2xl font-bold mb-6 text-primary-600 dark:text-primary-400">
                            Combinaison personnalisée #{index + 1}
                          </h3>
                          <PredictionBalls prediction={prediction} />
                          <ConfidenceBar score={prediction.confidenceScore} />

                          <div className="mt-6 text-sm text-gray-700 dark:text-gray-300 bg-gray-50/80 dark:bg-gray-700/30 p-6 rounded-lg border border-gray-100/50 dark:border-gray-700/50">
                            <h4 className="font-bold text-base mb-3 text-gray-800 dark:text-gray-200">Analyse:</h4>
                            <p className="leading-relaxed">{prediction.reasoning}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {!isCustomLoading && !customPredictions.length && !error && (
                    <p className="text-center text-gray-500">
                      Cliquez sur le bouton ci-dessus pour générer des prédictions personnalisées.
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default PredictionSection;
