// stores/favorite.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFavoriteStore = defineStore('favorite', () => {
  const favorites = ref(new Set());

  // Add a product to favorites
  const addFavorite = (product) => {
    favorites.value.add(product.id);
  };

  // Remove a product from favorites
  const removeFavorite = (product) => {
    favorites.value.delete(product.id);
  };

  // Toggle favorite status
  const toggleFavorite = (product) => {
    if (favorites.value.has(product.id)) {
      removeFavorite(product);
    }
    else {
      addFavorite(product);
    }
  };

  // Check if a product is in favorites
  const isFavorite = product => favorites.value.has(product.id);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };
});
