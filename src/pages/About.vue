<script>
export default {
  name: 'AboutPage',
};
</script>

<template>
  <div class="about-page">
    <h1>About Me</h1>
    <p>
      Welcome to my personal page! I’m Nikolay Geroev, a passionate developer always looking to innovate and learn.
    </p>
    <div class="links">
      <a href="https://github.com/90Niko" target="_blank" rel="noopener noreferrer">
        <button class="link-button">
          <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" class="icon">
          GitHub
        </button>
      </a>
      <a href="https://www.linkedin.com/in/nikolay-geroev-ab0707255/" target="_blank" rel="noopener noreferrer">
        <button class="link-button">
          <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" class="icon">
          LinkedIn
        </button>
      </a>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  font-family: Arial, sans-serif;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.links {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.link-button {
  background-color: #0073b1;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 10px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background-color 0.3s;
}

.link-button:first-child {
  background-color: #333;
}

.link-button:hover {
  opacity: 0.9;
}

.icon {
  width: 20px;
  height: 20px;
}
</style>
