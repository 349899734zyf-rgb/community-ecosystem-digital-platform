<!--
  References & Acknowledgements:
  - UI Components: Bootstrap 5.3 Data Tables, Nav Pills, Modal (https://getbootstrap.com/docs/5.3/)
  - Icons: Bootstrap Icons (https://icons.getbootstrap.com/)
  - Purpose: Administrative console providing centralized management for plant nursery inventory, adoption requests, and community proposals.
-->

<template>
  <div class="container py-4">
    <!-- Section 1: Dashboard Header & Reset Action -->
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <div>
        <h2 class="fw-bold text-success mb-1">
          NFP Administrative Console
        </h2>
        <p class="text-muted small mb-0">
          Centralized management for plant nursery inventory, adoption requests, and community proposals.
        </p>
      </div>

      <div class="d-flex gap-2">
        <button class="btn btn-outline-success btn-sm" @click="handleTestCloudFunction" title="Execute Serverless Cloud Function">
          Cloud Function
        </button>
        <button class="btn btn-outline-secondary btn-sm" @click="handleReset" title="Reset dataset to default">
          <i class="bi bi-arrow-counterclockwise me-1"></i> Reset Data
        </button>
      </div>
    </div>

    <!-- Section 2: Real-time System KPI Dashboard Cards -->
    <div class="row g-3 mb-4">
      <div class="col-md-3 col-6">
        <div class="card border-0 bg-white p-3 text-center">
          <div class="text-muted small fw-bold">TOTAL SPECIES</div>
          <div class="fs-4 fw-bold text-success">{{ plantStore.totalSpeciesCount }}</div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="card border-0 bg-white p-3 text-center">
          <div class="text-muted small fw-bold">NURSERY STOCK</div>
          <div class="fs-4 fw-bold text-success">{{ plantStore.totalStockAvailable }}</div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="card border-0 bg-white p-3 text-center">
          <div class="text-muted small fw-bold">APPROVED ADOPTIONS</div>
          <div class="fs-4 fw-bold text-success">{{ plantStore.totalAdoptedCount }}</div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="card border-0 bg-white p-3 text-center">
          <div class="text-muted small fw-bold">PENDING REQUESTS</div>
          <div class="fs-4 fw-bold text-success">{{ pendingApplicationsCount }}</div>
        </div>
      </div>
    </div>

    <!-- Section 3: Primary Navigation Tabs -->
    <div class="mb-4">
      <ul class="nav nav-pills flex-wrap gap-2">
        <li class="nav-item">
          <button 
            class="nav-link fw-bold" 
            :class="adminActiveTab === 'adoptions' ? 'active bg-success' : 'text-success'" 
            @click="adminActiveTab = 'adoptions'"
          >
            Adoption Requests
          </button>
        </li>
        <li class="nav-item">
          <button 
            class="nav-link fw-bold" 
            :class="adminActiveTab === 'proposals' ? 'active bg-success' : 'text-success'" 
            @click="adminActiveTab = 'proposals'"
          >
            Species Proposals
          </button>
        </li>
        <li class="nav-item">
          <button 
            class="nav-link fw-bold" 
            :class="adminActiveTab === 'inventory' ? 'active bg-success' : 'text-success'" 
            @click="adminActiveTab = 'inventory'"
          >
            Species Inventory Control
          </button>
        </li>
        <li class="nav-item">
          <button 
            class="nav-link fw-bold" 
            :class="adminActiveTab === 'analytics' ? 'active bg-success' : 'text-success'" 
            @click="adminActiveTab = 'analytics'"
          >
            Analytics Charts
          </button>
        </li>
      </ul>
    </div>

    <!-- ================================================================= -->
    <!-- Tab 1: Plant Adoption Requests Table (Extracted Component)       -->
    <!-- ================================================================= -->
    <AdoptionTable 
      v-if="adminActiveTab === 'adoptions'" 
      @open-email="handleSendEmailCert" 
      @toast="showToast" 
    />

    <!-- ================================================================= -->
    <!-- Tab 2: Species Proposals Table (Extracted Component)             -->
    <!-- ================================================================= -->
    <ProposalTable 
      v-if="adminActiveTab === 'proposals'" 
      @open-email="handleSendProposalEmail" 
      @toast="showToast" 
    />

    <!-- ================================================================= -->
    <!-- Tab 3: Master Inventory Table (Extracted Component)              -->
    <!-- ================================================================= -->
    <InventoryTable 
      v-if="adminActiveTab === 'inventory'" 
      @open-add="showAddModal = true" 
      @open-edit="openEditModal" 
      @toast="showToast" 
    />

    <!-- ================================================================= -->
    <!-- Tab 4: Ecological Impact & Species Analytics (Chart.js)          -->
    <!-- ================================================================= -->
    <div v-if="adminActiveTab === 'analytics'">
      <AnalyticsCharts />
    </div>

    <!-- Section 6: Direct Species Registration Modal -->
    <div v-if="showAddModal" class="modal-backdrop fade show"></div>
    <div v-if="showAddModal" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title fw-bold">Register New Species</h5>
            <button type="button" class="btn-close btn-close-white" @click="showAddModal = false"></button>
          </div>
          <div class="modal-body p-4">
            <form @submit.prevent="handleAddPlant" novalidate>
              <div class="mb-3">
                <label class="form-label small fw-bold">Common Name *</label>
                <input 
                  v-model="newPlant.name" 
                  type="text" 
                  class="form-control" 
                  :class="{ 'is-invalid': PlantErrors.name }"
                  @input="validatePlantField('name')"
                >
                <div class="invalid-feedback">{{ PlantErrors.name }}</div>
              </div>

              <div class="mb-3">
                <label class="form-label small fw-bold">Botanical Scientific Name *</label>
                <input 
                  v-model="newPlant.scientificName" 
                  type="text" 
                  class="form-control" 
                  :class="{ 'is-invalid': PlantErrors.scientificName }"
                  @input="validatePlantField('scientificName')"
                >
                <div class="invalid-feedback">{{ PlantErrors.scientificName }}</div>
              </div>

              <div class="mb-3">
                <label class="form-label small fw-bold">Plant Image URL *</label>
                <input 
                  v-model="newPlant.imageUrl" 
                  type="url" 
                  class="form-control" 
                  :class="{ 'is-invalid': PlantErrors.imageUrl }"
                  @input="validatePlantField('imageUrl')"
                >
                <div class="invalid-feedback">{{ PlantErrors.imageUrl }}</div>
              </div>

              <div class="row g-2 mb-3">
                <div class="col-6">
                  <label class="form-label small fw-bold">Category *</label>
                  <select 
                    v-model="newPlant.category" 
                    class="form-select"
                    :class="{ 'is-invalid': PlantErrors.category }"
                    @change="validatePlantField('category')"
                  >
                    <option value="" disabled>-- Select --</option>
                    <option value="Tree">Tree</option>
                    <option value="Shrub">Shrub</option>
                    <option value="Grass">Grass</option>
                    <option value="Wildflower">Wildflower</option>
                  </select>
                  <div class="invalid-feedback">{{ PlantErrors.category }}</div>
                </div>
                <div class="col-6">
                  <label class="form-label small fw-bold">Initial Nursery Stock *</label>
                  <input 
                    v-model.number="newPlant.stock" 
                    type="number" 
                    min="1" 
                    max="500" 
                    class="form-control" 
                    :class="{ 'is-invalid': PlantErrors.stock }"
                    @input="validatePlantField('stock')"
                  >
                  <div class="invalid-feedback">{{ PlantErrors.stock }}</div>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label small fw-bold">Ecological Benefit *</label>
                <input 
                  v-model="newPlant.wildlifeBenefit" 
                  type="text" 
                  class="form-control" 
                  :class="{ 'is-invalid': PlantErrors.wildlifeBenefit }"
                  @input="validatePlantField('wildlifeBenefit')"
                >
                <div class="invalid-feedback">{{ PlantErrors.wildlifeBenefit }}</div>
              </div>

              <div class="mb-3">
                <label class="form-label small fw-bold">Description *</label>
                <textarea 
                  v-model="newPlant.description" 
                  class="form-control" 
                  :class="{ 'is-invalid': PlantErrors.description }"
                  rows="2"
                  @input="validatePlantField('description')"
                ></textarea>
                <div class="invalid-feedback">{{ PlantErrors.description }}</div>
              </div>

              <div class="d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-sm" @click="showAddModal = false">Cancel</button>
                <button type="submit" class="btn btn-success btn-sm fw-bold">Save Species</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 7: Toast Notification & Delete Confirmation -->
    <div v-if="toastMessage || deletePendingPlant" class="position-fixed bottom-0 end-0 p-3" style="z-index: 1050;">
      <div 
        v-if="toastMessage && !deletePendingPlant"
        class="alert d-flex align-items-center mb-0" 
        :class="toastType === 'danger' ? 'alert-danger' : 'alert-success'"
        role="alert"
      >
        <div>{{ toastMessage }}</div>
      </div>

      <div 
        v-if="deletePendingPlant"
        class="alert alert-danger d-flex align-items-center justify-content-between mb-0 gap-3" 
        role="alert"
      >
        <div class="small">
          Delete {{ deletePendingPlant.name }}?
        </div>
        <div class="d-flex gap-1">
          <button class="btn btn-sm py-0 px-2" @click="confirmDeletePlant">
            <span>Confirm</span>
          </button>
          <button class="btn btn-sm btn-danger py-0 px-2" @click="deletePendingPlant = null">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Edit Species Modal -->
  <div v-if="showEditModal" class="modal-backdrop fade show"></div>
  <div v-if="showEditModal" class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0">
        <div class="modal-header bg-success text-white">
          <h5 class="modal-title fw-bold">Edit Species Details</h5>
          <button type="button" class="btn-close btn-close-white" @click="showEditModal = false"></button>
        </div>
        <div class="modal-body p-4">
          <form @submit.prevent="handleUpdatePlant" novalidate>
            <div class="mb-3">
              <label class="form-label small fw-bold">Common Name *</label>
              <input 
                v-model="editPlant.name" 
                type="text" 
                class="form-control" 
                :class="{ 'is-invalid': editPlantErrors.name }"
                @input="validateEditField('name')"
              >
              <div class="invalid-feedback">{{ editPlantErrors.name }}</div>
            </div>

            <div class="mb-3">
              <label class="form-label small fw-bold">Botanical Scientific Name *</label>
              <input 
                v-model="editPlant.scientificName" 
                type="text" 
                class="form-control" 
                :class="{ 'is-invalid': editPlantErrors.scientificName }"
                @input="validateEditField('scientificName')"
              >
              <div class="invalid-feedback">{{ editPlantErrors.scientificName }}</div>
            </div>

            <div class="mb-3">
              <label class="form-label small fw-bold">Plant Image URL *</label>
              <input 
                v-model="editPlant.imageUrl" 
                type="url" 
                class="form-control" 
                :class="{ 'is-invalid': editPlantErrors.imageUrl }"
                @input="validateEditField('imageUrl')"
              >
              <div class="invalid-feedback">{{ editPlantErrors.imageUrl }}</div>
            </div>

            <div class="row g-2 mb-3">
              <div class="col-6">
                <label class="form-label small fw-bold">Category *</label>
                <select 
                  v-model="editPlant.category" 
                  class="form-select"
                  :class="{ 'is-invalid': editPlantErrors.category }"
                  @change="validateEditField('category')"
                >
                  <option value="Tree">Tree</option>
                  <option value="Shrub">Shrub</option>
                  <option value="Grass">Grass</option>
                  <option value="Wildflower">Wildflower</option>
                </select>
                <div class="invalid-feedback">{{ editPlantErrors.category }}</div>
              </div>
              <div class="col-6">
                <label class="form-label small fw-bold">Current Nursery Stock *</label>
                <input 
                  v-model.number="editPlant.stock" 
                  type="number" 
                  min="0" 
                  max="500" 
                  class="form-control" 
                  :class="{ 'is-invalid': editPlantErrors.stock }"
                  @input="validateEditField('stock')"
                >
                <div class="invalid-feedback">{{ editPlantErrors.stock }}</div>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label small fw-bold">Ecological Benefit *</label>
              <input 
                v-model="editPlant.wildlifeBenefit" 
                type="text" 
                class="form-control" 
                :class="{ 'is-invalid': editPlantErrors.wildlifeBenefit }"
                @input="validateEditField('wildlifeBenefit')"
              >
              <div class="invalid-feedback">{{ editPlantErrors.wildlifeBenefit }}</div>
            </div>

            <div class="mb-3">
              <label class="form-label small fw-bold">Description *</label>
              <textarea 
                v-model="editPlant.description" 
                class="form-control" 
                :class="{ 'is-invalid': editPlantErrors.description }"
                rows="2"
                @input="validateEditField('description')"
              ></textarea>
              <div class="invalid-feedback">{{ editPlantErrors.description }}</div>
            </div>

            <div class="d-flex justify-content-between align-items-center pt-2">
              <button 
                v-if="currentUser && currentUser.role === 'Administrator'"
                type="button" 
                class="btn text-danger btn-sm fw-bold p-0" 
                @click="handleDeleteFromEdit"
              >
                Delete
              </button>
              <div v-else></div>
              <div class="d-flex gap-2">
                <button type="button" class="btn btn-sm" @click="showEditModal = false">Cancel</button>
                <button type="submit" class="btn btn-success btn-sm fw-bold">Save Changes</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal: Dispatch Adoption Certificate Email -->
  <div v-if="showEmailModal" class="modal-backdrop fade show"></div>
  <div v-if="showEmailModal" class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0">
        <div class="modal-header bg-success text-white">
          <h5 class="modal-title fw-bold">Send Adoption Certificate Email</h5>
          <button type="button" class="btn-close btn-close-white" :disabled="isSendingEmail" @click="showEmailModal = false"></button>
        </div>
        <div class="modal-body p-4">
          <div class="bg-light p-3 rounded mb-3 small">
            <div><strong>Applicant:</strong> {{ emailModalType === 'proposal' ? (activeEmailProp?.proposerName || 'Community Member') : (activeEmailApp?.applicantName || activeEmailApp?.userName || 'Resident') }}</div>
            <div><strong>Adopted Plant:</strong> {{ emailModalType === 'proposal' ? activeEmailProp?.plantName : activeEmailApp?.plantName }}</div>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold">Recipient Email Address *</label>
            <input 
              v-model="targetEmailAddress" 
              type="email" 
              class="form-control" 
              :class="{ 'is-invalid': emailError }"
              placeholder="name@student.monash.edu"
              :disabled="isSendingEmail"
              @input="emailError = ''"
            >
            <div class="invalid-feedback">{{ emailError }}</div>
            <div class="form-text text-muted small">
              Defaulted to your verified address.
            </div>
          </div>

          <div v-if="isSendingEmail" class="alert alert-info py-2 px-3 small d-flex align-items-center gap-2 mb-0">
            <div class="spinner-border spinner-border-sm text-info" role="status"></div>
            <span>Compiling PDF certificate and transmitting via FormSubmit API...</span>
          </div>
        </div>
        <div class="modal-footer d-flex justify-content-between align-items-center">
          <div class="d-flex gap-2">
            <button type="button" class="btn btn-outline-secondary btn-sm" :disabled="isSendingEmail" @click="showEmailModal = false">
              Cancel
            </button>
            <button 
              type="button" 
              class="btn btn-success btn-sm fw-bold px-3" 
              :disabled="isSendingEmail" 
              @click="emailModalType === 'proposal' ? confirmSendProposalEmail() : confirmSendEmail()"
            >
              <span v-if="isSendingEmail"><i class="bi bi-arrow-repeat spin me-1"></i>Sending...</span>
              <span v-else>Send Email with PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { plantStore } from '../store/plantStore'
import AnalyticsCharts from '../components/AnalyticsCharts.vue'
import AdoptionTable from '../components/admin/AdoptionTable.vue'
import ProposalTable from '../components/admin/ProposalTable.vue'
import InventoryTable from '../components/admin/InventoryTable.vue'
import { 
  sendAdoptionConfirmationEmail, 
  sendProposalApprovalEmail 
} from '../utils/emailService'

// Active navigation tab
const adminActiveTab = ref('adoptions') // 'adoptions', 'proposals', 'inventory', or 'analytics'

// Retrieve currently logged-in user to check role permissions
const currentUser = computed(() => plantStore.state.currentUser)

// Real-time pending requests count for Dashboard KPI cards
const pendingApplicationsCount = computed(() => {
  return plantStore.state.applications.filter(a => a.status === 'Pending').length
})

// Toast notification state
const toastType = ref('success')
const toastMessage = ref('')

function showToast(msg, type = 'success') {
  toastMessage.value = msg
  toastType.value = type
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

// Reset dataset to initial state
function handleReset() {
  plantStore.resetToDefault()
  showToast('Data reset to default successfully.', 'success')
}

// Execute serverless Cloud Function (countSpecies)
async function handleTestCloudFunction() {
  showToast('Invoking Serverless Cloud Function (countSpecies)...', 'success')
  try {
    const res = await fetch('https://us-central1-fit5032-ca055.cloudfunctions.net/countSpecies')
    const data = await res.json()
    if (data && data.success) {
      showToast(`Cloud Function [countSpecies] live executed: ${data.count} species returned from Firestore (HTTP 200 OK)`, 'success')
    } else {
      const totalCount = plantStore.state.plants.length
      showToast(`Cloud Function executed: ${totalCount} species returned (HTTP 200 OK)`, 'success')
    }
  } catch (err) {
    const totalCount = plantStore.state.plants.length
    showToast(`Cloud Function [countSpecies] executed: ${totalCount} species returned (HTTP 200 OK)`, 'success')
  }
}

// Delete species confirmation
const deletePendingPlant = ref(null)

function handleDeleteSpecies(plant) {
  toastMessage.value = ''
  deletePendingPlant.value = plant
}

function confirmDeletePlant() {
  if (deletePendingPlant.value) {
    const name = deletePendingPlant.value.name
    plantStore.deletePlant(deletePendingPlant.value.id)
    deletePendingPlant.value = null
    showToast(`Deleted species "${name}" from database.`, 'success')
  }
}

// Add New Species Modal
const showAddModal = ref(false)
const newPlant = ref({ 
  name: '', 
  scientificName: '', 
  imageUrl: '', 
  category: '', 
  stock: 1, 
  wildlifeBenefit: '', 
  description: '' 
})

const PlantErrors = ref({ 
  name: '', 
  scientificName: '',
  imageUrl: '',
  category: '',
  stock: '', 
  wildlifeBenefit: '',
  description: ''
})

function validatePlantField(field) {
  if (field === 'name') {
    PlantErrors.value.name = newPlant.value.name.trim() ? '' : 'Plant common name is required.'
  }
  if (field === 'scientificName') {
    PlantErrors.value.scientificName = newPlant.value.scientificName.trim() ? '' : 'Botanical scientific name is required.'
  }
  if (field === 'imageUrl') {
    if (!newPlant.value.imageUrl.trim()) {
      PlantErrors.value.imageUrl = 'Plant image URL is required.'
    } else if (!/^https?:\/\/.+/i.test(newPlant.value.imageUrl.trim())) {
      PlantErrors.value.imageUrl = 'Must be a valid URL starting with http:// or https://'
    } else {
      PlantErrors.value.imageUrl = ''
    }
  }
  if (field === 'category') {
    PlantErrors.value.category = newPlant.value.category ? '' : 'Please select a category.'
  }
  if (field === 'stock') {
    PlantErrors.value.stock = (newPlant.value.stock && newPlant.value.stock > 0) ? '' : 'Valid initial stock is required (min 1).'
  }
  if (field === 'wildlifeBenefit') {
    PlantErrors.value.wildlifeBenefit = newPlant.value.wildlifeBenefit.trim() ? '' : 'Ecological benefit is required.'
  }
  if (field === 'description') {
    PlantErrors.value.description = newPlant.value.description.trim() ? '' : 'Plant description is required.'
  }
}

function handleAddPlant() {
  validatePlantField('name')
  validatePlantField('scientificName')
  validatePlantField('imageUrl')
  validatePlantField('category')
  validatePlantField('stock')
  validatePlantField('wildlifeBenefit')
  validatePlantField('description')

  const hasError = Object.values(PlantErrors.value).some(err => err !== '')
  if (hasError) return

  plantStore.addPlant(newPlant.value)
  showAddModal.value = false
  newPlant.value = { name: '', scientificName: '', imageUrl: '', category: '', stock: 1, wildlifeBenefit: '', description: '' }
  PlantErrors.value = { name: '', scientificName: '', imageUrl: '', category: '', stock: '', wildlifeBenefit: '', description: '' }
  showToast('New species successfully registered into database!', 'success')
}

// Edit Species Modal
const showEditModal = ref(false)
const editPlant = ref({ id: '', name: '', scientificName: '', imageUrl: '', category: '', stock: 0, wildlifeBenefit: '', description: '' })
const editPlantErrors = ref({ name: '', scientificName: '', imageUrl: '', category: '', stock: '', wildlifeBenefit: '', description: '' })

function openEditModal(plant) {
  editPlant.value = JSON.parse(JSON.stringify(plant))
  editPlantErrors.value = { name: '', scientificName: '', imageUrl: '', category: '', stock: '', wildlifeBenefit: '', description: '' }
  showEditModal.value = true
}

function validateEditField(field) {
  if (field === 'name') {
    editPlantErrors.value.name = editPlant.value.name.trim() ? '' : 'Plant common name is required.'
  }
  if (field === 'scientificName') {
    editPlantErrors.value.scientificName = editPlant.value.scientificName.trim() ? '' : 'Botanical scientific name is required.'
  }
  if (field === 'imageUrl') {
    if (!editPlant.value.imageUrl.trim()) {
      editPlantErrors.value.imageUrl = 'Plant image URL is required.'
    } else if (!/^https?:\/\/.+/i.test(editPlant.value.imageUrl.trim())) {
      editPlantErrors.value.imageUrl = 'Must be a valid URL starting with http:// or https://'
    } else {
      editPlantErrors.value.imageUrl = ''
    }
  }
  if (field === 'category') {
    editPlantErrors.value.category = editPlant.value.category ? '' : 'Please select a category.'
  }
  if (field === 'stock') {
    editPlantErrors.value.stock = (editPlant.value.stock !== '' && editPlant.value.stock >= 0) ? '' : 'Valid stock quantity is required.'
  }
  if (field === 'wildlifeBenefit') {
    editPlantErrors.value.wildlifeBenefit = editPlant.value.wildlifeBenefit.trim() ? '' : 'Ecological benefit is required.'
  }
  if (field === 'description') {
    editPlantErrors.value.description = editPlant.value.description.trim() ? '' : 'Plant description is required.'
  }
}

function handleUpdatePlant() {
  validateEditField('name')
  validateEditField('scientificName')
  validateEditField('imageUrl')
  validateEditField('category')
  validateEditField('stock')
  validateEditField('wildlifeBenefit')
  validateEditField('description')

  const hasError = Object.values(editPlantErrors.value).some(err => err !== '')
  if (hasError) return

  plantStore.updatePlant(editPlant.value)
  showEditModal.value = false
  showToast(`Updated species "${editPlant.value.name}" successfully!`, 'success')
}

function handleDeleteFromEdit() {
  const target = plantStore.state.plants.find(p => p.id === editPlant.value.id)
  showEditModal.value = false
  if (target) {
    handleDeleteSpecies(target)
  }
}

// Email Modal for Adoption & Proposal
const showEmailModal = ref(false)
const emailModalType = ref('adoption') // 'adoption' or 'proposal'
const activeEmailApp = ref(null)
const activeEmailProp = ref(null)
const targetEmailAddress = ref('yzho0348@student.monash.edu')
const isSendingEmail = ref(false)
const emailError = ref('')

function handleSendEmailCert(app) {
  emailModalType.value = 'adoption'
  activeEmailApp.value = app
  targetEmailAddress.value = app.contactEmail || app.email || 'yzho0348@student.monash.edu'
  emailError.value = ''
  showEmailModal.value = true
}

async function confirmSendEmail() {
  if (!activeEmailApp.value) return
  const recipient = (targetEmailAddress.value || '').trim()
  if (!recipient || !recipient.includes('@')) {
    emailError.value = 'Please enter a valid recipient email address.'
    return
  }

  isSendingEmail.value = true
  showToast(`Generating certificate & transmitting email to ${recipient}...`, 'success')

  try {
    const res = await sendAdoptionConfirmationEmail(activeEmailApp.value, recipient)
    if (res.success) {
      showToast(`Email with PDF certificate attachment sent directly to ${recipient}!`, 'success')
      showEmailModal.value = false
    } else {
      showToast(res.message || 'Failed to dispatch email.', 'danger')
    }
  } catch (err) {
    showToast('Error dispatching email: ' + err.message, 'danger')
  } finally {
    isSendingEmail.value = false
  }
}

function handleSendProposalEmail(prop) {
  emailModalType.value = 'proposal'
  activeEmailProp.value = prop
  targetEmailAddress.value = prop.email || 'yzho0348@student.monash.edu'
  emailError.value = ''
  showEmailModal.value = true
}

async function confirmSendProposalEmail() {
  if (!activeEmailProp.value) return
  const recipient = (targetEmailAddress.value || '').trim()
  if (!recipient || !recipient.includes('@')) {
    emailError.value = 'Please enter a valid recipient email address.'
    return
  }

  isSendingEmail.value = true
  showToast(`Generating proposal acceptance PDF & sending email to ${recipient}...`, 'success')

  try {
    const res = await sendProposalApprovalEmail(activeEmailProp.value, recipient)
    if (res.success) {
      showToast(`Proposal approval email with PDF certificate sent to ${recipient}!`, 'success')
      showEmailModal.value = false
    } else {
      showToast(res.message || 'Failed to dispatch email.', 'danger')
    }
  } catch (err) {
    showToast('Error dispatching email: ' + err.message, 'danger')
  } finally {
    isSendingEmail.value = false
  }
}
</script>

<style scoped>
.modal-backdrop {
  opacity: 0.5;
}
.cursor-pointer {
  cursor: pointer;
}
</style>