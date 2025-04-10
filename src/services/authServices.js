import router from '../config/router';
import api from './apiServices';

export async function login(email, password) {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { token, role } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    return response.data;
  }
  catch (error) {
    throw error.response ? error.response.data : error;
  }
}

export async function isAuthenticated() {
  return !!localStorage.getItem('token');
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  router.push({ name: 'home' });
}

export async function getCurrentUser() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found, user is not authenticated');
    }

    const response = await api.get('/auth/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
  catch (error) {
    throw error.response ? error.response.data : error;
  }
}
