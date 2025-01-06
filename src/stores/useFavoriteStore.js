import { defineStore } from 'pinia';

export const useFavoriteStore = defineStore('favoriteStore', {
  state: () => ({
    favorites: [],
    isRemoved: false, // Tracks if an item has been removed
  }),
  getters: {
    isFavorite: state => (product) => {
      return state.favorites.some(fav => fav.id === product.id);
    },
  },
  actions: {
    toggleFavorite(product) {
      const index = this.favorites.findIndex(fav => fav.id === product.id);
      if (index !== -1) {
        this.favorites.splice(index, 1); // Remove from favorites
        this.isRemoved = true; // Mark as removed
      }
      else {
        this.favorites.push(product); // Add to favorites
        this.isRemoved = false; // Reset removal flag
      }
    },
    removeFavorite(product) {
      const initialLength = this.favorites.length;

      // Filter out the product
      this.favorites = this.favorites.filter(fav => fav.id !== product.id);

      // Update `isRemoved` only if the product was in the list
      this.isRemoved = this.favorites.length < initialLength;
    },
  },
});
