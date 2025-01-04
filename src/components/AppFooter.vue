<template>
  <footer class="app-footer">
    <p>&copy; {{ new Date().getFullYear() }}</p>
  </footer>
</template>

<style scoped>
.app-footer {
  background-color: #333;
  color: #fff;
  text-align: center;
  padding: 15px 0;
  font-size: 18px;
  position: fixed; /* Makes the footer always visible at the bottom */
  bottom: 0;
  left: 0;
  width: 100%; /* Ensures the footer spans the full width of the viewport */
}
</style>
