import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useCartStore = defineStore('cart', () => {
  // Reactive array to store cart items
  const cartItems = ref([]);

  /**
   * Add a product to the cart.
   * If the product already exists (by id), it will not be added again.
   * @param {object} product - The product object to add.
   */
  const addProduct = (product) => {
    // Check if the product already exists in the cart by comparing IDs
    const exists = cartItems.value.find(item => item.id === product.id);
    if (!exists) {
      cartItems.value.push(product);
    }
  };

  /**
   * Remove a product from the cart.
   * @param {object} product - The product object to remove.
   */
  const removeProduct = (product) => {
    cartItems.value = cartItems.value.filter(item => item.id !== product.id);
  };

  /**
   * Clear all items from the cart.
   */
  const clearCart = () => {
    cartItems.value = [];
  };

  /**
   * Computed property to get the total number of items in the cart.
   */
  const totalItems = computed(() => cartItems.value.length);

  return {
    cartItems,
    addProduct,
    removeProduct,
    clearCart,
    totalItems,
  };
});
