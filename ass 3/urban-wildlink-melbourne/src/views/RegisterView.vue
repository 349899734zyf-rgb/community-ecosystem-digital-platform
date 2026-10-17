<!--
  Academic References & Acknowledgements:
  - UI Components: Bootstrap 5.3 Forms & Floating Labels (https://getbootstrap.com/docs/5.3/)
  - Icons: Bootstrap Icons (https://icons.getbootstrap.com/)
  - Purpose: Multi-Role User Registration (BR C.1 Authentication & BR C.2 Roles)
-->

<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <!-- Registration Card Container -->
        <div class="card border-0 rounded-4 p-4 p-md-5 bg-white">
          
          <!-- Header Title & Subtitle -->
          <div class="text-center mb-4">
            <h3 class="fw-bold text-success mt-2 mb-1">Create an Account</h3>
            <p class="text-secondary small">
              <!-- Join the Urban WildLink Melbourne Community -->
              Join the Urban WildLink Melbourne Community
            </p>
          </div>

          <!-- Registration Form Area -->
          <form @submit.prevent="handleRegister" novalidate>
            
            <!-- 1. Full Legal Name Input -->
            <div class="mb-3">
              <label for="regFullName" class="form-label small fw-bold">Full Legal Name *</label>
              <input 
                id="regFullName"
                v-model.trim="form.fullName" 
                type="text" 
                class="form-control" 
                :class="{ 'is-invalid': errors.fullName }"
                placeholder=""
                aria-required="true"
                @input="validateField('fullName')"
              >
              <div class="invalid-feedback">{{ errors.fullName }}</div>
            </div>

            <!-- 2. Contact Email Input -->
            <div class="mb-3">
              <label for="regEmail" class="form-label small fw-bold">Email Address *</label>
              <input 
                id="regEmail"
                v-model.trim="form.email" 
                type="email" 
                class="form-control" 
                :class="{ 'is-invalid': errors.email }"
                placeholder=""
                aria-required="true"
                @input="validateField('email')"
              >
              <div class="invalid-feedback">{{ errors.email }}</div>
            </div>

            <!-- 3. Three-tier Role Selector (BR C.2 Core Requirement) -->
            <div class="mb-3">
              <label for="regRole" class="form-label small fw-bold">Select Account Role *</label>
              <select 
                id="regRole"
                v-model="form.role" 
                class="form-select"
                :class="{ 'is-invalid': errors.role }"
                aria-required="true"
                @change="validateField('role')"
              >
                <!-- Option 1: Resident / Backyard Gardener -->
                <option value="Resident">Resident</option>

                <!-- Option 2: Community Nursery Volunteer -->
                <option value="Volunteer">Volunteer</option>

                <!-- Option 3: NFP Administrator / Coordinator -->
                <option value="Administrator">Administrator</option>
              </select>

              <!-- Role Permission Help Text -->
              <div class="form-text small mt-1 text-muted">
                <span v-if="form.role === 'Resident'">
                  <!-- Resident: Can adopt plants and submit species reviews. -->
                  Resident: Browse catalog, adopt seedlings, and leave reviews.
                </span>
                <span v-else-if="form.role === 'Volunteer'">
                  <!-- Volunteer: Can manage nursery stock and check distribution lists. -->
                  Volunteer: Restock seedlings, check nursery orders, and support operations.
                </span>
                <span v-else-if="form.role === 'Administrator'">
                  <!-- Administrator: Full administrative access and species governance. -->
                  Administrator: Full approval authority and species management.
                </span>
              </div>
            </div>

            <!-- 4. Password Input -->
            <div class="mb-3">
              <label for="regPassword" class="form-label small fw-bold">Password *</label>
              <input 
                id="regPassword"
                v-model="form.password" 
                type="password" 
                class="form-control" 
                :class="{ 'is-invalid': errors.password }"
                placeholder="At least 6 characters"
                aria-required="true"
                @input="validateField('password')"
              >
              <div class="invalid-feedback">{{ errors.password }}</div>
            </div>

            <!-- 5. Confirm Password Input -->
            <div class="mb-3">
              <label for="regConfirmPassword" class="form-label small fw-bold">Confirm Password *</label>
              <input 
                id="regConfirmPassword"
                v-model="form.confirmPassword" 
                type="password" 
                class="form-control" 
                :class="{ 'is-invalid': errors.confirmPassword }"
                placeholder="Repeat your password"
                aria-required="true"
                @input="validateField('confirmPassword')"
              >
              <div class="invalid-feedback">{{ errors.confirmPassword }}</div>
            </div>

            <!-- Submit Registration Button -->
            <button type="submit" class="btn btn-success w-100 fw-bold py-2 mb-3" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Register Account
            </button>

            <!-- Navigation Link to Login Page -->
            <div class="text-center small text-secondary">
              Already have an account? 
              <router-link to="/login" class="text-success fw-bold text-decoration-none">
                Sign In here
              </router-link>
            </div>
          </form>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Import Vue Core APIs, global state store, and Firebase Auth (BR D.1)
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { plantStore } from '../store/plantStore'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'

// Initialize router instance for redirection
const router = useRouter()
const isSubmitting = ref(false)

// Reactive form state object
const form = ref({
  fullName: '',
  email: '',
  role: 'Resident',
  password: '',
  confirmPassword: ''
})

// Form validation error messages object
const errors = ref({
  fullName: '',
  email: '',
  role: '',
  password: '',
  confirmPassword: ''
})

// Top-level submission error message
const errorMessage = ref('')

// Real-time input field validator function
function validateField(field) {
  // Validate Full Name
  if (field === 'fullName') {
    errors.value.fullName = form.value.fullName.length >= 2 ? '' : 'Full legal name must contain at least 2 characters.'
  }
  // Validate Email Format (RFC Regex)
  if (field === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!form.value.email) {
      errors.value.email = 'Email address is required.'
    } else if (!emailRegex.test(form.value.email)) {
      errors.value.email = 'Please enter a valid email address.'
    } else {
      errors.value.email = ''
    }
  }
  // Validate Password Length
  if (field === 'password') {
    errors.value.password = form.value.password.length >= 6 ? '' : 'Password must be at least 6 characters long.'
    if (form.value.confirmPassword) {
      validateField('confirmPassword')
    }
  }
  // Validate Password Match
  if (field === 'confirmPassword') {
    errors.value.confirmPassword = form.value.confirmPassword === form.value.password ? '' : 'Passwords do not match.'
  }
}

// Handle Form Submission
async function handleRegister() {
  // Trigger validation across all fields
  validateField('fullName')
  validateField('email')
  validateField('password')
  validateField('confirmPassword')

  // Check if any validation errors exist
  const hasErrors = Object.values(errors.value).some(err => err !== '')
  if (hasErrors) return

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    // BR (D.1): External Authentication via Firebase Auth
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.value.email.trim(), form.value.password)
      await updateProfile(userCredential.user, { displayName: form.value.fullName.trim() })
      console.log('[Firebase Auth] User successfully registered in Google Firebase:', userCredential.user.email)
    } catch (fbErr) {
      console.warn('[Firebase Auth] Firebase notice:', fbErr.code, fbErr.message)
      // Continue locally if network is offline or user already registered in Firebase
    }

    // Invoke user registration in plantStore
    const result = plantStore.registerUser({
      fullName: form.value.fullName,
      email: form.value.email,
      role: form.value.role,
      password: form.value.password
    })

    // Display error message under email field if registration fails locally
    if (!result.success) {
      errors.value.email = result.message
      return
    }

    // Registration succeeded, route based on user role
    if (result.user.role === 'Administrator') {
      router.push('/admin')
    } else {
      router.push('/catalog')
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>