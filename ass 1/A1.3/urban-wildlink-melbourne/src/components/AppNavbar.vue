<!--
  Academic References & Acknowledgements:
  - Component Reference: Bootstrap 5.3 Navbar (https://getbootstrap.com/docs/5.3/components/navbar/)
  - Purpose: 4-Tier Role-Based Navigation Bar (BR C.1 & BR C.2)
-->

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-success sticky-top">
    <div class="container">
      
      <!-- Brand Title -->
      <router-link to="/" class="navbar-brand d-flex align-items-center fw-bold">
        <span>Urban WildLink Melbourne</span>
      </router-link>

      <!-- Mobile Responsive Hamburger Toggler -->
      <button 
        class="navbar-toggler border-0" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav" 
        aria-controls="navbarNav" 
        aria-expanded="false" 
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navigation Collapsible Area -->
      <div class="collapse navbar-collapse" id="navbarNav">
        
        <!-- Navigation Links -->
        <ul class="navbar-nav me-auto align-items-lg-center">
          <li class="nav-item">
            <router-link to="/" class="nav-link px-3" active-class="active fw-bold">
              Home
            </router-link>
          </li>

          <li class="nav-item">
            <router-link to="/catalog" class="nav-link px-3" active-class="active fw-bold">
              Plant Catalog
            </router-link>
          </li>

          <li class="nav-item">
            <router-link to="/adopt" class="nav-link px-3" active-class="active fw-bold">
              Adopt Plants
            </router-link>
          </li>

          <!-- Console Link -->
          <li v-if="currentUser && (currentUser.role === 'Administrator' || currentUser.role === 'Volunteer')" class="nav-item">
            <router-link to="/admin" class="nav-link px-3" active-class="active fw-bold">
              {{ currentUser.role === 'Administrator' ? 'Admin Console' : 'Nursery Console' }}
            </router-link>
          </li>

          <li class="nav-item">
            <router-link to="/about" class="nav-link px-3" active-class="active fw-bold">
              About
            </router-link>
          </li>
        </ul>
        <div class="d-flex align-items-center gap-3 mt-2 mt-lg-0">
          
          <!-- Guest State-->
          <template v-if="!currentUser">
            <router-link to="/login" class="btn btn-outline-light btn-sm fw-semibold px-3">
              Sign In
            </router-link>
          </template>

          <!-- Logged-in State: Plain text name without badges -->
          <template v-else>
            <span class="text-white small fw-bold">
              {{ currentUser.fullName }}
            </span>

            <button 
              type="button" 
              class="btn btn-outline-light btn-sm" 
              @click="handleLogout"
            >
              Logout
            </button>
          </template>

        </div>

      </div>
    </div>
  </nav>
</template>

<script setup>
// Import Vue computed API and Router
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { plantStore } from '../store/plantStore'

// Router instance
const router = useRouter()

// Reactively retrieve currently logged-in user
const currentUser = computed(() => plantStore.state.currentUser)

// Handle Logout Execution
function handleLogout() {

  // Clear authentication state in store
  plantStore.logoutUser()

  // Redirect to login view
  router.push('/login')
}
</script>