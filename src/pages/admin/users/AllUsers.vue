<script>
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';

export default {
  name: 'ManageUsers',
  setup() {
    const users = ref([]); // Reactive variable to store user data
    const searchQuery = ref(''); // Reactive variable for the search input

    // Fetch users from API
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5084/api/User/getAll');
        users.value = response.data; // Populate the users list
      }
      catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    // Computed property to filter users based on search query
    const filteredUsers = computed(() => {
      return users.value.filter((user) => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        return (
          fullName.includes(searchQuery.value.toLowerCase())
          || user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      });
    });

    onMounted(() => {
      fetchUsers();
    });

    return {
      users,
      searchQuery,
      filteredUsers,
    };
  },
};
</script>

<template>
  <div class="manage-users-container">
    <div class="search-container">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search users by name or email"
        class="search-input"
      >
    </div>
    <ul class="user-list">
      <li v-for="user in filteredUsers" :key="user.email" class="user-item">
        <p><strong>Name:</strong> {{ user.firstName }} {{ user.lastName }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.manage-users-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.search-container {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.search-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.2);
  outline: none;
}

.user-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.user-item {
  margin-bottom: 15px;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fafafa;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.user-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.user-item p {
  margin: 5px 0;
  color: #333;
}

.user-item p strong {
  color: #007bff;
}
</style>
