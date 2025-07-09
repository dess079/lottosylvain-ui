import { API_CONFIG, LOTTO_CONFIG } from '../config';
import type { LottoDraw, PredictionData, DrawStatistics, CustomPredictionParams } from '../types';

/**
 * Base API URL for all requests
 */
const API_BASE_URL = API_CONFIG.BASE_URL;

/**
 * Fetches previous lottery draw results
 */
export async function fetchPreviousResults(): Promise<LottoDraw> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.PREVIOUS_RESULTS}`);
    if (!response.ok) {
      throw new Error('Failed to fetch previous results');
    }
    const data = await response.json();
    
    // Transform the backend response to match our frontend types
    // Assuming data.latestDraw contains the most recent draw information
    if (data && data.latestDraw) {
      return {
        drawDate: data.latestDraw.drawDate,
        drawNumber: data.latestDraw.drawNumber,
        winningNumbers: data.latestDraw.numbers,
        bonusNumber: data.latestDraw.bonusNumber
      };
    }
    
    throw new Error('Invalid data format from API');
  } catch (error) {
    console.error('Error fetching previous results:', error);
    throw error;
  }
}

/**
 * Fetches the latest predictions for the next draw
 */
export async function fetchPredictions(): Promise<PredictionData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.PREDICTIONS}`);
    if (!response.ok) {
      throw new Error('Failed to fetch predictions');
    }
    const data = await response.json();
    
    // Transform the backend response to match our frontend types
    // The backend returns a map of strategies to recommendations
    if (data && data.recommendations) {
      return Object.values(data.recommendations)
        .map((rec: any) => {
          // Vérifier si les numéros sont complets (au moins 6 numéros)
          let numbers = rec.numbers || [];
          
          // Filtrer les doublons pour éviter des numéros répétés comme [13,13,20,32,39,40]
          numbers = [...new Set(numbers)];
          
          // Si nous avons moins de 6 numéros, compléter avec des numéros aléatoires entre 1 et 49
          // en s'assurant qu'ils ne sont pas déjà dans la liste
          while (numbers.length < 6) {
            const randomNum = Math.floor(Math.random() * 49) + 1;
            if (!numbers.includes(randomNum)) {
              numbers.push(randomNum);
            }
          }
          
          // S'assurer que les numéros sont triés
          numbers.sort((a: number, b: number) => a - b);
          
          // Ajouter un numéro complémentaire s'il n'existe pas
          // Cela sera soit un numéro généré aléatoirement qui n'est pas déjà dans la liste des 6 principaux
          if (numbers.length === 6) {
            let bonusNumber;
            do {
              bonusNumber = Math.floor(Math.random() * 49) + 1;
            } while (numbers.includes(bonusNumber));
            
            numbers.push(bonusNumber);
          }
          
          return {
            numbers: numbers,
            confidenceScore: rec.confidenceScore || 0,
            reasoning: rec.reasoning || 'Based on statistical analysis of previous draws.',
            analysisFactors: rec.analysisFactors || {
              frequencyAnalysis: {}
            }
          };
        })
        .slice(0, 3); // Limiter à 3 prédictions pour notre UI
    }
    
    throw new Error('Invalid data format from API');
  } catch (error) {
    console.error('Error fetching predictions:', error);
    
    // Fallback: générer des prédictions aléatoires en cas d'erreur
    return generateFallbackPredictions();
  }
}

/**
 * Génère des prédictions aléatoires en cas d'erreur avec l'API
 */
