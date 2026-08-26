<template>
  <div class="d-flex flex-column min-vh-100 bg-light">
    <!-- 顶部导航 -->
    <AppNavbar />

    <!-- 路由页面主视口 -->
    <main class="flex-grow-1">
      <router-view />
    </main>

    <!-- 底部页脚 -->
    <AppFooter />
  </div>
</template>

<script setup>
import AppNavbar from './components/AppNavbar.vue'
import AppFooter from './components/AppFooter.vue'
</script>