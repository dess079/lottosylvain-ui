import { API_CONFIG } from '../config';
import type { CustomPredictionParams, DrawStatistics, PredictionData, PreviousResult } from '../types';

/**
 * Base API URL for all requests
 */
const API_BASE_URL = API_CONFIG.BASE_URL;

/**
 * Fetches previous lottery draw results
 */
export async function fetchPreviousResults(): Promise<PreviousResult> {
  try {
    console.info(
      'fetchPreviousResults: URL utilisée',
      `${API_BASE_URL}${API_CONFIG.ENDPOINTS.PREVIOUS_RESULTS}`
    );

    const response = await fetch(
      `${API_BASE_URL}${API_CONFIG.ENDPOINTS.PREVIOUS_RESULTS}`
    );
    if (!response.ok) {
      console.error(
        `fetchPreviousResults: Failed with status ${response.status} - ${response.statusText}`
      );
      throw new Error(
        `Failed to fetch previous results. Status: ${response.status} - ${response.statusText}`
      );
    }

    console.info('fetchPreviousResults: Response received, parsing JSON', response);
    const rawData = await response.json();

    // Transform the API response to match the expected type
    const data: PreviousResult = {
      previousResultDate: rawData.previousResultDate, // Map to expected field
      drawResult: rawData.resultNumbers, // Map to expected field
      bonusNumber: rawData.bonusNumber,
    };

    // Validate the transformed data
    if (
      !data ||
      typeof data.previousResultDate !== 'string' ||
      !Array.isArray(data.drawResult) ||
      typeof data.bonusNumber !== 'number'
    ) {
      console.error('fetchPreviousResults: Invalid data format after transformation', data);
      throw new Error('Invalid data format from API');
    }

    console.info('fetchPreviousResults: Valid data received after transformation', data);
    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      console.error('fetchPreviousResults: Network error or server unreachable:', error);
    } else {
      console.error('fetchPreviousResults: Error fetching previous results:', error);
    }
    throw new Error(
      "Le service de résultats précédents n'est pas disponible actuellement. Veuillez vérifier votre connexion ou contacter le support."
    );
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
          // Vérifier que les numéros existent
          if (!rec.numbers) {
            throw new Error('Données de prédiction incomplètes: numéros manquants');
          }
          
          let numbers = [...rec.numbers];
          
          // Filtrer les doublons pour éviter des numéros répétés
          numbers = [...new Set(numbers)];
          
          // S'assurer que les numéros sont triés
          numbers.sort((a: number, b: number) => a - b);
          
          if (!rec.confidenceScore) {
            throw new Error('Données de prédiction incomplètes: score de confiance manquant');
          }
          
          return {
            numbers: numbers,
            confidenceScore: rec.confidenceScore,
            reasoning: rec.reasoning || 'Aucune explication fournie',
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
    throw new Error('Le service de prédictions n\'est pas disponible actuellement');
  }
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
        mostFrequentNumbers: data.frequentNumbers,
        leastFrequentNumbers: data.rareNumbers,
        numbersFrequency: data.allFrequencies,
        numbersLastAppearance: data.lastAppearances
      };
    }
    
    throw new Error('Invalid data format from API');
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw new Error('Le service de statistiques n\'est pas disponible actuellement');
  }
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
        reasoning: data.recommendation.reasoning || 'Aucune explication fournie pour cette prédiction personnalisée.',
        analysisFactors: {
          frequencyAnalysis: data.recommendation.frequencyData || {}
        }
      }];
    }
    
    throw new Error('Invalid data format from API');
  } catch (error) {
    console.error('Error fetching custom predictions:', error);
    throw new Error('Le service de prédictions personnalisées n\'est pas disponible actuellement');
  }
}

/**
 * Fetches the total count of draws from the database
 */
export async function fetchDrawCount(): Promise<number> {
  try {
    // Première tentative: endpoint spécifique pour le nombre de tirages
    const response = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.DRAW_COUNT}`);
    if (!response.ok) {
      throw new Error('Failed to fetch draw count');
    }
    
    const data = await response.json();
    
    // Extract the total count of draws
    if (data && data.success && data.count !== undefined) {
      return data.count;
    }
    
    throw new Error('Invalid data format from API');
  } catch (error) {
    console.error('Error in fetchDrawCount:', error);
    throw new Error('Le service de comptage des tirages n\'est pas disponible actuellement');
  }
}

/**
 * Récupère la recommandation basée sur l'IA depuis le backend
 */
export const fetchAIRecommendation = async (): Promise<PredictionData> => {
  const response = await fetch('/api/recommendations/ai');
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération de la recommandation IA');
  }
  return response.json();
};
