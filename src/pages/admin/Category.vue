<script>
export default {
  name: 'Category',
};
</script>

<template>
  <div>
    <h1>Category Management</h1>
    <nav>
      <router-link to="/admin/category/all-category">
        All Categories
      </router-link>
      <router-link to="/admin/category/create-category">
        Create Category
      </router-link>
    </nav>
    <router-view />
  </div>
</template>
