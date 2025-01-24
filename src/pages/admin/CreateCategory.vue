<script>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const name = ref(''); // Bind to the input field
    const isLoading = ref(false); // To handle loading state
    const errorMessage = ref(''); // To handle error messages
    const successMessage = ref(''); // To display success messages
    const router = useRouter(); // Router instance

    const createCategory = async () => {
      // Reset messages
      errorMessage.value = '';
      successMessage.value = '';

      // Validate input
      if (!name.value.trim()) {
        errorMessage.value = 'Name is required.';
        return;
      }

      isLoading.value = true; // Set loading state

      try {
        // Check if category already exists
        const existingCategory = await axios.get(`http://localhost:5084/api/Category/getAll`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const CheckCategory = existingCategory.data.find(category => category.name === name.value);

        console.log(existingCategory.data);
        console.log(name.value);
        console.log(CheckCategory);
        if (CheckCategory) {
          errorMessage.value = 'Category already exists.';
          return;
        }

        // Make a POST request to the backend
        await axios.post('http://localhost:5084/api/Category', {
          name: name.value,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Handle success
        successMessage.value = 'Category created successfully!';
        name.value = ''; // Reset the input field

        // Navigate to the admin dashboard
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 2000);
      }
      catch (error) {
        // Handle error
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage.value = error.response.data.message;
        }
        else {
          errorMessage.value = 'An error occurred while creating the category.';
        }
      }
      finally {
        isLoading.value = false; // Reset loading state
      }
    };

    return {
      name,
      isLoading,
      errorMessage,
      successMessage,
      createCategory,
    };
  },
};
</script>

<template>
  <div>
    <div class="admin-layout">
      <main class="admin-content">
        <h1>Create Category</h1>
        <form @submit.prevent="createCategory">
          <div>
            <label for="name">Name</label>
            <input id="name" v-model="name" type="text">
          </div>
          <button type="submit" :disabled="isLoading">
            Create Category
          </button>
        </form>
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
}

.admin-content {
  max-width: 600px;
  margin: 0 auto;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

form > div {
  margin-bottom: 15px;
}

button {
  background-color: #007bff;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message {
    margin: 0 auto;
  color: red;
  margin-top: 10px;
}

.success-message {
   margin: 0 auto;
  color: green;
  margin-top: 10px;
}
</style>
