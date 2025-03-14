<script setup>
import { useCartStore } from '@/stores/useCartStore';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

// Initialize the cart store
const cartStore = useCartStore();

const router = useRouter();

// Computed property for cart items
const cartItems = computed(() => cartStore.cartItems);

// Calculate the total number of items by summing the quantity of each item.
const totalItems = computed(() =>
  cartStore.cartItems.reduce((acc, item) => acc + item.quantity, 0),
);

// Total price factors in each item's quantity.
const totalPrice = computed(() =>
  cartStore.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
);

// Returns a full image URL or a fallback image if not provided.
function getImageUrl(imagePath) {
  if (!imagePath)
    return '/default-product.png'; // Fallback image

  return imagePath.startsWith('http')
    ? imagePath
    : `https://myshop0101.azurewebsites.net/${imagePath}`;
}

// Updates the quantity for a given item.
function updateQuantity(item) {
  console.log(`Updated quantity for ${item.name} to ${item.quantity}`);
  // Optionally, update the store:
  // cartStore.updateQuantity(item, item.quantity);
}

// Helper to ensure item.quantity is a valid number.
function ensureQuantity(item) {
  if (typeof item.quantity !== 'number' || Number.isNaN(item.quantity)) {
    item.quantity = 1;
  }
}

// Increments the quantity of the given item.
function incrementQuantity(item) {
  ensureQuantity(item);
  item.quantity++;
  updateQuantity(item);
}

// Decrements the quantity of the given item (ensuring it doesn't drop below 1).
function decrementQuantity(item) {
  ensureQuantity(item);
  if (item.quantity > 1) {
    item.quantity--;
    updateQuantity(item);
  }
}

// Removes a product from the cart.
function removeProduct(product) {
  cartStore.removeProduct(product);
}

// Clears the entire cart.
function clearCart() {
  cartStore.clearCart();
}
function goToAddress() {
  router.push({ name: 'address' });
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
            <img :src="getImageUrl(item.imagePath)" :alt="item.name" class="product-image">
          </div>
          <div class="item-details">
            <div class="info">
              <p class="product-name">
                {{ item.name }}
              </p>
              <div class="quantity-controls">
                <button class="quantity-btn" @click="decrementQuantity(item)">
                  -
                </button>
                <span class="quantity-value">{{ item.quantity }}</span>
                <button class="quantity-btn" @click="incrementQuantity(item)">
                  +
                </button>
              </div>
              <p class="product-price">
                $ {{ (item.price * item.quantity).toFixed(2) }}
              </p>
            </div>
          </div>
          <div class="actions">
            <button class="remove-btn" @click="removeProduct(item)">
              <i class="fa-regular fa-trash-can" aria-hidden="true" />
            </button>
          </div>
        </li>
      </ul>
      <div class="cart-summary">
        <p><strong>Total Items:</strong> {{ totalItems }}</p>
        <p><strong>Total Price:</strong> ${{ totalPrice.toFixed(2) }}</p>
        <div class="summary-actions">
          <button class="clear-btn" @click="clearCart">
            Clear Cart
          </button>
          <button class="checkout-btn" @click="goToAddress">
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
  margin: 2rem auto;
  padding: 1.5rem;
}
.cart h1 {
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
}
.empty-cart {
  text-align: center;
  font-size: 1.2rem;
  color: #777;
}
.cart-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}
.item-image {
  width: 80px;
  height: 80px;
  margin-right: 1rem;
  flex-shrink: 0;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.item-details {
  flex: 1;
  display: flex;
  align-items: center;
}

.info {
  display: flex;
  width: 100%;
  align-items: center;
}

.product-name {
  flex: 2;
  text-align: left;
  font-size: 1rem;
  color: #333;
}

.quantity-controls {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
}

.quantity-btn {
  width: 30px;
  height: 30px;
  font-size: 1.2rem;
  background: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5cb85c;

}

.quantity-value {
  font-size: 1rem;
  width: 20px;
  text-align: center;
}

.product-price {
  flex: 2;
  text-align: center;
  font-size: 1rem;
  color: #555;
}

.actions {
  flex: 0;
  margin-left: auto;
}

.remove-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #d9534f;
  cursor: pointer;
  transition: color 0.2s;
}

.remove-btn:hover {
  color: #c9302c;
}

.cart-summary {
  margin-top: 2rem;
  border-top: 1px solid #eee;
  padding-top: 1rem;
  text-align: right;
  font-size: 1.1rem;
}

.cart-summary p {
  margin: 0.5rem 0;
}

.summary-actions {
  margin-top: 1rem;
}

.clear-btn,
.checkout-btn {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-left: 1rem;
}

.clear-btn {
  background-color: #f0ad4e;
  color: #fff;
}

.clear-btn:hover {
  background-color: #ec971f;
}

.checkout-btn {
  background-color: #5cb85c;
  color: #fff;
}

.checkout-btn:hover {
  background-color: #4cae4c;
}
</style>
