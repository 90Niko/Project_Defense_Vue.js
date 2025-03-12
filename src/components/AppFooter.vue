<template>
  <footer class="app-footer">
    <p class="footer-text">
      &copy; {{ new Date().getFullYear() }} Designed by N.Geroev
    </p>
    <div class="social-icons">
      <a href="https://www.facebook.com" target="_blank"><i class="fab fa-facebook" /></a>
      <a href="https://www.instagram.com" target="_blank"><i class="fab fa-instagram" /></a>
      <a href="https://www.tiktok.com" target="_blank"><i class="fab fa-tiktok" /></a>
      <a href="https://www.linkedin.com" target="_blank"><i class="fab fa-linkedin" /></a>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background-color: #333;
  color: #fff;
  padding: 15px 20px;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  z-index: 1000;
}

.footer-text {
 flex: 1;
  text-align: center; /* Centers the text */
  font-size: 20px;
}

.social-icons {
  display: flex;
  align-items: center;
}

.social-icons a {
  color: #fff;
  margin: 0 10px;
  font-size: 24px;
  transition: color 0.3s;
}

.social-icons a:hover {
  color: #f8b400;
}
</style>
