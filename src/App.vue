<script>
import AppFooter from './components/AppFooter.vue';
import AppHeader from './components/AppHeader.vue';

export default {
  components: {
    AppHeader,
    AppFooter,
  },
};
</script>

<template>
  <div class="layout-container">
    <AppHeader />
    <main class="main-content">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.layout-container {
  min-height: 100vh; /* Ensures the layout spans the entire viewport height */
  display: flex;
  flex-direction: column;
  background-image: url('../src/images/background.png'); /* Add the path to your background image */
  background-size: cover; /* Ensures the image covers the entire container */
  background-repeat: no-repeat; /* Prevents the image from repeating */
  background-position: center; /* Centers the image */
}

.main-content {
 /* Allows the content to grow and push the footer down */
  padding: 10px; /* Optional: Add some padding for content */
}
</style>
