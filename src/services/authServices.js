import api from './apiServices';

export async function login(email, password) {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { token, role } = response.data;

    // Store the token in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    return response.data;
  }
  catch (error) {
    throw error.response ? error.response.data : error;
  }
}

export async function isAuthenticated() {
  return !!localStorage.getItem('token'); // Check if token exists
}
export function logout() {
  localStorage.removeItem('token');
}

export async function getCurrentUser() {
  try {
    const response = await api.get('/auth/user'); // Create an endpoint in your API to return current user info
    return response.data;
  }
  catch (error) {
    throw error.response ? error.response.data : error;
  }
}
