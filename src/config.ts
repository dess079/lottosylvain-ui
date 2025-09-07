/**
 * Application configuration settings
 */

/**
 * API configuration
 */

// API config for Docker/Container
const API_CONFIG_CONTAINER = {
  BASE_URL: '/api/v3/lotto',
  ENDPOINTS: {
    PREVIOUS_RESULTS: '/lotto-matrix/previous-results',
    PREDICTIONS: '/lotto-matrix/recommendations',
    STATISTICS: '/lotto-matrix/stats',
    CUSTOM_PREDICTIONS: '/lotto-matrix/recommend',
    DRAW_COUNT: '/lotto-matrix/draw-count',
    DATA_STATS: '/lotto-matrix/data-stats',
    SPRING_AI_RECOMMENDATIONS: '/recommendations',
    SPRING_AI_STREAMING: '/predictions/stream',
    SPRING_AI_HEALTH: '/health'
  }
};

// API config for local dev
const API_CONFIG_LOCAL = {
  BASE_URL: 'http://localhost:5173/api/v3/lotto',
  ENDPOINTS: {
    PREVIOUS_RESULTS: '/lotto-matrix/previous-results',
    PREDICTIONS: '/lotto-matrix/recommendations',
    STATISTICS: '/lotto-matrix/stats',
    CUSTOM_PREDICTIONS: '/lotto-matrix/recommend',
    DRAW_COUNT: '/lotto-matrix/draw-count',
    DATA_STATS: '/lotto-matrix/data-stats',
    SPRING_AI_RECOMMENDATIONS: '/recommendations',
    SPRING_AI_STREAMING: '/predictions/stream',
    SPRING_AI_HEALTH: '/health'
  }
};

// Export config based on environment
export const API_CONFIG =
  import.meta.env.MODE === 'development'
    ? API_CONFIG_LOCAL
    : API_CONFIG_CONTAINER;

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
