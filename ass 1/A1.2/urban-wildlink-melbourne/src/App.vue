<!--
  References & Acknowledgements:
  - Framework: Vue 3 (Composition API) & Vite
  - Layout Structure: Flexbox Sticky Footer Architecture (min-vh-100, flex-grow-1, mt-auto)
-->

<template>
  <div class="d-flex flex-column min-vh-100">
    <!-- Top Navigation Bar -->
    <AppNavbar />

    <!-- Router Viewport -->
    <main class="flex-grow-1">
      <router-view />
    </main>

    <!-- Sticky Bottom Footer -->
    <AppFooter />
  </div>
</template>

<script setup>
import AppNavbar from './components/AppNavbar.vue'
import AppFooter from './components/AppFooter.vue'
</script>

<style>
/* Global stylesheet imported in main.js */
</style>