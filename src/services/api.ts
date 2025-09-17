import { API_CONFIG } from '../config';
import type { CustomPredictionParams, PredictionData, PreviousResult, AIResponse } from '../types';
import type { LottoAIResponse } from '@/types/LottoAIResponse';


/**
 * Base API URL for all requests
 */
const API_BASE_URL = API_CONFIG.BASE_URL;

/**
 * Configuration pour choisir quelle version de l'API utiliser
 */
export const API_VERSION_CONFIG = {
  USE_SPRING_AI_V3: true, // Basculer vers Spring AI v3 par défaut
  FALLBACK_TO_V2: true,   // Fallback vers v2 en cas d'erreur
  ENABLE_STREAMING: true, // Activer le streaming Spring AI
  ENABLE_HEALTH_CHECK: true // Activer les vérifications de santé
};


/**
 * Fetches previous lottery draw results
 */
/**
 * Récupère les résultats précédents du tirage, avec gestion de plage de dates
 * @param startDate Date de début (format 'YYYY-MM-DD')
 * @param endDate Date de fin (format 'YYYY-MM-DD')
 * @returns PreviousResult
 */
export async function fetchPreviousResults(startDate?: string, endDate?: string): Promise<PreviousResult> {
  try {
    // Construction de l'URL avec paramètres de dates si fournis
    let url = `${API_BASE_URL}${API_CONFIG.ENDPOINTS.PREVIOUS_RESULTS}`;
    const params: string[] = [];
    if (startDate) params.push(`start=${encodeURIComponent(startDate)}`);
    if (endDate) params.push(`end=${encodeURIComponent(endDate)}`);
    if (params.length > 0) url += `?${params.join('&')}`;

    console.info('fetchPreviousResults: URL utilisée', url);

    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Aucun tirage trouvé pour la période sélectionnée.");
      }
      console.error(`fetchPreviousResults: Failed with status ${response.status} - ${response.statusText}`);
      throw new Error(`Failed to fetch previous results. Status: ${response.status} - ${response.statusText}`);
    }

    console.info('fetchPreviousResults: Response received, parsing JSON', response);
    const rawData: PreviousResult = await response.json();

    console.info('fetchPreviousResults: Valid data received after transformation', rawData);
    return rawData;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Aucun tirage trouvé')) {
        throw error;
      }
      if (error instanceof TypeError) {
        console.error('fetchPreviousResults: Network error or server unreachable:', error);
      } else {
        console.error('fetchPreviousResults: Error fetching previous results:', error);
      }
    }
    throw new Error("Le service de résultats précédents n'est pas disponible actuellement.");
  }
}

/**
 * Fetches the latest predictions for the next draw using Spring AI v3 with fallback
 */
