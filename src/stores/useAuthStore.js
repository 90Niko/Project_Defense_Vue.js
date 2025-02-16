import axios from 'axios';
import { defineStore } from 'pinia';
import router from '../config/router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null,
    role: localStorage.getItem('userRole') || null,
    isLoggedIn: false,
    isLoading: true, // Flag to manage loading state while fetching user data
  }),

  actions: {
    setLoggedIn(status, user, role) {
      this.isLoggedIn = status;
      this.user = user;
      this.role = role;
      // Persist role in localStorage for consistency across reloads
      if (role)
        localStorage.setItem('userRole', role);
    },

    setToken(token) {
      this.token = token;
      localStorage.setItem('token', token);
    },

    async initializeAuth() {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('userRole');
      if (token && role) {
        this.token = token;
        this.role = role;
        try {
          const response = await axios.get('http://localhost:5084/api/auth/user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const user = response.data;
          // Set user data, role, and logged-in status
          this.setLoggedIn(true, user, role); // Update login status and user data
        }
        catch (error) {
          console.error('Token validation failed:', error);
          this.logout(); // If token validation fails, logout and redirect
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
      localStorage.removeItem('userRole');
      router.push({ name: 'home' }); // Redirect to the home page after logout
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
