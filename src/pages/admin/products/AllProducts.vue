<script>
import axios from 'axios';
import dayjs from 'dayjs';
import { computed, onMounted, ref } from 'vue';
import { useToast } from 'vue-toastification';

export default {
  name: 'AllProducts',
  setup() {
    const products = ref([]);
    const isLoading = ref(true);
    const errorMessage = ref('');
    const toast = useToast();

    // Sorting state
    const sortBy = ref(''); // options: '', 'date', 'price', 'category'
    const sortOrder = ref('asc'); // 'asc' or 'desc'

    // Toggle sort order between ascending and descending
    const toggleSortOrder = () => {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    };

    // Computed sorted products based on sortBy and sortOrder
    const sortedProducts = computed(() => {
      if (!sortBy.value) {
        return products.value;
      }
      return [...products.value].sort((a, b) => {
        let aValue, bValue;
        if (sortBy.value === 'date') {
          aValue = new Date(a.createdOn);
          bValue = new Date(b.createdOn);
        }
        else if (sortBy.value === 'price') {
          aValue = a.price;
          bValue = b.price;
        }
        else if (sortBy.value === 'category') {
          aValue = a.categoryName.toLowerCase();
          bValue = b.categoryName.toLowerCase();
        }
        if (aValue < bValue)
          return sortOrder.value === 'asc' ? -1 : 1;
        if (aValue > bValue)
          return sortOrder.value === 'asc' ? 1 : -1;
        return 0;
      });
    });

    // Fetch products from API
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://myshop0101.azurewebsites.net/api/Product/getAll');
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
        await axios.delete(`https://myshop0101.azurewebsites.net/api/Product/delete/${id}`);
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
      // Implement your edit logic here
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
      sortBy,
      sortOrder,
      toggleSortOrder,
      sortedProducts,
    };
  },
};
</script>

<template>
  <div class="product-container">
    <h1 class="title">
      Product List
    </h1>

    <!-- Sorting Controls -->
    <div v-if="products.length" class="sort-controls">
      <label for="sortField">Sort by:</label>
      <select id="sortField" v-model="sortBy">
        <option value="">
          None
        </option>
        <option value="date">
          Date
        </option>
        <option value="price">
          Price
        </option>
        <option value="category">
          Category
        </option>
      </select>
      <button class="sort-order-button" @click="toggleSortOrder">
        Order: {{ sortOrder === 'asc' ? 'Ascending' : 'Descending' }}
      </button>
    </div>

    <div v-if="isLoading" class="loading-message">
      Loading products...
    </div>
    <div v-else-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    <div v-else-if="products.length === 0" class="no-products-message">
      No products available.
    </div>

    <!-- Responsive Table Wrapper -->
    <div v-else class="table-responsive">
      <table class="product-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Product Name</th>
            <th @click="sortBy = 'price'; toggleSortOrder()">
              Price
            </th>
            <th>Description</th>
            <th @click="sortBy = 'category'; toggleSortOrder()">
              Category
            </th>
            <th @click="sortBy = 'date'; toggleSortOrder()">
              Created On
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in sortedProducts" :key="product.id">
            <td data-label="Id">
              {{ product.id }}
            </td>
            <td data-label="Product Name">
              {{ product.name }}
            </td>
            <td data-label="Price">
              ${{ product.price }}
            </td>
            <td data-label="Description">
              {{ product.description }}
            </td>
            <td data-label="Category">
              {{ product.categoryName }}
            </td>
            <td data-label="Created On">
              {{ dayjs(product.createdOn).format('ddd, MMM D, YYYY h:mm A') }}
            </td>
            <td data-label="Actions">
              <button class="details-button" @click="editProduct(product.id)">
                Details
              </button>
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
  </div>
</template>

<style scoped>
/* Base Styles */
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

/* Sorting Controls */
.sort-controls {
  text-align: center;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.sort-controls label {
  font-weight: bold;
}

.sort-controls select {
  padding: 5px;
}

.sort-order-button {
  padding: 5px 10px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

/* Responsive Table Wrapper */
.table-responsive {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch; /* Enables smooth scrolling on iOS */
}

/* Table Styling */
.product-table {
  width: 100%;
  min-width: 800px; /* Set a min-width to force horizontal scrolling on smaller screens */
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
  cursor: pointer;
}

.product-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.product-table tr:hover {
  background-color: #f1f1f1;
}

.product-table td:last-child {
  text-align: center;
}

/* Buttons */
.edit-button,
.delete-button,
.details-button {
  width: 80px;
  padding: 8px 0;
  margin: 0 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  text-align: center;
}

.edit-button {
  background-color: #4caf50;
  color: white;
}

.details-button {
  background-color: #007bff;
  color: white;
}

.details-button:hover {
  background-color: #0056b3;
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

/* Responsive Adjustments for Smaller Screens */
@media (max-width: 680px) {
  .product-table th,
  .product-table td {
    padding: 8px 10px;
  }

  .sort-controls {
    flex-direction: column;
  }

  .sort-controls label,
  .sort-controls select,
  .sort-order-button {
    margin-bottom: 10px;
  }
}
</style>
