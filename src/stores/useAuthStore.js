import router from '@/config/router';
import axios from 'axios';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    role: localStorage.getItem('userRole') || null,
    isLoggedIn: !!localStorage.getItem('token'),
    isLoading: true, // Ensures we only update UI after auth is initialized
  }),

  actions: {
    setLoggedIn(status, user, role) {
      this.isLoggedIn = status;
      this.user = user;
      this.role = role;

      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      if (role) {
        localStorage.setItem('userRole', role);
      }
    },

    setToken(token) {
      this.token = token;
      localStorage.setItem('token', token);

      // Set default Authorization header for Axios
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    },

    async initializeAuth() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.logout(); // Ensure complete logout if no token is found
        return;
      }

      this.setToken(token); // Set axios auth header

      try {
        const response = await axios.get('http://localhost:5084/api/auth/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = response.data;

        // Update user and role in store after successful API response
        this.setLoggedIn(true, user, user.role);
      }
      catch (error) {
        console.error('Token validation failed:', error);
        this.logout();
      }

      this.isLoading = false; // Mark loading complete
    },

    logout() {
      this.token = null;
      this.user = null;
      this.role = null;
      this.isLoggedIn = false;

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');

      delete axios.defaults.headers.common.Authorization; // Remove token from Axios

      router.push({ name: 'home' }); // Redirect after logout
    },
  },

  getters: {
    isAdmin: state => state.role === 'Admin',
    isUser: state => state.role === 'User',
  },
});
