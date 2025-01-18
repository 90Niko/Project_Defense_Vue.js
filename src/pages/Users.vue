<script>
import { fetchUsers } from '@/services/userServices';
import { useAuthStore } from '@/stores/useAuthStore';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'Users',
  setup() {
    const users = ref([]);
    const isLoading = ref(false);
    const authStore = useAuthStore();
    const router = useRouter();

    const redirectToLogin = () => {
      router.push('/login'); // Navigate to Login.vue
    };

    const loadUsers = async () => {
      isLoading.value = true;
      try {
        const data = await fetchUsers();
        users.value = data;
      }
      catch (error) {
        console.error('Error fetching users:', error);
      }
      finally {
        isLoading.value = false;
      }
    };

    onMounted(() => {
      if (authStore.isLoggedIn) {
        loadUsers();
      }
    });

    return {
      users,
      isLoading,
      isLoggedIn: computed(() => authStore.isLoggedIn),
      redirectToLogin,
    };
  },
};
</script>

<template>
  <div class="users-container">
    <h1>Users</h1>
    <div v-if="isLoggedIn" class="users-list">
      <div v-if="isLoading" class="loading">
        Loading<span class="dots"><span>.</span><span>.</span><span>.</span></span>
      </div>
      <ul v-else>
        <li v-for="user in users" :key="user.id" class="user-item">
          {{ user.username }}{{ user.email }}{{ user.address[1] }}
        </li>
      </ul>
    </div>
    <div v-else class="login-prompt">
      <p>You must log in to view the users list.</p>
      <button class="login-button" @click="redirectToLogin">
        Log In
      </button>
    </div>
  </div>
</template>
