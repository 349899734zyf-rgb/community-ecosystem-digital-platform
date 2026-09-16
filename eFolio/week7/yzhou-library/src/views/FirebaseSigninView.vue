<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-sm p-4">
          <h1 class="text-center mb-4">Firebase Sign In</h1>

          <!-- User State Display -->
          <div v-if="currentUser" class="alert alert-info text-center">
            <p class="mb-1"><strong>Currently Logged In As:</strong> {{ currentUser.email }}</p>
            <p class="mb-1">
              <strong>User UID:</strong> <small class="text-muted">{{ currentUser.uid }}</small>
            </p>
            <p class="mb-0">
              <strong>Role:</strong>
              <span class="badge" :class="currentRole === 'admin' ? 'bg-danger' : 'bg-success'" style="margin-left: 8px;">
                {{ currentRole.toUpperCase() }}
              </span>
            </p>
            <div v-if="currentRole === 'admin'" class="alert alert-warning mt-2 mb-0 py-1">
              <small>👑 <strong>Admin Access:</strong> Full library administrative permissions granted.</small>
            </div>
            <div v-else-if="currentRole === 'user'" class="alert alert-secondary mt-2 mb-0 py-1">
              <small>👤 <strong>User Access:</strong> Standard member book borrowing privileges.</small>
            </div>
          </div>

          <!-- Sign In Form -->
          <div v-if="!currentUser">
            <div class="mb-3">
              <label class="form-label">Email address</label>
              <input
                type="email"
                class="form-control"
                placeholder="Enter your email"
                v-model="email"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Password</label>
              <input
                type="password"
                class="form-control"
                placeholder="Enter your password"
                v-model="password"
              />
            </div>

            <!-- Role Selector for Task 7.2 Multiple Roles Login -->
            <div class="mb-3">
              <label class="form-label">Sign in as Role (Access Control)</label>
              <select class="form-select" v-model="selectedRole">
                <option value="user">User (Regular Member)</option>
                <option value="admin">Admin (Librarian Administrator)</option>
              </select>
            </div>

            <div class="d-grid gap-2 mt-4">
              <button class="btn btn-success" @click="signin">
                Sign in via Firebase
              </button>
            </div>
          </div>

          <!-- Logout Button (for Task 7.2 HD Level) -->
          <div v-else class="d-grid gap-2 mt-4">
            <button class="btn btn-danger" @click="logout">
              Log Out from Firebase
            </button>
          </div>

          <div v-if="errorMessage" class="alert alert-danger mt-3 text-center">
            {{ errorMessage }}
          </div>
          <div v-if="successMessage" class="alert alert-success mt-3 text-center">
            {{ successMessage }}
          </div>

          <p v-if="!currentUser" class="text-center mt-3 text-muted">
            Don't have an account?
            <router-link to="/FireRegister">Register here</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const selectedRole = ref('user')
const currentRole = ref('user')
const currentUser = ref<User | null>(null)
const errorMessage = ref('')
const successMessage = ref('')

const router = useRouter()
const auth = getAuth()

onMounted(() => {
  // Listen to Auth state changes and restore current user
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser.value = user
      currentRole.value = localStorage.getItem('userRole') || 'user'
      console.log('Active Signed-in User:', auth.currentUser)
    } else {
      currentUser.value = null
      currentRole.value = ''
    }
  })
})

const signin = () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter both email and password.'
    return
  }

  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      console.log('Firebase Sign in Successful!')
      // Task 7.1 Requirement: Show current user in console panel
      console.log('Current User (auth.currentUser):', auth.currentUser)

      // Task 7.2 Requirement: Multiple Roles in the system
      localStorage.setItem('userRole', selectedRole.value)
      localStorage.setItem('userEmail', userCredential.user.email || '')
      currentRole.value = selectedRole.value
      currentUser.value = auth.currentUser

      successMessage.value = `Welcome back! Signed in as [${selectedRole.value.toUpperCase()}].`
    })
    .catch((error) => {
      console.log('Login Error Code:', error.code)
      errorMessage.value = error.message
    })
}

// Task 7.2 Requirement: Log out page with developer console showing current user
const logout = () => {
  signOut(auth)
    .then(() => {
      console.log('User signed out successfully!')
      // Task 7.2 Requirement: Show current user after logout (should be null)
      console.log('Current User after sign-out:', auth.currentUser)

      localStorage.removeItem('userRole')
      localStorage.removeItem('userEmail')
      currentUser.value = null
      currentRole.value = ''
      successMessage.value = 'Logged out successfully.'
    })
    .catch((error) => {
      console.error('Sign-out error:', error)
      errorMessage.value = error.message
    })
}
</script>

<style scoped>
.card {
  border-radius: 12px;
}
</style>
