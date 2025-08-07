import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { APP_CONFIG } from '../../config';
import { fetchAIRecommendation, fetchCustomPredictions, fetchPredictions } from '../../services/api';
import type { PredictionData } from '../../types';
import AnalysisMarkdownBox from '../AnalysisMarkdownBox';
import { Card, Button } from '../shadcn';
import ConfidenceBar from './ConfidenceBar';
import PredictionBalls from './PredictionBalls';
import PredictionTabs from './PredictionTabs';
import { Loader2 } from 'lucide-react';
import { getNextDrawDate } from '@/lib/utils';
import { FrontendRecommendationsResponse } from '@/types/FrontendRecommendationsResponse';
import { formatDate } from 'date-fns';

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
  const [aiRecommendation, setAIRecommendation] = useState<null | FrontendRecommendationsResponse>(null);
  const [isAILoading, setIsAILoading] = useState(false);
  const nextDrawDate = getNextDrawDate();

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
      <div className='flex flex-row gap-4 p-1 justify-between h-screen w-full min-h-[400px] max-h-screen'>
        <Card className='flex flex-col min-h-0 max-h-full h-screen w-1/2 overflow-hidden'>
            <h2 className="text-4xl font-bold text-center gradient-text">Prédiction pour le prochain tirage</h2>
            <h3 className="text-lg text-center font-semibold text-primary-600">
              {formatDate(nextDrawDate, 'yyyy-MM-dd')}
            </h3>
            {/* Affichage de la prédiction IA principale */}
            <div className="flex-1 flex flex-col min-h-0 max-h-full overflow-auto">
              <h3 className="text-xl font-semibold mb-6 text-primary-600 text-center">Prédiction IA principale</h3>
              
              {/* Bouton pour lancer la prédiction IA */}
              <div className="mb-6 text-center">
                <Button
                  onClick={loadAIRecommendation}
                  disabled={isAILoading}
                  variant="default"
                  size="lg"
                >
                  {isAILoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isAILoading ? 'Génération en cours...' : 'Générer Prédiction IA'}
                </Button>
              </div>

              <div>
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
                    <AnalysisMarkdownBox title="Analyse:" markdown={rec.reasoning as string} />
                   
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>

        <Card className='flex flex-col min-h-0 max-h-full h-screen w-1/2 overflow-hidden'>
            <div className="flex-1 flex flex-col min-h-0 max-h-full overflow-auto">
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
            </div>
          </Card>   
      </div>
  );
};

export default PredictionSection;
