import { API_CONFIG } from '../config';
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
      return Object.values(data.recommendations).map((rec: any) => ({
        numbers: rec.numbers,
        confidenceScore: rec.confidence,
        reasoning: rec.reasoning || 'Based on statistical analysis of previous draws.',
        analysisFactors: rec.analysisFactors || {
          frequencyAnalysis: rec.frequencyData
        }
      }));
    }
    
    throw new Error('Invalid data format from API');
  } catch (error) {
    console.error('Error fetching predictions:', error);
    throw error;
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
        mostFrequentNumbers: data.frequentNumbers || {},
        leastFrequentNumbers: data.rareNumbers || {},
        numbersFrequency: data.allFrequencies || {},
        numbersLastAppearance: data.lastAppearances || {}
      };
    }
    
    throw new Error('Invalid data format from API');
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
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
