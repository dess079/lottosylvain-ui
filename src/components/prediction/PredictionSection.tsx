import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchPredictions, fetchCustomPredictions, fetchAIRecommendation } from '../../services/api';
import { Card } from '../shadcn';
import PredictionTabs from './PredictionTabs';
import { formatDate, getNextDrawDate } from '../../lib/utils';
import { APP_CONFIG } from '../../config';
import type { PredictionData } from '../../types';
import PredictionBalls from './PredictionBalls';
import ConfidenceBar from './ConfidenceBar';

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
      <div className='flex flex-row gap-8 p-1 justify-between'>
        <Card className='min-w-50%'>
          <h2 className="text-4xl font-bold text-center gradient-text">Prédiction pour le prochain tirage</h2>
          <h3 className="text-lg text-center font-semibold text-primary-600">
            {formatDate(nextDrawDate)}
          </h3>

            {/* Affichage de la prédiction IA principale */}
            <div className="w-full ">
              <h3 className="text-xl font-semibold mb-6 text-primary-600 text-center">Prédiction IA principale</h3>
            
                <div >
                  {Object.entries(aiRecommendation?.recommendations ?? {}).map(([strategy, rec], idx) => (
                    <motion.div
                      key={strategy}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.15 }}
                      className="flex flex-col">
                      <h3 className="text-2xl font-bold mb-6 text-primary-600">
                        Stratégie : {strategy}
                      </h3>
                      <PredictionBalls prediction={{ numbers: rec.numbers, confidenceScore: rec.confidenceScore, reasoning: (rec.reasoning ?? rec.justification) ?? '' }} />
                      <ConfidenceBar score={rec.confidenceScore} />
                      <div className="text-sm">
                        <h4 className="font-bold text-base mb-3 text-gray-800 dark:text-white">Analyse IA:</h4>
                        <p className="leading-relaxed">{(rec.reasoning ?? rec.justification) ?? ''}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
          
            </div>
          </Card>

           <Card className='min-w-50%'>
            <PredictionTabs
              predictions={predictions}
              customPredictions={customPredictions}
              isLoading={isLoading}
              isCustomLoading={isCustomLoading}
              error={error}
              selectedNumbers={selectedNumbers}
              excludedNumbers={excludedNumbers}
              historicalWeight={historicalWeight}
              loadPredictions={loadPredictions}
              loadCustomPredictions={loadCustomPredictions}
              toggleNumberSelection={toggleNumberSelection}
              toggleNumberExclusion={toggleNumberExclusion}
              setHistoricalWeight={setHistoricalWeight}
            />
          </Card>
        
      </div>
     
  
  );
};

export default PredictionSection;
