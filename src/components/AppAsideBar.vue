<script setup>
import axiosWebApi from '@/config/axiosWebApi';
import { useAuthStore } from '@/stores/useAuthStore';
import { useEventBus } from '@/stores/useEventBus';
import { computed, onMounted, ref, watch } from 'vue';

const authStore = useAuthStore();
const isAdmin = computed(() => authStore.user?.role === 'Admin');
const unreadMessagesCount = ref(0);
const eventBus = useEventBus();

async function fetchUnreadMessages() {
  try {
    const response = await axiosWebApi.get('/api/Chat/unReadMessage');
    console.log('API Response:', response.data);

    if (response.data && typeof response.data.unreadCount === 'number') {
      unreadMessagesCount.value = response.data.unreadCount;
    }
    else {
      unreadMessagesCount.value = 0;
    }

    console.log('Unread messages count:', unreadMessagesCount.value);
  }
  catch (error) {
    console.error('Error fetching unread messages:', error);
  }
}

eventBus.on('messages-read', async () => {
  await fetchUnreadMessages();
});

watch(isAdmin, (newVal) => {
  if (newVal) {
    fetchUnreadMessages();
  }
}, { immediate: true });

onMounted(fetchUnreadMessages);
</script>

<template>
  <aside v-if="isAdmin" class="sidebar">
    <h2>Admin Panel</h2>
    <nav>
      <ul>
        <li>
          <router-link to="/admin/dashboard">
            Dashboard
          </router-link>
        </li>
        <li>
          <router-link to="/admin/orders/">
            Orders
          </router-link>
        </li>
        <li>
          <router-link to="/admin/inbox">
            Inbox   ({{ unreadMessagesCount }})
            <span v-if="unreadMessagesCount > 0" class="notification-dot" />
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  min-height: 100vh;
}

.sidebar h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #ffffff;
  text-align: center;
}

.sidebar nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar nav ul li {
  margin-bottom: 15px;
}

.sidebar nav ul li a {
  color: #ecf0f1;
  text-decoration: none;
  font-size: 1rem;
  display: block;
  padding: 10px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.sidebar nav ul li a:hover {
  background-color: #34495e;
}

.sidebar nav ul li a.router-link-active {
  background-color: #1abc9c;
  color: #ffffff;
}

.notification-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 55%;
  position: absolute;
}
</style>
