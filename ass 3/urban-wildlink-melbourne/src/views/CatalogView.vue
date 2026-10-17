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
          Native Flora Catalog
        </h2>
        <p class="text-muted small mb-0">
          Indigenous species available for Greater Melbourne backyard habitat creation.
        </p>
      </div>

      <button class="btn btn-success btn-sm fw-bold" @click="showProposalModal = true">
        Suggest New Species
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
            <span class="input-group-text bg-light text-success">
              <i class="bi bi-search"></i>
            </span>
            <input 
              v-model="searchQuery" 
              type="text" 
              class="form-control" 
              placeholder="Search by plant name, scientific name, or wildlife attraction..."
              @input="currentPage = 1"
            >
          </div>
        </div>
        <div class="col-6 col-md-3">
          <select v-model="selectedCategory" class="form-select text-secondary" @change="currentPage = 1">
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
          <div v-if="plant.imageUrl" style="height: 300px;" class="overflow-hidden bg-light">
            <img 
              :src="plant.imageUrl" 
              :alt="plant.name" 
              class="w-100 h-100" 
              style="object-fit: cover;"
            >
          </div>
          <div class="p-3 d-flex justify-content-between align-items-center">
            <span class="badge bg-success bg-opacity-10 text-success fw-bold">
              {{ plant.category }}
            </span>
          </div>

          <div class="card-body p-3 d-flex flex-column">
            <h5 class="card-title fw-bold text-success mb-1">{{ plant.name }}</h5>
            <p class="text-muted small fst-italic mb-2">{{ plant.scientificName }}</p>
            <p class="card-text text-secondary small mb-3 flex-grow-1">{{ plant.description }}</p>

            <div class="mb-3 small">
              <div class="mb-1 text-secondary"><strong>Sun:</strong> {{ plant.sunExposure }}</div>
              <div class="mb-1 text-secondary"><strong>Water:</strong> {{ plant.waterNeeds }}</div>
              <div class="text-secondary"><strong>Attracts:</strong> {{ plant.wildlifeBenefit }}</div>
            </div>

            <!-- Bottom action bar: Left reviews and rating, Right apply to adopt -->
            <div class="pt-2 d-flex justify-content-between align-items-center mt-auto">
              <!-- View Reviews & Rate Button (BR C.3) -->
              <button 
                type="button" 
                class="btn btn-outline-success btn-sm"
                title="View community reviews and ratings"
                @click="openReviewModal(plant)"
              >
                <i class="bi bi-star-fill text-warning me-1"></i>
                <span class="fw-bold me-1">{{ plantStore.getPlantRating(plant).average }}</span>
                <span class="small text-muted">({{ plantStore.getPlantRating(plant).count }})</span>
              </button>

              <!-- Apply to Adopt Button -->
              <router-link 
                :to="{ path: '/adopt', query: { selectedPlantId: plant.id } }"
                class="btn btn-success btn-sm fw-bold"
                :class="{ 'disabled': plant.stock <= 0 }"
              >
                Apply to Adopt
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty Filter State -->
    <div v-else class="text-center py-5 rounded-3 my-4">
      <h5 class="text-secondary">No native plants matched your search criteria</h5>
    </div>

    <!-- Section 5: Interactive Pagination Controls -->
    <div v-if="filteredPlants.length > 0" class="d-flex justify-content-end align-items-center flex-wrap gap-2 py-3 px-3 rounded-3 mb-4 small">
      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-success btn-sm fw-bold" :disabled="currentPage <= 1" @click="currentPage--">
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
        <button class="btn btn-success btn-sm fw-bold" :disabled="currentPage >= totalPages" @click="currentPage++">
           <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- Section 6: Community Species Proposal Modal Dialog -->
    <div v-if="showProposalModal" class="modal-backdrop fade show"></div>
    <div v-if="showProposalModal" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title fw-bold">Suggest a New Native Species</h5>
            <button type="button" class="btn-close btn-close-white" @click="showProposalModal = false"></button>
          </div>
          <div class="modal-body p-4">
            <form @submit.prevent="handleProposalSubmit" novalidate>
              <!-- Proposer Name -->
              <div class="mb-3">
                <label class="form-label small fw-bold">Your Full Name * </label>
                <input 
                  v-model="proposalForm.proposerName" 
                  type="text" 
                  class="form-control" 
                  :class="{ 'is-invalid': proposalErrors.proposerName }"
                  placeholder=""
                  @input="validateProposalField('proposerName')"
                >
                <div class="invalid-feedback">{{ proposalErrors.proposerName }}</div>
              </div>
              <!-- Proposer Email -->
              <div class="mb-3">
                <label class="form-label small fw-bold">Contact Email * </label>
                <input 
                  v-model="proposalForm.email" 
                  type="email" 
                  class="form-control" 
                  :class="{ 'is-invalid': proposalErrors.email }"
                  placeholder=""
                  @input="validateProposalField('email')"
                >
                <div class="invalid-feedback">{{ proposalErrors.email }}</div>
              </div>
              <!-- Plant Name & Category -->
              <div class="row g-2 mb-3">
                <div class="col-8">
                  <label class="form-label small fw-bold">Proposed Plant Common Name * </label>
                  <input 
                    v-model="proposalForm.plantName" 
                    type="text" 
                    class="form-control" 
                    :class="{ 'is-invalid': proposalErrors.plantName }"
                    placeholder=""
                    @input="validateProposalField('plantName')"
                  >
                  <div class="invalid-feedback">{{ proposalErrors.plantName }}</div>
                </div>
                <div class="col-4">
                  <label class="form-label small fw-bold">Category * </label>
                  <select v-model="proposalForm.category" class="form-select">
                    <option value="Tree">Tree</option>
                    <option value="Shrub">Shrub</option>
                    <option value="Grass">Grass</option>
                    <option value="Wildflower">Wildflower</option>
                  </select>
                </div>
              </div>
              <!-- Botanical Name -->
              <div class="mb-3">
                <label class="form-label small fw-bold">Botanical Scientific Name</label>
                <input v-model="proposalForm.scientificName" type="text" class="form-control" placeholder="">
              </div>
              <!-- Plant Image URL -->
              <div class="mb-3">
                <label class="form-label small fw-bold">Plant Image URL</label>
                <input v-model="proposalForm.imageUrl" type="url" class="form-control" placeholder="">
              </div>
              <!-- Ecological Attraction -->
              <div class="mb-3">
                <label class="form-label small fw-bold">Ecological Attraction & Habitat Value</label>
                <input v-model="proposalForm.wildlifeBenefit" type="text" class="form-control" placeholder="">
              </div>
              <!-- Reason for Suggestion -->
              <div class="mb-3">
                <label class="form-label small fw-bold">Reason for Suggestion * </label>
                <textarea 
                  v-model="proposalForm.reason" 
                  class="form-control" 
                  :class="{ 'is-invalid': proposalErrors.reason }"
                  rows="2" 
                  placeholder=""
                  @input="validateProposalField('reason')"
                ></textarea>
                <div class="invalid-feedback">{{ proposalErrors.reason }}</div>
              </div>
              <div class="d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-sm" @click="showProposalModal = false">Cancel</button>
                <button type="submit" class="btn btn-success btn-sm fw-bold">Submit for Review</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Toast Banner -->
    <div v-if="toastMessage" class="position-fixed bottom-0 end-0 p-3" style="z-index: 1050;">
      <div class="alert alert-success d-flex align-items-center mb-0" role="alert">
        <i class="bi bi-check-circle-fill fs-4 me-2"></i>
        <div>{{ toastMessage }}</div>
      </div>
    </div>

    <!-- Section 7: Species Reviews and Aggregated Rating Modal (BR C.3) -->
    <div v-if="showReviewModal" class="modal-backdrop fade show"></div>
    <div v-if="showReviewModal && activeReviewPlant" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0">
          
          <!-- Modal Header: Species Name and Close Button -->
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title fw-bold fs-6">
              {{ activeReviewPlant.name }} — Community Reviews & Ratings
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="closeReviewModal"></button>
          </div>

          <!-- Modal Body -->
          <div class="modal-body p-4">
            
            <!-- 1. Aggregated Rating Score Summary Card (BR C.3) -->
            <div class="bg-light p-3 rounded-3 mb-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div>
                <div class="d-flex align-items-baseline gap-2">
                  <span class="fs-1 fw-bold text-success">{{ plantStore.getPlantRating(activeReviewPlant).average }}</span>
                  <span class="text-muted fw-bold">/ 5.0</span>
                </div>

                <!-- 5-Star Visual Graphical Display -->
                <div class="d-flex gap-1 text-warning mb-1">
                  <i 
                    v-for="star in 5" 
                    :key="star" 
                    class="bi" 
                    :class="star <= Math.round(Number(plantStore.getPlantRating(activeReviewPlant).average)) ? 'bi-star-fill' : 'bi-star'"
                  ></i>
                </div>
              </div>
            </div>

            <!-- 2. Write a Review & Rate Form (Role-Based BR C.2 & C.3) -->
            <div class="border rounded-3 p-3 mb-4 bg-white">
              <h6 class="fw-bold text-success mb-2">Share Your Backyard Growing Experience</h6>

              <!-- State A: Authenticated User (Can rate 1-5 stars and submit review) -->
              <div v-if="currentUser">
                <!-- Interactive 1-5 Star Picker -->
                <div class="mb-3">
                  <label class="form-label small fw-bold mb-1">Your Star Rating *</label>
                  <div class="d-flex align-items-center gap-2">
                    <div class="d-flex gap-1 fs-4" style="cursor: pointer;">
                      <i 
                        v-for="star in 5" 
                        :key="star" 
                        class="bi" 
                        :class="star <= (hoverRating || reviewForm.rating) ? 'bi-star-fill text-warning' : 'bi-star text-secondary'"
                        @mouseenter="hoverRating = star"
                        @mouseleave="hoverRating = 0"
                        @click="reviewForm.rating = star"
                      ></i>
                    </div>
                    <span class="small fw-semibold text-secondary">
                    </span>
                  </div>
                </div>

                <!-- Review Feedback Textarea -->
                <div class="mb-3">
                  <label class="form-label small fw-bold">Review *</label>
                  <textarea 
                    v-model.trim="reviewForm.comment"
                    class="form-control"
                    :class="{ 'is-invalid': reviewError }"
                    rows="2"
                    placeholder=""
                    @input="reviewError = ''"
                  ></textarea>
                  <div class="invalid-feedback">{{ reviewError }}</div>
                </div>

                <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <span class="small text-muted">
                  </span>
                  <button 
                    type="button" 
                    class="btn btn-success btn-sm fw-bold px-3"
                    @click="handleReviewSubmit"
                  >
                    Submit Review
                  </button>
                </div>
              </div>

              <!-- State B: Unauthenticated Guest (Prompt to sign in) -->
              <div v-else class="text-center py-2">
                <p class="text-muted small mb-2">
                  Only signed-in community members can submit a review and star rating.
                </p>
                <router-link to="/login" class="btn btn-outline-success btn-sm fw-semibold">
                  Sign In to Rate & Review
                </router-link>
              </div>
            </div>

            <!-- 3. Existing Community Reviews List -->
            <h6 class="fw-bold text-dark mb-3">
              Community Feedback ({{ activeReviewPlant.reviews ? activeReviewPlant.reviews.length : 0 }})
            </h6>
            
            <div v-if="activeReviewPlant.reviews && activeReviewPlant.reviews.length > 0" class="d-flex flex-column gap-3" style="max-height: 260px; overflow-y: auto;">
              <div 
                v-for="rev in activeReviewPlant.reviews" 
                :key="rev.id"
                class="border rounded-3 p-3 bg-light bg-opacity-50"
              >
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <div class="d-flex align-items-center gap-2">
                    <span class="fw-bold small text-dark">{{ rev.userName }}</span>
                  </div>
                  <span class="text-muted small">{{ rev.date }}</span>
                </div>
                
                <!-- Star Rating Display -->
                <div class="d-flex gap-1 text-warning small mb-2">
                  <i 
                    v-for="star in 5" 
                    :key="star" 
                    class="bi" 
                    :class="star <= rev.rating ? 'bi-star-fill' : 'bi-star'"
                  ></i>
                </div>

                <p class="text-secondary small mb-0">{{ rev.comment }}</p>
              </div>
            </div>

            <div v-else class="text-center text-muted py-3 small">
              No reviews yet for this species. Be the first to share your experience!
            </div>
          </div>

          <!-- Modal Footer Close Button -->
          <div class="modal-footer border-top-0 pt-0">
            <button type="button" class="btn btn-sm btn-secondary" @click="closeReviewModal">Close</button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { plantStore } from '../store/plantStore'
