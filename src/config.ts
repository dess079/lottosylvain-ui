/**
 * Application configuration settings
 */

/**
 * Environment detection
 */
const IS_DEVELOPMENT = import.meta.env.DEV;
const IS_CONTAINER = import.meta.env.VITE_ENVIRONMENT === 'container';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/';

/**
 * API configuration unifiée basée sur les variables d'environnement
 */
export const API_CONFIG = {
  BASE_URL: `${API_BASE_URL}api/essais`,
  ENDPOINTS: {
  PREVIOUS_RESULTS: '/lotto-matrix/previous-results',
    PREDICTIONS: '/lotto-matrix/recommendations',
    STATISTICS: '/lotto-matrix/stats',
    CUSTOM_PREDICTIONS: '/lotto-matrix/recommend',
    DRAW_COUNT: '/lotto-matrix/draw-count',
    DATA_STATS: '/lotto-matrix/data-stats',
    SPRING_AI_RECOMMENDATIONS: '/predictions/recommendations',
    SPRING_AI_STREAMING: '/predictions/stream',
    SPRING_AI_HEALTH: '/health'
  }
};

/**
 * Fonction utilitaire pour construire une URL complète d'API
 */
export function buildApiUrl(endpoint: string): string {
  const baseUrl = API_CONFIG.BASE_URL.replace(/\/$/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
}

/**
 * Configuration de débogage
 */
export const DEBUG_CONFIG = {
  ENABLED: IS_DEVELOPMENT,
  LOG_API_CALLS: IS_DEVELOPMENT,
  SHOW_ENV_INFO: IS_DEVELOPMENT
};

/**
 * Fonction utilitaire pour logger selon l'environnement
 */
export function debugLog(message: string, data?: any): void {
  if (DEBUG_CONFIG.ENABLED) {
    console.log(`[LOTTOSYLVAIN] ${message}`, data || '');
  }
}

/**
 * Fonction de diagnostic pour vérifier les variables d'environnement
 */
export function logEnvironmentInfo(): void {
  if (DEBUG_CONFIG.SHOW_ENV_INFO) {
    console.group('[LOTTOSYLVAIN] Environment Variables');
    console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
    console.log('VITE_ENVIRONMENT:', import.meta.env.VITE_ENVIRONMENT);
    console.log('DEV:', import.meta.env.DEV);
    console.log('API_BASE_URL:', API_BASE_URL);
    console.log('Final API_CONFIG.BASE_URL:', API_CONFIG.BASE_URL);
    console.groupEnd();
  }
}

/**
 * Application configuration
 */
export const APP_CONFIG = {
  APP_NAME: 'Lotto-Sylvain UI',
  VERSION: '1.0.0',
  MAX_SELECTED_NUMBERS: 6,
  MAX_PREDICTIONS: 3,
  REFRESH_INTERVAL: 0, // In milliseconds, 0 = no auto refresh
};

/**
 * Lotto game configuration
 */
export const LOTTO_CONFIG = {
  GAME_NAME: 'Lotto 6/49',
  MIN_NUMBER: 1,
  MAX_NUMBER: 49,
  NUMBERS_PER_DRAW: 6,
  HAS_BONUS_NUMBER: true,
  DRAW_DAYS: ['Wednesday', 'Saturday'] // Days of the week when draws occur
};