export async function fetchPredictions(): Promise<LottoAIResponse> {
  // Fonction pour Spring AI v3
  const fetchSpringAI = async (): Promise<LottoAIResponse> => {
    const response = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.SPRING_AI_RECOMMENDATIONS}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Spring AI predictions: ${response.status} - ${response.statusText}`);
    }
    const data: LottoAIResponse = await response.json();
    console.info('fetchPredictions (Spring AI v3): Response received', data);
    if (data && data.lottoPrediction) {
      return data;
    }
    throw new Error('Invalid data format from Spring AI API: lottoPrediction manquant');
  };

  // Utiliser Spring AI v3 uniquement (plus de fallback legacy)
  return fetchSpringAI();
}

/**
 * Fetches detailed number statistics from PostgreSQL
 */
export async function fetchDetailedNumberStatistics(): Promise<Map<number, any>> {
  try {
    // Utiliser la configuration API pour construire l'URL correcte selon l'environnement
    const url = `${API_CONFIG.BASE_URL}/lotto-matrix/stats`;
    console.log('[fetchDetailedNumberStatistics] Calling URL:', url);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch detailed statistics: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();

    // Convertir les données en Map pour un accès plus facile
    const statsMap = new Map<number, any>();
    
    // La structure retournée par le backend existant: {success: true, data: {}, count: X}
    if (data.success && data.data) {
      Object.entries(data.data).forEach(([key, value]) => {
        const numberKey = parseInt(key);
        // La valeur contient déjà toutes les statistiques pour ce numéro
        statsMap.set(numberKey, value);
      });
      console.log('[fetchDetailedNumberStatistics] Successfully mapped', statsMap.size, 'numbers');
    } else {
      console.warn('[fetchDetailedNumberStatistics] No success or data found in response:', data);
    }

    return statsMap;
  } catch (error) {
    console.error('Error fetching detailed statistics:', error);
    throw new Error('Les statistiques détaillées ne sont pas disponibles');
  }
}

/**
 * Fetches customized predictions based on user parameters using Spring AI v3
 */
export async function fetchCustomPredictions(params: CustomPredictionParams): Promise<PredictionData[]> {
  try {
    // Essayer d'abord avec l'ancien endpoint pour la compatibilité
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
    queryParams.append('strategy', 'SPRING_AI_CUSTOM');
    
    const url = `${API_BASE_URL}${API_CONFIG.ENDPOINTS.CUSTOM_PREDICTIONS}?${queryParams.toString()}`;
    console.log('fetchCustomPredictions: Trying Spring AI custom predictions with URL', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Spring AI custom predictions: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform the Spring AI response to match our frontend types
    if (data && data.success && data.recommendation) {
      return [{
        numbers: data.recommendation.recommendedNumbers || data.recommendation.numbers,
        confidenceScore: data.recommendation.confidenceScore || data.recommendation.confidence || 0.5,
        reasoning: data.recommendation.reasoning || data.recommendation.justification || 'Prédiction personnalisée générée par Spring AI avec filtres utilisateur.',
        analysisFactors: {
          frequencyAnalysis: data.recommendation.frequencyData || {}
        }
      }];
    }
    
    // Si la structure est celle de FrontendRecommendation directement
    if (data && data.numbers) {
      return [{
        numbers: data.numbers,
        confidenceScore: data.confidence || 0.5,
        reasoning: data.justification || 'Prédiction personnalisée générée par Spring AI.',
        analysisFactors: {
          frequencyAnalysis: {}
        }
      }];
    }
    
    throw new Error('Invalid data format from Spring AI custom predictions API');
  } catch (error) {
    console.error('Error fetching Spring AI custom predictions:', error);
    throw new Error('Le service de prédictions personnalisées Spring AI n\'est pas disponible actuellement');
  }
}

/**
 * Fetches the total count of draws from the database
 */
export async function fetchDrawCount(): Promise<number> {
  try {
    // Utiliser la configuration API pour construire l'URL correcte selon l'environnement
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DRAW_COUNT}`;
    console.log('[fetchDrawCount] Calling URL:', url);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch draw count: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[fetchDrawCount] Réponse brute API:', data);

    // Accepte { count: number }, { success: boolean, count: number } ou { totalDraws: number }
    if (data && typeof data.count === 'number') {
      return data.count;
    }
    if (data && typeof data.totalDraws === 'number') {
      return data.totalDraws;
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
/**
 * Récupère la recommandation IA principale depuis le backend Spring AI v3
 * Retourne la réponse complète FrontendRecommendationsResponse
 */
export const fetchAIRecommendation = async (): Promise<LottoAIResponse> => {
  const url = `${API_BASE_URL}${API_CONFIG.ENDPOINTS.SPRING_AI_RECOMMENDATIONS}`;
  console.log('fetchAIRecommendation (Spring AI v3): Fetching from URL', url);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération de la recommandation Spring AI: ${response.status} - ${response.statusText}`);
  }

  const raw: LottoAIResponse = await response.json();
  console.log('fetchAIRecommendation (Spring AI v3): Data received', raw);
  return raw;
};

/**
 * Appelle le backend pour obtenir la prédiction IA Lotto649 via Spring AI v3
 * @param targetDate Date cible optionnelle (format YYYY-MM-DD)
 * @returns Les données retournées par Spring AI
 */
export async function fetchSpringAIPrediction(targetDate?: string): Promise<LottoAIResponse> {
  let url = `${API_BASE_URL}${API_CONFIG.ENDPOINTS.SPRING_AI_RECOMMENDATIONS}`;
  if (targetDate) {
    url += `?targetDate=${encodeURIComponent(targetDate)}`;
  }
  console.log('fetchSpringAIPrediction: Calling URL', url);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération de la prédiction Spring AI: ${response.status} - ${response.statusText}`);
  }
  const data: LottoAIResponse = await response.json();
  console.log('fetchSpringAIPrediction: Data received', data);
  return data;
}

