import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchPreviousResults, fetchLottoStatistics } from '../services/api';
import { 
  Skeleton, 
  Card, 
  LottoBall 
} from './shadcn';
import { formatDate } from '../lib/utils';
import { LOTTO_CONFIG } from '../config';
import type { LottoDraw, DrawStatistics } from '../types';

/**
 * Component that displays previous lottery results and statistics
 */
const PreviousResults: React.FC = () => {
  const [previousResult, setPreviousResult] = useState<LottoDraw | null>(null);
  const [statistics, setStatistics] = useState<DrawStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Load data in parallel
        const [resultData, statsData] = await Promise.all([
          fetchPreviousResults(),
          fetchLottoStatistics()
        ]);
        
        setPreviousResult(resultData);
        setStatistics(statsData);
      } catch (err) {
        setError('Failed to load lottery data. Please try again later.');
        console.error('Error loading lottery data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const renderFrequencyHeatmap = () => {
    if (!statistics?.numbersFrequency) return null;
    
    const getColorClass = (frequency: number) => {
      // Normalize frequency to a 0-1 scale
      const maxFreq = Math.max(...Object.values(statistics.numbersFrequency));
      const minFreq = Math.min(...Object.values(statistics.numbersFrequency));
      const normalized = (frequency - minFreq) / (maxFreq - minFreq);
      
      if (normalized < 0.2) return 'bg-blue-100 text-blue-800';
      if (normalized < 0.4) return 'bg-blue-200 text-blue-800';
      if (normalized < 0.6) return 'bg-blue-300 text-blue-800';
      if (normalized < 0.8) return 'bg-blue-400 text-blue-900';
      return 'bg-blue-500 text-white';
    };
    
    const numbers = Array.from(
      { length: LOTTO_CONFIG.MAX_NUMBER - LOTTO_CONFIG.MIN_NUMBER + 1 }, 
      (_, i) => i + LOTTO_CONFIG.MIN_NUMBER
    );
    
    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-3">Fréquence des numéros</h3>
        <div className="grid grid-cols-7 gap-2">
          {numbers.map(num => {
            const frequency = statistics.numbersFrequency[num] || 0;
            return (
              <div 
                key={num}
                className={`p-2 rounded-md flex flex-col items-center ${getColorClass(frequency)}`}
              >
                <span className="font-bold">{num}</span>
                <span className="text-xs">{frequency}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

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

  if (!previousResult) {
    return <p className="text-center text-gray-500">Aucun résultat précédent disponible.</p>;
  }

  return (
    <section className="py-8">
      <Card className="max-w-4xl mx-auto p-6">
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-2">Dernier tirage {LOTTO_CONFIG.GAME_NAME}</h2>
          <p className="text-lg text-gray-600 mb-6">
            Date du tirage: <span className="font-semibold">{formatDate(previousResult.drawDate)}</span> - 
            Tirage #{previousResult.drawNumber}
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {previousResult.winningNumbers.map((number, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20,
                  delay: index * 0.1 
                }}
              >
                <LottoBall number={number} />
              </motion.div>
            ))}
            
            {previousResult.bonusNumber && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20,
                  delay: 0.7
                }}
              >
                <div className="flex items-center">
                  <span className="mr-2 text-gray-500">+</span>
                  <LottoBall number={previousResult.bonusNumber} isBonus={true} />
                </div>
              </motion.div>
            )}
          </div>
          
          <button
            className="text-primary-600 flex items-center gap-1 hover:underline"
            onClick={() => setShowStats(!showStats)}
          >
            <span>{showStats ? 'Masquer les statistiques' : 'Afficher les statistiques'}</span>
            <svg 
              className={`w-4 h-4 transition-transform ${showStats ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showStats && statistics && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full mt-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Numéros les plus fréquents</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(statistics.mostFrequentNumbers)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 6)
                      .map(([number, frequency]) => (
                        <div key={number} className="flex flex-col items-center">
                          <LottoBall number={parseInt(number)} className="mb-1" />
                          <span className="text-xs text-gray-600">{frequency} fois</span>
                        </div>
                      ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Numéros les moins fréquents</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(statistics.leastFrequentNumbers)
                      .sort((a, b) => a[1] - b[1])
                      .slice(0, 6)
                      .map(([number, frequency]) => (
                        <div key={number} className="flex flex-col items-center">
                          <LottoBall number={parseInt(number)} className="mb-1" />
                          <span className="text-xs text-gray-600">{frequency} fois</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              
              {renderFrequencyHeatmap()}
            </motion.div>
          )}
        </div>
      </Card>
    </section>
  );
};

export default PreviousResults;
