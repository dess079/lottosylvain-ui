import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchPreviousResults } from '../services/api';
import { 
  Skeleton, 
  Card, 
  LottoBall 
} from './shadcn';
import { formatDate } from '../lib/utils';
import { LOTTO_CONFIG } from '../config';
import type { PreviousResult } from '../types';

/**
 * Component that displays previous lottery results and statistics
 */
const PreviousResults: React.FC = () => {
  const [previousResult, setPreviousResult] = useState<PreviousResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Load data in parallel
        const previousResult: PreviousResult = await fetchPreviousResults();

        console.debug('Raw API response:', previousResult);

        // Validate and transform data
        if (!previousResult || typeof previousResult !== 'object') {
          throw new Error('Invalid data format received from API.');
        }

        const { previousResultDate, drawResult } = previousResult;

        if (!previousResultDate || !Array.isArray(drawResult)) {
          console.warn('Malformed data fields:', { previousResultDate, drawResult });
          throw new Error('Missing or invalid fields in API response.');
        }

        setPreviousResult(previousResult);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Une erreur inattendue est survenue lors du chargement des données.'
        );
        console.error('Error loading lottery data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
        {error}
      </div>
    );
  }

  console.debug('Rendering PreviousResults with data:', previousResult);
  console.debug('PreviousResult raw data:', previousResult);

  const drawDate = previousResult?.previousResultDate || 'Date inconnue';
  const drawNumbers = Array.isArray(previousResult?.drawResult) ? previousResult.drawResult : [];

  if (!previousResult) {
    console.error('PreviousResult is null or undefined:', previousResult);
  } else {
    console.debug('Processed PreviousResult:', { drawDate, drawNumbers });
  }

  if (drawNumbers.length === 0) {
    console.warn('No draw numbers available:', previousResult);
  }

  return (
    <section className="py-8">
      <Card className="max-w-4xl mx-auto p-8 card-shimmer shadow-lg">
        <div className="flex flex-col items-center">
          <h2 className="text-4xl font-bold mb-3 text-center gradient-text">Dernier tirage {LOTTO_CONFIG.GAME_NAME}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Date du tirage: <span className="font-semibold">{formatDate(drawDate)}</span>
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {drawNumbers.map((number, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20,
                  delay: index * 0.15 
                }}
                className="filter drop-shadow-lg"
              >
                <LottoBall number={number} size="lg" />
              </motion.div>
            ))}
          </div>
          <div>{previousResult?.bonusNumber}</div>
        </div>
      </Card>
    </section>
  );
};

export default PreviousResults;
