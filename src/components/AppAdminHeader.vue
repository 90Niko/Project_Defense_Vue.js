<template>
  <header>
    <nav>
      <router-link to="/admin/dashboard">
        Dashboard
      </router-link>
      <router-link to="/admin/manage-users">
        Users
      </router-link>
      <router-link to="/admin/create-product">
        Create Product
      </router-link>
      <router-link to="/admin/create-category">
        Create Category
      </router-link>
    </nav>
  </header>
</template>

  <style>
  header {
    background-color: #343a40;
    color: white;
    padding: 10px;
  }
  nav a {
    margin-right: 10px;
    color: white;
  }
  </style>
