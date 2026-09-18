<template>
  <div>
    <header>
      <BHeader />
    </header>
    <main class="main-box">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import BHeader from './components/BHeader.vue'
</script>