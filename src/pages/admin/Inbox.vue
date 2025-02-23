<script>
import axios from 'axios';
import { onMounted, ref } from 'vue';

export default {
  setup() {
    // Reactive state
    const chatSessions = ref([]);
    const loading = ref(false);
    const selectedSession = ref(null); // Track selected session for displaying messages
    const newMessage = ref(''); // New message input field
    const userEmail = ref('Admin'); // Placeholder for admin email, update dynamically as needed

    // Fetch chat sessions
    const fetchChatSessions = async () => {
      loading.value = true;
      try {
        const response = await axios.get('http://localhost:5084/api/Chat/getAllChatSessions');
        console.log('Chat sessions:', response.data);
        chatSessions.value = response.data;
      }
      catch (error) {
        console.error('Error fetching chat sessions:', error);
        chatSessions.value = [];
      }
      finally {
        loading.value = false;
      }
    };

    // Format date
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString(); // Formats date to a readable string
    };

    // Send message to selected session
    const sendMessage = async () => {
      if (!newMessage.value.trim()) {
        return; // Don't send empty messages
      }

      const messagePayload = {
        chatSessionId: selectedSession.value.id,
        userEmail: userEmail.value,
        message: newMessage.value,
      };

      console.log('Sending message with payload:', messagePayload);

      try {
        const response = await axios.post(
          'http://localhost:5084/api/Chat/sendByCurrentChatSesions',
          messagePayload,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        console.log('Message sent:', response.data);

        // Add the new message to the selected session
        selectedSession.value.messages.push({
          id: response.data.id, // Assuming response contains the message ID
          sender: 'Admin', // Since it's the admin sending the message
          content: newMessage.value,
          timestamp: new Date().toISOString(),
        });

        // Clear the message input field
        newMessage.value = ''; // Clear the input field after sending
        console.log('Updated selected session after sending message:', selectedSession.value);
      }
      catch (error) {
        console.error('Error sending message:', error);
      }
    };

    // Fetch chat sessions when the component is mounted
    onMounted(() => {
      fetchChatSessions();
    });

    // Toggle selected session for showing/hiding messages
    const toggleSession = (session) => {
      if (selectedSession.value === session) {
        selectedSession.value = null; // Deselect if clicked again
      }
      else {
        selectedSession.value = session; // Select this session
      }
    };

    // Return reactive state and methods for use in the template
    return {
      chatSessions,
      loading,
      formatDate,
      selectedSession,
      toggleSession,
      newMessage,
      sendMessage,
    };
  },
};
</script>

<template>
  <div class="admin-inbox">
    <h1>Admin Inbox</h1>

    <!-- Loading state -->
    <div v-if="loading" class="loading">
      Loading...
    </div>

    <!-- No sessions found message -->
    <div v-else-if="!chatSessions.length" class="no-sessions">
      No chat sessions found.
    </div>

    <!-- Chat sessions -->
    <div v-else>
      <ul>
        <li v-for="session in chatSessions" :key="session.id" class="chat-session">
          <h3 @click="toggleSession(session)">
            Session ID: {{ session.id }}
          </h3>
          <p>User Email: {{ session.userEmail }}</p>
          <p>Created At: {{ formatDate(session.createdAt) }}</p>

          <!-- Show messages if this session is selected -->
          <div v-if="selectedSession === session" class="messages">
            <h4>Messages:</h4>
            <ul>
              <li v-for="message in session.messages" :key="message.id" class="message-item" :class="[message.sender === 'Admin' ? 'admin' : 'user']">
                <p>
                  <strong>{{ message.sender }}:</strong> {{ message.content }}
                </p>
                <p class="timestamp">
                  <em>{{ formatDate(message.timestamp) }}</em>
                </p>
              </li>
            </ul>

            <!-- New message input and send button -->
            <div>
              <textarea v-model="newMessage" placeholder="Type your message..." rows="3" />
              <button :disabled="!newMessage.trim()" @click="sendMessage">
                Send Message
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

  <style scoped>
    .admin-inbox {
      font-family: Arial, sans-serif;
      background-color: #f4f7f6;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      max-width: 800px;
      margin: 0 auto;
    }

    .chat-session {
      background-color: #fff;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    h3 {
      margin: 0;
      font-size: 1.3em;
      cursor: pointer;
      color: #333;
      font-weight: bold;
    }

    p {
      margin: 5px 0;
      color: #666;
    }

    ul {
      list-style-type: none;
      padding-left: 0;
    }

    li {
      margin-bottom: 10px;
    }

    .messages {
      margin-top: 15px;
      padding-left: 20px;
      padding-right: 20px;
    }

    .messages ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .message-item {
      display: flex;
      flex-direction: column;
      margin-bottom: 15px;
      padding: 10px;
      border-radius: 8px;
      background-color: #f1f1f1;
    }

    .message-item.admin {
      background-color: #d3e6f2; /* Light blue for admin messages */
      align-items: flex-end; /* Align admin messages to the right */
    }

    .message-item.user {
      background-color: #e9f7ff; /* Light background for user messages */
      align-items: flex-start; /* Align user messages to the left */
    }

    .message-item p {
      margin: 5px 0;
    }

    .message-item .sender {
      font-weight: bold;
      color: #007bff;
    }

    .message-item .content {
      padding: 10px;
      border-radius: 10px;
      max-width: 70%;
    }

    .message-item .timestamp {
      font-size: 0.8em;
      color: #999;
      margin-top: 5px;
    }

    textarea {
      width: 100%;
      padding: 10px;
      margin-top: 10px;
      margin-bottom: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      resize: none;
      font-size: 1em;
      box-sizing: border-box;
    }

    button {
      background-color: #007bff;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 1em;
      width: 100%;
    }

    button:hover {
      background-color: #0056b3;
    }

    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .loading {
      font-size: 1.2em;
      color: #007bff;
      font-weight: bold;
      text-align: center;
    }

    .no-sessions {
      text-align: center;
      font-size: 1.2em;
      color: #666;
    }
  </style>
