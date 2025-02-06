<script setup>
import { useCartStore } from '@/stores/useCartStore';
import { computed } from 'vue';

// Initialize the cart store
const cartStore = useCartStore();

// Computed properties to track cart items, total items, and total price.
const cartItems = computed(() => cartStore.cartItems);
const totalItems = computed(() => cartStore.totalItems);
const totalPrice = computed(() =>
  cartStore.cartItems.reduce((acc, item) => acc + item.price, 0),
);

function getImageUrl(imagePath) {
  if (!imagePath)
    return '/default-product.png'; // ✅ Fallback image

  // ✅ Ensure full image URL
  return imagePath.startsWith('http') ? imagePath : `http://localhost:5084/${imagePath}`;
}

// Methods to remove a product from the cart or clear the entire cart.
function removeProduct(product) {
  cartStore.removeProduct(product);
}

function clearCart() {
  cartStore.clearCart();
}
</script>

<template>
  <div class="cart">
    <h1>Shopping Cart</h1>

    <!-- When the cart is empty -->
    <div v-if="cartItems.length === 0" class="empty-cart">
      <p>Your cart is empty.</p>
    </div>

    <!-- Display cart items if available -->
    <div v-else>
      <ul class="cart-list">
        <li v-for="item in cartItems" :key="item.id" class="cart-item">
          <div class="item-image">
            <!-- Use a fallback image if imagePath is not provided -->
            <img :src="getImageUrl(item.imagePath)" :alt="item.name" class="product-image">
          </div>
          <div class="item-details">
            <h3>{{ item.name }}</h3>
            <p>$ {{ item.price }}</p>
            <button class="remove-btn" @click="removeProduct(item)">
              Remove
            </button>
          </div>
        </li>
      </ul>

      <!-- Cart summary -->
      <div class="cart-summary">
        <p><strong>Total Items:</strong> {{ totalItems }}</p>
        <p><strong>Total Price:</strong> ${{ totalPrice.toFixed(2) }}</p>
        <div class="actions">
          <button class="clear-btn" @click="clearCart">
            Clear Cart
          </button>
          <button class="checkout-btn">
            Checkout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.cart h1 {
  text-align: center;
  margin-bottom: 20px;
}

.empty-cart {
  text-align: center;
  font-size: 1.2rem;
  color: #555;
}

.cart-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.cart-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding: 15px 0;
}

.item-image img {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-right: 20px;
}

.item-details {
  flex-grow: 1;
}

.item-details h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
}

.item-details p {
  margin: 5px 0;
  font-size: 1rem;
  color: #007bff;
}

.remove-btn {
  background-color: #dc3545;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.remove-btn:hover {
  background-color: #c82333;
}

.cart-summary {
  text-align: right;
  margin-top: 20px;
  font-size: 1.1rem;
  color: #333;
}

.cart-summary p {
  margin: 5px 0;
}

.actions {
  margin-top: 15px;
}

.clear-btn,
.checkout-btn {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.clear-btn {
  background-color: #ffc107;
  color: #212529;
  margin-right: 10px;
}

.clear-btn:hover {
  background-color: #e0a800;
}

.checkout-btn:hover {
  background-color: #0056b3;
}
</style>
