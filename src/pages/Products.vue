<script>
import { useAuthStore } from '@/stores/auth'; // Import auth store
import { useFavoriteStore } from '@/stores/useFavoriteStore'; // Adjust the path based on your project structure
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';

export default {
  name: 'ProductList',
  setup() {
    // Reactive state
    const products = ref([]);
    const currentPage = ref(1);
    const itemsPerPage = 4;
    const isLoading = ref(false);

    // Use Favorite Store
    const favoriteStore = useFavoriteStore();
    const authStore = useAuthStore(); // Access auth store

    // Computed properties
    const totalPages = computed(() => Math.ceil(products.value.length / itemsPerPage));
    const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return products.value.slice(start, end);
    });

    // Favorite functionality
    const toggleFavorite = (product) => {
      return favoriteStore.toggleFavorite(product);
    };

    const isFavorite = (product) => {
      return favoriteStore.isFavorite(product);
    };

    const removeFavorite = (product) => {
      favoriteStore.removeFavorite(product);
    };

    const viewDetails = (product) => {
      console.log(`Viewing details for product: ${product.title}`);
      // Implement navigation to the product details page or modal
    };

    // Fetch products
    const fetchProducts = async () => {
      isLoading.value = true;
      try {
        const response = await axios.get('https://fakestoreapi.com/products');
        products.value = response.data;
      }
      catch (error) {
        console.error('Failed to fetch products:', error);
      }
      finally {
        isLoading.value = false;
      }
    };

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    };

    // Pagination controls
    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
        scrollToTop();
      }
    };

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        scrollToTop();
      }
    };

    // Fetch products on component mount
    onMounted(fetchProducts);

    return {
      products,
      currentPage,
      itemsPerPage,
      isLoading,
      totalPages,
      paginatedProducts,
      toggleFavorite,
      isFavorite,
      removeFavorite,
      viewDetails,
      nextPage,
      previousPage,
      isLoggedIn: authStore.isLoggedIn, // Reactive property for login status
    };
  },
};
</script>

<template>
  <progress v-if="isLoading" class="loader-line" />
  <div class="products">
    <h1>Products</h1>
    <ul class="product-list">
      <li
        v-for="product in paginatedProducts"
        :key="product.id"
        class="product-item"
      >
        <article class="product-card">
          <div class="product-image-container">
            <img
              :src="product.image"
              :alt="product.title"
              class="product-image"
            >
          </div>
          <div class="product-details">
            <h2 class="product-name">
              {{ product.title }}
            </h2>
          </div>
          <p class="product-price">
            $ {{ product.price }}
          </p>
          <div class="btn">
            <!-- Conditionally Render Buttons -->
            <button
              v-if="isLoggedIn"
              class="favorite-button"
              :class="{ 'favorite-active': isFavorite(product) }"
              @click="isFavorite(product) ? removeFavorite(product) : toggleFavorite(product)"
            >
              <i
                :class="isFavorite(product) ? 'bi bi-x-circle' : 'bi bi-star'"
              />
              {{ isFavorite(product) ? 'Remove' : 'Favorite' }}
            </button>
            <button
              v-else
              class="details-button"
              @click="viewDetails(product)"
            >
              <i class="bi bi-info-circle" />
              Details
            </button>
          </div>
        </article>
      </li>
    </ul>
    <div class="pagination">
      <button :disabled="currentPage === 1" @click="previousPage">
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="nextPage">
        Next
      </button>
    </div>
  </div>
</template>

<style>
.favorite-button {
  background-color: #ddd;
  color: #333;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.favorite-button.favorite-active {
  background-color: #ffcc00;
  color: #fff;
}

.favorite-button i {
  margin-right: 5px;
}
.loader-line {
  width: 100%;
  height: 3px;
  position: relative;
  overflow: hidden;
  background-color: #ddd;
  margin: 0 auto;
  border-radius: 20px;
}

.loader-line:before {
  content: "";
  position: absolute;
  left: -50%;
  height: 3px;
  width: 40%;
  background-color: #212020;
  animation: lineAnim 1s linear infinite;
  border-radius: 20px;
}
.products {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 80px;
  font-family: Arial, sans-serif;
  text-align: center;

}

h1{
  font-size: 2.5rem;
  margin-bottom: 120px;
  padding-bottom: 20px;
  color: #333;
}

.product-list {
  list-style-type: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Four items per row */
  gap: 20px;
}

.product-item {
  display: flex;
  justify-content: center;
}

.product-card {
  width: 100%;
  max-width: 280px;
  height: 480px; /* Fixed height for uniformity */
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  transition: transform 0.2s, box-shadow 0.2s;
  background-color: #fff;
  display: flex;
  flex-direction: column; /* Vertical layout */
  justify-content: space-between; /* Space out content */
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.product-image-container {
  background-color: #f9f9f9;
  padding: 10px;
  height: 180px; /* Reduced height to fit other elements */
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.product-details {
  padding: 10px;
  text-align: left;
  flex-grow: 1; /* Ensures details expand to fill space */
}

.product-name {
  font-size: 1rem;
  font-weight: bold;
  margin: 5px 0;
  color: #333;
  text-align: center;
}

.product-description {
  font-size: 0.85rem;
  color: #666;
  line-height: 1.4;
  height: 45px; /* Smaller height for truncated description */
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 10px;
  text-align: justify;
}

.product-price {
  font-size: 1rem;
  font-weight: bold;
  color: #007BFF;
  text-align: center;
  margin-top: auto; /* Pushes the price to the bottom */
  padding-bottom: 10px; /* Add space between price and bottom of the card */
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  background-color: #007BFF;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  margin: 0 5px;
  cursor: pointer;
  font-size: 1rem;
}

.pagination button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.pagination span {
  font-size: 1rem;
  margin: 0 10px;
  color: #333;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .product-list {
    grid-template-columns: repeat(3, 1fr); /* Three items per row */
  }
}

@media (max-width: 768px) {
  .product-list {
    grid-template-columns: repeat(2, 1fr); /* Two items per row */
  }
}

@media (max-width: 480px) {
  .product-list {
    grid-template-columns: 1fr; /* One item per row */
  }
}
.favorite-button {
  background-color: #ddd;
  color: #333;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.favorite-button.favorite-active {
  background-color: #ffcc00;
  color: #fff;
}

.details-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.details-button:hover {
  background-color: #0056b3;
}

.favorite-button i, .details-button i {
  margin-right: 5px;
}
</style>
