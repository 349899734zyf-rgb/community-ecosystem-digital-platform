<!--
  Academic References & Acknowledgements:
  - UI Components: Bootstrap 5.3 Forms (https://getbootstrap.com/docs/5.3/)
  - Purpose: Clean User Login with Field-Specific Validations (BR C.1 & BR C.2)
-->

<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-7 col-lg-5">
        
        <!-- Login Card Container without heavy shadows -->
        <div class="card border-0 p-4 p-md-5 rounded-3">
          
          <!-- Header Title -->
          <div class="text-center mb-4">
            <h3 class="fw-bold text-success mb-1">Welcome Back</h3>
            <p class="text-secondary small">
              <!-- Sign in to access your biodiversity dashboard -->
              Sign in to access your biodiversity dashboard
            </p>
          </div>

          <!-- Login Form -->
          <form @submit.prevent="handleLogin" novalidate>
            
            <!-- 1. Email Address Input -->
            <div class="mb-3">
              <label class="form-label small fw-bold">Email Address *</label>
              <input 
                v-model.trim="email" 
                type="email" 
                class="form-control" 
                :class="{ 'is-invalid': errors.email }"
                placeholder="name@domain.com"
                @input="errors.email = ''"
              >
              <div class="invalid-feedback">{{ errors.email }}</div>
            </div>

            <!-- 2. Password Input -->
            <div class="mb-3">
              <label class="form-label small fw-bold">Password *</label>
              <input 
                v-model="password" 
                type="password" 
                class="form-control" 
                :class="{ 'is-invalid': errors.password }"
                placeholder="Enter your password"
                @input="errors.password = ''"
              >
              <div class="invalid-feedback">{{ errors.password }}</div>
            </div>

            <!-- Sign In Submit Button -->
            <button type="submit" class="btn btn-success w-100 fw-bold py-2 mb-3 mt-2">
              Sign In
            </button>

            <!-- Navigation Link to Register View -->
            <div class="text-center small text-secondary">
              Don't have an account yet? 
              <router-link to="/register" class="text-success fw-bold text-decoration-none">
                Register here
              </router-link>
            </div>
          </form>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Import Vue core APIs and plantStore
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { plantStore } from '../store/plantStore'

// Router instance
const router = useRouter()

// Two-way data binding for credentials
const email = ref('')
const password = ref('')

// Field-specific error messages object
const errors = ref({
  email: '',
  password: ''
})

// Handle Login Submission
function handleLogin() {
  // Reset error states
  errors.value.email = ''
  errors.value.password = ''

  // Validate empty fields
  if (!email.value.trim()) {
    errors.value.email = 'Email address is required.'
  }
  if (!password.value) {
    errors.value.password = 'Password is required.'
  }

  // Block submission if fields are empty
  if (errors.value.email || errors.value.password) {
    return
  }

  // Invoke credential verification in plantStore
  const result = plantStore.loginUser(email.value, password.value)

  // If failed
  if (!result.success) {
    if (result.message.includes('Account does not exist')) {
      errors.value.email = result.message
    } else {
      errors.value.password = result.message
    }
    return
  }

  // Successful login, redirect based on role
  if (result.user.role === 'Administrator') {
    router.push('/admin')
  } else {
    router.push('/catalog')
  }
}
</script>