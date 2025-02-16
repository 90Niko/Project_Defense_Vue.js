<script>
import axios from 'axios';
import { computed, nextTick, onMounted, ref } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../stores/useAuthStore';

export default {
  name: 'Inbox',
  setup() {
    const messages = ref([]);
    const newMessage = ref('');
    const isLoading = ref(true);
    const isSending = ref(false);
    const authStore = useAuthStore();
    const toast = useToast();

    // Computed user email and role from authStore
    const userEmail = computed(() => authStore.user?.name || '');
    const userRole = computed(() => authStore.role || '');

    // Fetch messages from the server
    const fetchMessages = async () => {
      if (!userEmail.value) {
        toast.error('User email is missing. Please log in again.');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5084/api/Message/getUserChat/${userEmail.value}`, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });

        if (response.status === 200) {
          messages.value = response.data;
          // Auto-scroll to the latest message
          nextTick(() => {
            const chatBox = document.querySelector('.messages');
            if (chatBox)
              chatBox.scrollTop = chatBox.scrollHeight;
          });
        }
        else {
          toast.error('Failed to load messages. Please try again later.');
        }
      }
      catch (error) {
        toast.error('An error occurred while fetching messages.');
        console.error('Error fetching messages:', error);
      }
      finally {
        isLoading.value = false;
      }
    };

    // Send a new message
    const sendMessage = async () => {
      if (!newMessage.value.trim()) {
        toast.error('Please enter a message!');
        return;
      }

      if (!userEmail.value) {
        toast.error('User email is missing. Please log in again.');
        return;
      }

      isSending.value = true;

      try {
        const response = await axios.post(
          'http://localhost:5084/api/Message/create',
          {
            sender: userEmail.value,
            content: newMessage.value,
          },
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          },
        );

        if (response.status === 200) {
          messages.value.push({
            sender: userEmail.value,
            content: newMessage.value,
            timestamp: new Date().toISOString(),
          });

          newMessage.value = '';
          toast.success('Message sent successfully!');

          // Auto-scroll to the latest message
          nextTick(() => {
            const chatBox = document.querySelector('.messages');
            if (chatBox)
              chatBox.scrollTop = chatBox.scrollHeight;
          });
        }
        else {
          toast.error('Failed to send the message. Please try again later.');
        }
      }
      catch (error) {
        toast.error('An error occurred while sending the message.');
        console.error('Error sending message:', error);
      }
      finally {
        isSending.value = false;
      }
    };

    // Initialize fetching of messages if the user is logged in
    onMounted(() => {
      if (authStore.isLoggedIn) {
        fetchMessages();
      }
      else {
        isLoading.value = false;
      }
    });

    return {
      messages,
      newMessage,
      isLoading,
      isSending,
      sendMessage,
      userEmail,
      userRole,
    };
  },
};
</script>

<template>
  <div class="inbox-container">
    <h1>Inbox</h1>

    <div v-if="isLoading" class="loading">
      Loading messages...
    </div>

    <div v-else class="chat-box">
      <div class="messages">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="{ sent: message.sender === userEmail, received: message.sender !== userEmail }"
        >
          <p class="message-content">
            {{ message.content }}
          </p>
          <small class="timestamp">{{ new Date(message.timestamp).toLocaleTimeString() }}</small>
        </div>
      </div>

      <div class="message-input">
        <input
          v-model="newMessage"
          type="text"
          placeholder="Type your message..."
          :disabled="isSending"
          @keyup.enter="sendMessage"
        >
        <button :disabled="isSending" @click="sendMessage">
          {{ isSending ? 'Sending...' : 'Send' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.inbox-container {
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.chat-box {
  display: flex;
  flex-direction: column;
  height: 400px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fefefe;
  padding: 1rem;
  overflow-y: auto;
}

.messages {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.sent {
  align-self: flex-end;
  background-color: #42b983;
  color: white;
  padding: 0.5rem;
  border-radius: 10px;
  margin: 5px 0;
  max-width: 80%;
}

.received {
  align-self: flex-start;
  background-color: #ddd;
  color: black;
  padding: 0.5rem;
  border-radius: 10px;
  margin: 5px 0;
  max-width: 80%;
}

.message-content {
  margin: 0;
}

.timestamp {
  font-size: 0.8rem;
  text-align: right;
  display: block;
  margin-top: 2px;
}

.message-input {
  display: flex;
  margin-top: 1rem;
}

.message-input input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.message-input button {
  padding: 0.5rem 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  margin-left: 0.5rem;
}

.message-input button:hover {
  background-color: #369f72;
}

.loading {
  font-size: 1.2rem;
  color: #42b983;
}
</style>
