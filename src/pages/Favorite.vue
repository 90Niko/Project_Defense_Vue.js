<script>
import { useAuthStore } from '@/stores/auth';
import { useFavoriteStore } from '@/stores/useFavoriteStore';
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'Favorites',
  props: {
    items: {
      type: Array,
      default: () => [], // Default to empty array if no items are passed
    },
  },
  setup(props) {
    // Authentication store
    const authStore = useAuthStore();

    // Favorite store
    const favoriteStore = useFavoriteStore();

    // Computed property for login status
    const isLoggedIn = computed(() => authStore.isLoggedIn);

    // Check if an item is a favorite
    const isFavorite = item => favoriteStore.isFavorite(item);

    // Toggle favorite status
    const toggleFavorite = (item) => {
      if (!isLoggedIn.value) {
        console.log('You must be logged in to manage favorites!'); // Placeholder for toast or notification
        return;
      }
      favoriteStore.toggleFavorite(item);
    };

    // Redirect to login page
    const redirectToLogin = () => {
      window.location.href = '/login'; // Replace with router push if using Vue Router
    };

    return {
      items: props.items,
      isLoggedIn,
      isFavorite,
      toggleFavorite,
      redirectToLogin,
    };
  },
});
</script>

<template>
  <div class="favorite-container">
    <!-- Show login message if user is not logged in -->
    <div v-if="!isLoggedIn" class="favorite-message">
      <h3 class="msg">
        Log in to view and manage your favorite items.
      </h3>
      <button class="btn-login" @click="redirectToLogin">
        Log In
      </button>
    </div>

    <!-- Show empty state message if there are no items -->
    <div v-else-if="!items || items.length === 0" class="no-items-message">
      <h3 class="msg">
        No favorite items to display. Start exploring and add some!
      </h3>
    </div>

    <!-- Show list of favorite items -->
    <ul v-else class="favorites-list">
      <li v-for="item in items" :key="item.id" class="favorite-item">
        <div class="favorite-item-details">
          <span class="item-name">{{ item.name }}</span>
          <button
            :disabled="!isLoggedIn"
            :class="{ 'favorite-active': isFavorite(item) }"
            :aria-pressed="isFavorite(item)"
            :title="isFavorite(item) ? 'Unfavorite this item' : 'Add to favorites'"
            class="btn-favorite"
            @click="toggleFavorite(item)"
          >
            {{ isFavorite(item) ? 'Unfavorite' : 'Favorite' }}
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.favorite-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  text-align: center;
}

.msg {
  color: #333;
  font-size: 1.2rem;
  margin-bottom: 20px;
}

.favorite-message,
.no-items-message {
  margin-top: 50px;
}

.favorites-list {
  list-style: none;
  padding: 0;
  margin-top: 20px;
}

.favorite-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
  transition: box-shadow 0.3s;
}

.favorite-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.favorite-item-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.item-name {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
}

.btn-login {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-login:hover {
  background-color: #0056b3;
}

.btn-favorite {
  background-color: #555;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-favorite.favorite-active {
  background-color: #ffcc00;
  color: white;
}

.btn-favorite:hover:not([disabled]) {
  background-color: #777;
}

button[disabled] {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
