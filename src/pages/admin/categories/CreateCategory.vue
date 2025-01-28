<script>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

export default {
  setup() {
    const name = ref(''); // Bind to the input field
    const isLoading = ref(false); // To handle loading state
    const router = useRouter(); // Router instance
    const toast = useToast(); // Toast instance

    const createCategory = async () => {
      // Validate input
      if (!name.value.trim()) {
        toast.error('Name is required.');
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

        if (CheckCategory) {
          toast.error('Category already exists.');
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
        toast.success('Category created successfully!');
        name.value = ''; // Reset the input field

        // Navigate to the admin dashboard
        setTimeout(() => {
          router.push('/admin/category/all-category');
        }, 2000);
      }
      catch (error) {
        // Handle error
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        }
        else {
          toast.error('An error occurred while creating the category.');
        }
      }
      finally {
        isLoading.value = false; // Reset loading state
      }
    };

    return {
      name,
      isLoading,
      createCategory,
    };
  },
};
</script>

<template>
  <main class="admin-content">
    <form class="form" @submit.prevent="createCategory">
      <div class="form-group">
        <label for="name" class="form-label">Name</label>
        <input id="name" v-model="name" type="text" class="form-input">
      </div>
      <button type="submit" :disabled="isLoading" class="btn">
        Create Category
      </button>
    </form>
  </main>
</template>

<style scoped>
.admin-content {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

h1 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
  color: #333;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #333;
  background-color: #f9f9f9;
  font-size: 1rem;
}

.form-input:focus {
  border-color: #007BFF;
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

.btn {
  padding: 0.75rem 1.5rem;
  background-color: #007BFF;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.btn:not(:disabled):hover {
  background-color: #0056b3;
}
</style>
