<template>
  <div class="not-found">
    <img
      src="../images/404-error-page-not-found.png"
      alt="404 Error: Page Not Found"
      class="not-found-image"
    >
    <router-link to="/" class="home-link">
      Return to Home
    </router-link>
  </div>
</template>

  <style scoped>
  .not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 20px;
  }

  .not-found-image {
    max-width: 53%;
    height: auto;
  }

  .not-found-text {
    font-size: 1.2em;
    margin: 20px 0;
    color: #555;
  }

  .home-link {
    text-decoration: none;
    color: #007bff;
    font-weight: bold;
    margin-top: 10px;
    transition: color 0.3s ease;
    position: absolute 30px;

  }

  .home-link:hover {
    color: #0056b3;
  }
  </style>
