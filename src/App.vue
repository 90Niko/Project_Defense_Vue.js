<script>
import AppFooter from '@/components/AppFooter.vue';
import AppHeader from '@/components/AppHeader.vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { onMounted } from 'vue';

export default {
  components: {
    AppHeader,
    AppFooter,
  },
  setup() {
    const authStore = useAuthStore();

    // Ensure authentication state is initialized when app starts
    onMounted(() => {
      authStore.initializeAuth();
    });

    return { authStore };
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
</style>
