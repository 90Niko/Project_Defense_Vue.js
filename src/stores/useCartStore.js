import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useCartStore = defineStore('cart', () => {
  // Reactive array to store cart items
  const cartItems = ref([]);

  /**
   * Add a product to the cart.
   * When a product is added, its quantity is set to 1.
   * If the product already exists (by id), its quantity is reset to 1.
   * @param {object} product - The product object to add.
   */
  const addProduct = (product) => {
    // Check if the product already exists in the cart by comparing IDs
    const exists = cartItems.value.find(item => item.id === product.id);
    if (exists) {
      // Reset the quantity to 1 if the product already exists
      exists.quantity = 1;
    }
    else {
      // Add a new product with quantity set to 1
      cartItems.value.push({ ...product, quantity: 1 });
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
   * This sums the quantity of each product.
   */
  const totalItems = computed(() =>
    cartItems.value.reduce((acc, item) => acc + item.quantity, 0),
  );

  return {
    cartItems,
    addProduct,
    removeProduct,
    clearCart,
    totalItems,
  };
});
