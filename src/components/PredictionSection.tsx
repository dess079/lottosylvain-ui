import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchPredictions, fetchCustomPredictions } from '../services/api';
import Button from './ui/Button';
import Card from './ui/Card';
import LottoBall from './ui/LottoBall';
import Tooltip from './ui/Tooltip';
import { formatDate, getNextDrawDate } from '../lib/utils';
import { APP_CONFIG, LOTTO_CONFIG } from '../config';
import type { PredictionData } from '../types';

/**
 * Component that displays lottery predictions and allows for customization
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
  const [showCustomOptions, setShowCustomOptions] = useState(false);
  const [activeTab, setActiveTab] = useState<'standard' | 'custom'>('standard');
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
        weightHistorical: historicalWeight
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
      <div className="grid grid-cols-7 sm:grid-cols-10 gap-2 my-4">
        {numbers.map(number => {
          const isSelected = selectedNumbers.includes(number);
          const isExcluded = excludedNumbers.includes(number);
          
          return (
            <div key={number} className="relative">
              <button
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all duration-200 ${
                  isSelected ? 'bg-primary-100 text-primary-800 border-2 border-primary-500' :
                  isExcluded ? 'bg-gray-200 text-gray-500 border-2 border-gray-500 line-through' :
                  'bg-white hover:bg-gray-100 border border-gray-300'
                }`}
                onClick={() => toggleNumberSelection(number)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  toggleNumberExclusion(number);
                }}
              >
                {number}
              </button>
              <Tooltip content="Right-click to exclude number">
                <div className="absolute top-0 right-0 w-4 h-4 flex items-center justify-center bg-gray-800 text-white text-xs rounded-full cursor-help">
                  ?
                </div>
              </Tooltip>
            </div>
          );
        })}
      </div>
    );
  };

  const renderPredictionBalls = (prediction: PredictionData) => {
    return (
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {prediction.numbers.map((number, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <LottoBall number={number} />
          </motion.div>
        ))}
      </div>
    );
  };

  const renderConfidenceBar = (score: number) => {
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div 
          className="bg-primary-500 h-2.5 rounded-full"
          style={{ width: `${score * 100}%` }}
        ></div>
        <div className="text-sm text-right">
          Confidence: {(score * 100).toFixed(1)}%
        </div>
      </div>
    );
  };

  return (
    <section className="py-8">
      <Card className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-2">Prédiction pour le prochain tirage</h2>
          <p className="text-lg text-gray-600 mb-6">
            Date du prochain tirage: <span className="font-semibold">{formatDate(nextDrawDate)}</span>
          </p>
          
          <div className="w-full mb-6">
            <div className="flex border-b border-gray-200">
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === 'standard'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('standard')}
              >
                Prédictions standard
              </button>
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === 'custom'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('custom')}
              >
                Prédictions personnalisées
              </button>
            </div>
          </div>
          
          {activeTab === 'standard' && (
            <div className="w-full">
              <div className="flex justify-center mb-6">
                <Button 
                  onClick={loadPredictions} 
                  isLoading={isLoading}
                  size="lg"
                >
                  Générer des prédictions
                </Button>
              </div>
              
              {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
                  {error}
                </div>
              )}
              
              {!isLoading && predictions.length > 0 && (
                <div className="space-y-8">
                  {predictions.map((prediction, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <h3 className="text-xl font-semibold mb-3">Combinaison #{index + 1}</h3>
                      {renderPredictionBalls(prediction)}
                      {renderConfidenceBar(prediction.confidenceScore)}
                      
                      <div className="mt-4 text-sm text-gray-700 bg-gray-50 p-3 rounded">
                        <h4 className="font-medium mb-2">Analyse:</h4>
                        <p>{prediction.reasoning}</p>
                      </div>
                      
                      {prediction.analysisFactors && (
                        <div className="mt-4">
                          <button
                            className="text-primary-600 text-sm hover:underline"
                            onClick={() => {
                              // Toggle detailed analysis view
                            }}
                          >
                            Voir l'analyse détaillée
                          </button>
                        </div>
                      )}
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
          )}
          
          {activeTab === 'custom' && (
            <div className="w-full">
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Personnalisez vos prédictions</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sélectionnez des numéros à inclure (clic gauche) ou exclure (clic droit):
                  </label>
                  {renderNumberGrid()}
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Importance des données historiques: {historicalWeight}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={historicalWeight}
                    onChange={(e) => setHistoricalWeight(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Aléatoire</span>
                    <span>Équilibré</span>
                    <span>Historique</span>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button
                    onClick={loadCustomPredictions}
                    isLoading={isCustomLoading}
                    variant="secondary"
                  >
                    Générer des prédictions personnalisées
                  </Button>
                </div>
              </div>
              
              {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
                  {error}
                </div>
              )}
              
              {!isCustomLoading && customPredictions.length > 0 && (
                <div className="space-y-8">
                  {customPredictions.map((prediction, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <h3 className="text-xl font-semibold mb-3">Combinaison personnalisée #{index + 1}</h3>
                      {renderPredictionBalls(prediction)}
                      {renderConfidenceBar(prediction.confidenceScore)}
                      
                      <div className="mt-4 text-sm text-gray-700 bg-gray-50 p-3 rounded">
                        <h4 className="font-medium mb-2">Analyse:</h4>
                        <p>{prediction.reasoning}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              
              {!isCustomLoading && !customPredictions.length && !error && (
                <p className="text-center text-gray-500">
                  Personnalisez vos critères et cliquez sur le bouton pour générer des prédictions.
                </p>
              )}
            </div>
          )}
        </div>
      </Card>
    </section>
  );
};

export default PredictionSection;
