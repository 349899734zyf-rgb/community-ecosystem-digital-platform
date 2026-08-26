<template>
  <footer class="bg-dark text-white pt-4 pb-3 mt-auto">
    <div class="container">
      <div class="row g-4">
        <!-- 第 1 列：机构简述 (桌面4列，手机12列) -->
        <div class="col-12 col-md-5">
          <h5 class="text-success fw-bold">
            <i class="bi bi-tree-fill text-warning me-2"></i>Urban WildLink Melbourne
          </h5>
          <p class="text-secondary small mb-0">
            A community Not-for-Profit dedicated to restoring native biodiversity and urban wildlife corridors across Greater Melbourne.
          </p>
        </div>

        <!-- 第 2 列：快速导航链接 (桌面3列，手机6列) -->
        <div class="col-6 col-md-3">
          <h6 class="text-white fw-bold mb-2">Quick Links</h6>
          <ul class="list-unstyled small text-secondary mb-0">
            <li class="mb-1"><router-link to="/" class="text-secondary text-decoration-none">Home</router-link></li>
            <li class="mb-1"><router-link to="/catalog" class="text-secondary text-decoration-none">Plant Catalog</router-link></li>
            <li class="mb-1"><router-link to="/adopt" class="text-secondary text-decoration-none">Adopt Plants</router-link></li>
            <li class="mb-1"><router-link to="/about" class="text-secondary text-decoration-none">About</router-link></li>
          </ul>
        </div>

        <!-- 第 3 列：联系方式 (桌面4列，手机6列) -->
        <div class="col-6 col-md-4">
          <h6 class="text-white fw-bold mb-2">Contact</h6>
          <ul class="list-unstyled small text-secondary mb-0">
            <li class="mb-1"><i class="bi bi-geo-alt me-1 text-success"></i> Melbourne, VIC, Australia</li>
            <li class="mb-1"><i class="bi bi-envelope me-1 text-success"></i> info@urbanwildlink.org.au</li>
          </ul>
        </div>
      </div>

      <hr class="border-secondary my-3 opacity-25">

      <!-- 版权信息 -->
      <div class="text-center text-secondary small">
        © 2026 Urban WildLink Melbourne. FIT5032 Internet Applications Development.
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>