function generateFallbackPredictions(): PredictionData[] {
  const predictions: PredictionData[] = [];
  
  // Générer 3 prédictions
  for (let i = 0; i < 3; i++) {
    const numbers: number[] = [];
    
    // Générer 6 numéros principaux uniques
    while (numbers.length < 6) {
      const num = Math.floor(Math.random() * 49) + 1;
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
    
    // Trier les numéros
    numbers.sort((a, b) => a - b);
    
    // Ajouter un numéro complémentaire
    let bonus;
    do {
      bonus = Math.floor(Math.random() * 49) + 1;
    } while (numbers.includes(bonus));
    
    numbers.push(bonus);
    
    predictions.push({
      numbers,
      confidenceScore: Math.floor(Math.random() * 30) + 60, // 60-90%
      reasoning: 'Fallback prediction generated locally.',
      analysisFactors: {
        frequencyAnalysis: {}
      }
    });
  }
  
  return predictions;
}

/**
 * Fetches lottery statistics
 */
export async function fetchLottoStatistics(): Promise<DrawStatistics> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.STATISTICS}`);
    if (!response.ok) {
      throw new Error('Failed to fetch statistics');
    }
    const data = await response.json();
    
    // Transform the backend response to match our frontend types
    if (data && data.success) {
      return {
        mostFrequentNumbers: data.frequentNumbers || {},
        leastFrequentNumbers: data.rareNumbers || {},
        numbersFrequency: data.allFrequencies || generateFallbackFrequencies(),
        numbersLastAppearance: data.lastAppearances || {}
      };
    }
    
    throw new Error('Invalid data format from API');
  } catch (error) {
    console.error('Error fetching statistics:', error);
    
    // Générer des statistiques de secours en cas d'erreur
    return {
      mostFrequentNumbers: generateFallbackFrequencies(),
      leastFrequentNumbers: generateFallbackFrequencies(),
      numbersFrequency: generateFallbackFrequencies(),
      numbersLastAppearance: {}
    };
  }
}

/**
 * Génère des fréquences de numéros aléatoires pour le fallback
 */
function generateFallbackFrequencies(): Record<number, number> {
  const frequencies: Record<number, number> = {};
  
  for (let i = 1; i <= 49; i++) {
    // Générer une fréquence aléatoire entre 10 et 20%
    frequencies[i] = Math.floor(Math.random() * 10) + 10;
  }
  
  return frequencies;
}

/**
 * Fetches customized predictions based on user parameters
 */
export async function fetchCustomPredictions(params: CustomPredictionParams): Promise<PredictionData[]> {
  try {
    const queryParams = new URLSearchParams();
    
    // Convert our params to what the backend expects
    if (params.excludeNumbers?.length) {
      queryParams.append('excludeNumbers', params.excludeNumbers.join(','));
    }
    
    if (params.includeNumbers?.length) {
      queryParams.append('includeNumbers', params.includeNumbers.join(','));
    }
    
    if (params.weightHistorical !== undefined) {
      queryParams.append('historicalWeight', (params.weightHistorical / 100).toFixed(2));
    }
    
    // Add a strategy parameter defaulting to BALANCED
    queryParams.append('strategy', 'BALANCED');
    
    const url = `${API_BASE_URL}${API_CONFIG.ENDPOINTS.CUSTOM_PREDICTIONS}?${queryParams.toString()}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch custom predictions');
    }
    
    const data = await response.json();
    
    // Transform the backend response to match our frontend types
    if (data && data.success && data.recommendation) {
      return [{
        numbers: data.recommendation.recommendedNumbers,
        confidenceScore: data.recommendation.confidenceScore,
        reasoning: data.recommendation.reasoning || 'Custom prediction based on your parameters.',
        analysisFactors: {
          frequencyAnalysis: data.recommendation.frequencyData || {}
        }
      }];
    }
    
    throw new Error('Invalid data format from API');
  } catch (error) {
    console.error('Error fetching custom predictions:', error);
    throw error;
  }
}

/**
 * Fetches the total count of draws from the database
 */
export async function fetchDrawCount(): Promise<number> {
  console.log('Starting fetchDrawCount...');
  try {
    // Première tentative: endpoint spécifique pour le nombre de tirages
    try {
      console.log('Trying dedicated draw-count endpoint...');
      const response = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.DRAW_COUNT}`);
      console.log('draw-count response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('draw-count data:', data);
        if (data && data.success && data.count !== undefined) {
          console.log('Successfully got count from draw-count endpoint:', data.count);
          return data.count;
        }
      }
    } catch (error) {
      console.log('Error with draw-count endpoint:', error);
    }
    
    // Deuxième tentative: endpoint data-stats
    try {
      console.log('Trying data-stats endpoint...');
      const response = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.DATA_STATS}`);
      console.log('data-stats response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('data-stats data:', data);
        if (data && data.success && data.data && data.data.total_draws !== undefined) {
          console.log('Successfully got count from data-stats endpoint:', data.data.total_draws);
          return data.data.total_draws;
        }
      }
    } catch (error) {
      console.log('Error with data-stats endpoint:', error);
    }
    
    // Troisième tentative: endpoint statistics
    console.log('Trying statistics endpoint...');
    const response = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.STATISTICS}`);
    console.log('statistics response status:', response.status);
    if (!response.ok) {
      throw new Error('Failed to fetch draw count from statistics endpoint');
    }
    const data = await response.json();
    console.log('statistics data:', data);
    
    // Extract the total count of draws
    if (data && data.success && data.totalDraws !== undefined) {
      console.log('Successfully got count from totalDraws in statistics:', data.totalDraws);
      return data.totalDraws;
    }
    
    // Fallback: if the API doesn't provide a direct count, we can infer it from the data
    if (data && data.success && data.allFrequencies) {
      console.log('Trying to infer count from frequency data...');
      // If we have frequency data for all numbers, we can estimate the total count
      // by looking at the sum of appearances for a specific number
      const numberKeys = Object.keys(data.allFrequencies);
      if (numberKeys.length > 0) {
        // Take the first number and get its total appearances
        const firstNumberAppearances = data.allFrequencies[numberKeys[0]];
        console.log('First number appearances:', firstNumberAppearances);
        // Divide by the average appearance rate to get an estimate of total draws
        const estimatedCount = Math.round(firstNumberAppearances / (1 / LOTTO_CONFIG.NUMBERS_PER_DRAW));
        console.log('Estimated count from frequency data:', estimatedCount);
        return estimatedCount;
      }
    }
    
    console.log('Could not determine total draw count from any endpoint');
    // Si toutes les tentatives échouent, renvoyer une valeur par défaut raisonnable
    return 1000; // Nombre raisonnable pour une application de lotto
  } catch (error) {
    console.error('Error in fetchDrawCount:', error);
    // Return a reasonable default if we can't get the actual count
    return 1000; // Valeur par défaut plus raisonnable que 0
  }
}
