<script>
import { useDetailsStore } from '@/stores/useDetailsStore';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const detailsStore = useDetailsStore();
    const currentProduct = detailsStore.currentProduct;
    async function returnToProducts() {
      await router.push({ name: 'products' });
    }

    return {
      currentProduct,
      returnToProducts,
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
          :src="currentProduct.image"
          :alt="currentProduct.title"
        >
      </div>
      <div class="cart-details">
        <div class="cart-description">
          <p>{{ currentProduct.description }}</p>
        </div>
        <div class="cart-category-price">
          <p class="desc">
            <strong>Category:</strong> {{ currentProduct.category }}
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
.cart-container {
  max-width: 750px;
  padding: 20px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
  padding-bottom: 30px;
  margin-bottom: 60px;
}

.cart-header {
  text-align: center;
  margin-bottom: 20px;
}
.price{
  color: #35b330;
}
.desc{
  color: #525352;
}
.cart-title {
  font-size: 1.8rem;
  color: #333;
}

.cart-content {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.cart-image-container {
  flex: 1 1 25%;
  display: flex;
  justify-content: center;
  align-items: center;

}

.cart-product-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.cart-details {
  flex: 1 1 50%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cart-description {
  font-size: 0.91rem;
  color: #555;
}

.cart-category-price {
  font-size: 1rem;
  color: #555;
}

.cart-category-price p {
  margin: 5px 0;
}

.cart-done-button {
  text-align: center;
  background-color: #555;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.cart-done-button:hover {
  background-color: #333;
}

.cart-product-not-found {
  text-align: center;
  font-size: 1.2rem;
  color: #d9534f;
}
</style>
