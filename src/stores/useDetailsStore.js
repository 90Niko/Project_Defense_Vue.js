// src/stores/useDetailsStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDetailsStore = defineStore('details', () => {
  // Reactive state for the current product
  const currentProduct = ref(null);

  // Method to set the current product
  const setProduct = (product) => {
    currentProduct.value = product;
  };

  // Method to clear the current product
  const clearProduct = () => {
    currentProduct.value = null;
  };

  return {
    currentProduct,
    setProduct,
    clearProduct,
  };
});
