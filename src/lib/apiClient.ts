
import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = 
      error.response?.data?.message || 
      error.message || 
      'Something went wrong';
    
    toast.error(message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      toast.warning("Please login!");
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
