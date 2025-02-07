<script>
import MermaidDiagram from '@/pages/admin/MermaidDiagram.vue';
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'AdminDashboard',
  components: {
    MermaidDiagram,
  },
  setup() {
    const router = useRouter();
    const categoriesCount = ref(0);
    const productsCount = ref(0);
    const usersCount = ref(0);

    // Fetch functions for counts
    const fetchCategoriesCount = async () => {
      try {
        const response = await axios.get('http://localhost:5084/api/Category/getAll');
        categoriesCount.value = response.data.length;
      }
      catch (error) {
        console.error('Error fetching categories:', error);
        categoriesCount.value = 0;
      }
    };

    const fetchProductsCount = async () => {
      try {
        const response = await axios.get('http://localhost:5084/api/Product/getAll');
        productsCount.value = response.data.length;
      }
      catch (error) {
        console.error('Error fetching products:', error);
        productsCount.value = 0;
      }
    };

    const fetchUsersCount = async () => {
      try {
        const response = await axios.get('http://localhost:5084/api/User/getAll');
        usersCount.value = response.data.length;
      }
      catch (error) {
        console.error('Error fetching users:', error);
        usersCount.value = 0;
      }
    };

    // Fetch counts on initialization.
    fetchCategoriesCount();
    fetchProductsCount();
    fetchUsersCount();

    const navigateTo = (path) => {
      router.push(path);
    };

    return {
      navigateTo,
      categoriesCount,
      productsCount,
      usersCount,
    };
  },
};
</script>

<template>
  <div class="admin-panel">
    <aside class="sidebar">
      <h2>Admin Panel</h2>
      <nav>
        <ul>
          <li>
            <router-link to="/dashboard">
              Dashboard
            </router-link>
          </li>
          <li>
            <router-link to="/users">
              Users
            </router-link>
          </li>
          <li>
            <router-link to="/settings">
              Settings
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>
    <main class="content">
      <div class="button-group">
        <button class="user-button" @click="navigateTo('/admin/manage-users')">
          User Account: {{ usersCount }}
        </button>
        <button class="product-button" @click="navigateTo('/admin/product')">
          Product: {{ productsCount }}
        </button>
        <button class="category-button" @click="navigateTo('/admin/category')">
          Category: {{ categoriesCount }}
        </button>
      </div>

      <!-- Other diagrams (if any) can go here -->

      <!-- New analytic diagrams for each entity -->
      <MermaidDiagram
        :product-count="productsCount"
        :category-count="categoriesCount"
        :user-count="usersCount"
      />

      <router-view />
    </main>
  </div>
</template>

<style scoped>
.admin-panel {
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
}

/* Sidebar styling */
.sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 1rem;
  box-sizing: border-box;
}

.sidebar h2 {
  margin-top: 0;
  font-size: 1.5rem;
  text-align: center;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.sidebar li {
  margin: 1rem 0;
}

.sidebar a {
  color: #ecf0f1;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s;
}

.sidebar a:hover {
  color: #1abc9c;
}

/* Main content styling */
.content {
  flex: 1;
  padding: 2rem;
  background-color: #ecf0f1;
  overflow-y: auto;
}

/* Button group styling */
.button-group {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  justify-content: center;
  margin-top: 2rem;
}

.button-group button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 450px;
  height: 150px;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  color: white;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.button-group button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.button-group button:active {
  transform: scale(0.95);
}

.product-button {
  background-color: #007bff;
}

.category-button {
  background-color: #28a745;
}

.user-button {
  background-color: #ffc107;
}

/* Responsive styling */
@media (max-width: 768px) {
  .button-group {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }
  .button-group button {
    width: 100%;
    height: auto;
    padding: 1rem 0;
  }
  .button-group button:hover {
    transform: none;
    box-shadow: none;
    background-color: #555;
  }
}
</style>
