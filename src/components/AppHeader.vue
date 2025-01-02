<script>
export default {
  data() {
    return {
      links: [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Product', path: '/product' },
        { name: 'Favorite', path: '/favorite' },
      ],
    };
  },
};
</script>

<template>
  <nav>
    <ul>
      <li class="cart-icon">
        🛍️
      </li>
      <li>
        <router-link to="/">
          Home
        </router-link>
      </li>
      <li>
        <router-link to="/about">
          About
        </router-link>
      </li>
      <li>
        <router-link to="/product">
          Product
        </router-link>
      </li>
      <li>
        <router-link to="/favorite">
          Favorite
        </router-link>
      </li>
    </ul>
    <ul>
      <li>
        <router-link to="/cart">
          🛒 Cart
        </router-link>
      </li>
      <li>
        <a>
          <router-link to="/signin">
            Sign In
          </router-link>
        </a>
      </li>
      <li>
        <router-link to="/login">
          Login
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  padding: 0rem 1rem;
}

nav ul {
  list-style: none;
  display: flex;
  gap: 1.5rem;
  margin: 0;
  padding: 0;
}

nav ul li {
  font-size: 0.9rem;
}

nav ul li {
  text-decoration: none;
  color: #fff;
  padding: 0.5rem 0.5rem;
  border-radius: 4px;
}

nav ul li:hover {
  background-color: #555;
  color: #bf9494;
}

/* Specific styling for the cart icon */
nav ul li [router-link="/cart"] {
  display: flex;
  align-items: center;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  nav {
    flex-direction: column;
  }

  nav ul {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
}
.cart-icon {
  font-size: 1.9rem;
}
</style>
