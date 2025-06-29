import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig.js';

const httpClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

export default httpClient;