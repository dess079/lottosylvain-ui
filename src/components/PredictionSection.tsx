import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { fetchPredictions, fetchCustomPredictions } from '../services/api';
import {
  Card,
  Alert,
  AlertDescription,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  LottoBall,
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './shadcn';
import { formatDate, getNextDrawDate } from '../lib/utils';
import { APP_CONFIG, LOTTO_CONFIG } from '../config';
import type { PredictionData } from '../types';
import { Loader2 } from 'lucide-react';

/**
 * Subcomponent for rendering error messages
 */
const ErrorMessage: React.FC<{ error: string | null }> = ({ error }) => {
  if (!error) return null;

  return (
    <div
      className="flex items-center justify-center w-full"
      style={{ height: '6in', minHeight: '6in', maxHeight: '6in', margin: '0 auto' }}
    >
      <Alert variant="destructive" className="w-full max-w-lg mx-auto">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    </div>
  );
};

/**
 * Subcomponent for rendering prediction balls
 */
const PredictionBalls: React.FC<{ prediction: PredictionData }> = React.memo(({ prediction }) => (
  <div className="flex flex-wrap gap-3 justify-center my-6">
    {prediction.numbers.map((number, index) => (
      <motion.div
        key={index}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: index * 0.15,
          type: 'spring',
          stiffness: 260,
          damping: 20,
        }}
        className="filter drop-shadow-lg"
      >
        <LottoBall number={number} animated={true} />
      </motion.div>
    ))}
  </div>
));

/**
 * Subcomponent for rendering the confidence bar
 */
