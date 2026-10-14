<!--
  References & Acknowledgements:
  - Framework: Vue 3 (Composition API) & Vite
  - Layout Structure: Flexbox Sticky Footer Architecture (min-vh-100, flex-grow-1, mt-auto)
-->

<template>
  <div class="d-flex flex-column min-vh-100">
    <!-- Accessibility Skip Link (BR E.3: WCAG 2.1 AA Bypass Blocks) -->
    <a href="#main-content" class="skip-link btn btn-success fw-bold">
      Skip to main content
    </a>

    <!-- Offline Resilience Banner (BR F.1-4) -->
    <OfflineBanner />

    <!-- Top Navigation Bar -->
    <AppNavbar />

    <!-- Router Viewport -->
    <main id="main-content" class="flex-grow-1" tabindex="-1">
      <router-view />
    </main>

    <!-- Sticky Bottom Footer -->
    <AppFooter />
  </div>
</template>

<script setup>
import OfflineBanner from './components/OfflineBanner.vue'
import AppNavbar from './components/AppNavbar.vue'
import AppFooter from './components/AppFooter.vue'
</script>

<style>
/* WCAG 2.1 AA Keyboard Navigation Skip Link */
.skip-link {
  position: absolute;
  top: -50px;
  left: 15px;
  z-index: 1200;
  transition: top 0.2s ease-in-out;
}
.skip-link:focus {
  top: 15px;
}
</style>