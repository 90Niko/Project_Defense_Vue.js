<script>
import axios from 'axios';
import { inject, onMounted, ref } from 'vue';
import { useToast } from 'vue-toastification';

export default {
  name: 'AllCategory',
  setup() {
    const categories = ref([]);
    const $modal = inject('$modal'); // Inject modal if available
    const toast = useToast(); // Initialize toast

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5084/api/Category/getAll');
        categories.value = response.data;
      }
      catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories. Please try again later.'); // Toast error message
      }
    };

    const showConfirmDialog = (message) => {
      if (!$modal) {
        return new Promise((resolve) => {
          const userConfirmed = window.confirm(message); // Fallback to browser confirm
          resolve(userConfirmed);
        });
      }
      return new Promise((resolve) => {
        $modal.show('dialog', {
          title: 'Confirmation',
          text: message,
          buttons: [
            { title: 'Cancel', handler: () => resolve(false) },
            { title: 'OK', handler: () => resolve(true) },
          ],
        });
      });
    };

    const deleteCategory = async (id) => {
      if (await showConfirmDialog('Are you sure you want to delete this category?')) {
        try {
          await axios.delete(`http://myshop0101.azurewebsites.net/api/Category/${id}`);
          categories.value = categories.value.filter(category => category.id !== id);
          toast.success('Category deleted successfully!'); // Toast success message
        }
        catch (error) {
          console.error('Error deleting category:', error);
          toast.error('Failed to delete category. Please try again later.'); // Toast error message
        }
      }
    };

    onMounted(fetchCategories);

    return {
      categories,
      deleteCategory,
    };
  },
};
</script>

<template>
  <div class="container">
    <h1>Categories</h1>
    <table class="category-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="category in categories" :key="category.id">
          <td>{{ category.id }}</td>
          <td>{{ category.name }}</td>
          <td>
            <button class="delete-btn" @click="deleteCategory(category.id)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.category-table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.category-table th,
.category-table td {
  border: 1px solid #e0e0e0;
  padding: 12px;
  text-align: left;
}

.category-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.category-table tr:hover {
  background-color: #f1f1f1;
}

.delete-btn {
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.delete-btn:hover {
  background-color: #ff7875;
}
</style>
