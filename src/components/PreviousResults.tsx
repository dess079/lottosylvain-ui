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
      
      if (normalized < 0.2) return 'bg-blue-200 text-blue-800 border-blue-300';
      if (normalized < 0.4) return 'bg-blue-300 text-blue-800 border-blue-400';
      if (normalized < 0.6) return 'bg-blue-400 text-blue-900 border-blue-500';
      if (normalized < 0.8) return 'bg-blue-500 text-white border-blue-600';
      return 'bg-blue-600 text-white border-blue-700';
    };
    
    const numbers = Array.from(
      { length: LOTTO_CONFIG.MAX_NUMBER - LOTTO_CONFIG.MIN_NUMBER + 1 }, 
      (_, i) => i + LOTTO_CONFIG.MIN_NUMBER
    );
    
    return (              <div className="mt-8 bg-white dark:bg-gray-800 p-8 rounded-xl 
        shadow-[0_15px_35px_-15px_rgba(0,0,0,0.3)] 
        hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] 
        transition-all duration-300 
        border border-gray-100 dark:border-gray-700
        relative before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/20 before:to-white/5 before:content-['']
        dark:before:from-gray-800/20 dark:before:to-gray-900/10"
      >              <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-200">Fréquence des numéros</h3>              <div className="grid grid-cols-7 md:grid-cols-10 gap-4">
          {numbers.map(num => {
            const frequency = statistics.numbersFrequency[num] || 0;
            return (
              <div 
                key={num}
                className={`p-3 rounded-lg flex flex-col items-center ${getColorClass(frequency)} border shadow-md transition-transform hover:scale-110 hover:shadow-lg`}
              >
                <span className="font-bold text-lg">{num}</span>
                <span className="text-xs font-medium mt-1">{frequency}</span>
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
      <Card className="max-w-4xl mx-auto p-8 card-shimmer shadow-lg">
        <div className="flex flex-col items-center">
          <h2 className="text-4xl font-bold mb-3 text-center gradient-text">Dernier tirage {LOTTO_CONFIG.GAME_NAME}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Date du tirage: <span className="font-semibold">{formatDate(previousResult.drawDate)}</span> - 
            Tirage <span className="font-bold bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 px-2 py-1 rounded-md">#{previousResult.drawNumber}</span>
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {previousResult.winningNumbers.map((number, index) => (
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
            
            {previousResult.bonusNumber && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20,
                  delay: previousResult.winningNumbers.length * 0.15
                }}
                className="filter drop-shadow-lg"
              >
                <div className="flex items-center">
                  <span className="mr-3 text-2xl font-bold text-gray-500 dark:text-gray-400">+</span>
                  <LottoBall number={previousResult.bonusNumber} isBonus={true} size="lg" />
                </div>
              </motion.div>
            )}
          </div>
          
          <button
            className="mt-4 py-3 px-6 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-medium rounded-full flex items-center gap-2 hover:bg-primary-200 dark:hover:bg-primary-900/30 transition-colors shadow-sm"
            onClick={() => setShowStats(!showStats)}
          >
            <span>{showStats ? 'Masquer les statistiques' : 'Afficher les statistiques détaillées'}</span>
            <svg 
              className={`w-5 h-5 transition-transform duration-300 ${showStats ? 'rotate-180' : ''}`} 
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
              className="w-full mt-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl 
                  shadow-[0_15px_35px_-15px_rgba(0,0,0,0.3)] 
                  hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] 
                  transition-all duration-300 
                  hover:translate-y-[-8px] 
                  border border-gray-100 dark:border-gray-700
                  relative before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/20 before:to-white/5 before:content-['']
                  dark:before:from-gray-800/20 dark:before:to-gray-900/10"
                >
                  <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-200">Numéros les plus fréquents</h3>
                  <div className="flex flex-wrap gap-4 justify-center">
                    {Object.entries(statistics.mostFrequentNumbers)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 6)
                      .map(([number, frequency], index) => (
                        <motion.div 
                          key={number} 
                          className="flex flex-col items-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1, type: "spring" }}
                        >
                          <LottoBall number={parseInt(number)} className="mb-2 shadow-lg" />
                          <span className="text-sm font-medium px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full shadow-sm">
                            {frequency} fois
                          </span>
                        </motion.div>
                      ))}
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl 
                  shadow-[0_15px_35px_-15px_rgba(0,0,0,0.3)] 
                  hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] 
                  transition-all duration-300 
                  hover:translate-y-[-8px] 
                  border border-gray-100 dark:border-gray-700
                  relative before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/20 before:to-white/5 before:content-['']
                  dark:before:from-gray-800/20 dark:before:to-gray-900/10"
                >
                  <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-200">Numéros les moins fréquents</h3>
                  <div className="flex flex-wrap gap-4 justify-center">
                    {Object.entries(statistics.leastFrequentNumbers)
                      .sort((a, b) => a[1] - b[1])
                      .slice(0, 6)
                      .map(([number, frequency], index) => (
                        <motion.div 
                          key={number} 
                          className="flex flex-col items-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1, type: "spring" }}
                        >
                          <LottoBall number={parseInt(number)} className="mb-2 shadow-lg" />
                          <span className="text-sm font-medium px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full shadow-sm">
                            {frequency} fois
                          </span>
                        </motion.div>
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
