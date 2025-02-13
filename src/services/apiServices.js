import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5084/api', // Replace with your ASP.NET Core API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include the token in headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

export default api;
