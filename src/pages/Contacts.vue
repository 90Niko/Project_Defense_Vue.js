<script>
import axios from 'axios';
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../stores/useAuthStore';

export default {
  name: 'Contacts',
  setup() {
    const message = ref('');
    const contacts = ref([
      { name: 'Nikolay Geroev', email: 'ngeroev78@gmail.com', phone: '123-456-7890' },
    ]);
    const isLoading = ref(true);
    const isSending = ref(false);
    const chatSessionId = ref('');

    const authStore = useAuthStore();
    const toast = useToast();
    const router = useRouter();
    console.log('AuthStore user:', authStore.user);

    const userEmail = computed(() => authStore.user?.name || '');
    console.log('userEmail:', userEmail.value);

    const sendMessage = async () => {
      if (!message.value.trim()) {
        toast.error('Please enter a message!');
        return;
      }

      if (!userEmail.value) {
        toast.error('User email is missing. Please log in again.');
        return;
      }

      isSending.value = true;

      try {
        const response = await axios.post('http://localhost:5084/api/Message/create', {
          sender: userEmail.value,
          content: message.value,
        });

        if (response.status === 200 && response.data) {
          chatSessionId.value = chatSessionId.value || response.data.chatSessionId || '';
          message.value = '';
          toast.success('Message sent successfully!');
        }
        else {
          toast.error('Failed to send the message. Please try again later.');
        }
      }
      catch (error) {
        toast.error('An error occurred while sending the message. Please try again.');
        console.error('Error sending message:', error.response || error.message);
      }
      finally {
        isSending.value = false;
      }
    };

    watch(
      () => authStore.isLoggedIn,
      (isLoggedIn) => {
        if (!isLoggedIn) {
          toast.clear();
          router.push('/login');
        }
        isLoading.value = false;
      },
      { immediate: true },
    );

    onMounted(() => {
      isLoading.value = !authStore.isLoggedIn;
    });

    return {
      contacts,
      message,
      sendMessage,
      isLoading,
      isSending,
      authStore,
      chatSessionId,
    };
  },
};
</script>

<template>
  <div class="contacts">
    <h1>Contacts</h1>
    <ul>
      <li v-for="contact in contacts" :key="contact.email">
        <h3>{{ contact.name }}</h3>
        <p>Email: {{ contact.email }}</p>
        <p>Phone: {{ contact.phone }}</p>
      </li>
    </ul>

    <div v-if="isLoading">
      Checking login status...
    </div>

    <div v-else-if="authStore.isLoggedIn" class="message-sender">
      <h2>Send a Message</h2>
      <input v-model="message" type="text" placeholder="Type your message..." :disabled="isSending">
      <button :disabled="isSending" @click="sendMessage">
        {{ isSending ? 'Sending...' : 'Send' }}
      </button>
    </div>

    <div v-else>
      <p>You need to be logged in to send a message.</p>
    </div>
  </div>
</template>

<style scoped>
.contacts {
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.contacts h1 {
  color: #2c3e50;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.contacts ul {
  list-style: none;
  padding: 0;
}

.contacts li {
  margin-bottom: 1.5rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fefefe;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.contacts li:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.message-sender {
  margin-top: 2rem;
  text-align: center;
}

.message-sender input {
  padding: 0.5rem;
  width: 80%;
  margin-bottom: 1rem;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.message-sender button {
  padding: 0.5rem 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.message-sender button:hover {
  background-color: #369f72;
}
</style>
