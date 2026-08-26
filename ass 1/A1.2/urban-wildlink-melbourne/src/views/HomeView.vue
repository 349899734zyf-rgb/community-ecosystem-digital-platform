<template>
  <div>
    <!-- Hero visual banner (retain only one core main action button, simple and neat) -->
    <section class="py-5 bg-success text-white">
      <div class="container py-3">
        <div class="row align-items-center">
          <div class="col-lg-8">
            <span class="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-3">
              <i class="bi bi-geo-alt-fill me-1"></i> Greater Melbourne Initiative
            </span>
            <h1 class="display-5 fw-bold mb-3">
              Restoring Urban Wildlife Corridors Across Melbourne
            </h1>
            <p class="lead opacity-90 mb-4">
              Transforming private backyards, balconies, and community spaces into connected micro-habitats of Australian indigenous vegetation.
            </p>
            <div>
              <router-link to="/catalog" class="btn btn-warning btn-lg fw-bold px-4 shadow-sm">
                <i class="bi bi-flower1 me-1"></i> Explore Native Flora Catalog
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. Community Data Dashboard (4 columns / 2 columns adaptive) -->
    <section class="container py-4">
      <div class="row g-3 text-center">
        <div class="col-6 col-md-3">
          <div class="p-3 bg-white rounded-3 shadow-sm border h-100">
            <h3 class="fw-bold text-success mb-1">1,450+</h3>
            <span class="text-muted small">Native Plants Distributed</span>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="p-3 bg-white rounded-3 shadow-sm border h-100">
            <h3 class="fw-bold text-success mb-1">320+</h3>
            <span class="text-muted small">Micro-Habitats Created</span>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="p-3 bg-white rounded-3 shadow-sm border h-100">
            <h3 class="fw-bold text-success mb-1">86</h3>
            <span class="text-muted small">Wildlife Species Logged</span>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="p-3 bg-white rounded-3 shadow-sm border h-100">
            <h3 class="fw-bold text-success mb-1">650+</h3>
            <span class="text-muted small">Registered Gardeners</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. Featured Indigenous Plant Showcase (display real species information, replace previous empty repetitive cards) -->
    <section class="container py-4 mb-3">
      <div class="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-2">
        <div>
          <span class="text-success fw-bold text-uppercase small">Local Biodiversity</span>
          <h3 class="fw-bold text-dark mb-0">Featured Indigenous Species</h3>
        </div>
        <router-link to="/catalog" class="btn btn-outline-success btn-sm">
          View All Plants <i class="bi bi-arrow-right"></i>
        </router-link>
      </div>

      <div class="row g-4">
        <!-- Plant 1: Golden Wattle -->
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card h-100 border-0 shadow-sm overflow-hidden">
            <div class="p-4 bg-light border-bottom text-center">
              <i class="bi bi-sun-fill text-warning display-4"></i>
            </div>
            <div class="card-body d-flex flex-column p-4">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="card-title fw-bold text-success mb-0">Golden Wattle</h5>
                <span class="badge bg-success bg-opacity-10 text-success">Tree / Shrub</span>
              </div>
              <p class="text-muted small fst-italic mb-2">Acacia pycnantha</p>
              <p class="card-text text-secondary small mb-3">
                Australia's national floral emblem. Offers dense golden blooms that provide vital winter pollen for native bees and seed food for parrots.
              </p>
              <div class="mt-auto d-flex flex-wrap gap-1">
                <span class="badge bg-light text-dark border">Full Sun</span>
                <span class="badge bg-light text-dark border">Attracts Pollinators</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Plant 2: Silver Banksia -->
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card h-100 border-0 shadow-sm overflow-hidden">
            <div class="p-4 bg-light border-bottom text-center">
              <i class="bi bi-flower2 text-success display-4"></i>
            </div>
            <div class="card-body d-flex flex-column p-4">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="card-title fw-bold text-success mb-0">Silver Banksia</h5>
                <span class="badge bg-success bg-opacity-10 text-success">Large Shrub</span>
              </div>
              <p class="text-muted small fst-italic mb-2">Banksia marginata</p>
              <p class="card-text text-secondary small mb-3">
                Hardy Melbourne indigenous Banksia producing yellow cylindrical cones rich in nectar for honeyeaters, lorikeets, and sugar gliders.
              </p>
              <div class="mt-auto d-flex flex-wrap gap-1">
                <span class="badge bg-light text-dark border">Drought Tolerant</span>
                <span class="badge bg-light text-dark border">Bird Haven</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Plant 3: Common Correa -->
        <div class="col-12 col-md-12 col-lg-4">
          <div class="card h-100 border-0 shadow-sm overflow-hidden">
            <div class="p-4 bg-light border-bottom text-center">
              <i class="bi bi-bell-fill text-danger display-4"></i>
            </div>
            <div class="card-body d-flex flex-column p-4">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="card-title fw-bold text-success mb-0">Common Correa</h5>
                <span class="badge bg-success bg-opacity-10 text-success">Low Shrub</span>
              </div>
              <p class="text-muted small fst-italic mb-2">Correa reflexa</p>
              <p class="card-text text-secondary small mb-3">
                Known as the Native Fuchsia. Features pendulous bell flowers that bloom from autumn through winter, ideal for shaded garden beds.
              </p>
              <div class="mt-auto d-flex flex-wrap gap-1">
                <span class="badge bg-light text-dark border">Partial Shade</span>
                <span class="badge bg-light text-dark border">Nectar Rich</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. Why Plant Trees in Your Backyard? (NFP Core Value Vision) -->
    <section class="bg-light py-5 border-top">
      <div class="container">
        <div class="row align-items-center g-4">
          <div class="col-md-6">
            <h3 class="fw-bold text-success mb-3">Why Backyard Corridors Matter</h3>
            <p class="text-secondary small mb-3">
              Urban development has fragmented natural habitats into isolated patches. By planting indigenous flora in private gardens, Melbourne residents create continuous "stepping stones" that allow wildlife to safely navigate and feed across the suburbs.
            </p>
            <ul class="list-unstyled small text-secondary">
              <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Conserves local groundwater through climate-adapted root systems</li>
              <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Provides essential nectar during winter food scarcity</li>
              <li class="mb-0"><i class="bi bi-check-circle-fill text-success me-2"></i>Reduces urban heat island effect across suburban neighbourhoods</li>
            </ul>
          </div>
          <div class="col-md-6">
            <div class="p-4 bg-white rounded-3 shadow-sm border border-success border-opacity-25">
              <h5 class="fw-bold text-dark mb-2"><i class="bi bi-shield-check text-success me-2"></i>Community Adoption Program</h5>
              <p class="text-muted small mb-3">
                Eligible households can request up to 5 free indigenous seedlings per planting season, accompanied by expert planting guides.
              </p>
              <router-link to="/adopt" class="btn btn-success w-100 fw-bold">
                Submit Plant Adoption Request <i class="bi bi-arrow-right ms-1"></i>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
</script>

<style scoped>
.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08) !important;
}
</style>