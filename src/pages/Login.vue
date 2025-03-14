<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification'; // Import toast
import { useAuthStore } from '../stores/useAuthStore';

const username = ref('');
const password = ref('');
const errorMessage = ref(null);
const authStore = useAuthStore();
const router = useRouter();
const isLoading = ref(false);
const toast = useToast(); // Initialize toast

async function handleLogin() {
  isLoading.value = true;
  errorMessage.value = null;

  try {
    const response = await axios.post('https://myshop0101.azurewebsites.net/api/auth/login', {
      email: username.value,
      password: password.value,
    });

    const { token, role } = response.data;

    // Validate role and token
    if (!role || !token) {
      throw new Error('Invalid response from server.');
    }

    // Store token and role in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);

    // Set logged-in state in the store
    authStore.setLoggedIn(true, { name: username.value, role });

    // Show success toast
    toast.success('Login successful!');

    // Redirect based on role
    if (role === 'Admin') {
      router.push({ name: 'AdminDashboard' });
    }
    else {
      router.push({ name: 'home' });
    }
  }
  catch (error) {
    console.error('Error during login:', error);
    errorMessage.value = error.response?.data?.message || 'An unexpected error occurred. Please try again.';

    // Show error toast
    toast.error(errorMessage.value);
  }
  finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div>
    <!-- Loading indicator -->
    <progress v-if="isLoading" class="loader-line" />

    <!-- Login form -->
    <div class="login-form">
      <h2 class="form-title">
        Login
      </h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">
            <img
              class="form-icon"
              width="24"
              height="24"
              src="https://img.icons8.com/sf-black-filled/24/new-post.png"
              alt="email"
            >
            Email:
          </label>
          <input id="username" v-model="username" type="text" required>
        </div>
        <div class="form-group">
          <label for="password">
            <img
              class="form-icon"
              width="24"
              height="24"
              src="https://img.icons8.com/material-sharp/24/password.png"
              alt="password"
            >
            Password:
          </label>
          <input id="password" v-model="password" type="password" required>
        </div>
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
        <p v-if="errorMessage" class="error">
          {{ errorMessage }}
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>
body {
  font-family: 'Arial', sans-serif;
  background-color: #f0f4f8;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-form {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  padding: 30px;
  box-sizing: border-box;
  margin: 0 auto;
  margin-top: 100px;
}

.form-title {
  font-size: 28px;
  font-weight: bold;
  color: #333333;
  text-align: center;
  margin-bottom: 25px;
}

.loader-line {
  height: 4px;
  background-color: #007bff;
  width: 100%;
  animation: loading 1.5s linear infinite;
  border-radius: 4px;
  margin-bottom: 20px;
}

@keyframes loading {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}

.login-form form {
  display: flex;
  flex-direction: column;
}

.form-group {
  position: relative;
  margin-bottom: 20px;
}

.form-icon {
  position: absolute;
  left: 10px;
  top: 72%;
  transform: translateY(-50%);
  z-index: 1;
  pointer-events: none;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  height: 50px;
  padding: 10px 10px 10px 40px;
  font-size: 16px;
  border: 1px solid #cccccc;
  border-radius: 8px;
  box-sizing: border-box;
  background-color: white;
  transition: border-color 0.2s;
  color: #333333;
  margin: 0 auto;
}

input[type="text"]:focus,
input[type="password"]:focus {
  border-color: #007bff;
  outline: none;
}

button {
  background-color: #007bff;
  color: #ffffff;
  padding: 14px;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  text-align: center;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

.error {
  font-size: 14px;
  color: #dc3545;
  text-align: center;
  margin-top: 10px;
}

/* Responsive Design */
@media (max-width: 480px) {
  .login-form {
    padding: 20px;
  }

  .form-title {
    font-size: 24px;
  }

  button {
    padding: 12px;
    font-size: 14px;
  }
}
</style>
