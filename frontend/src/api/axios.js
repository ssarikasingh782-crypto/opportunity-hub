import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Request Interceptor: Attach Bearer Token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format error payloads and handle 401 expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't loop redirect if we're already on login/register
      const currentPath = window.location.pathname;
      if (
        !currentPath.includes('/login') &&
        !currentPath.includes('/register')
      ) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login?expired=true';
      }
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.msg ||
      error.message ||
      'An unexpected error occurred';

    return Promise.reject({
      ...error,
      formattedMessage: message,
      errors: error.response?.data?.errors || [],
    });
  }
);

export default api;
