<script>
import { useAuthStore } from '@/stores/useAuthStore';
import { useDetailsStore } from '@/stores/useDetailsStore';
import { useFavoriteStore } from '@/stores/useFavoriteStore';
import axios from 'axios'; // Use axios directly
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'ProductList',
  setup() {
    // Reactive state
    const products = ref([]);
    const currentPage = ref(1);
    const itemsPerPage = 4;
    const isLoading = ref(false);

    // Stores
    const favoriteStore = useFavoriteStore();
    const authStore = useAuthStore();
    const detailsStore = useDetailsStore();
    const router = useRouter();

    // Computed properties
    const totalPages = computed(() => Math.ceil(products.value.length / itemsPerPage) || 1);
    const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      return products.value.slice(start, start + itemsPerPage);
    });

    // Favorite functionality
    const toggleFavorite = (product) => {
      favoriteStore.toggleFavorite(product);
    };

    const isFavorite = (product) => {
      return favoriteStore.isFavorite(product);
    };

    // View product details
    const viewDetails = (product) => {
      detailsStore.setProduct(product);
      router.push(`/details/${product.id}`);
    };
    const getImageUrl = (imagePath) => {
      if (!imagePath)
        return '/default-product.png'; // ✅ Fallback image

      // ✅ Ensure full image URL
      return imagePath.startsWith('http') ? imagePath : `http://localhost:5084/${imagePath}`;
    };

    // Fetch products from API
    const loadProducts = async () => {
      isLoading.value = true;
      try {
        const response = await axios.get('http://localhost:5084/api/Product/getAll');
        products.value = response.data; // Set the products array with API data

        console.log('Products:', products.value);
      }
      catch (error) {
        console.error('Error fetching products:', error);
      }
      finally {
        isLoading.value = false;
      }
    };

    // Pagination controls
    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    onMounted(loadProducts);

    return {
      products,
      currentPage,
      totalPages,
      paginatedProducts,
      isLoading,
      toggleFavorite,
      isFavorite,
      viewDetails,
      nextPage,
      previousPage,
      isLoggedIn: computed(() => authStore.isLoggedIn),
      getImageUrl,
    };
  },
};
</script>

<template>
  <progress v-if="isLoading" class="loader-line" />
  <div class="products">
    <h1>Products</h1>
    <ul class="product-list">
      <li v-for="product in paginatedProducts" :key="product.id" class="product-item">
        <article class="product-card">
          <div class="product-image-container">
            <img :src="getImageUrl(product.imagePath)" :alt="product.name" class="product-image">
          </div>
          <div class="product-details">
            <h2 class="product-name">
              {{ product.name }}
            </h2>
          </div>
          <p class="product-price">
            $ {{ product.price }}
          </p>
          <div class="btn">
            <button
              v-if="isLoggedIn"
              class="favorite-button"
              :class="{ 'favorite-active': isFavorite(product) }"
              @click="toggleFavorite(product)"
            >
              <i :class="isFavorite(product) ? 'bi bi-x-circle' : 'bi bi-star'" />
              {{ isFavorite(product) ? 'Remove' : 'Favorite' }}
            </button>
            <button v-else class="details-button" @click="viewDetails(product)">
              <i class="bi bi-info-circle" />
              Details
            </button>
          </div>
        </article>
      </li>
    </ul>

    <footer v-if="!isLoading && totalPages > 1" class="pagination-container">
      <button class="pagination-button" :disabled="currentPage === 1" @click="previousPage">
        Previous
      </button>
      <span class="pagination-info">Page {{ currentPage }} of {{ totalPages }}</span>
      <button class="pagination-button" :disabled="currentPage === totalPages" @click="nextPage">
        Next
      </button>
    </footer>
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
  padding-bottom: 40px;
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
  height: 470px; /* Fixed height for uniformity */
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
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 10px;
}

.pagination-button {
  padding: 8px 16px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-button:disabled {
  cursor: not-allowed;
  color: #aaa;
  border-color: #ddd;
}

.pagination-button:not(:disabled):hover {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
}

.pagination-info {
  font-size: 14px;
  color: #555;
}

@media (max-width: 768px) {
  .pagination button {
    padding: 8px 15px;
    font-size: 0.9rem;
  }

  .pagination span {
    font-size: 1rem;
  }
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
