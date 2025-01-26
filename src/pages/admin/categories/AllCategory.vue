<script>
import axios from 'axios';
import { inject, onMounted, ref } from 'vue';

export default {
  name: 'AllCategory',
  setup() {
    const categories = ref([]);
    const $modal = inject('$modal'); // Inject modal if available

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5084/api/Category/getAll');
        categories.value = response.data;
      }
      catch (error) {
        console.error('Error fetching categories:', error);
        this.alert('Failed to load categories. Please try again later.');
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
          await axios.delete(`http://localhost:5084/api/Category/${id}`);
          categories.value = categories.value.filter(category => category.id !== id);
          this.alert('Category deleted successfully!');
        }
        catch (error) {
          console.error('Error deleting category:', error);
          this.alert('Failed to delete category. Please try again later.');
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
  <div>
    <h1>All Categories</h1>
    <table>
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
            <button @click="deleteCategory(category.id)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f4f4f4;
  text-align: left;
}
</style>
