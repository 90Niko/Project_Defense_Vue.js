<script>
import { useDetailsStore } from '@/stores/useDetailsStore';

export default {
  setup() {
    const detailsStore = useDetailsStore();
    const currentProduct = detailsStore.currentProduct;

    return {
      currentProduct,
    };
  },
};
</script>

<template>
  <div v-if="currentProduct" class="product-details">
    <div class="details-header">
      <h1>{{ currentProduct.title }}</h1>
    </div>
    <div class="details-content">
      <div class="image-container">
        <img :src="currentProduct.image" :alt="currentProduct.title" class="product-image">
      </div>
      <div class="details-text">
        <p class="product-description">
          {{ currentProduct.description }}
        </p>
        <p class="product-price">
          <strong>Price:</strong> ${{ currentProduct.price }}
        </p>
        <p class="product-category">
          <strong>Category:</strong> {{ currentProduct.category }}
        </p>
      </div>
    </div>
  </div>
  <p v-else class="product-not-found">
    Product not found.
  </p>
</template>

  <style scoped>
  .product-details {
    max-width: 800px;
    margin: 2rem auto;
    padding: 1.5rem;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .details-header {
    text-align: center;
    margin-bottom: 1rem;
  }

  .details-header h1 {
    font-size: 1.8rem;
    color: #333;
    margin: 0;
  }

  .details-content {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .image-container {
    flex: 1 1 40%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .product-image {
    max-width: 100%;
    max-height: 300px;
    border-radius: 8px;
    object-fit: cover;
  }

  .details-text {
    flex: 1 1 50%;
    font-size: 1rem;
    color: #555;
    line-height: 1.6;
  }

  .product-description {
    margin-bottom: 2rem;
  }

  .product-price {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: #2a9d8f;
  }

  .product-category {
    font-size: 1rem;
    color: #6c757d;
  }

  .product-not-found {
    text-align: center;
    font-size: 1.2rem;
    color: #dc3545;
    margin-top: 2rem;
  }

  @media (max-width: 600px) {
    .details-content {
      flex-direction: column;
    }

    .details-text {
      text-align: center;
    }
  }
  </style>
