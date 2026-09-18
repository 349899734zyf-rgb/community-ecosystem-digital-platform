<template>
  <div class="container mt-5 text-center">
    <div class="alert alert-danger py-5">
      <h1 class="display-4 text-danger mb-3">⛔ Access Denied</h1>
      <p class="lead">You do not have permission to view the About page. Please login first.</p>
      <router-link to="/login" class="btn btn-primary mt-3">Go to Login Page</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// 静态无权限提示页
</script>