/**
 * Application configuration settings
 */

/**
 * API configuration
 */
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8090/api/essais',
  ENDPOINTS: {
    PREVIOUS_RESULTS: '/lotto-matrix/complete-analysis',
    PREDICTIONS: '/lotto-matrix/recommendations',
    STATISTICS: '/lotto-matrix/stats',
    CUSTOM_PREDICTIONS: '/lotto-matrix/recommend',
    DRAW_COUNT: '/lotto-matrix/draw-count', // Endpoint spécifique pour le nombre de tirages
    DATA_STATS: '/lotto-matrix/data-stats' // Endpoint pour les statistiques de données
  }
};

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
