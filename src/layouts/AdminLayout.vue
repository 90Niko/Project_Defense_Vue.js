<script>
import AppAdminHeader from '@/components/AppAdminHeader.vue';

export default {
  components: {
    AppAdminHeader,
  },
};
</script>

<template>
  <div>
    <AppAdminHeader />
    <div class="admin-layout">
      <main class="admin-content">
        <router-view />
      </main>
    </div>
  </div>
</template>
