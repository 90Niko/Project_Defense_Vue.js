<script setup>
import { useAuthStore } from '@/stores/useAuthStore';
import axios from 'axios';
import { onMounted, ref } from 'vue';

const authStore = useAuthStore();
const userEmail = ref('');
const message = ref('');
const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

onMounted(() => {
  if (authStore.user) {
    userEmail.value = authStore.user.name;
  }
});

async function sendMessage() {
  successMessage.value = '';
  errorMessage.value = '';
  loading.value = true;

  try {
    const response = await axios.get('http://localhost:5084/api/Chat/send', {
      params: { userEmail: userEmail.value, message: message.value },
    });

    if (response.status === 200) {
      successMessage.value = 'Message sent successfully!';
      message.value = '';
    }
  }
  catch (error) {
    console.error(error);
    errorMessage.value = 'Failed to send message. Please try again later.';
  }
  finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="container">
    <h2>Contact Support</h2>
    <form @submit.prevent="sendMessage">
      <div class="form-group">
        <label for="message">Message:</label>
        <textarea id="message" v-model="message" placeholder="Type your message..." required />
      </div>
      <button type="submit" :disabled="loading">
        Send Message
      </button>
      <p v-if="successMessage" class="success">
        {{ successMessage }}
      </p>
      <p v-if="errorMessage" class="error">
        {{ errorMessage }}
      </p>
    </form>
  </div>
</template>

<style scoped>
.container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #f9f9f9;
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  font-weight: bold;
}
textarea {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:disabled {
  background: #ccc;
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
