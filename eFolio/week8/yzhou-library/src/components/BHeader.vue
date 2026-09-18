<template>
  <div class="container">
    <header class="d-flex justify-content-center py-3">
      <ul class="nav nav-pills">
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active">Home (Week 5)</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active">About</router-link>
        </li>
        
        <!-- 未登录时显示 Login 链接 -->
        <li class="nav-item" v-if="!isAuthenticated">
          <router-link to="/login" class="nav-link" active-class="active">Login</router-link>
        </li>

        <!-- Week 7 Studio: Firebase Authentication Links -->
        <li class="nav-item">
          <router-link to="/FireLogin" class="nav-link" active-class="active">Firebase Login</router-link>
        </li>
        <!-- Week 8 Studio: Firestore Add Book Link -->
        <li class="nav-item">
          <router-link to="/addbook" class="nav-link" active-class="active">Add Book</router-link>
        </li>
      </ul>
    </header>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { isAuthenticated } from '../router'

const router = useRouter()

const handleLogout = () => {
  isAuthenticated.value = false // 清除登录状态
  router.push('/login') // 登出后跳转回登录页
}
</script>