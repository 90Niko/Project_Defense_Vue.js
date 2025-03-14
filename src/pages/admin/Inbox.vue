<script>
import { useEventBus } from '@/stores/useEventBus';
import axios from 'axios';
import { nextTick, onMounted, onUnmounted, ref } from 'vue';

export default {
  setup() {
    const chatSessions = ref([]);
    const loading = ref(false);
    const selectedSession = ref(null);
    const newMessage = ref('');
    const eventBus = useEventBus();
    const userEmail = ref('Admin'); // Admin email or identifier
    let unreadInterval = null; // Store interval reference

    const scrollToBottom = () => {
      nextTick(() => {
        const messageContainer = document.querySelector('.messages');
        if (messageContainer) {
          messageContainer.scrollTop = messageContainer.scrollHeight;
        }
      });
    };

    const checkForUnreadMessages = async () => {
      try {
        for (const session of chatSessions.value) {
          const unreadResponse = await axios.get(
            `https://myshop0101.azurewebsites.net/api/Chat/userUnRead/${session.userEmail}`,
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
        const response = await axios.get('https://myshop0101.azurewebsites.net/api/Chat/getAllChatSessions');
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

    // Check for unread message

    // Send message to selected session
    const sendMessage = async () => {
      if (!newMessage.value.trim() || !selectedSession.value)
        return;

      const messagePayload = {
        chatSessionId: selectedSession.value.id,
        userEmail: userEmail.value,
        message: newMessage.value,
      };

      try {
        const response = await axios.post(
          'https://myshop0101.azurewebsites.net/api/Chat/sendByCurrentChatSesions',
          messagePayload,
          { headers: { 'Content-Type': 'application/json' } },
        );

        selectedSession.value.messages.push({
          id: response.data.id,
          sender: 'Admin',
          content: newMessage.value,
          timestamp: new Date().toISOString(),
        });

        newMessage.value = ''; // Clear input field
        scrollToBottom(); // Scroll to the latest message
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
          await axios.get(`https://myshop0101.azurewebsites.net/api/Chat/adminMarkAsRead/${session.userEmail}`);
          session.hasUnread = false; // Update UI
          eventBus.emit('messages-read'); // Emit event to update sidebar
        }
        catch (error) {
          console.error('Error marking messages as read:', error);
        }
        scrollToBottom(); // Scroll to the latest message
      }
    };

    // Scroll to the bottom of the messages container

    // Format date
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString();
    };

    // Poll for unread messages every 5 seconds
    onMounted(() => {
      fetchChatSessions();
      unreadInterval = setInterval(checkForUnreadMessages, 5000);
    });

    // Clear interval when component unmounts
    onUnmounted(() => {
      if (unreadInterval)
        clearInterval(unreadInterval);
    });

    return {
      chatSessions,
      loading,
      selectedSession,
      newMessage,
      sendMessage,
      toggleSession,
      formatDate,
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
    <div v-else class="chat-container">
      <div class="session-list">
        <div
          v-for="session in chatSessions"
          :key="session.id"
          class="session-item"
          :class="{ active: selectedSession === session }"
          @click="toggleSession(session)"
        >
          <div class="session-header">
            <span class="user-email">{{ session.userEmail }} </span>
            <span v-if="session.hasUnread" class="unread-dot" />
          </div>
          <span class="session-date">{{ formatDate(session.createdAt) }}</span>
        </div>
      </div>

      <!-- Chat window -->
      <div v-if="selectedSession" class="chat-window">
        <div class="messages">
          <div
            v-for="message in selectedSession.messages"
            :key="message.id"
            class="message"
            :class="message.sender === 'Admin' ? 'admin' : 'user'"
          >
            <p class="message-content">
              {{ message.content }}
            </p>
            <p class="message-timestamp">
              {{ formatDate(message.timestamp) }}
            </p>
          </div>
        </div>

        <!-- New message input -->
        <div class="message-input">
          <textarea
            v-model="newMessage"
            placeholder="Type your message..."
            @keyup.enter="sendMessage"
          />
          <button :disabled="!newMessage.trim()" @click="sendMessage">
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-inbox {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f4f7f6;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  max-width: 1300px;
  margin: 20px auto;
  min-height: 600px;
}

.chat-container {
  display: flex;
  gap: 20px;
  min-height: 400px;
}

.session-list {
  flex: 1;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  max-height: 100%;
  overflow-y: auto;
}

.session-item {
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 15px;
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.session-item:hover {
  background-color: #f1f1f1;
  transform: translateX(5px);
}

.session-item.active {
  background-color: #007bff;
  color: white;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.5);
}

.session-header {
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.user-email {
  font-size: 1.1em;
}

.unread-dot {
  width: 10px;
  height: 10px;
  background-color: #dc3545;
  border-radius: 50%;
  left: 120px;
  top: 15px;
  position: relative;
}

.session-date {
  font-size: 0.9em;
  color: #666;
  margin-top: 5px;
}

.chat-window {
  flex: 2;
  background-color: #fff;
  border-radius: 10px;
  height: 600px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.message {
  margin-bottom: 15px;
  padding: 12px;
  border-radius: 10px;
  max-width: 70%;
  font-size: 1em;
  word-wrap: break-word;
}

.message.admin {
  background-color: #e7f5ff;
  margin-left: auto;
}

.message.user {
  background-color: #f1f1f1;
  margin-right: auto;
}

.message-content {
  margin: 0;
}

.message-timestamp {
  font-size: 0.8em;
  color: #777;
  margin-top: 5px;
}

.message-input {
  display: flex;
  gap: 12px;
  padding-top: 15px;
  align-items: stretch;
}

textarea {
  flex: 1;
  border-radius: 8px;
  border: 1px solid #ddd;
  resize: none;
  outline: none;
  transition: border-color 0.3s ease;
  height: 60px; /* Set a fixed height */
  padding: 12px;
}

textarea:focus {
  border-color: #007bff;
}

button {
  padding: 0 20px; /* Remove padding to make the button height uniform */
  height: 60px; /* Set button height to match the textarea */
  display: inline-block;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.loading,
.no-sessions {
  font-size: 1.2em;
  color: #555;
  text-align: center;
  padding: 30px;
}

@media screen and (max-width: 768px) {
  .chat-container {
    flex-direction: column;
  }

  .session-list {
    margin-bottom: 20px;
  }

  .message-input {
    flex-direction: column;
    align-items: stretch;
  }

  .messages {
    max-height: auto;
  }

  button {
    width: 100%;
  }

  textarea {
    width: 100%;
  }
}
</style>
