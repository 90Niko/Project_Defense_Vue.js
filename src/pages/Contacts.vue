<script>
import axios from 'axios';
import { computed, onMounted, ref, watch } from 'vue'; // Import Composition API functions
import { useToast } from 'vue-toastification'; // Import toast function
import { useAuthStore } from '../stores/useAuthStore'; // Import the auth store

export default {
  name: 'Contacts',
  setup() {
    // Create refs for state properties
    const message = ref('');
    const errorMessage = ref('');
    const contacts = ref([
      { name: 'Nikolay Geroev', email: 'ngeroev78@gmail.com', phone: '123-456-7890' },
    ]);
    const isLoading = ref(true); // Flag for loading state

    // Access the auth store inside the setup function
    const authStore = useAuthStore();
    const toast = useToast(); // Use the toast function from the toast plugin

    // Computed property for user email
    const userEmail = computed(() => {
      return authStore.user ? authStore.user.email : ''; // Safely access the email
    });

    // Send message method
    const sendMessage = async () => {
      if (!message.value) {
        toast.error('Please enter a message!'); // Show an error toast
        return;
      }

      if (!userEmail.value) {
        toast.error('You must be logged in to send a message.'); // Show an error toast
        return;
      }

      try {
        // Log the request payload for debugging
        console.log('Sending message:', {
          sender: userEmail.value,
          content: message.value,
        });

        // Call the API to send the message with the dynamically fetched email
        const response = await axios.post('http://localhost:5084/api/Message/create', {
          sender: userEmail.value, // Use the email from the auth store
          content: message.value, // The content of the message
        });

        // Log the response to see what's being returned
        console.log('Response from server:', response);

        // On success, check if the response status is 201 and then display the message content
        if (response.status === 201 && response.data) {
          message.value = ''; // Clear the input after sending
          errorMessage.value = ''; // Clear any previous error messages

          // Display success toast
          toast.success('Message was successfully sent!');
        }
        else {
          toast.error(`Failed to send the message. Response status: ${response.status}. Please try again later.`);
        }
      }
      catch (error) {
        // Log the error response and message for better insight
        console.error('Error sending message:', error.response || error.message);

        toast.error('An error occurred while sending the message. Please try again.');
        if (error.response) {
          // Additional detailed error message
          toast.error(`Error: ${error.response.status} - ${error.response.statusText}`);
        }
      }
    };

    // Watch the auth store's login status
    watch(
      () => authStore.isLoggedIn,
      (isLoggedIn) => {
        if (!isLoggedIn) {
          toast.error('You need to be logged in to send messages.');
        }
        else {
          toast.clear(); // Clear error message toast when logged in
        }
        isLoading.value = false; // Set loading to false once login status is determined
      },
      { immediate: true }, // Trigger immediately after mounting
    );

    // Check login status when the component is mounted
    onMounted(() => {
      if (!authStore.isLoggedIn) {
        toast.error('You need to be logged in to send messages.');
        isLoading.value = false;
      }
    });

    // Return all necessary refs and methods to the template
    return {
      contacts,
      message,
      errorMessage,
      sendMessage,
      isLoading,
    };
  },
};
</script>

<template>
  <div class="contacts">
    <h1>Contacts</h1>
    <ul>
      <li v-for="contact in contacts" :key="contact.id">
        <h3>{{ contact.name }}</h3>
        <p>Email: {{ contact.email }}</p>
        <p>Phone: {{ contact.phone }}</p>
      </li>
    </ul>

    <!-- Show a loading message while the login status is being determined -->
    <div v-if="isLoading">
      Checking login status...
    </div>

    <div v-else class="message-sender">
      <h2>Send a Message</h2>
      <input v-model="message" type="text" placeholder="Type your message...">
      <button @click="sendMessage">
        Send
      </button>
      <p v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>
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

.contacts li h3 {
  margin: 0 0 0.5rem 0;
  color: #34495e;
  font-size: 1.2rem;
  text-decoration: none;
}

.contacts li p {
  margin: 0.3rem 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.message-sender {
  margin-top: 2rem;
  text-align: center;
}

.message-sender input {
  padding: 0.5rem;
  width: 80%;
  margin-bottom: 1rem;
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

.error-message {
  color: red;
  font-size: 1rem;
  margin-top: 1rem;
}
</style>
