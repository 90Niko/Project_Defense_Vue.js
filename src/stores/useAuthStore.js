import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false);
  const user = ref(null);

  const setLoggedIn = (status, userData = null) => {
    isLoggedIn.value = status;
    user.value = userData;
  };

  const logout = () => {
    isLoggedIn.value = false;
    user.value = null;
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure';
  };

  return {
    isLoggedIn,
    user,
    setLoggedIn,
    logout, // Ensure logout is returned
  };
});
