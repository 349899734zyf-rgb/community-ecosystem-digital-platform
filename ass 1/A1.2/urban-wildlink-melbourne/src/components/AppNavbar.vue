<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-success sticky-top shadow-sm">
    <div class="container">
      <!-- 品牌 Logo -->
      <router-link to="/" class="navbar-brand d-flex align-items-center fw-bold">
        <i class="bi bi-tree-fill text-warning me-2 fs-4"></i>
        <span>Urban WildLink Melbourne</span>
      </router-link>

      <!-- 移动端汉堡菜单折叠按钮 (BR A.2 响应式关键) -->
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

      <!-- 导航页面链接 -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-lg-center">
          <li class="nav-item">
            <router-link to="/" class="nav-link px-3" active-class="active fw-bold">
              <i class="bi bi-house-door me-1"></i> Home
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/catalog" class="nav-link px-3" active-class="active fw-bold">
              <i class="bi bi-flower1 me-1"></i> Plant Catalog
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/adopt" class="nav-link px-3" active-class="active fw-bold">
              <i class="bi bi-heart me-1"></i> Adopt Plants
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/about" class="nav-link px-3" active-class="active fw-bold">
              <i class="bi bi-info-circle me-1"></i> About
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
</script>

<style scoped>
.nav-link.active {
  color: #ffc107 !important;
  font-weight: 600;
}
</style>