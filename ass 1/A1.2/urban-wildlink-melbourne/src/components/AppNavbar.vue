<!--
  References & Acknowledgements:
  - Component Reference: Bootstrap 5.3 Navbar & Responsive Collapse (https://getbootstrap.com/docs/5.3/components/navbar/)
  - Icons: Bootstrap Icons (https://icons.getbootstrap.com/)
  - Routing: Vue Router 4 (createRouter, RouterLink)
-->

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-success sticky-top shadow-sm">
    <div class="container">
      <!-- Brand Logo -->
      <router-link to="/" class="navbar-brand d-flex align-items-center fw-bold">
        <i class="bi bi-tree-fill text-warning me-2 fs-4"></i>
        <span>Urban WildLink Melbourne</span>
      </router-link>

      <!-- Mobile Responsive Hamburger Toggler (BR A.2) -->
      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav" 
        aria-controls="navbarNav" 
        aria-expanded="false" 
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navigation Links -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-lg-center">
          <li class="nav-item">
            <router-link to="/" class="nav-link px-3" active-class="active fw-bold">
              <i class="bi bi-house-door me-1"></i> Home
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/catalog" class="nav-link px-3" active-class="active fw-bold">
              <i class="bi bi-flower1 me-1"></i> Plant Catalog
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/adopt" class="nav-link px-3" active-class="active fw-bold">
              <i class="bi bi-heart me-1"></i> Adopt Plants
            </router-link>
          </li>

          <!-- Independent Admin console entry point -->
          <li class="nav-item">
            <router-link to="/admin" class="nav-link px-3" active-class="active fw-bold">
              <i class="bi bi-shield-lock me-1"></i> Admin Console
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/about" class="nav-link px-3" active-class="active fw-bold">
              <i class="bi bi-info-circle me-1"></i> About
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { plantStore } from '../store/plantStore'
</script>

<style scoped>
.nav-link.active {
  color: #ffc107 !important;
  font-weight: 600;
}
</style>