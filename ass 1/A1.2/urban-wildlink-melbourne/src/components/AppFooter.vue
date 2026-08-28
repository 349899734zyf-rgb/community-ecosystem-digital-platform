<!--
  References & Acknowledgements:
  - Layout Reference: Bootstrap 5.3 Sticky Footer & Responsive Grid (https://getbootstrap.com/docs/5.3/examples/footers/)
  - Icons: Bootstrap Icons (https://icons.getbootstrap.com/)
-->

<template>
  <footer class="bg-dark text-white pt-4 pb-3 mt-auto">
    <div class="container">
      <div class="row g-4 justify-content-between">
        <!-- Column 1: Organization Summary -->
        <div class="col-12 col-md-5">
          <h5 class="text-success fw-bold">
            <i class="bi bi-tree-fill text-warning me-2"></i>Urban WildLink Melbourne
          </h5>
          <p class="text-secondary small mb-0">
            A community Not-for-Profit dedicated to restoring native biodiversity and urban wildlife corridors across Greater Melbourne.
          </p>
        </div>

        <!-- Column 3: Contact Information (Desktop 4 Columns, Mobile 6 Columns) -->
        <div class="col-6 col-md-4">
          <h6 class="text-white fw-bold mb-2">Contact</h6>
          <ul class="list-unstyled small text-secondary mb-0">
            <li class="mb-1"> Melbourne, VIC, Australia</li>
            <li class="mb-1"> yzho0348@student.monash.edu</li>
          </ul>
        </div>
      </div>

      <div style="height: 50px;"></div>

      <!-- Copyright Information -->
      <div class="text-center text-secondary small">
        © 2026 Urban WildLink Melbourne. FIT5032 Internet Applications Development.
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>