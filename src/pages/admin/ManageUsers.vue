<script>
export default {
  name: 'ManageUsers',
};
</script>

<template>
  <div class="category-container">
    <h1 class="title">
      User Management
    </h1>
    <nav class="navigation">
      <router-link to="/admin/manage-users/all-users" class="nav-link">
        All Users
      </router-link>
    </nav>
    <router-view />
  </div>
</template>

<style scoped>
/* Container */
.category-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  font-family: Arial, sans-serif;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Title */
.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

/* Navigation */
.navigation {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.nav-link {
  text-decoration: none;
  color: #0056b3;
  font-size: 1.2rem;
  font-weight: 500;
  transition: color 0.3s ease, background 0.3s ease;
  padding: 10px 20px;
  border-radius: 5px;
}

.nav-link:hover {
  color: #ffffff;
  background-color: #0056b3;
}

/* Router View Styling */
router-view {
  margin-top: 20px;
}
</style>
