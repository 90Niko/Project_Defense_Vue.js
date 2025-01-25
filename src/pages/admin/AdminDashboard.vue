<script>
export default {
  name: 'AdminDashboard',
  methods: {
    navigateTo(path) {
      this.$router.push(path); // Use Vue Router's push method
    },
  },
};
</script>

<template>
  <div class="button-group">
    <button type="button" class="product-button" aria-label="Manage Products" @click="navigateTo('/admin/create-product')">
      Product
    </button>
    <button type="button" class="category-button" aria-label="Manage Categories" @click="navigateTo('/admin/create-category')">
      Category
    </button>
    <button type="button" class="user-button" aria-label="Manage Users" @click="navigateTo('/admin/manage-users')">
      User
    </button>
  </div>
</template>

<style scoped>
.button-group {
  display: flex;
  flex-direction: row; /* Arrange buttons in a row */
  gap: 1.5rem; /* Add spacing between columns */
  justify-content: center; /* Center the buttons horizontally */
  margin-top: 2rem; /* Add some space at the top */
}

button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 450px;
  height: 150px;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  color: white;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

button:active {
  transform: scale(0.95);
}

.product-button {
  background-color: #007bff; /* Blue */
}

.category-button {
  background-color: #28a745; /* Green */
}

.user-button {
  background-color: #ffc107; /* Yellow */
  color: #333; /* Darker text for better contrast */
}
@media (max-width: 768px) {
  .button-group {
    flex-direction: column; /* Arrange buttons in a column */
    gap: 1rem; /* Add spacing between rows */
    align-items: center; /* Center the buttons horizontally */
  }
  button {
    width: 100%; /* Make buttons take full width */
    height: auto;
  /* Adjust height automatically */
    padding: 1rem 0; /* Add some padding for smaller screens */
 /* Make buttons stack vertically */
  }
  button:hover {
    transform: none;
    box-shadow: none;
    color: white;
    background-color: #555;
  }
}
</style>
