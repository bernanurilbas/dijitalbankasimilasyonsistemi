import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('astra_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.';
    
    // Auto logout on 401 Unauthorized
    if (error.response?.status === 401 && localStorage.getItem('astra_token')) {
      localStorage.removeItem('astra_token');
      localStorage.removeItem('astra_user');
      window.location.href = '/login';
    }
    
    return Promise.reject(message);
  }
);

export default api;
