import axios from 'axios';

// Base URL da API backend
const API_BASE_URL = 'http://localhost:3000';

// Criar instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token nas requisições
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e refresh token
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 e não tentou refresh ainda
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          // Tentar refresh do token
          const response = await axios.post(`${API_BASE_URL}/refresh`, {
            refreshToken,
          });

          const { accessToken: newAccessToken } = response.data;

          // Atualizar token no localStorage
          localStorage.setItem('accessToken', newAccessToken);

          // Atualizar header da requisição original
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // Retry da requisição original
          return api(originalRequest);
        } catch (refreshError) {
          // Se o refresh falhar, limpar tokens e redirecionar para login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          // Do not force a navigation here to avoid unexpected reload loops during development.
          // Return the error so the UI can handle navigation or show a message.
          return Promise.reject(refreshError);
        }
      } else {
        // Se não tiver refresh token, redirecionar para login
        localStorage.removeItem('accessToken');
        // Do not force navigation here; let the UI decide what to do on unauthenticated requests.
      }
    }

    return Promise.reject(error);
  }
);

export default api;
