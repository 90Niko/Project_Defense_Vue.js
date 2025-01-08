<script>
import { fetchUsers } from '@/services/userServices';
import { useAuthStore } from '@/stores/useAuthStore';
import { computed, onMounted, ref } from 'vue';

export default {
  name: 'Users',
  setup() {
    const users = ref([]);
    const isLoading = ref(false);
    const authStore = useAuthStore();

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
    </div>
  </div>
</template>

<style scoped>
.users-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  text-align: center;
}

h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
}

.users-list {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.loading {
  font-size: 1.2rem;
  color: #666;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

.dots span {
  display: inline-block;
  font-size: 1.2rem;
  animation: blink 1.5s infinite;
}

.dots span:nth-child(1) {
  animation-delay: 0s;
}

.dots span:nth-child(2) {
  animation-delay: 0.3s;
}

.dots span:nth-child(3) {
  animation-delay: 0.6s;
}

@keyframes blink {
  0%, 20% {
    opacity: 0;
  }
  50%, 100% {
    opacity: 1;
  }
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.user-item {
  padding: 10px 15px;
  border-bottom: 1px solid #ddd;
  font-size: 1rem;
  color: #333;
}

.user-item:last-child {
  border-bottom: none;
}

.user-item:hover {
  background-color: #f0f0f0;
}

.login-prompt {
  margin-top: 20px;
  font-size: 1.2rem;
  color: #c00;
  font-weight: bold;
}
</style>
