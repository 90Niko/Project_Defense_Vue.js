import axios from 'axios';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null,
    role: null,
    isLoggedIn: false,
  }),

  actions: {
    setLoggedIn(status, user, role) {
      this.isLoggedIn = status;
      this.user = user;
      this.role = role;
    },

    setToken(token) {
      this.token = token;
      localStorage.setItem('token', token);
    },

    async initializeAuth() {
      const token = localStorage.getItem('token');
      if (token) {
        this.token = token;

        try {
          const response = await axios.get('http://localhost:5084/api/auth/user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const user = response.data;

          // Set user data, role, and logged-in status
          this.isLoggedIn = true;
          this.user = user;
          this.role = user.role || ''; // Ensure the API includes `role` in its response
        }
        catch (error) {
          console.error('Token validation failed:', error);
          this.logout();
        }
      }
      this.isLoading = false;
    },

    logout() {
      this.token = null;
      this.user = null;
      this.role = null;
      this.isLoggedIn = false;
      localStorage.removeItem('token');
    },
  },

  getters: {
    isAdmin() {
      return this.role === 'Admin';
    },

    isUser() {
      return this.role === 'User';
    },
  },
});
