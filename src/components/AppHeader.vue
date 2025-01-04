<script setup>
import { useAuthStore } from '@/stores/auth';
import { computed } from 'vue';

const authStore = useAuthStore();

const links = [
  { name: 'home', label: 'Home' },
  { name: 'about', label: 'About' },
  { name: 'contacts', label: 'Contacts' },
  { name: 'favorite', label: 'Favorite' },
  { name: 'products', label: 'Products' },
];

const isLoggedIn = computed(() => authStore.isLoggedIn);
const userName = computed(() => authStore.user?.name || '');

function handleLogout() {
  authStore.logout();
}
</script>

<template>
  <nav>
    <ul class="main-links">
      <li class="cart-icon">
        🛍️
      </li>
      <li v-for="link in links" :key="link.name" class="navbar">
        <router-link :to="{ name: link.name }">
          {{ link.label }}
        </router-link>
      </li>
    </ul>
    <ul class="auth-links">
      <li v-if="isLoggedIn">
        Welcome, {{ userName }}
      </li>
      <li v-if="isLoggedIn">
        <button @click="handleLogout">
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
}

.main-links {
  list-style: none;
  display: flex;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.login-link {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  color: #fff;
}

.login-link li {
  font-size: 1rem;
  display: inline-block;
  margin: 0 0.5rem;
  color: #fff!important;

}
.login-link li .router-link:hover {
  background-color: #555;
  color: #bf9494;
}

nav ul li a{
  font-size: 1rem;
  display: inline-block;
  color: #fff;
}

nav ul li a:active {
  color: #702222;
  font-weight: bold; /* Optional for added emphasis */
/* Optional for added effect */
}

nav ul li a:hover {
  color: #7e6868;
  transform: scale(1.1);
  transition: color 1s ease;

}

.logo img {
  height: 40px;
  width: auto;
}

.cart-icon {
  font-size: 1.5rem;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  nav {
    flex-direction: column;
    align-items: flex-start;
  }

  .main-links {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .login-link {
    margin-top: 1rem;
  }

  .logo {
    margin-bottom: 1rem;
  }
}
</style>
