<script>
import { useDetailsStore } from '@/stores/useDetailsStore';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const detailsStore = useDetailsStore();
    const currentProduct = detailsStore.currentProduct;

    async function returnToProducts() {
      await router.push({ name: 'products' });
    }

    const getImageUrl = (imagePath) => {
      if (!imagePath)
        return '/default-product.png';
      // Ensure a full URL is provided if needed
      return imagePath.startsWith('http')
        ? imagePath
        : `http://localhost:5084/${imagePath}`;
    };

    return {
      currentProduct,
      returnToProducts,
      getImageUrl,
      dayjs,
    };
  },
};
</script>

<template>
  <div v-if="currentProduct" class="cart-container">
    <div class="cart-header">
      <h1 class="cart-title">
        {{ currentProduct.title }}
      </h1>
    </div>
    <div class="cart-content">
      <div class="cart-image-container">
        <img
          class="cart-product-image"
          :src="getImageUrl(currentProduct.imagePath)"
          :alt="currentProduct.title"
        >
      </div>
      <div class="cart-details">
        <div class="cart-description">
          <p>{{ currentProduct.description }}</p>
          <p>
            <strong>Created On:</strong>
            {{ dayjs(currentProduct.createdOn).format('ddd, MMM D, YYYY h:mm A') }}
          </p>
        </div>
        <div class="cart-category-price">
          <p class="desc">
            <strong>Category:</strong> {{ currentProduct.categoryName }}
          </p>
          <p class="price">
            <strong>Price:</strong> ${{ currentProduct.price }}
          </p>
        </div>
        <button class="cart-done-button" @click="returnToProducts">
          Done
        </button>
      </div>
    </div>
  </div>
  <p v-else class="cart-product-not-found">
    Product not found.
  </p>
</template>

<style scoped>
/* CSS Variables for theme customization */
:root {
  --primary-color: #5A67D8;
  --primary-color-hover: #434190;
  --text-color: #333;
  --secondary-text-color: #555;
  --accent-color: #e74c3c;
  --background-color: #fff;
  --border-color: #eaeaea;
  --font-family: 'Roboto', sans-serif;
}

/* Card Container */
.cart-container {
  max-width: 750px;
  margin: 40px auto;
  background-color: var(--background-color);
  border-radius: 16px;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.1);
  padding: 40px;
  font-family: var(--font-family);
  color: var(--text-color);
  transition: transform 0.3s ease;
}

.cart-container:hover {
  transform: translateY(-5px);
}

/* Header */
.cart-header {
  text-align: center;
  margin-bottom: 30px;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 15px;
}

.cart-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

/* Content Layout */
.cart-content {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 30px;
  align-items: start;
}

.cart-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.cart-image-container:hover .cart-product-image {
  transform: scale(1.05);
}

.cart-product-image {
  width: 100%;
  height: auto;
  border-radius: 12px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

/* Details Section */
.cart-details {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.cart-description {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--secondary-text-color);
  margin-bottom: 20px;
}

.cart-category-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  margin-bottom: 30px;
  border-top: 1px solid var(--border-color);
  padding-top: 15px;
}

.cart-category-price p {
  margin: 0;
}

.desc {
  color: var(--secondary-text-color);
}

.price {
  color: var(--primary-color);
  font-weight: 600;
  font-size: 1.1rem;
}

/* Button Styling */
.cart-done-button {
  background-color: var(--primary-color);
  color: #fff;
  border: none;
  padding: 14px 35px;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  align-self: flex-start;
  box-shadow: 0 4px 15px rgba(11, 33, 230, 0.4);
}

.cart-done-button:hover {
  background-color: var(--primary-color-hover);
  transform: translateY(-3px);
}

/* Fallback message */
.cart-product-not-found {
  text-align: center;
  font-size: 1.2rem;
  color: var(--accent-color);
  margin-top: 40px;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .cart-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .cart-image-container,
  .cart-details {
    width: 100%;
  }

  .cart-category-price {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
