<script setup>
import axiosWebApi from '@/config/axiosWebApi';
import { useAuthStore } from '@/stores/useAuthStore';
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
    const response = await axiosWebApi.get('/api/Chat/send', {
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
  max-width: 600px;
  margin: 40px auto;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto', sans-serif;
  transition: all 0.3s ease-in-out;
}

h2 {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: #444;
  margin-bottom: 8px;
}

textarea {
  width: 100%;
  padding: 14px;
  font-size: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  resize: vertical;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

textarea:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.3);
}

button {
  width: 100%;
  padding: 15px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

button:hover:enabled {
  background-color: #0056b3;
  transform: scale(1.05);
}

.success {
  color: #28a745;
  font-weight: 600;
  text-align: center;
  margin-top: 20px;
  font-size: 16px;
}

.error {
  color: #dc3545;
  font-weight: 600;
  text-align: center;
  margin-top: 20px;
  font-size: 16px;
}

@media (max-width: 768px) {
  .container {
    padding: 25px;
  }

  h2 {
    font-size: 24px;
  }

  textarea {
    font-size: 14px;
  }

  button {
    font-size: 14px;
  }
}
</style>