// Import security sanitization utility to defend against XSS attacks (BR C.4)
import { sanitizeInput } from '../utils/security'

const searchQuery = ref('')
const selectedCategory = ref('All')
const showProposalModal = ref(false)
const toastMessage = ref('')

// Pagination configuration: 9 plant cards per page
const pageSize = 9
const currentPage = ref(1)
const pageInput = ref(1)

const proposalForm = ref({ 
  proposerName: '', 
  email: '', 
  plantName: '', 
  scientificName: '', 
  imageUrl: '', 
  category: 'Wildflower', 
  wildlifeBenefit: '', 
  reason: '' 
})

const proposalErrors = ref({ 
  proposerName: '', 
  email: '', 
  plantName: '', 
  reason: '' 
})

function validateProposalField(field) {
  if (field === 'proposerName') {
    proposalErrors.value.proposerName = proposalForm.value.proposerName.trim() ? '' : 'Full name is required.'
  }
  if (field === 'email') {
    if (!proposalForm.value.email.trim()) {
      proposalErrors.value.email = 'Contact email address is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(proposalForm.value.email)) {
      proposalErrors.value.email = 'Please enter a valid email address.'
    } else {
      proposalErrors.value.email = ''
    }
  }
  if (field === 'plantName') {
    proposalErrors.value.plantName = proposalForm.value.plantName.trim() ? '' : 'Plant common name is required.'
  }
  if (field === 'reason') {
    proposalErrors.value.reason = proposalForm.value.reason.trim() ? '' : 'Please provide a reason for proposing this species.'
  }
}

