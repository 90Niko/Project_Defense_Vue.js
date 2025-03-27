<script>
import axiosWebApi from '@/config/axiosWebApi';
import MermaidDiagram from '@/pages/admin/MermaidDiagram.vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'AdminDashboard',
  components: {
    MermaidDiagram,
  },
  setup() {
    const router = useRouter();
    const categoriesCount = ref(null);
    const productsCount = ref(null);
    const usersCount = ref(null);
    const loading = ref(true);

    // Fetch all counts in parallel
    const fetchCounts = async () => {
      try {
        const [categoriesRes, productsRes, usersRes] = await Promise.all([
          axiosWebApi.get('/api/Category/getAll'),
          axiosWebApi.get('/api/Product/getAll'),
          axiosWebApi.get('/api/User/getAll'),
        ]);

        categoriesCount.value = categoriesRes.data.length;
        productsCount.value = productsRes.data.length;
        usersCount.value = usersRes.data.length;
      }
      catch (error) {
        console.error('Error fetching counts:', error);
        categoriesCount.value = 0;
        productsCount.value = 0;
        usersCount.value = 0;
      }
      finally {
        loading.value = false;
      }
    };

    onMounted(fetchCounts);

    const navigateTo = (path) => {
      router.push(path);
    };

    return {
      navigateTo,
      categoriesCount,
      productsCount,
      usersCount,
      loading,
    };
  },
};
</script>

<template>
  <main class="content">
    <h1>Dashboard</h1>
    <div v-if="loading" class="loading">
      Loading data...
    </div>
    <div v-else class="button-group">
      <button class="user-button" @click="navigateTo('/admin/manage-users')">
        User Accounts: {{ usersCount }}
      </button>
      <button class="product-button" @click="navigateTo('/admin/product')">
        Products: {{ productsCount }}
      </button>
      <button class="category-button" @click="navigateTo('/admin/category')">
        Categories: {{ categoriesCount }}
      </button>
    </div>
    <MermaidDiagram
      v-if="!loading"
      :product-count="productsCount"
      :category-count="categoriesCount"
      :user-count="usersCount"
    />
  </main>
</template>

<style scoped>
.content {
  flex: 1;
  background-color: #ecf0f1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.loading {
  font-size: 1.5rem;
  text-align: center;
  color: #555;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  align-items: center;
}

.button-group button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 220px;
  height: 100px;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: white;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  margin-bottom: 1rem;
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

@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }

  .content {
    margin-left: 0;
    padding: 1rem;
  }

  .button-group {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .button-group button {
    width: 100%;
    height: auto;
    padding: 1rem;
  }
}
</style>
