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
    <!-- Conditionally render either AdminHeader or AppHeader -->
    <AppHeader />
    <main class="main-content">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.layout-container {
  min-height: 100vh;
  background-image: url('../src/images/background.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.main-content {
  padding: 0.6rem;
}
</style>
