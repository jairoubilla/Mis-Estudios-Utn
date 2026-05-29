import axios from 'axios';
import { clearToken, getToken, notifyAuthExpired } from './auth';

const apiClient = axios.create();
const AUTH_ERROR_STATUSES = new Set([401]);

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = getToken();
    const status = error.response?.status;

    if (token && AUTH_ERROR_STATUSES.has(status)) {
      clearToken();
      notifyAuthExpired();
    }

    return Promise.reject(error);
  }
);

export default apiClient;