function handleProposalSubmit() {
  validateProposalField('proposerName')
  validateProposalField('email')
  validateProposalField('plantName')
  validateProposalField('reason')
  if (proposalErrors.value.proposerName || proposalErrors.value.email || proposalErrors.value.plantName || proposalErrors.value.reason) {
    return
  }
  plantStore.submitSpeciesProposal(proposalForm.value)
  showProposalModal.value = false
  proposalForm.value = { proposerName: '', email: '', plantName: '', scientificName: '', imageUrl: '', category: 'Wildflower', wildlifeBenefit: '', reason: '' }
  showToast('Species suggestion submitted! Waiting for Admin review.')
}

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

function showToast(msg) {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

// Current authenticated user (computed property)
const currentUser = computed(() => plantStore.state.currentUser)

// Review modal visibility and active plant record
const showReviewModal = ref(false)
const activeReviewPlant = ref(null)

// Hover star rating state for dynamic preview
const hoverRating = ref(0)

// Review submission form data
const reviewForm = ref({
  rating: 5,
  comment: ''
})

// Review validation error message
const reviewError = ref('')

// Open plant review and rating modal
function openReviewModal(plant) {
  activeReviewPlant.value = plant
  reviewForm.value = { rating: 5, comment: '' }
  reviewError.value = ''
  hoverRating.value = 0
  showReviewModal.value = true
}

// Close plant review and rating modal
function closeReviewModal() {
  showReviewModal.value = false
  activeReviewPlant.value = null
}

// Handle plant review and rating submission (BR C.3)
function handleReviewSubmit() {
  reviewError.value = ''

  if (!reviewForm.value.rating || reviewForm.value.rating < 1 || reviewForm.value.rating > 5) {
    reviewError.value = 'Please select a star rating between 1 and 5.'
    return
  }
  if (!reviewForm.value.comment.trim()) {
    reviewError.value = 'Please share your gardening feedback (at least a few words).'
    return
  }

  // Sanitize user review text to prevent stored XSS attacks (BR C.4)
  const cleanComment = sanitizeInput(reviewForm.value.comment)
  const res = plantStore.addPlantReview(activeReviewPlant.value.id, {
    userName: currentUser.value.fullName,
    userRole: currentUser.value.role,
    rating: reviewForm.value.rating,
    comment: cleanComment
  })

  if (res.success) {
    reviewForm.value = { rating: 5, comment: '' }
    showToast('Thank you! Your rating and review have been published.')
  }
}
</script>

<style scoped>
.modal-backdrop {
  opacity: 0.5;
}
</style>