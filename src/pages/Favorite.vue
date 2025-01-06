<script>
import { useAuthStore } from '@/stores/auth';
import { useFavoriteStore } from '@/stores/useFavoriteStore';
import { useRouter } from 'vue-router'; // Import router for navigation

export default {
  name: 'FavoritesList',
  setup() {
    const favoriteStore = useFavoriteStore();
    const authStore = useAuthStore();
    const router = useRouter(); // Access the router

    // Reactive favorites array
    const favorites = favoriteStore.favorites;

    // Redirect to Login page
    const redirectToLogin = () => {
      router.push('/login'); // Navigate to Login.vue
    };

    // Remove a product from the favorites list
    const removeFavorite = (product) => {
      favoriteStore.removeFavorite(product); // Update the store
      const index = favorites.findIndex(item => item.id === product.id);
      if (index !== -1) {
        favorites.splice(index, 1); // Remove the product from the local array
      }
    };

    // Reset the isRemoved flag to false to "restore" the product
    const resetRemovedFlag = () => {
      favoriteStore.isRemoved = false;
    };

    return {
      favorites, // Reactive array
      removeFavorite, // Method to remove a product
      resetRemovedFlag, // Method to reset removal state
      isLoggedIn: authStore.isLoggedIn, // Reactive property for login status
      redirectToLogin, // Method to redirect to Login
    };
  },
};
</script>

<template>
  <div>
    <h1>Your Favorites</h1>
    <!-- Show message and login button if the user is not logged in -->
    <div v-if="!isLoggedIn" class="login-prompt">
      <p class="login-message">
        Please log in to view your favorite products.
      </p>
      <button class="login-button" @click="redirectToLogin">
        Log In
      </button>
    </div>
    <!-- Display favorite items if the user is logged in and the list is not empty -->
    <ul v-if="isLoggedIn && favorites.length > 0" class="favorite-list">
      <li v-for="product in favorites" :key="product.id" class="favorite-item">
        <div class="favorite-product">
          <img :src="product.image" :alt="product.title" class="favorite-image">
          <div class="favorite-details">
            <h2>{{ product.title }}</h2>
            <p>$ {{ product.price }}</p>
          </div>
        </div>
        <!-- Remove Button -->
        <button class="remove-button" @click="removeFavorite(product)">
          Remove
        </button>
      </li>
    </ul>
    <!-- Show a message if there are no favorites -->
    <p v-else-if="isLoggedIn">
      No favorites added yet!
    </p>
  </div>
</template>

<style>
h1 {
  text-align: center;
  margin-bottom: 20px;
}
p {
  margin: 0;
  text-align: center;
}
.favorite-list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Two items per row */
  gap: 20px;
}

.favorite-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 10px;
  background-color: #f9f9f9;
}

.favorite-product {
  display: flex;
  align-items: center;
}

.favorite-image {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-right: 10px;
}

.favorite-details {
  text-align: left;
}

.remove-button {
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.remove-button:hover {
  background-color: #e60000;
}

.login-prompt {
  text-align: center;
  margin-bottom: 20px;
}

.login-message {
  color: #ff4d4d;
  font-weight: bold;
  margin-bottom: 10px;
}

.login-button {
  background-color: #333;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}

.login-button:hover {
  background-color: #555;
}
</style>
