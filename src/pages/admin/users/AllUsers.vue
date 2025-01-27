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
  <div class="category-container">
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
.category-container {
  background-color: #f9f9f9;
  margin-bottom: auto;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.navigation {
  margin-bottom: 30px;
}

.nav-link {
  display: inline-block;
  padding: 10px 20px;
  margin: 0 10px;
  text-decoration: none;
  color: white;
  background-color: #007bff;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.nav-link:hover {
  background-color: #0056b3;
}

.search-container {
  margin-bottom: 0 ;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

.user-list {
  list-style: none;
  padding: 0;
}

.user-item {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
}

.user-item p {
  margin: 5px 0;
}
</style>
