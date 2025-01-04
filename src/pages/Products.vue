<script>
import axios from 'axios';

export default {
  data() {
    return {
      products: [],
      currentPage: 1,
      itemsPerPage: 4,
      isLoading: false,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.products.length / this.itemsPerPage);
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.products.slice(start, end);
    },
  },
  async created() {
    this.isLoading = true;
    try {
      const response = await axios.get('https://fakestoreapi.com/products');
      this.products = response.data;
      this.isLoading = false;
    }
    catch (error) {
      console.error('Failed to fetch products:', error);
    }
  },
  methods: {
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.scrollToTop();
      }
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.scrollToTop();
      }
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth', // Smooth scrolling effect
      });
    },
  },
};
</script>

<template>
  <progress v-if="isLoading" />
  <div class="products">
    <h1>Products</h1>
    <ul class="product-list">
      <li v-for="product in paginatedProducts" :key="product.id" class="product-item">
        <article class="product-card">
          <div class="product-image-container">
            <img :src="product.image" :alt="product.title" class="product-image">
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
            <div class="btn">
              <i class="bi bi-plus-circle" />
              <i class="bi bi-star-fill" />
            </div>
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
.products {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
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
</style>
