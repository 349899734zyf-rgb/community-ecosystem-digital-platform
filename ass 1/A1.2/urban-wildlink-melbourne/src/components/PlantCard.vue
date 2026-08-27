<!--
  References & Acknowledgements:
  - Component Reference: Bootstrap 5.3 Card Layout (https://getbootstrap.com/docs/5.3/components/card/)
  - Icons: Bootstrap Icons (https://icons.getbootstrap.com/)
-->

<template>
  <div class="card h-100 border-0 shadow-sm overflow-hidden d-flex flex-column">
    <!-- Card Header: Category & Stock Indicator -->
    <div class="p-3 bg-light border-bottom d-flex justify-content-between align-items-center">
      <span class="badge bg-success bg-opacity-10 text-success fw-bold">
        <i class="bi bi-tag-fill me-1"></i>{{ plant.category }}
      </span>
      <span class="badge" :class="plant.stock > 0 ? 'bg-success text-white' : 'bg-danger text-white'">
        {{ plant.stock > 0 ? `${plant.stock} In Stock` : 'Out of Stock' }}
      </span>
    </div>

    <!-- Card Body Content -->
    <div class="card-body p-3 d-flex flex-column">
      <h5 class="card-title fw-bold text-success mb-1">{{ plant.name }}</h5>
      <p class="text-muted small fst-italic mb-2">{{ plant.scientificName }}</p>
      
      <p class="card-text text-secondary small mb-3 flex-grow-1">
        {{ plant.description }}
      </p>

      <!-- Ecological Requirements -->
      <div class="mb-3 small">
        <div class="mb-1 text-secondary">
          <i class="bi bi-sun text-warning me-1"></i><strong>Sun:</strong> {{ plant.sunExposure }}
        </div>
        <div class="mb-1 text-secondary">
          <i class="bi bi-droplet text-success me-1"></i><strong>Water:</strong> {{ plant.waterNeeds }}
        </div>
        <div class="text-secondary">
          <i class="bi bi-heart-pulse text-danger me-1"></i><strong>Attracts:</strong> {{ plant.wildlifeBenefit }}
        </div>
      </div>

      <!-- Action Footer -->
      <div class="pt-2 border-top d-flex justify-content-between align-items-center mt-auto">
        <span class="small text-muted">
          Adopted: <strong>{{ plant.adoptedCount }}</strong>
        </span>
        <button 
          class="btn btn-sm btn-outline-success fw-bold"
          :disabled="plant.stock <= 0"
          @click="$emit('adopt', plant.id)"
        >
          <i class="bi bi-plus-lg me-1"></i>{{ plant.stock > 0 ? 'Adopt 1 Plant' : 'Unavailable' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  plant: {
    type: Object,
    required: true
  }
})

defineEmits(['adopt'])
</script>