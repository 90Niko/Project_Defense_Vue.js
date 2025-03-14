<script setup>
import { useAuthStore } from '@/stores/useAuthStore'; // Import auth store
import { useCartStore } from '@/stores/useCartStore';
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';

const cartStore = useCartStore();
const authStore = useAuthStore(); // Access auth store

// Reactive form data
const address = ref('');
const city = ref('');
const zip = ref('');
const country = ref('');
const phoneNumber = ref('');
const fullName = ref('');

// Error messages
const errors = ref({
  address: '',
  city: '',
  zip: '',
  country: '',
  phoneNumber: '',
  fullName: '',
  general: '',
});

// Loading state
const isSubmitting = ref(false);

// Computed properties
const allCartProducts = computed(() => cartStore.cartItems);
const totalItems = computed(() =>
  cartStore.cartItems.reduce((acc, item) => acc + item.quantity, 0),
);
const totalPrice = computed(() =>
  cartStore.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2),
);

// Validate fields
function validateField(field, label) {
  if (!field.value) {
    errors.value[label] = `${label} is required.`;
  }
  else {
    errors.value[label] = '';
  }
}

// Submit order
async function submitForm() {
  if (isSubmitting.value)
    return;

  // Reset errors
  errors.value = { address: '', city: '', zip: '', country: '', phoneNumber: '', fullName: '', general: '' };

  // Validate fields
  validateField(address, 'address');
  validateField(city, 'city');
  validateField(zip, 'zip');
  validateField(country, 'country');
  validateField(phoneNumber, 'phoneNumber');
  validateField(fullName, 'fullName');

  // Check for errors
  if (Object.values(errors.value).some(error => error !== ''))
    return;

  if (!authStore.isLoggedIn) {
    errors.value.general = 'You must be logged in to place an order.';
    return;
  }

  // Prepare order data with userId from authStore
  const orderData = {
    customerName: fullName.value,
    customerEmail: authStore.user?.email || '', // Optional if you have email in user data
    customerPhone: phoneNumber.value,
    totalPrice: Number.parseFloat(totalPrice.value),
    address: `${address.value}, ${city.value}, ${zip.value}, ${country.value}`,
    orderItems: allCartProducts.value.map(item => ({
      productId: item.id,
      quantity: item.quantity,
      price: item.price,
    })),
  };

  if (orderData.orderItems.length === 0) {
    errors.value.general = 'Your cart is empty.';
    return;
  }

  try {
    isSubmitting.value = true;

    const response = await axios.post('https://myshop0101.azurewebsites.net/api/Order/create', orderData, {
      headers: { 'Content-Type': 'application/json' },
    });

    console.log('Order Created:', response.data);

    // Clear cart and form
    cartStore.clearCart();
    address.value = '';
    city.value = '';
    zip.value = '';
    country.value = '';
    phoneNumber.value = '';
    fullName.value = '';
  }
  catch (error) {
    console.error('Order creation failed:', error.response?.data || error.message);
  }
  finally {
    isSubmitting.value = false;
  }
}

// Load saved address from localStorage
onMounted(() => {
  const savedAddress = JSON.parse(localStorage.getItem('shippingAddress') || '{}');
  address.value = savedAddress.address || '';
  city.value = savedAddress.city || '';
  zip.value = savedAddress.zip || '';
  country.value = savedAddress.country || '';
  phoneNumber.value = savedAddress.phoneNumber || '';
  fullName.value = savedAddress.fullName || '';
});
</script>

<template>
  <div class="address">
    <h1>Add Shipping Address</h1>

    <!-- Cart Summary -->
    <div v-if="totalItems > 0" class="listItems">
      <h2>Cart Summary ({{ totalItems }} items)</h2>
      <ul>
        <li v-for="item in allCartProducts" :key="item.id">
          <div class="item-details">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-quantity">x{{ item.quantity }}</span>
            <span class="item-price">${{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>
        </li>
      </ul>
      <div class="total-price">
        <strong>Total:</strong> ${{ totalPrice }}
      </div>
    </div>
    <p v-else>
      Your cart is empty.
    </p>

    <!-- General Error Message -->
    <p v-if="errors.general" class="error">
      {{ errors.general }}
    </p>

    <!-- Address Form -->
    <form aria-labelledby="address-form-title" @submit.prevent="submitForm">
      <div>
        <label for="fullName">Full Name</label>
        <input id="fullName" v-model="fullName" type="text" aria-required="true">
        <span v-if="errors.fullName" class="error">{{ errors.fullName }}</span>
      </div>
      <div>
        <label for="phoneNumber">Phone Number</label>
        <input id="phoneNumber" v-model="phoneNumber" type="text" aria-required="true">
        <span v-if="errors.phoneNumber" class="error">{{ errors.phoneNumber }}</span>
      </div>
      <div class="form-control">
        <label for="address">Address</label>
        <input id="address" v-model="address" type="text" aria-required="true">
        <span v-if="errors.address" class="error">{{ errors.address }}</span>
      </div>
      <div class="form-control">
        <label for="city">City</label>
        <input id="city" v-model="city" type="text" aria-required="true">
        <span v-if="errors.city" class="error">{{ errors.city }}</span>
      </div>
      <div class="form-control">
        <label for="zip">Zip</label>
        <input id="zip" v-model="zip" type="text" aria-required="true">
        <span v-if="errors.zip" class="error">{{ errors.zip }}</span>
      </div>
      <div class="form-control">
        <label for="country">Country</label>
        <input id="country" v-model="country" type="text" aria-required="true">
        <span v-if="errors.country" class="error">{{ errors.country }}</span>
      </div>
      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Submitting...' : 'Submit' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
/* Add your styling here */
</style>

<style scoped>
.address {
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  max-width: 600px;
}

.listItems {
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.listItems h2 {
  text-align: center;
}

.listItems ul {
  list-style: none;
  padding: 0;
}

.listItems li {
  display: flex;
  justify-content: space-between;
  background: #f9f9f9;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 8px;
}

.total-price {
  text-align: right;
  font-size: 18px;
  font-weight: bold;
}

.form-control {
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
}

button:hover {
  background: #0056b3;
}

button:disabled {
  background: #ccc;
}

.error {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}

.success {
  color: green;
  font-size: 14px;
  margin-top: 10px;
}
</style>
