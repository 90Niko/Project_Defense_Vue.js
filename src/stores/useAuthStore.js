import axios from 'axios';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null,
    isLoggedIn: false,
  }),

  actions: {
    setLoggedIn(status, user) {
      this.isLoggedIn = status;
      this.user = user;
    },

    setToken(token) {
      this.token = token;
    },
    async initializeAuth() {
      const token = localStorage.getItem('token');
      if (token) {
        this.token = token;

        try {
          // Correct endpoint for token validation
          const response = await axios.get('http://localhost:5084/api/auth/user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Set user data and logged-in status
          this.isLoggedIn = true;
          this.user = response.data; // Replace with actual user data returned by the API
        }
        catch (error) {
          console.error('Token validation failed:', error);
          this.logout(); // Clear the state if validation fails
        }
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      this.isLoggedIn = false;
      localStorage.removeItem('token');
    },
  },
});
