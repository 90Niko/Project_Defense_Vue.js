<script>
import axios from 'axios';
import dayjs from 'dayjs';
import { onMounted, ref } from 'vue';
import { useToast } from 'vue-toastification';

export default {
  name: 'AllProducts',
  setup() {
    const products = ref([]);
    const isLoading = ref(true);
    const errorMessage = ref('');
    const toast = useToast();

    // Fetch products
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5084/api/Product/getAll');
        products.value = response.data;
        toast.success('Products loaded successfully!');
      }
      catch (error) {
        console.error('Error fetching products:', error);
        errorMessage.value = 'Failed to load products. Please try again later.';
        toast.error('Failed to load products.');
      }
      finally {
        isLoading.value = false;
      }
    };

    // Delete a product
    const deleteProduct = async (id) => {
      try {
        await axios.delete(`http://localhost:5084/api/Product/delete/${id}`);
        // Remove the deleted product from the list
        products.value = products.value.filter(product => product.id !== id);
        toast.success('Product deleted successfully!');
      }
      catch (error) {
        console.error('Error deleting product:', error);
        errorMessage.value = 'Failed to delete product. Please try again later.';
        toast.error('Failed to delete product.');
      }
    };

    // Edit a product (redirect to edit page or open a modal)
    const editProduct = (id) => {
      console.log('Edit product with ID:', id);
      toast.info(`Edit product with ID: ${id}`);
      // Implement your edit logic here (e.g., redirect to an edit page or open a modal)
    };

    onMounted(() => {
      fetchProducts();
    });

    return {
      products,
      isLoading,
      errorMessage,
      dayjs,
      deleteProduct,
      editProduct,
    };
  },
};
</script>

<template>
  <div class="product-container">
    <h1 class="title">
      Product List
    </h1>
    <div v-if="isLoading" class="loading-message">
      Loading products...
    </div>
    <div v-else-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    <div v-else-if="products.length === 0" class="no-products-message">
      No products available.
    </div>
    <table v-else class="product-table">
      <thead>
        <tr>
          <th>Id</th>
          <th>Product Name</th>
          <th>Price</th>
          <th>Description</th>
          <th>Category</th>
          <th>Created On</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.id }}</td>
          <td>{{ product.name }}</td>
          <td>${{ product.price }}</td>
          <td>{{ product.description }}</td>
          <td>{{ product.categoryName }}</td>
          <td>{{ dayjs(product.createdOn).format('MMMM D, YYYY') }}</td>
          <td>
            <button class="edit-button" @click="editProduct(product.id)">
              Edit
            </button>
            <button class="delete-button" @click="deleteProduct(product.id)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.product-container {
  padding: 20px;
  background-color: #f9f9f9;
  min-height: 100vh;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.loading-message,
.error-message,
.no-products-message {
  text-align: center;
  font-size: 1.2rem;
  color: #555;
  margin: 20px 0;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.product-table th,
.product-table td {
  border: 1px solid #ddd;
  padding: 10px 15px;
  text-align: left;
}

.product-table th {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}

.product-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.product-table tr:hover {
  background-color: #f1f1f1;
}

/* Center buttons in the table cell */
.product-table td:last-child {
  text-align: center; /* Center buttons horizontally */
}

.edit-button,
.delete-button {
  width: 80px; /* Fixed width for both buttons */
  padding: 8px 0; /* Adjust padding for consistent height */
  margin: 0 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  text-align: center; /* Center text inside the button */
}

.edit-button {
  background-color: #4caf50;
  color: white;
}

.edit-button:hover {
  background-color: #45a049;
}

.delete-button {
  background-color: #f44336;
  color: white;
}

.delete-button:hover {
  background-color: #e53935;
}
</style>