const ConfidenceBar: React.FC<{ score: number }> = ({ score }) => {
  const scorePercentage = score * 100;

  const getColor = useCallback(() => {
    if (scorePercentage > 80) return 'from-emerald-400 via-green-500 to-emerald-600';
    if (scorePercentage > 60) return 'from-teal-400 via-cyan-500 to-teal-600';
    if (scorePercentage > 40) return 'from-blue-400 via-indigo-500 to-blue-600';
    if (scorePercentage > 20) return 'from-amber-400 via-yellow-500 to-amber-600';
    return 'from-red-400 via-rose-500 to-red-600';
  }, [scorePercentage]);

  return (
    <div className="w-full mb-5 mt-3">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Indice de confiance</span>
        <div className="flex items-center">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getColor()} shadow-sm`}
          >
            {scorePercentage.toFixed(1)}%
          </span>
        </div>
      </div>
      <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner confidence-bar">
        <div
          className={`h-full bg-gradient-to-r ${getColor()} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${scorePercentage}%` }}
        />
      </div>
    </div>
  );
};

/**
 * Main PredictionSection component
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
  const nextDrawDate = getNextDrawDate();

  // Fetch predictions on component mount
  useEffect(() => {
    loadPredictions();
  }, []);

  const loadPredictions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchPredictions();
      setPredictions(data);
    } catch (err) {
      setError('Failed to load predictions. Please try again later.');
      console.error('Error loading predictions:', err);
    } finally {
      setIsLoading(false);
    }
  };

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

  const renderNumberGrid = () => {
    const numbers = Array.from(
      { length: LOTTO_CONFIG.MAX_NUMBER - LOTTO_CONFIG.MIN_NUMBER + 1 },
      (_, i) => i + LOTTO_CONFIG.MIN_NUMBER
    );

    return (
      <div className="grid grid-cols-7 sm:grid-cols-10 gap-4 my-8">
        {numbers.map(number => {
          const isSelected = selectedNumbers.includes(number);
          const isExcluded = excludedNumbers.includes(number);

          return (
            <div key={number} className="relative">
              <button
                className={`w-14 h-14 rounded-full flex items-center justify-center font-medium transition-all duration-200 text-lg shadow-lg ${
                  isSelected
                    ? 'bg-primary-200 text-primary-800 border-3 border-primary-500 shadow-md scale-110'
                    : isExcluded
                    ? 'bg-gray-200 text-gray-500 border-3 border-gray-500 line-through opacity-70'
                    : 'bg-white hover:bg-gray-100 border-2 border-gray-300 hover:shadow-xl hover:scale-105'
                }`}
                onClick={() => toggleNumberSelection(number)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  toggleNumberExclusion(number);
                }}
              >
                {number}
              </button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center bg-gray-800 text-white text-xs rounded-full cursor-help shadow-md">
                      ?
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clic droit pour exclure le numéro</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className="py-8">
      <Card className="max-w-4xl mx-auto p-8 card-shimmer shadow-lg">
        <div className="flex flex-col items-center">
          <h2 className="text-4xl font-bold mb-3 text-center gradient-text">Prédiction pour le prochain tirage</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Date du prochain tirage: <span className="font-semibold">{formatDate(nextDrawDate)}</span>
          </p>

          <Tabs defaultValue="standard" className="w-full mb-8">
            <TabsList className="flex w-full border-b border-gray-200 dark:border-gray-700 mb-6">
              <TabsTrigger
                value="standard"
                className="flex-1 px-6 py-3 font-bold text-base border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:text-primary-600 dark:data-[state=active]:text-primary-400 transition-colors"
              >
                Prédictions standard
              </TabsTrigger>
              <TabsTrigger
                value="custom"
                className="flex-1 px-6 py-3 font-bold text-base border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:text-primary-600 dark:data-[state=active]:text-primary-400 transition-colors"
              >
                Prédictions personnalisées
              </TabsTrigger>
            </TabsList>

            <TabsContent value="standard">
              <h3 className="text-xl font-semibold mb-6 text-primary-600 dark:text-primary-400 text-center">
                Prédictions standard
              </h3>
              <div className="w-full">
                <div className="flex justify-center mb-8">
                  <Button
                    onClick={loadPredictions}
                    disabled={isLoading}
                    size="lg"
                    className="relative px-10 py-6 text-base font-bold shadow-xl hover:shadow-2xl transition-shadow"
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {predictions.map((prediction, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.15 }}
                        className="p-8 border border-gray-200 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:translate-y-[-5px] bg-white dark:bg-gray-800 relative overflow-hidden before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/10 before:to-transparent before:content-[''] dark:before:from-gray-800/10 dark:before:to-transparent"
                      >
                        <h3 className="text-2xl font-bold mb-4 text-primary-600 dark:text-primary-400">
                          Combinaison #{index + 1}
                        </h3>
                        <PredictionBalls prediction={prediction} />
                        <ConfidenceBar score={prediction.confidenceScore} />

                        <div className="mt-4 text-sm text-gray-700 dark:text-gray-300 bg-gray-50/80 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-100/50 dark:border-gray-700/50">
                          <h4 className="font-bold text-base mb-2 text-gray-800 dark:text-gray-200">Analyse:</h4>
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
              <h3 className="text-xl font-semibold mb-6 text-primary-600 dark:text-primary-400 text-center">
                Prédictions personnalisées
              </h3>
              <div className="w-full">
                <div className="mb-10 p-8 bg-gray-50/90 dark:bg-gray-800/60 rounded-xl shadow-inner border border-gray-200 dark:border-gray-700 analysis-box">
                  <h3 className="text-xl font-bold mb-8 text-gray-800 dark:text-gray-200">Personnalisez vos prédictions</h3>

                  <div className="mb-6">
                    <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-4">
                      Sélectionnez des numéros à inclure (clic gauche) ou exclure (clic droit):
                    </label>
                    {renderNumberGrid()}
                  </div>

                  <div className="mb-8">
                    <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-3">
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
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
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
                      className="relative px-10 py-6 text-base font-bold shadow-xl hover:shadow-2xl transition-shadow bg-gradient-to-r from-primary-600 to-primary-700 text-white"
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {customPredictions.map((prediction, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.15 }}
                        className="p-8 border border-gray-200 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:translate-y-[-5px] bg-white dark:bg-gray-800 relative overflow-hidden before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/10 before:to-transparent before:content-[''] dark:before:from-gray-800/10 dark:before:to-transparent"
                      >
                        <h3 className="text-2xl font-bold mb-4 text-primary-600 dark:text-primary-400">
                          Combinaison personnalisée #{index + 1}
                        </h3>
                        <PredictionBalls prediction={prediction} />
                        <ConfidenceBar score={prediction.confidenceScore} />

                        <div className="mt-4 text-sm text-gray-700 dark:text-gray-300 bg-gray-50/80 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-100/50 dark:border-gray-700/50">
                          <h4 className="font-bold text-base mb-2 text-gray-800 dark:text-gray-200">Analyse:</h4>
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
    </section>
  );
};

export default PredictionSection;