/**
 * Supprime une prédiction côté backend (endpoint supposé RESTful DELETE /recommendations/{id})
 * @param id Identifiant de la prédiction
 */
export async function deletePrediction(id: number): Promise<void> {
  try {
    const url = `${API_BASE_URL}${API_CONFIG.ENDPOINTS.SPRING_AI_RECOMMENDATIONS}/${id}`;
    const response = await fetch(url, { method: 'DELETE' });
    if (!response.ok) {
      throw new Error(`Echec suppression prédiction ${id}: ${response.status}`);
    }
  } catch (error) {
    console.error('deletePrediction: erreur', error);
    throw new Error("La suppression de la prédiction a échoué.");
  }
}


/**
 * Vérifie le statut de santé du service Spring AI
 * @returns Statut de santé (string)
 */
export async function fetchSpringAIHealth(): Promise<string> {
  const url = `${API_BASE_URL}${API_CONFIG.ENDPOINTS.SPRING_AI_HEALTH}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Spring AI Service Unavailable: ${response.status}`);
  }
  
  return await response.text();
}

/**
 * Crée un EventSource pour recevoir les prédictions en streaming
 * @param targetDate Date cible optionnelle
 * @param onMessage Callback appelé pour chaque chunk reçu
 * @param onError Callback appelé en cas d'erreur
 * @returns EventSource pour gérer la connexion
 */
export function createSpringAIStreamingPrediction(
  targetDate?: string,
  onMessage?: (chunk: string) => void,
  onError?: (error: Event) => void
): EventSource {
  let url = `${API_BASE_URL}${API_CONFIG.ENDPOINTS.SPRING_AI_STREAMING}`;
  
  if (targetDate) {
    url += `?targetDate=${encodeURIComponent(targetDate)}`;
  }
  
  console.log('createSpringAIStreamingPrediction: Creating EventSource for', url);
  
  const eventSource = new EventSource(url);
  
  if (onMessage) {
    eventSource.onmessage = (event) => {
      onMessage(event.data);
    };
  }
  
  if (onError) {
    eventSource.onerror = onError;
  }
  
  return eventSource;
}

/**
 * Appelle le backend pour obtenir la prédiction IA Lotto649 (legacy)
 * @deprecated Utiliser fetchSpringAIPrediction à la place
 * @returns Les données retournées par l'IA (AIResponse)
 */
export async function fetchAIPrediction(): Promise<AIResponse> {
  const url = `${API_BASE_URL}/ai/lotto649/predict`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Erreur lors de la récupération de la prédiction IA');
  /**
   * On suppose que la réponse respecte l'interface AIResponse
   */
  return await response.json();
}

/**
 * Teste la connectivité et la disponibilité de Spring AI v3
 * @returns Objet avec le statut et les informations de santé
 */
export async function testSpringAIConnectivity(): Promise<{
  isAvailable: boolean;
  healthStatus: string;
  version: string;
  error?: string;
}> {
  try {
    if (!API_VERSION_CONFIG.ENABLE_HEALTH_CHECK) {
      return {
        isAvailable: false,
        healthStatus: 'Health check disabled',
        version: 'unknown',
        error: 'Health check disabled in configuration'
      };
    }

    const healthStatus = await fetchSpringAIHealth();
    
    return {
      isAvailable: true,
      healthStatus: healthStatus,
      version: 'Spring AI v3.0',
      error: undefined
    };
  } catch (error) {
    console.warn('Spring AI connectivity test failed:', error);
    
    return {
      isAvailable: false,
      healthStatus: 'Service Unavailable',
      version: 'unknown',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Fonction utilitaire pour basculer automatiquement vers Spring AI v3 si disponible
 */
export async function initializeAPIVersion(): Promise<void> {
  try {
    const connectivity = await testSpringAIConnectivity();
    
    if (connectivity.isAvailable) {
      console.info('Spring AI v3 is available, using Spring AI endpoints');
      API_VERSION_CONFIG.USE_SPRING_AI_V3 = true;
    } else {
      console.warn('Spring AI v3 not available, falling back to legacy API', connectivity.error);
      API_VERSION_CONFIG.USE_SPRING_AI_V3 = false;
    }
  } catch (error) {
    console.error('Failed to initialize API version:', error);
    API_VERSION_CONFIG.USE_SPRING_AI_V3 = false;
  }
}
