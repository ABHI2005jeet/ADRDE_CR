import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adrde-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Request failed';
    return Promise.reject(new Error(message));
  },
);

export async function checkApiHealth() {
  try {
    const { data } = await axios.get(`${BASE_URL}/health`, { timeout: 3000 });
    return data?.status === 'ok';
  } catch {
    return false;
  }
}

export function setAuthToken(token) {
  if (token) localStorage.setItem('adrde-token', token);
  else localStorage.removeItem('adrde-token');
}

export function getAuthToken() {
  return localStorage.getItem('adrde-token');
}
