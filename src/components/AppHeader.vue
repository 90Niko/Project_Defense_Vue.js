<script setup>
import { useAuthStore } from '@/stores/useAuthStore';
import { useCartStore } from '@/stores/useCartStore';
import axios from 'axios';
import { Home, Info, Mail, Phone, ShoppingBag, Star } from 'lucide-vue-next';
import { computed, onMounted, ref, watch } from 'vue';
import { useToast } from 'vue-toastification';

const authStore = useAuthStore();
const toast = useToast();

// Ensure user information is loaded from localStorage on mounted
onMounted(() => {
  // Check if there's a stored user in localStorage
  const savedUser = localStorage.getItem('user');
  if (savedUser && !authStore.user) {
    authStore.setUser(JSON.parse(savedUser)); // Assuming `setUser` is the method to set user data in the store
  }
});

// Links for navigation
const links = [
  { name: 'home', label: 'Home', icon: Home },
  { name: 'about', label: 'About', icon: Info },
  { name: 'contacts', label: 'Contacts', icon: Phone },
  { name: 'favorite', label: 'Favorite', icon: Star },
  { name: 'products', label: 'Products', icon: ShoppingBag },
];

// Recomputed values for logged-in status, username, and admin status
const isLoggedIn = computed(() => authStore.isLoggedIn);
const userName = computed(() => authStore.user?.name || '');
const isAdmin = computed(() => authStore.user?.role === 'Admin');

const cartStore = useCartStore();
const cartCount = computed(() => cartStore.totalItems);

// State for tracking unread messages
const hasNewNotifications = ref(false);

// Check for unread messages
async function checkUnreadMessages() {
  try {
    if (!isLoggedIn.value || isAdmin.value)
      return; // Don't check for admins

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

// Handle logout action
function handleLogout() {
  authStore.logout();
  localStorage.removeItem('user'); // Remove the user from localStorage on logout
  toast.success('You have been logged out successfully!');
}

const isDropdownOpen = ref(false);

// Toggle dropdown menu
function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

// Close dropdown menu
function closeDropdown() {
  isDropdownOpen.value = false;
}
</script>

<template>
  <nav class="navbarr">
    <button class="dropdown-toggle" @click="toggleDropdown">
      ☰
    </button>
    <ul class="main-links" :class="[{ open: isDropdownOpen }]">
      <li class="cart-icon">
        🛍️
      </li>
      <li v-for="link in links" :key="link.name" class="navbar-item" @click="closeDropdown">
        <router-link :to="{ name: link.name }">
          <component :is="link.icon" class="icons" />
          {{ link.label }}
        </router-link>
      </li>

      <!-- Show Inbox only for logged-in users who are NOT admins -->
      <li v-if="isLoggedIn && !isAdmin" class="navbar-item inbox-item" @click="closeDropdown">
        <router-link :to="{ name: 'userInbox' }">
          <Mail class="icons" /> Inbox
          <span v-if="hasNewNotifications" class="notification-dot" />
        </router-link>
      </li>

      <!-- Show Admin Area only for Admin users -->
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
        <router-link :to="{ name: 'cart' }">
          🛒 Cart <span v-if="cartCount > 0" class="cartCount">({{ cartCount }})</span>
        </router-link>
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
.navbarr {
  height:4rem;
}
.navbar a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  transition: color 0.3s ease, background 0.3s ease;
  border-radius: 8px;
}
.navbar a:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #f8b400;
}
.icons {
 width: 20px;
}
.navbar-item li{
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.logout {
  background-color: #333;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
.logout:hover {
  background-color: #555;
  color: #f8b400;
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
  cursor: pointer;
}
.main-links {
  list-style: none;
  display: flex;
  gap: 0.2rem;
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
.auth-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  transition: color 0.3s ease, background 0.3s ease;
  border-radius: 8px;
}
.auth-links a:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #f8b400;
}
.cartCount {
  color:  #f8b400;

}
.navbar-item a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  transition: color 0.3s ease, background 0.3s ease;
  border-radius: 8px;
}
.navbar-item a:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #f8b400;
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
