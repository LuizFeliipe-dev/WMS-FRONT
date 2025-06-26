import { getAuthHeader } from '@/utils/auth';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
  },
  timeout: 10000,
});

export default api;
