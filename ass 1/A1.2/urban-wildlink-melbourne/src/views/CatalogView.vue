<!--
  References & Acknowledgements:
  - UI Components: Bootstrap 5.3 Card Grid & Input Groups (https://getbootstrap.com/docs/5.3/)
  - Icons: Bootstrap Icons (https://icons.getbootstrap.com/)
  - Purpose: Public Flora Catalog with multi-attribute filtering, pagination, and species proposal modal.
-->

<template>
  <div class="container py-4">
    <!-- Section 1: Page Header & Action Trigger -->
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <div>
        <h2 class="fw-bold text-success mb-1">
          <i class="bi bi-flower1 me-2"></i>Native Flora Catalog
        </h2>
        <p class="text-muted small mb-0">
          Indigenous species available for Greater Melbourne backyard habitat creation.
        </p>
      </div>

      <button class="btn btn-outline-success btn-sm fw-bold" @click="showProposalModal = true">
        <i class="bi bi-lightbulb-fill text-warning me-1"></i> Suggest New Species
      </button>
    </div>

    <!-- Section 2: Catalog Summary Banner -->
    <div class="border-success border-opacity-25 py-2 px-3 mb-4 rounded-3 d-flex justify-content-between align-items-center flex-wrap gap-2 small">
      <div>
        Catalog Species: <strong>{{ plantStore.totalSpeciesCount }}</strong> | 
        Total Nursery Stock: <strong>{{ plantStore.totalStockAvailable }}</strong>
      </div>
    </div>

    <!-- Section 3: Search and Category Filtering Bar -->
    <div class="mb-4">
      <div class="row g-3 align-items-center">
        <div class="col-12 col-md-6">
          <div class="input-group">
            <span class="input-group-text border-end-0"><i class="bi bi-search text-muted"></i></span>
            <input 
              v-model="searchQuery" 
              type="text" 
              class="form-control border-start-0" 
              placeholder="Search by plant name, scientific name, or wildlife attraction..."
              @input="currentPage = 1"
            >
          </div>
        </div>
        <div class="col-6 col-md-3">
          <select v-model="selectedCategory" class="form-select" @change="currentPage = 1">
            <option value="All">All Categories</option>
            <option value="Tree">Trees</option>
            <option value="Shrub">Shrubs</option>
            <option value="Grass">Grasses</option>
            <option value="Wildflower">Wildflowers</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Section 4: Dynamic Plant Card Grid (3x3 Grid) -->
    <div v-if="paginatedPlants.length > 0" class="row g-4 mb-4">
      <div v-for="plant in paginatedPlants" :key="plant.id" class="col-12 col-md-6 col-lg-4">
        <div class="card h-100 border-0 overflow-hidden d-flex flex-column">
          <div v-if="plant.imageUrl" style="height: 180px;" class="overflow-hidden bg-light">
            <img 
              :src="plant.imageUrl" 
              :alt="plant.name" 
              class="w-100 h-100" 
              style="object-fit: cover;"
            >
          </div>
          <div class="p-3 d-flex justify-content-between align-items-center">
            <span class="badge bg-success bg-opacity-10 text-success fw-bold">
              <i class="bi bi-tag-fill me-1"></i>{{ plant.category }}
            </span>
          </div>

          <div class="card-body p-3 d-flex flex-column">
            <h5 class="card-title fw-bold text-success mb-1">{{ plant.name }}</h5>
            <p class="text-muted small fst-italic mb-2">{{ plant.scientificName }}</p>
            <p class="card-text text-secondary small mb-3 flex-grow-1">{{ plant.description }}</p>

            <div class="mb-3 small">
              <div class="mb-1 text-secondary"><i class="bi bi-sun text-warning me-1"></i><strong>Sun:</strong> {{ plant.sunExposure }}</div>
              <div class="mb-1 text-secondary"><i class="bi bi-droplet text-success me-1"></i><strong>Water:</strong> {{ plant.waterNeeds }}</div>
              <div class="text-secondary"><i class="bi bi-heart-pulse text-danger me-1"></i><strong>Attracts:</strong> {{ plant.wildlifeBenefit }}</div>
            </div>

            <div class="pt-2 d-flex justify-content-end align-items-center mt-auto">
              <router-link 
                :to="{ path: '/adopt', query: { selectedPlantId: plant.id } }"
                class="btn btn-sm btn-outline-success fw-bold"
                :class="{ 'disabled': plant.stock <= 0 }"
              >
                <i class="bi bi-pencil-square me-1"></i>Apply to Adopt
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty Filter State -->
    <div v-else class="text-center py-5 rounded-3 shadow-sm my-4">
      <i class="bi bi-search display-3 text-muted mb-3 d-block"></i>
      <h5 class="text-secondary">No native plants matched your search criteria</h5>
      <button class="btn btn-outline-success btn-sm mt-2" @click="searchQuery = ''; selectedCategory = 'All'; currentPage = 1">
        Clear Search Filters
      </button>
    </div>

    <!-- Section 5: Interactive Pagination Controls -->
    <div v-if="filteredPlants.length > 0" class="d-flex justify-content-end align-items-center flex-wrap gap-2 py-3 px-3 rounded-3 mb-4 small">
      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-outline-success btn-sm" :disabled="currentPage <= 1" @click="currentPage--">
          <i class="bi bi-chevron-left"></i>
        </button>
        <span></span>
        <input 
          v-model.number="pageInput" 
          type="number" 
          min="1" 
          :max="totalPages" 
          class="form-control form-control-sm text-center" 
          style="width: 55px;"
          @change="jumpPage"
        >
        <span>of {{ totalPages }}</span>
        <button class="btn btn-outline-success btn-sm" :disabled="currentPage >= totalPages" @click="currentPage++">
           <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- Section 6: Community Species Proposal Modal Dialog -->
    <div v-if="showProposalModal" class="modal-backdrop fade show"></div>
    <div v-if="showProposalModal" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title fw-bold"><i class="bi bi-lightbulb-fill text-warning me-2"></i>Suggest a New Native Species</h5>
            <button type="button" class="btn-close btn-close-white" @click="showProposalModal = false"></button>
          </div>
          <div class="modal-body p-4">
            <form @submit.prevent="handleProposalSubmit">
              <div class="mb-3">
                <label class="form-label small fw-bold">Your Full Name *</label>
                <input v-model="proposalForm.proposerName" type="text" class="form-control" required placeholder="e.g. Marcus Chen">
              </div>
              <div class="mb-3">
                <label class="form-label small fw-bold">Contact Email *</label>
                <input v-model="proposalForm.email" type="email" class="form-control" required placeholder="name@domain.com">
              </div>
              <div class="row g-2 mb-3">
                <div class="col-8">
                  <label class="form-label small fw-bold">Proposed Plant Common Name *</label>
                  <input v-model="proposalForm.plantName" type="text" class="form-control" required placeholder="e.g. Kangaroo Paw">
                </div>
                <div class="col-4">
                  <label class="form-label small fw-bold">Category</label>
                  <select v-model="proposalForm.category" class="form-select">
                    <option value="Tree">Tree</option>
                    <option value="Shrub">Shrub</option>
                    <option value="Grass">Grass</option>
                    <option value="Wildflower">Wildflower</option>
                  </select>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label small fw-bold">Botanical Scientific Name (Optional)</label>
                <input v-model="proposalForm.scientificName" type="text" class="form-control" placeholder="e.g. Anigozanthos flavidus">
              </div>
              <div class="mb-3">
                <label class="form-label small fw-bold">Ecological Attraction & Habitat Value</label>
                <input v-model="proposalForm.wildlifeBenefit" type="text" class="form-control" placeholder="e.g. Attracts honeyeaters and native bees">
              </div>
              <div class="mb-3">
                <label class="form-label small fw-bold">Reason for Suggestion</label>
                <textarea v-model="proposalForm.reason" class="form-control" rows="2" placeholder="Why is this plant beneficial for Melbourne backyards?"></textarea>
              </div>
              <div class="d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-secondary btn-sm" @click="showProposalModal = false">Cancel</button>
                <button type="submit" class="btn btn-success btn-sm fw-bold">Submit for Review</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Toast Banner -->
    <div v-if="toastMessage" class="position-fixed bottom-0 end-0 p-3" style="z-index: 1050;">
      <div class="alert alert-success shadow d-flex align-items-center mb-0" role="alert">
        <i class="bi bi-check-circle-fill fs-4 me-2"></i>
        <div>{{ toastMessage }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { plantStore } from '../store/plantStore'

const searchQuery = ref('')
const selectedCategory = ref('All')
const showProposalModal = ref(false)
const toastMessage = ref('')

// Pagination configuration: 9 plant cards per page
const pageSize = 9
const currentPage = ref(1)
const pageInput = ref(1)

const proposalForm = ref({ proposerName: '', email: '', plantName: '', scientificName: '', category: 'Wildflower', wildlifeBenefit: '', reason: '' })

// Multi-attribute reactive search filter
const filteredPlants = computed(() => {
  return plantStore.state.plants.filter(plant => {
    const matchesSearch = 
      plant.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      plant.scientificName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      plant.wildlifeBenefit.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = selectedCategory.value === 'All' || plant.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredPlants.value.length / pageSize)))

const paginatedPlants = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredPlants.value.slice(start, start + pageSize)
})

watch(currentPage, (val) => { pageInput.value = val })

function jumpPage() {
  let target = Math.max(1, Math.min(pageInput.value, totalPages.value))
  currentPage.value = target
  pageInput.value = target
}

function handleProposalSubmit() {
  plantStore.submitSpeciesProposal(proposalForm.value)
  showProposalModal.value = false
  proposalForm.value = { proposerName: '', email: '', plantName: '', scientificName: '', category: 'Wildflower', wildlifeBenefit: '', reason: '' }
  showToast('Species suggestion submitted! Waiting for Admin review.')
}

function showToast(msg) {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}
</script>

<style scoped>
.modal-backdrop {
  opacity: 0.5;
}
</style>