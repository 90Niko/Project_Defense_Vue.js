<script>
import { useEventBus } from '@/stores/useEventBus';
import axios from 'axios';
import { onMounted, onUnmounted, ref } from 'vue';

export default {
  setup() {
    const chatSessions = ref([]);
    const loading = ref(false);
    const selectedSession = ref(null);
    const newMessage = ref('');
    const eventBus = useEventBus();
    const userEmail = ref('Admin'); // Admin email or identifier
    let unreadInterval = null; // Store interval reference

    // Function to check unread messages
    const checkForUnreadMessages = async () => {
      try {
        for (const session of chatSessions.value) {
          const unreadResponse = await axios.get(
            `http://localhost:5084/api/Chat/userUnRead/${session.userEmail}`,
          );
          session.hasUnread = unreadResponse.data.unreadCount > 0;
        }
      }
      catch (error) {
        console.error('Error checking unread messages:', error);
      }
    };

    // Fetch chat sessions
    const fetchChatSessions = async () => {
      loading.value = true;
      try {
        const response = await axios.get('http://localhost:5084/api/Chat/getAllChatSessions');
        chatSessions.value = response.data;
        await checkForUnreadMessages(); // Check for unread messages
      }
      catch (error) {
        console.error('Error fetching chat sessions:', error);
        chatSessions.value = [];
      }
      finally {
        loading.value = false;
      }
    };

    // Send message to selected session
    const sendMessage = async () => {
      if (!newMessage.value.trim() || !selectedSession.value) {
        return;
      }

      const messagePayload = {
        chatSessionId: selectedSession.value.id,
        userEmail: userEmail.value,
        message: newMessage.value,
      };

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

        selectedSession.value.messages.push({
          id: response.data.id, // Assuming response contains the message ID
          sender: 'Admin',
          content: newMessage.value,
          timestamp: new Date().toISOString(),
        });

        newMessage.value = ''; // Clear input field
      }
      catch (error) {
        console.error('Error sending message:', error);
      }
    };

    // Toggle selected session and mark messages as read
    const toggleSession = async (session) => {
      if (selectedSession.value === session) {
        selectedSession.value = null; // Close session
      }
      else {
        selectedSession.value = session; // Open session

        try {
          await axios.get(`http://localhost:5084/api/Chat/adminMarkAsRead/${session.userEmail}`);
          session.hasUnread = false; // Update UI

          // Emit event to update unread messages in the sidebar
          eventBus.emit('messages-read');
        }
        catch (error) {
          console.error('Error marking messages as read:', error);
        }
      }
    };

    // Poll for unread messages every 5 seconds
    onMounted(() => {
      fetchChatSessions();
      unreadInterval = setInterval(checkForUnreadMessages, 5000);
    });

    // Clear interval when component unmounts
    onUnmounted(() => {
      if (unreadInterval) {
        clearInterval(unreadInterval);
      }
    });

    // Format date
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString();
    };

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
            <!-- Show red dot if there are unread messages -->
            <span v-if="session.hasUnread" class="unread-dot" />
          </h3>
          <p>User Email: {{ session.userEmail }}</p>
          <p>Created At: {{ formatDate(session.createdAt) }}</p>

          <!-- Show messages if this session is selected -->
          <div v-if="selectedSession === session" class="messages">
            <h4>Messages:</h4>
            <ul>
              <li v-for="message in session.messages" :key="message.id" class="message-item" :class="[message.sender === 'Admin' ? 'admin' : 'user']">
                <p><strong>{{ message.sender }}:</strong> {{ message.content }}</p>
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

  .message-item {
    padding: 10px;
    border-radius: 8px;
    background-color: #f1f1f1;
    margin-bottom: 10px;
  }

  .message-item.admin {
    background-color: #d3e6f2;
    text-align: right;
  }

  .message-item.user {
    background-color: #e9f7ff;
    text-align: left;
  }

  .timestamp {
    font-size: 0.8em;
    color: #999;
    margin-top: 5px;
  }

  textarea {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    border-radius: 5px;
    resize: none;
  }

  button {
    background-color: #007bff;
    color: white;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
  }

  .unread-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: red;
    border-radius: 50%;
    margin-left: 10px;
  }
</style>
