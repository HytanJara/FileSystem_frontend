// API Configuration
const API_BASE_URL = 'http://localhost:8080';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    LOGIN: '/usuarios/login',
    REGISTER: '/usuarios',
    // Add more endpoints as needed
  }
};

export function getApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}
