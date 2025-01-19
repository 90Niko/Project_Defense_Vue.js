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
    <h2 class="form-title">
      Login
    </h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="username"><img
          class="form-icon"
          width="24"
          height="24"
          src="https://img.icons8.com/sf-black-filled/24/new-post.png"
          alt="email"
        > Email:</label>
        <input id="username" v-model="username" type="text" required>
      </div>
      <div>
        <label for="password">  <img
          class="form-icon"
          width="24"
          height="24"
          src="https://img.icons8.com/material-sharp/24/password.png"
          alt="password"
        >Password:</label>
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
body {
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-form {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  padding: 20px;
  box-sizing: border-box;
  margin: 0 auto;
  margin-top: 100px;

}
.form-title {
  font-size: 24px;
  font-weight: bold;
  color: #333333;
  text-align: center;
  margin-bottom: 20px;
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

.login-form div {
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
  padding: 10px 10px 10px 40px; /* Space for the icon */
  font-size: 14px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: white;
  transition: border-color 0.2s;
  color: #333333;
  margin: 0 auto;
}

input[type="text"]:focus,
input[type="password"]:focus {
  border-color: #007bff;
}

/* Submit Button */
button {
  background-color: #555;
  color: #ffffff;
  padding: 12px;
  margin-bottom: 5px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  text-align: center;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #333;
}

/* Error Message */
.error {
  font-size: 14px;
  color: #dc3545;
  text-align: center;
}

/* Responsive Design */
@media (max-width: 480px) {
  .login-form {
    padding: 15px;
  }

  .login-form h2 {
    font-size: 20px;
  }

  button {
    padding: 10px;
    font-size: 14px;
  }
}
</style>
