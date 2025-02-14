<script setup>
import AppAsideBar from '@/components/AppAsideBar.vue';
</script>

<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <AppAsideBar />

    <!-- Main Content Area -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f5f6fa;
}

.main-content {
  flex-grow: 1;
  background-color: #ffffff; /* Match the width of the sidebar */
}

/* Responsive design for smaller screens */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 10px;
  }
}
</style>
