<!--
  References & Acknowledgements:
  - UI Components: Bootstrap 5.3 Data Tables, Nav Pills, Modal (https://getbootstrap.com/docs/5.3/)
  - Icons: Bootstrap Icons (https://icons.getbootstrap.com/)
  - Purpose: Administrative dashboard for nursery stock management, application approvals, and proposal handling.
-->

<template>
  <div class="container py-4">
    <!-- Section 1: Dashboard Header & Reset Action -->
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <div>
        <h2 class="fw-bold text-success mb-1">
          <i class="bi bi-shield-lock-fill me-2"></i>NFP Administrative Console
        </h2>
        <p class="text-muted small mb-0">
          Centralized management for plant nursery inventory, adoption requests, and community proposals.
        </p>
      </div>

      <button class="btn btn-outline-secondary btn-sm" @click="handleReset" title="Reset dataset to default">
        <i class="bi bi-arrow-counterclockwise me-1"></i> Reset Data
      </button>
    </div>

    <!-- Section 2: Real-time System Metrics Banner -->
    <div class="border-success border-opacity-25 py-2 px-3 mb-4 rounded-3 d-flex justify-content-between align-items-center flex-wrap gap-2 small">
      <div class="d-flex gap-1 flex-wrap text-dark">
        <div>Total Species: <strong>{{ plantStore.totalSpeciesCount }}</strong></div>
        <div>| Nursery Seedlings: <strong>{{ plantStore.totalStockAvailable }}</strong></div>
        <div>| Approved Adoptions: <strong>{{ plantStore.totalAdoptedCount }}</strong></div>
      </div>
      <div>
      </div>
    </div>

    <!-- Section 3: Primary Navigation Tabs -->
    <div class="mb-4">
      <ul class="nav nav-pills">
        <li class="nav-item">
          <button 
            class="nav-link fw-bold" 
            :class="adminActiveTab === 'adoptions' ? 'active bg-success' : 'text-success'" 
            @click="adminActiveTab = 'adoptions'; appPage = 1"
          >
             Adoption Requests
          </button>
        </li>
        <li class="nav-item">
          <button 
            class="nav-link fw-bold" 
            :class="adminActiveTab === 'proposals' ? 'active bg-success' : 'text-success'" 
            @click="adminActiveTab = 'proposals'; propPage = 1"
          >
             Species Proposals
          </button>
        </li>
        <li class="nav-item">
          <button 
            class="nav-link fw-bold" 
            :class="adminActiveTab === 'inventory' ? 'active bg-success' : 'text-success'" 
            @click="adminActiveTab = 'inventory'; invPage = 1"
          >
             Species Inventory & Stock Control
          </button>
        </li>
      </ul>
    </div>

    <!-- ================================================================= -->
    <!-- Tab 1: Plant Adoption Requests Table -->
    <!-- ================================================================= -->
    <div v-if="adminActiveTab === 'adoptions'" class="card border-0 mb-4 bg-white">
      <div class="card-header bg-success text-white fw-bold">
        <i class="bi bi-clipboard-check me-2"></i>Resident Plant Adoption Requests
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-bordered mb-0 align-middle small">
            <thead class="table-light">
              <tr>
                <th>Applicant Name</th>
                <th>Delivery Address</th>
                <th>Requested Plant</th>
                <th>Quantity</th>
                <th>Garden Type</th>
                <th>Status</th>
                <th>Submitted Time</th>
                <th class="text-center" style="width: 170px;">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="app in paginatedApplications" :key="app.id">
                <td><span>{{ app.applicantName }}</span><br></td>
                <td>{{ app.address }}, <span class="text-dark">VIC {{ app.postcode }}</span></td>
                <td><span class="text-dark">{{ app.plantName }}</span></td>
                <td>{{ app.quantity }} seedlings</td>
                <td>{{ app.gardenType }}</td>
                <td>
                  <span :class="getStatusClass(app.status)">
                     {{ app.status }}
                  </span>
                </td>
                <td class="text-muted small">{{ app.submittedAt }}</td>
                <td class="text-center">
                  <div v-if="app.status === 'Pending'" class="btn-group btn-group-sm">
                    <button class="btn btn-success btn-sm" @click="handleApproveApp(app.id)" title="Approve application">
                      Approve
                    </button>
                    <button class="btn btn-outline-danger btn-sm" @click="handleRejectApp(app.id)" title="Reject application">
                        Reject
                    </button>
                  </div>
                  <span v-else class="text-muted small">Completed</span>
                </td>
              </tr>
              <tr v-if="paginatedApplications.length === 0">
                <td colspan="8" class="text-center text-muted py-4">No adoption requests found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="card-footer bg-transparent border-top-0 d-flex justify-content-between align-items-center flex-wrap gap-2 py-2 small">
        <span class="text-muted fw-bold">Total: {{ plantStore.state.applications.length }} records</span>
        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-outline-success btn-sm" :disabled="appPage <= 1" @click="appPage--">
            <i class="bi bi-chevron-left"></i>
          </button>
          <span></span>
          <input 
            v-model.number="appPageInput" 
            type="number" 
            min="1" 
            :max="totalAppPages" 
            class="form-control form-control-sm text-center" 
            style="width: 55px;"
            @change="jumpAppPage"
          >
          <span>of {{ totalAppPages }}</span>
          <button class="btn btn-outline-success btn-sm" :disabled="appPage >= totalAppPages" @click="appPage++">
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- Tab 2: Species Proposals Table -->
    <!-- ================================================================= -->
    <div v-if="adminActiveTab === 'proposals'" class="card border-0 mb-4 bg-white">
      <div class="card-header bg-success text-white fw-bold">
        <i class="bi bi-lightbulb me-2"></i>Community Species Proposals
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-bordered mb-0 align-middle small">
            <thead class="table-light">
              <tr>
                <th>Proposed Plant Name</th>
                <th>Category</th>
                <th>Proposer</th>
                <th>Ecological Benefit & Reason</th>
                <th>Status</th>
                <th>Submitted Time</th>
                <th class="text-center" style="width: 170px;">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prop in paginatedProposals" :key="prop.id">
                <td><span>{{ prop.plantName }}</span><br></td>
                <td>{{ prop.category }}</td>
                <td>{{ prop.proposerName }}<br><span class="text-muted"></span></td>
                <td><strong></strong> {{ prop.wildlifeBenefit }}<br><span class="text-dark">{{ prop.reason }}</span></td>
                <td>
                  <span :class="getStatusClass(prop.status)">
                    {{ prop.status }}
                  </span>
                </td>
                <td class="text-muted small">{{ prop.submittedAt }}</td>
                <td class="text-center">
                  <div v-if="prop.status === 'Pending'" class="btn-group btn-group-sm">
                    <button class="btn btn-success btn-sm" @click="handleApproveProposal(prop.id)">
                      Approve
                    </button>
                    <button class="btn btn-outline-danger btn-sm" @click="handleRejectProposal(prop.id)">
                      Reject
                    </button>
                  </div>
                  <span v-else class="text-muted small">Completed</span>
                </td>
              </tr>
              <tr v-if="paginatedProposals.length === 0">
                <td colspan="7" class="text-center text-muted py-4">No species proposals found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="card-footer bg-transparent border-top-0 d-flex justify-content-between align-items-center flex-wrap gap-2 py-2 small">
        <span class="text-muted fw-bold">Total: {{ plantStore.state.speciesProposals.length }} records</span>
        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-outline-success btn-sm" :disabled="propPage <= 1" @click="propPage--">
            <i class="bi bi-chevron-left"></i>
          </button>
          <span></span>
          <input 
            v-model.number="propPageInput" 
            type="number" 
            min="1" 
            :max="totalPropPages" 
            class="form-control form-control-sm text-center" 
            style="width: 55px;"
            @change="jumpPropPage"
          >
          <span>of {{ totalPropPages }}</span>
          <button class="btn btn-outline-success btn-sm" :disabled="propPage >= totalPropPages" @click="propPage++">
           <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- Tab 3: Master Inventory Table  -->
    <!-- ================================================================= -->
    <div v-if="adminActiveTab === 'inventory'">
      <div class="card border-0 bg-white">
        <div class="card-header bg-success text-white fw-bold d-flex justify-content-between align-items-center py-2">
          <span><i class="bi bi-boxes me-2"></i>Master Species Inventory & Nursery Stock</span>
          <!-- Header Action: Register New Species -->
          <button class="btn btn-light btn-sm fw-bold text-success" @click="showAddModal = true">
            <i class="bi bi-plus-circle-fill me-1"></i> Add New Species
          </button>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-bordered mb-0 align-middle small">
              <thead class="table-light">
                <tr>
                  <th>Species Name</th>
                  <th>Category</th>
                  <th>Current Nursery Stock</th>
                  <th>Approved Adoptions</th>
                  <th>Sun & Water Requirements</th>
                  <th class="text-center" style="width: 250px;">Custom Restock</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="plant in paginatedInventory" :key="plant.id">
                  <td>
                    <span class="text-dark">{{ plant.name }}</span><br>
                  </td>
                  <td>{{ plant.category }}</td>
                  <td>
                    <span :class="plant.stock > 0 ? 'text-dark' : 'text-danger'">
                      {{ plant.stock }} seedlings
                    </span>
                    <span v-if="plant.stock <= 0" class="text-danger small ms-1">(Out of stock)</span>
                  </td>
                  <td><span>{{ plant.adoptedCount }}</span> plants</td>
                  <td>{{ plant.sunExposure }} | {{ plant.waterNeeds }}</td>
                  <td class="text-center">
                    <div class="input-group input-group-sm justify-content-center">
                      <input 
                        v-model.number="restockInputs[plant.id]" 
                        type="number" 
                        min="1" 
                        max="500" 
                        class="form-control text-center" 
                        style="max-width: 70px;"
                        placeholder="Qty"
                      >
                      <button 
                        class="btn btn-outline-success fw-bold" 
                        type="button" 
                        @click="handleCustomRestock(plant.id)"
                      >
                        <i class="bi bi-plus-lg me-1"></i>Restock
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="card-footer bg-transparent border-top-0 d-flex justify-content-between align-items-center flex-wrap gap-2 py-2 small">
          <span class="text-muted fw-bold">Total: {{ plantStore.state.plants.length }} species</span>
          <div class="d-flex align-items-center gap-2">
            <button class="btn btn-outline-success btn-sm" :disabled="invPage <= 1" @click="invPage--">
              <i class="bi bi-chevron-left"></i>
            </button>
            <span></span>
            <input 
              v-model.number="invPageInput" 
              type="number" 
              min="1" 
              :max="totalInvPages" 
              class="form-control form-control-sm text-center" 
              style="width: 55px;"
              @change="jumpInvPage"
            >
            <span>of {{ totalInvPages }}</span>
            <button class="btn btn-outline-success btn-sm" :disabled="invPage >= totalInvPages" @click="invPage++">
             <i class="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 6: Direct Species Registration Modal -->
    <div v-if="showAddModal" class="modal-backdrop fade show"></div>
    <div v-if="showAddModal" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title fw-bold"><i class="bi bi-shield-lock me-2"></i>Register New Species</h5>
            <button type="button" class="btn-close btn-close-white" @click="showAddModal = false"></button>
          </div>
          <div class="modal-body p-4">
            <form @submit.prevent="handleAddPlant">
              <div class="mb-3">
                <label class="form-label small fw-bold">Common Name *</label>
                <input v-model="newPlant.name" type="text" class="form-control" required placeholder="e.g. Lemon Scented Myrtle">
              </div>
              <div class="mb-3">
                <label class="form-label small fw-bold">Botanical Scientific Name</label>
                <input v-model="newPlant.scientificName" type="text" class="form-control" placeholder="e.g. Backhousia citriodora">
              </div>
              <div class="mb-3">
                <label class="form-label small fw-bold">Plant Image URL</label>
                <input 
                  v-model="newPlant.imageUrl" 
                  type="url" 
                  class="form-control" 
                  placeholder="e.g. https://images.unsplash.com/..."
                >
              </div>
              <div class="row g-2 mb-3">
                <div class="col-6">
                  <label class="form-label small fw-bold">Category</label>
                  <select v-model="newPlant.category" class="form-select">
                    <option value="Tree">Tree</option>
                    <option value="Shrub">Shrub</option>
                    <option value="Grass">Grass</option>
                    <option value="Wildflower">Wildflower</option>
                  </select>
                </div>
                <div class="col-6">
                  <label class="form-label small fw-bold">Initial Nursery Stock</label>
                  <input v-model.number="newPlant.stock" type="number" min="1" max="100" class="form-control" required>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label small fw-bold">Ecological Benefit</label>
                <input v-model="newPlant.wildlifeBenefit" type="text" class="form-control" placeholder="e.g. Attracts native bees">
              </div>
              <div class="mb-3">
                <label class="form-label small fw-bold">Description</label>
                <textarea v-model="newPlant.description" class="form-control" rows="2"></textarea>
              </div>
              <div class="d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-secondary btn-sm" @click="showAddModal = false">Cancel</button>
                <button type="submit" class="btn btn-success btn-sm fw-bold">Save Species</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 7: Toast Notification -->
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

const adminActiveTab = ref('adoptions') // 'adoptions', 'proposals', or 'inventory'
const showAddModal = ref(false)
const toastMessage = ref('')

const restockInputs = ref({})
const pageSize = 4

function getStatusClass(status) {
  if (status === 'Approved') return 'text-success fw-bold'
  if (status === 'Pending') return 'text-warning fw-bold text-dark-emphasis'
  return 'text-danger fw-bold'
}

// Section 8: Pagination Logic for Application Requests
const appPage = ref(1)
const appPageInput = ref(1)
const totalAppPages = computed(() => Math.max(1, Math.ceil(plantStore.state.applications.length / pageSize)))
const paginatedApplications = computed(() => {
  const start = (appPage.value - 1) * pageSize
  return plantStore.state.applications.slice(start, start + pageSize)
})
watch(appPage, (val) => { appPageInput.value = val })
function jumpAppPage() {
  let target = Math.max(1, Math.min(appPageInput.value, totalAppPages.value))
  appPage.value = target
  appPageInput.value = target
}

// Section 9: Pagination Logic for Species Proposals
const propPage = ref(1)
const propPageInput = ref(1)
const totalPropPages = computed(() => Math.max(1, Math.ceil(plantStore.state.speciesProposals.length / pageSize)))
const paginatedProposals = computed(() => {
  const start = (propPage.value - 1) * pageSize
  return plantStore.state.speciesProposals.slice(start, start + pageSize)
})
watch(propPage, (val) => { propPageInput.value = val })
function jumpPropPage() {
  let target = Math.max(1, Math.min(propPageInput.value, totalPropPages.value))
  propPage.value = target
  propPageInput.value = target
}

// Section 10: Pagination Logic for Master Inventory
const invPage = ref(1)
const invPageInput = ref(1)
const totalInvPages = computed(() => Math.max(1, Math.ceil(plantStore.state.plants.length / pageSize)))
const paginatedInventory = computed(() => {
  const start = (invPage.value - 1) * pageSize
  return plantStore.state.plants.slice(start, start + pageSize)
})
watch(invPage, (val) => { invPageInput.value = val })
function jumpInvPage() {
  let target = Math.max(1, Math.min(invPageInput.value, totalInvPages.value))
  invPage.value = target
  invPageInput.value = target
}

const newPlant = ref({ name: '', category: 'Shrub', stock: 20, wildlifeBenefit: '', imageUrl: '', description: '' })

function handleAddPlant() {
  if (!newPlant.value.name) return
  plantStore.addPlant(newPlant.value)
  showAddModal.value = false
  newPlant.value = { name: '', category: 'Shrub', stock: 20, wildlifeBenefit: '', imageUrl: '', description: '' }
  showToast('New species successfully registered into database!')
}

function handleCustomRestock(plantId) {
  const qty = parseInt(restockInputs.value[plantId]) || 5
  const newStock = plantStore.restockPlant(plantId, qty)
  restockInputs.value[plantId] = null
  showToast(`Restocked +${qty} seedlings! Current inventory: ${newStock}`)
}

function handleApproveApp(appId) {
  const res = plantStore.approveApplication(appId)
  showToast(res.message)
}

function handleRejectApp(appId) {
  plantStore.rejectApplication(appId)
  showToast('Application rejected.')
}

function handleApproveProposal(proposalId) {
  plantStore.approveSpeciesProposal(proposalId)
  showToast('Proposal Approved! New species is now live in the resident catalog.')
}

function handleRejectProposal(proposalId) {
  plantStore.rejectSpeciesProposal(proposalId)
  showToast('Proposal Rejected.')
}

function handleReset() {
  if (confirm('Reset all catalog, applications, and proposals to default seed data?')) {
    plantStore.resetToDefault()
    appPage.value = 1
    propPage.value = 1
    invPage.value = 1
    showToast('Data reset to default successfully.')
  }
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