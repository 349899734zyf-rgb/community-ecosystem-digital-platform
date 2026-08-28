<!--
  References & Acknowledgements:
  - Component Reference: Bootstrap 5.3 Navbar & Responsive Collapse (https://getbootstrap.com/docs/5.3/components/navbar/)
  - Icons: Bootstrap Icons (https://icons.getbootstrap.com/)
  - Routing: Vue Router 4 (createRouter, RouterLink)
-->

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-success sticky-top">
    <div class="container">
      <!-- NFP Brand Logo -->
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

          <!-- Admin Console: Clicking triggers login modal for guests, or navigates directly for admins -->
          <li class="nav-item">
            <a 
              href="javascript:void(0)" 
              class="nav-link px-3 cursor-pointer" 
              :class="{ 'active fw-bold': route.path === '/admin' }"
              @click="handleAdminNavClick"
            >
              Admin Console
            </a>
          </li>

          <li class="nav-item">
            <router-link to="/about" class="nav-link px-3" active-class="active fw-bold">
              About
            </router-link>
          </li>

          <!-- Administrator Logout Action (Visible only when authenticated) -->
          <li v-if="plantStore.state.isAdmin" class="nav-item ms-lg-2">
            <button class="btn btn-outline-light btn-sm" @click="handleAdminLogout" title="Exit Administrator mode">
              <i class="bi bi-box-arrow-right me-1"></i> Logout
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Section 2: Administrator Passcode Verification Modal -->
    <div v-if="showLoginModal" class="modal-backdrop fade show"></div>
    <div v-if="showLoginModal" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered" style="max-width: 400px;">
        <div class="modal-content border-0 shadow">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title fw-bold fs-6">
              Administrator Login
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="showLoginModal = false"></button>
          </div>
          <div class="modal-body p-4">
            <form @submit.prevent="submitAdminPasscode">
              <p class="text-secondary small mb-3">
                Please enter the authorized passcode to unlock the administrative console.
              </p>

              <div class="mb-3">
                <label class="form-label small fw-bold">Admin Passcode</label>
                <div class="input">
                  <span class="input-text bg-light"></span>
                  <input 
                    v-model="inputPasscode" 
                    type="password" 
                    class="form-control" 
                    placeholder=""
                    required
                    autofocus
                  >
                </div>
                <div class="form-text small">
                  Demo passcode: <code class="text-dark fw-bold">admin123</code>
                </div>
              </div>

              <div v-if="loginErrorMessage" class="alert text-danger py-2 small mb-3">
                {{ loginErrorMessage }}
              </div>

              <div class="d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-sm" @click="showLoginModal = false">Cancel</button>
                <button type="submit" class="btn btn-success btn-sm fw-bold">Sign In</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { plantStore } from '../store/plantStore'

const router = useRouter()
const route = useRoute()

const showLoginModal = ref(false)
const inputPasscode = ref('')
const loginErrorMessage = ref('')

function handleAdminNavClick() {
  if (plantStore.state.isAdmin) {
    router.push('/admin')
  } else {
    inputPasscode.value = ''
    loginErrorMessage.value = ''
    showLoginModal.value = true
  }
}

function submitAdminPasscode() {
  const res = plantStore.loginAdmin(inputPasscode.value)
  if (res.success) {
    showLoginModal.value = false
    router.push('/admin')
  } else {
    loginErrorMessage.value = res.message
  }
}

function handleAdminLogout() {
  plantStore.logoutAdmin()
  router.push('/')
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.modal-backdrop {
  opacity: 0.5;
}
</style>