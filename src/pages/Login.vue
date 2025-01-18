<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/useAuthStore';

const username = ref('');
const password = ref('');
const errorMessage = ref(null);
const authStore = useAuthStore();
const router = useRouter();
const isLoading = ref(false);

async function handleLogin() {
  isLoading.value = true;
  errorMessage.value = null;

  try {
    const response = await axios.post('http://localhost:5084/api/auth/login', {
      email: username.value,
      password: password.value,
    });

    const data = response.data;

    console.log('Login successful:', data);

    // Save token securely
    localStorage.setItem('token', data.token);

    // Call setLoggedIn method in the store
    authStore.setLoggedIn(true, { name: username.value });

    // Redirect to home
    router.push({ name: 'home' });
  }
  catch (error) {
    console.error('Error during login:', error);
    errorMessage.value = error.response?.data?.message || 'An error occurred. Please try again.';
  }
  finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <progress v-if="isLoading" class="loader-line" />
  <div class="login-form">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="username">Username:</label>
        <input id="username" v-model="username" type="text" required>
      </div>
      <div>
        <label for="password">Password:</label>
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
</template>

<style scoped>
.loader-line {
  width: 100%;
  height: 3px;
  background-color: #ddd;
  margin: 0 auto;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
}

.loader-line:before {
  content: "";
  position: absolute;
  left: -50%;
  height: 3px;
  width: 40%;
  background-color: #444;
  animation: lineAnim 1s linear infinite;
  border-radius: 20px;
}

@keyframes lineAnim {
  0% {
    left: -50%;
  }
  100% {
    left: 100%;
  }
}

.login-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
}

.login-form h2 {
  text-align: center;
  margin-bottom: 20px;
}

.login-form div {
  margin-bottom: 15px;
}

.login-form label {
  display: block;
  margin-bottom: 5px;
}

.login-form input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.login-form button {
  width: 100%;
  padding: 10px;
  background-color: #444;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.login-form button:hover {
  background-color: #666;
}

.error {
  color: red;
  margin-top: 10px;
  text-align: center;
}
</style>
