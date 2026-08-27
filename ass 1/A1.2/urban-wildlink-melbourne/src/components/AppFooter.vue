<!--
  References & Acknowledgements:
  - Layout Reference: Bootstrap 5.3 Sticky Footer & Responsive Grid (https://getbootstrap.com/docs/5.3/examples/footers/)
  - Icons: Bootstrap Icons (https://icons.getbootstrap.com/)
-->

<template>
  <footer class="bg-dark text-white pt-4 pb-3 mt-auto">
    <div class="container">
      <div class="row g-4">
        <!-- Column 1: Organization Summary -->
        <div class="col-12 col-md-5">
          <h5 class="text-success fw-bold">
            <i class="bi bi-tree-fill text-warning me-2"></i>Urban WildLink Melbourne
          </h5>
          <p class="text-secondary small mb-0">
            A community Not-for-Profit dedicated to restoring native biodiversity and urban wildlife corridors across Greater Melbourne.
          </p>
        </div>

        <!-- Column 2: Quick Navigation Links (Desktop 3 Columns, Mobile 6 Columns) -->
        <div class="col-6 col-md-3">
          <h6 class="text-white fw-bold mb-2">Quick Links</h6>
          <ul class="list-unstyled small text-secondary mb-0">
            <li class="mb-1"><router-link to="/" class="text-secondary text-decoration-none">Home</router-link></li>
            <li class="mb-1"><router-link to="/catalog" class="text-secondary text-decoration-none">Plant Catalog</router-link></li>
            <li class="mb-1"><router-link to="/adopt" class="text-secondary text-decoration-none">Adopt Plants</router-link></li>
            <li class="mb-1"><router-link to="/about" class="text-secondary text-decoration-none">About</router-link></li>
          </ul>
        </div>

        <!-- Column 3: Contact Information (Desktop 4 Columns, Mobile 6 Columns) -->
        <div class="col-6 col-md-4">
          <h6 class="text-white fw-bold mb-2">Contact</h6>
          <ul class="list-unstyled small text-secondary mb-0">
            <li class="mb-1"><i class="bi bi-geo-alt me-1 text-success"></i> Melbourne, VIC, Australia</li>
            <li class="mb-1"><i class="bi bi-envelope me-1 text-success"></i> yzho0348@student.monash.edu</li>
          </ul>
        </div>
      </div>

      <hr class="border-secondary my-3 opacity-25">

      <!-- Copyright Information -->
      <div class="text-center text-secondary small">
        © 2026 Urban WildLink Melbourne. FIT5032 Internet Applications Development.
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>