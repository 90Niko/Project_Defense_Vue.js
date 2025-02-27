<script setup>
import { useAuthStore } from '@/stores/useAuthStore';
import { useCartStore } from '@/stores/useCartStore';
import axios from 'axios';
import { computed, onMounted, ref, watch } from 'vue';
import { useToast } from 'vue-toastification';

const authStore = useAuthStore();
const toast = useToast();

const links = [
  { name: 'home', label: 'Home' },
  { name: 'about', label: 'About' },
  { name: 'contacts', label: 'Contacts' },
  { name: 'favorite', label: 'Favorite' },
  { name: 'products', label: 'Products' },
];

const isLoggedIn = computed(() => authStore.isLoggedIn);
const userName = computed(() => authStore.user?.name || '');
const isAdmin = computed(() => authStore.user?.role === 'Admin');

const cartStore = useCartStore();
const cartCount = computed(() => cartStore.totalItems);

// State for tracking unread messages
const hasNewNotifications = ref(false);

async function checkUnreadMessages() {
  try {
    const userEmail = authStore.user?.name;
    if (userEmail) {
      const response = await axios.get('http://localhost:5084/api/Chat/anyIsUnread', {
        params: { userEmail },
      });
      hasNewNotifications.value = response.data;
    }
  }
  catch (error) {
    console.error('Error fetching unread messages:', error);
  }
}

// Watch login state to check unread messages
watch(isLoggedIn, (newValue, oldValue) => {
  if (newValue && !oldValue) {
    checkUnreadMessages();
  }
});

// Check unread messages on mount
onMounted(() => {
  if (isLoggedIn.value) {
    checkUnreadMessages();
    setInterval(checkUnreadMessages, 30000); // Check every 30 seconds
  }
});

function handleLogout() {
  authStore.logout();
  toast.success('You have been logged out successfully!');
}

const isDropdownOpen = ref(false);

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

function closeDropdown() {
  isDropdownOpen.value = false;
}
</script>

<template>
  <nav>
    <button class="dropdown-toggle" @click="toggleDropdown">
      ☰
    </button>
    <ul class="main-links" :class="[{ open: isDropdownOpen }]">
      <li class="cart-icon">
        🛍️
      </li>
      <li v-for="link in links" :key="link.name" class="navbar" @click="closeDropdown">
        <router-link :to="{ name: link.name }">
          {{ link.label }}
        </router-link>
      </li>

      <!-- Show Inbox only for logged-in users -->
      <li v-if="isLoggedIn && !isAdmin" class="navbar inbox-item" @click="closeDropdown">
        <router-link :to="{ name: 'userInbox' }">
          Inbox
          <span v-if="hasNewNotifications" class="notification-dot" />
        </router-link>
        <!-- Custom Tooltip -->
        <span v-if="hasNewNotifications" class="tooltip">You have a new message(1)</span>
      </li>

      <li v-if="isAdmin" class="navbar" @click="closeDropdown">
        <router-link :to="{ name: 'AdminDashboard' }">
          Admin Area
        </router-link>
      </li>
    </ul>
    <ul class="auth-links">
      <li v-if="isLoggedIn">
        Welcome, {{ userName }}
      </li>
      <li v-if="isLoggedIn">
        <button class="cart">
          <router-link :to="{ name: 'cart' }">
            🛒 Cart <span v-if="cartCount > 0">({{ cartCount }})</span>
          </router-link>
        </button>
      </li>

      <li v-if="isLoggedIn">
        <button class="logout" @click="handleLogout">
          Logout
        </button>
      </li>
      <li v-if="!isLoggedIn">
        <router-link :to="{ name: 'register' }">
          Register
        </router-link>
      </li>
      <li v-if="!isLoggedIn">
        <router-link :to="{ name: 'login' }">
          Login
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.logout {
  background-color: #333;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
.logout:hover {
  background-color: #555;
}
.navbar {
  text-decoration: none;
  list-style: none;
  margin: 0;
  padding: 0;
  color: #fff;
}
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  padding: 0rem 1rem;
  position: relative;
}
.cart {
  background-color: #333;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  text-decoration: underline;
}
.main-links {
  list-style: none;
  display: flex;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.main-links.open {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #333;
  width: 100%;
  padding: 1rem;
  gap: 1rem;
  z-index: 1;
}

.auth-links {
  display: flex;
  gap: 1rem;
}

/* Responsive Dropdown */
.dropdown-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
}

.dropdown-toggle:focus {
  outline: none;
}

.logo-and-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .main-links {
    display: none;
    flex-direction: column;
    align-items: flex-start;
  }

  .auth-links {
    flex-direction: row;
    gap: 0.5rem;
  }

  .dropdown-toggle {
    display: block;
  }
}

/* Red dot notification */
.notification-dot {
  width: 8px;
  height: 8px;
  background-color: red;
  border-radius: 50%;
  position: absolute;
  top: -3px;
  right: -10px;
}

/* Custom Tooltip */
.tooltip {
  position: absolute;
  background-color: #ffffff;
  color: #333;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 10px;
  top: -30px;
  left: 280%;
  transform: translateX(-50%);
  white-space: nowrap;
  display: none;
  transition: opacity 0.2s ease-in-out;
  opacity: 0;
}

.inbox-item:hover .tooltip {
  display: block;
  opacity: 1;
}

.inbox-item {
  position: relative;
}
</style>
