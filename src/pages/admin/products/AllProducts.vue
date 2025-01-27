<script>
import axios from 'axios';
import dayjs from 'dayjs';
import { onMounted, ref } from 'vue';

export default {
  name: 'AllProducts',
  setup() {
    const products = ref([]);
    const isLoading = ref(true);
    const errorMessage = ref('');

    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5084/api/Product/getAll');
        products.value = response.data;
        console.log('Products:', products.value);
      }
      catch (error) {
        console.error('Error fetching products:', error);
        errorMessage.value = 'Failed to load products. Please try again later.';
      }
      finally {
        isLoading.value = false;
      }
    };

    onMounted(() => {
      fetchProducts();
    });

    return {
      products,
      isLoading,
      errorMessage,
      dayjs,
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
  </style>
