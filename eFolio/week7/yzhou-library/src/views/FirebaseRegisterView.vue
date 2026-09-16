<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-sm p-4">
          <h1 class="text-center mb-4">Create an Account</h1>

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

          <!-- Role Selection for Task 7.2 Multiple Roles Support -->
          <div class="mb-3">
            <label class="form-label">Select Role</label>
            <select class="form-select" v-model="role">
              <option value="user">User (Regular Member)</option>
              <option value="admin">Admin (Librarian Administrator)</option>
            </select>
          </div>

          <div class="d-grid gap-2 mt-4">
            <button class="btn btn-primary" @click="register">
              Save to Firebase
            </button>
          </div>

          <div v-if="errorMessage" class="alert alert-danger mt-3 text-center">
            {{ errorMessage }}
          </div>
          <div v-if="successMessage" class="alert alert-success mt-3 text-center">
            {{ successMessage }}
          </div>

          <p class="text-center mt-3 text-muted">
            Already have an account?
            <router-link to="/FireLogin">Login via Firebase</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const role = ref('user')
const errorMessage = ref('')
const successMessage = ref('')

const router = useRouter()
const auth = getAuth()

const register = () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter both email and password.'
    return
  }

  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      console.log('Firebase Register Successful!', userCredential.user)
      // Store user role for Role-based Access Control (eFolio 7.2)
      localStorage.setItem('userRole', role.value)
      localStorage.setItem('userEmail', userCredential.user.email || '')
      
      successMessage.value = `Account created successfully as [${role.value.toUpperCase()}]!`
      setTimeout(() => {
        router.push('/FireLogin')
      }, 1500)
    })
    .catch((error) => {
      console.log('Register Error Code:', error.code)
      errorMessage.value = error.message
    })
}
</script>

<style scoped>
.card {
  border-radius: 12px;
}
</style>
