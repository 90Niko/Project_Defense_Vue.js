<script>
import { useAuthStore } from '@/stores/useAuthStore';
import axios from 'axios';
import { ref } from 'vue';

export default {
  name: 'ChatSession',
  setup() {
    // Get the user email from the store
    const authStore = useAuthStore();
    const userEmail = ref(authStore.user?.name || ''); // Use the user's email as a placeholder
    const chatSession = ref(null); // Store the chat session
    const newMessage = ref(''); // New message input
    const loading = ref(false); // Loading state for the API call

    const markAsRead = async () => {
      try {
        await axios.get(`http://localhost:5084/api/Chat/markAsRead?userEmail=${userEmail.value}`);
        // Refresh chat session to update message statuses
      }
      catch (error) {
        console.error('Error marking messages as read:', error);
      }
    };

    markAsRead(); // Call the function when the component is mounted
    // Fetch chat session data from the API
    const fetchChatSession = async () => {
      loading.value = true;
      try {
        const response = await axios.get(`http://localhost:5084/api/Chat/myChatSession/${userEmail.value}`);
        console.log('Fetched Chat Session:', response.data); // Check the structure of the response

        // Ensure valid data before setting the chat session
        if (response.data && response.data.id && Array.isArray(response.data.messages)) {
          chatSession.value = response.data; // Set chat session data
        }
        else {
          chatSession.value = null; // If no valid session, set to null
        }
      }
      catch (error) {
        console.error('Error fetching chat session:', error);
        chatSession.value = null; // Set to null on error
      }
      finally {
        loading.value = false;
      }
    };

    // Send a new message to the backend
    const sendMessage = async () => {
      if (!newMessage.value.trim())
        return; // Don't send empty messages
      try {
        await axios.get(`http://localhost:5084/api/Chat/send?userEmail=${userEmail.value}&message=${encodeURIComponent(newMessage.value)}`);
        newMessage.value = ''; // Clear the input after sending
        fetchChatSession(); // Refresh the chat session to include the new message
      }
      catch (error) {
        console.error('Error sending message:', error);
      }
    };

    // Call the fetchChatSession function when the component is mounted
    fetchChatSession();

    return {
      userEmail,
      chatSession,
      loading,
      newMessage,
      sendMessage,
    };
  },
};
</script>

<template>
  <div class="chat-container">
    <div class="chat-box">
      <!-- Loading state -->
      <div v-if="loading" class="loading-message">
        Loading...
      </div>

      <!-- No chat session found -->
      <div v-if="!chatSession" class="no-chat-session">
        <p>No chat session found. Please check if you are logged in and if the data exists.</p>
      </div>

      <!-- Chat session details -->
      <div v-else>
        <h2 class="chat-header">
          Chat Session
        </h2>
        <p>User Email: {{ chatSession.userEmail }}</p>
        <p>Created At: {{ new Date(chatSession.createdAt).toLocaleString() }}</p>

        <!-- Display messages -->
        <div v-if="chatSession.messages.length > 0" class="messages-list">
          <ul>
            <li v-for="message in chatSession.messages" :key="message.id" :class="{ 'my-message': message.sender === userEmail, 'other-message': message.sender !== userEmail }">
              <div class="message">
                <div class="message-sender">
                  {{ message.sender }}
                </div>
                <div class="message-content">
                  {{ message.content }}
                </div>
                <div class="message-time">
                  {{ new Date(message.timestamp).toLocaleTimeString() }}
                </div>
              </div>
            </li>
          </ul>
        </div>
        <!-- If no messages -->
        <div v-else>
          <p>No messages yet. Start the conversation!</p>
        </div>

        <!-- Send Message Form -->
        <div class="message-form">
          <textarea v-model="newMessage" placeholder="Type your message..." rows="3" />
          <button @click="sendMessage">
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* General Chat Styling */
.chat-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f1f1f1;
}

.chat-box {
  width: 100%;
  max-width: 600px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.chat-header {
  font-size: 1.5em;
  margin-bottom: 15px;
  text-align: center;
  color: #333;
}

.no-chat-session {
  color: #ff0000;
  text-align: center;
}

.messages-list {
  overflow-y: auto;
  max-height: 400px;
  margin-bottom: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.my-message {
  text-align: right;
}

.other-message {
  text-align: left;
}

.message {
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
  max-width: 80%;
  margin: 5px 0;
}

.my-message .message {
  background-color: #d4f5d4;
}

.other-message .message {
  background-color: #e0e0e0;
}

.message-sender {
  font-weight: bold;
  margin-bottom: 5px;
}

.message-content {
  margin-bottom: 5px;
}

.message-time {
  font-size: 0.8em;
  color: #888;
}

.message-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

textarea {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: none;
  font-size: 1em;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.loading-message {
  text-align: center;
  font-size: 1.2em;
  color: #888;
}
</style>
