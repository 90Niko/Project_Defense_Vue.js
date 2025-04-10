<script setup>
import axiosWebApi from '@/config/axiosWebApi';
import { useAuthStore } from '@/stores/useAuthStore';
import { computed, onMounted, ref } from 'vue';

const authStore = useAuthStore();
const user = ref(null);
const userName = computed(() => authStore.user?.name || '');

// Function to fetch current user
async function fetchCurrentUser() {
  try {
    const email = userName.value;
    if (!email) {
      console.error('Email is not available');
      return;
    }
    const response = await axiosWebApi.get(`/api/User/getCurrentUser/${email}`);
    if (response.status !== 200) {
      console.error('Failed to fetch user data:', response.statusText);
      return;
    }
    user.value = response.data;

    if (!user.value) {
      console.error('User not found');
    }
    else {
      console.log('User:', user.value);
    }
  }
  catch (error) {
    console.error('Error fetching user:', error);
  }
}

// Fetch user data when component is mounted
onMounted(() => {
  fetchCurrentUser();
});
</script>

<template>
  <div v-if="user" class="user-profile">
    <div class="profile-info">
      <p><strong>Name:</strong> {{ user.name }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Phone:</strong> {{ user.phone }}</p>
    </div>
  </div>
  <div v-else>
    <p>Loading user info...</p>
  </div>
</template>

<style scoped>
.user-profile {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-info p {
  font-size: 16px;
  margin: 10px 0;
}

.profile-info strong {
  font-weight: bold;
}
</style>
