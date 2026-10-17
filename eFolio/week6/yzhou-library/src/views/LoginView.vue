<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <h2 class="text-center mb-4">Library Member Login</h2>

        <!-- 登录成功后的绿色提示 -->
        <div v-if="loginSuccess" class="alert alert-success">
          Login successful! Redirecting to About page...
        </div>

        <!-- 登录失败的红字报错 -->
        <div v-if="errorMessage" class="alert alert-danger">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleLogin" v-if="!loginSuccess">
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input 
              type="text" 
              class="form-control" 
              id="username" 
              v-model="username" 
              placeholder="Enter 'admin'"
              required 
            />
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input 
              type="password" 
              class="form-control" 
              id="password" 
              v-model="password" 
              placeholder="Enter 'password123'"
              required 
            />
          </div>

          <div class="text-center">
            <button type="submit" class="btn btn-primary w-100">Login</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { isAuthenticated } from '../router'

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const loginSuccess = ref(false)

const router = useRouter()

// 登录处理：使用硬编码预设账号密码 (admin / password123)
const handleLogin = () => {
  if (username.value === 'admin' && password.value === 'password123') {
    isAuthenticated.value = true // 更新全局登录状态
    loginSuccess.value = true
    errorMessage.value = ''
    
    // 1.5 秒后自动重定向到受保护的 About 页面
    setTimeout(() => {
      router.push('/about')
    }, 1500)
  } else {
    isAuthenticated.value = false
    errorMessage.value = 'Invalid username or password! (Hint: use admin / password123)'
  }
}
</script>