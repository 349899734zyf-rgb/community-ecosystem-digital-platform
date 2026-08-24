<template>
  <div class="container py-5">
    <div class="p-5 mb-4 bg-light rounded-3 shadow-sm border border-success border-opacity-25">
      <div class="container-fluid py-3">
        <h1 class="display-5 fw-bold text-success">
          <i class="bi bi-tree-fill me-2"></i>Urban WildLink Melbourne
        </h1>
        <p class="col-md-8 fs-4 text-muted">
          Restoring native biodiversity across Greater Melbourne backyards and community corridors.
        </p>
        <router-link to="/catalog" class="btn btn-success btn-lg me-2">
          <i class="bi bi-search me-1"></i> Explore Plant Catalog
        </router-link>
        <router-link to="/adopt" class="btn btn-outline-success btn-lg">
          <i class="bi bi-heart-fill me-1"></i> Adopt Native Plants
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// HomeView logic will be enhanced in Stage 2
</script>