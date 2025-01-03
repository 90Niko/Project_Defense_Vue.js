<script>
export default {
  data() {
    return {
      links: [
        { name: 'home', label: 'Home' },
        { name: 'about', label: 'About' },
        { name: 'contacts', label: 'Contacts' },
        { name: 'favorite', label: 'Favorite' },
        // { name: 'login', label: 'Login' },
      ],
    };
  },
};
</script>

<template>
  <header>
    <nav>
      <ul class="main-links">
        <li class="cart-icon">
          🛍️
        </li>
        <li v-for="link in links" :key="link.name">
          <router-link :to="{ name: link.name }">
            {{ link.label }}
          </router-link>
        </li>
      </ul>
      <ul class="login-link">
        <li>
          <router-link :to="{ name: 'register' }">
            Register
          </router-link>
        </li><li>
          <router-link :to="{ name: 'login' }">
            Login
          </router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
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
}

.login-link li {
  font-size: 1rem;

}

.login-link li .router-link {
  text-decoration: none;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.login-link li .router-link:hover {
  background-color: #555;
  color: #bf9494;
}

nav ul li {
  font-size: 1rem;
}

.main-links li .router-link {
  text-decoration: none;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.main-links li .router-link:hover {
  background-color: #555;
  color: #bf9494;
}

.logo img {
  height: 40px;
  width: auto;
}

.cart-icon {
  font-size: 1.5rem;
  cursor: pointer;
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
