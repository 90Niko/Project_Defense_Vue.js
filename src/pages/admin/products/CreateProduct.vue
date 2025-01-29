<script>
import axios from 'axios';
import { ref } from 'vue';

export default {
  setup() {
    const product = ref({
      name: '',
      price: '',
      description: '',
      categoryId: '',
      imageFile: null, // Stores the selected file
    });

    const successMessage = ref('');
    const errorMessage = ref('');

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

        const response = await axios.post('http://localhost:5084/api/Product/create', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

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
        <input v-model="product.name" type="text" required>
      </div>

      <div>
        <label>Price:</label>
        <input v-model="product.price" type="number" required>
      </div>

      <div>
        <label>Description:</label>
        <textarea v-model="product.description" required />
      </div>

      <div>
        <label>Category ID:</label>
        <input v-model="product.categoryId" type="number" required>
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
input, textarea {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
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
