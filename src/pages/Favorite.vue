<script>
import { useAuthStore } from '@/stores/useAuthStore';
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

    const getImageUrl = (imagePath) => {
      if (!imagePath)
        return '/default-product.png'; // ✅ Fallback image

      // ✅ Ensure full image URL
      return imagePath.startsWith('http') ? imagePath : `https://myshop0101.azurewebsites.net/${imagePath}`;
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
      redirectToLogin,
      getImageUrl, // Method to redirect to Login
    };
  },
};
</script>

<template>
  <div>
    <h1>Your Favorites</h1>
    <!-- Show message and login button if the user is not logged in -->
    <div v-if="!isLoggedIn" class="login-prompt">
      <p>You must log in to view the favorite.</p>
      <button class="login-button" @click="redirectToLogin">
        Log In
      </button>
    </div>
    <!-- Display favorite items if the user is logged in and the list is not empty -->
    <ul v-if="isLoggedIn && favorites.length > 0" class="favorite-list">
      <li v-for="product in favorites" :key="product.id" class="favorite-item">
        <div class="favorite-product">
          <img :src="getImageUrl(product.imagePath)" :alt="product.name" class="favorite-image">
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
/* Global Styling */
body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: #f4f4f9;
  color: #333;
}

h1 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 30px;
  color: #222;
}

p {
  margin: 0;
  text-align: center;
  font-size: 1rem;
  color: #666;
}

/* Login Prompt Styling */
.login-prompt {
  text-align: center;
  padding: 20px;
  background-color: #ffe6e6;
  border: 1px solid #ffcccc;
  border-radius: 10px;
  margin: 20px auto;
  max-width: 500px;
}

.login-message {
  color: #d9534f;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 15px;
}

.login-button {
  background-color: #d9534f;
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s, transform 0.2s;
}

.login-button:hover {
  background-color: #c9302c;
  transform: scale(1.05);
}

/* Favorites List Styling */
.favorite-list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.favorite-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.favorite-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.favorite-product {
  display: flex;
  align-items: center;
}

.favorite-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
  margin-right: 15px;
}

.favorite-details {
  text-align: left;
}

.favorite-details h2 {
  font-size: 1.25rem;
  margin: 0 0 5px;
  color: #222;
}

.favorite-details p {
  font-size: 1rem;
  color: #666;
  margin: 0;
}

.remove-button {
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s, transform 0.2s;
}

.remove-button:hover {
  background-color: #e60000;
  transform: scale(1.05);
}

/* Empty Favorites Message */
p {
  margin-top: 20px;
  font-size: 1.1rem;
  color: #999;
}

/* Responsive Design */
@media (max-width: 768px) {
  .favorite-list {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }

  .favorite-item {
    flex-direction: column;
    padding: 10px;
  }

  .favorite-image {
    width: 50%;
    height: auto;
    margin-bottom: 10px;
  }

  .remove-button {
    margin-top: 10px;
  }
}
</style>
