<script>
import { useAuthStore } from '@/stores/auth';
import { computed, defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'Favorites',
  props: {
    items: {
      type: Array,
      required: true, // Items should be passed as an array
    },
  },
  setup(props) {
    // Authentication store
    const authStore = useAuthStore();

    // Computed property for login status
    const isLoggedIn = computed(() => authStore.isLoggedIn);

    // Reactive Set to store favorites
    const favorites = ref(new Set());

    // Check if an item is a favorite
    const isFavorite = item => favorites.value.has(item.id);

    // Toggle favorite status
    const toggleFavorite = (item) => {
      if (!isLoggedIn.value) {
        alert('You must be logged in to manage favorites!');
        return;
      }

      if (isFavorite(item)) {
        favorites.value.delete(item.id);
      }
      else {
        favorites.value.add(item.id);
      }
    };

    // Redirect to login page
    const redirectToLogin = () => {
      window.location.href = '/login';
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
  <div>
    <!-- Show message if user is not logged in -->
    <div v-if="!isLoggedIn" class="favorite-message">
      <h3 class="msg">
        You need to log in to manage your favorites.
      </h3>
      <button @click="redirectToLogin">
        Log In
      </button>
    </div>

    <!-- Show message if there are no items -->
    <div v-else-if="!items || items.length === 0" class="no-items-message">
      <h3 class="msg">
        No items available to display.
      </h3>
    </div>

    <!-- Display favorite actions -->
    <ul v-else>
      <li v-for="item in items" :key="item.id">
        <span>{{ item.name }}</span>
        <button
          :disabled="!isLoggedIn"
          :title="!isLoggedIn ? 'Log in to add to favorites' : ''"
          @click="toggleFavorite(item)"
        >
          {{ isFavorite(item) ? 'Unfavorite' : 'Favorite' }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.msg{
  color: rgb(253, 253, 253);
}
.favorite-message {
  margin-bottom: 1em;
  text-align: center;
  color: rgb(255, 255, 255);
}

.no-items-message {
  margin-top: 1em;
  color: gray;
  font-size: 1.2em;
  text-align: center;
}

button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
button {
  background-color: #555;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
  margin-top: 1em;
  width: 100px;
}
</style>
