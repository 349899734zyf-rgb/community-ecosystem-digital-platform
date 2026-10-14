<!--
  OfflineBanner.vue
  BR (F.1-4): Innovation - Offline Features
  
  Listens to browser network status (navigator.onLine).
  When offline, displays an alert banner informing the user that data is safely cached in LocalStorage.
-->
<template>
  <div 
    v-if="!isOnline" 
    class="alert alert-warning border-0 rounded-0 mb-0 py-2 text-center small shadow-sm d-flex align-items-center justify-content-center gap-2"
    role="status"
    aria-live="polite"
  >
    <i class="bi bi-wifi-off fs-6"></i>
    <span>
      <strong>Offline Mode Active:</strong> You are currently disconnected. The application is running seamlessly from cached LocalStorage data.
    </span>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isOnline = ref(typeof navigator !== 'undefined' ? navigator.onLine : true)

function updateOnlineStatus() {
  isOnline.value = navigator.onLine
}

onMounted(() => {
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
})

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
})
</script>
