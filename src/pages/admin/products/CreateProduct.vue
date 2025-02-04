<script>
import axios from 'axios';
import { onMounted, ref } from 'vue';

export default {
  setup() {
    const product = ref({
      name: '',
      price: '',
      description: '',
      categoryId: '',
      imageFile: null, // Stores the selected file
    });

    const categories = ref([]);
    const successMessage = ref('');
    const errorMessage = ref('');

    // Fetch categories from the API
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5084/api/Category/getAll');
        categories.value = response.data;
      }
      catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    // Call fetchCategories when the component is mounted
    onMounted(() => {
      fetchCategories();
    });

    // Handle file selection
    const handleFileUpload = (event) => {
      product.value.imageFile = event.target.files[0];
    };

    // Submit form
    const submitProduct = async () => {
      try {
        const formData = new FormData();
        formData.append('Name', product.value.name);
        formData.append('Price', product.value.price);
        formData.append('Description', product.value.description);
        formData.append('CategoryId', product.value.categoryId);

        if (product.value.imageFile) {
          formData.append('ImageFile', product.value.imageFile);
        }

        const response = await axios.post(
          'http://localhost:5084/api/Product/create',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        successMessage.value = 'Product created successfully!';
        errorMessage.value = '';
        console.log('Response:', response.data);

        // Reset form after success
        product.value = {
          name: '',
          price: '',
          description: '',
          categoryId: '',
          imageFile: null,
        };
      }
      catch (error) {
        successMessage.value = '';
        errorMessage.value = 'Failed to create product.';
        console.error('Error:', error);
      }
    };

    return {
      product,
      categories,
      successMessage,
      errorMessage,
      handleFileUpload,
      submitProduct,
    };
  },
};
</script>

<template>
  <div class="container">
    <h2>Create Product</h2>
    <form @submit.prevent="submitProduct">
      <div>
        <label>Product Name:</label>
        <input v-model="product.name" type="text" required placeholder="Enter product name...">
      </div>

      <div>
        <label>Price:</label>
        <input v-model="product.price" required placeholder="Enter product price...">
      </div>

      <div>
        <label>Description:</label>
        <textarea v-model="product.description" required placeholder="Enter prodct description" />
      </div>

      <div>
        <label>Category:</label>
        <select v-model="product.categoryId" required>
          <option disabled value="">
            Please select a category
          </option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>

      <div>
        <label>Upload Image:</label>
        <input type="file" @change="handleFileUpload">
      </div>

      <button type="submit">
        Create Product
      </button>
    </form>

    <p v-if="successMessage" class="success">
      {{ successMessage }}
    </p>
    <p v-if="errorMessage" class="error">
      {{ errorMessage }}
    </p>
  </div>
</template>

<style scoped>
.container {
  max-width: 500px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f9f9f9;
}
label {
  display: block;
  margin-top: 10px;
}
input, textarea, select {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  box-sizing: border-box;
}
button {
  margin-top: 15px;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}
.success {
  color: green;
  margin-top: 10px;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
