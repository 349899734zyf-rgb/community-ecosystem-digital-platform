<!--
  References & Acknowledgements:
  - Form Validations & Controls: Bootstrap 5.3 Forms & Validation States (https://getbootstrap.com/docs/5.3/forms/validation/)
  - Progress Bar Component: Bootstrap 5.3 Progress (https://getbootstrap.com/docs/5.3/components/progress/)
  - Icons: Bootstrap Icons (https://icons.getbootstrap.com/)
  - Purpose: 3-step resident adoption wizard with multi-type client-side validations adhering to BR B.1.
-->

<template>
  <div class="container py-4">
    <!-- Section 1: Page Header -->
    <div class="text-center mb-4">
      <span class="badge text-success fw-bold text-uppercase px-3 py-2 rounded-pill mb-2">
        Community Adoption Program
      </span>
      <h2 class="fw-bold text-success mb-1">Indigenous Plant Adoption Request</h2>
    </div>

    <!-- Section 2: 3-Step Wizard Progress Bar (Matching A1.1 Wireframe 1) -->
    <div v-if="!isSubmitted" class="card border-0 mb-4 bg-white">
      <div class="card-body p-3">
        <div class="d-flex justify-content-between align-items-center mb-2 small fw-bold">
          <span :class="currentStep >= 1 ? 'text-success' : 'text-muted'">
            1. Personal Details
          </span>
          <span :class="currentStep >= 2 ? 'text-success' : 'text-muted'">
            2. Species & Garden
          </span>
          <span :class="currentStep >= 3 ? 'text-success' : 'text-muted'">
            3. Confirmation
          </span>
        </div>
        <div class="progress" style="height: 6px;">
          <div 
            class="progress-bar bg-success transition-all" 
            role="progressbar" 
            :style="{ width: currentStep === 1 ? '33%' : currentStep === 2 ? '66%' : '100%' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Section 3: Active Form Steps Container -->
    <div v-if="!isSubmitted" class="card border-0 bg-white">
      <div class="card-body p-4">
        
        <!-- ============================================================= -->
        <!-- STEP 1: Personal & Delivery Address Details -->
        <!-- ============================================================= -->
        <div v-if="currentStep === 1">
          <h5 class="fw-bold text-success mb-3">
            Step 1: Personal & Delivery Details
          </h5>

          <!-- Full Name Input -->
          <div class="mb-3">
            <label class="form-label small fw-bold">Full Legal Name</label>
            <input 
              v-model.trim="formData.fullName" 
              type="text" 
              class="form-control" 
              :class="getFieldClass('fullName')" 
              placeholder="e.g. Marcus Chen"
              @blur="touchField('fullName')"
              @input="validateField('fullName')"
            >
            <div class="invalid-feedback">{{ errors.fullName }}</div>
            <div class="form-text small">Must contain at least 2 characters (letters and spaces only).</div>
          </div>

          <!-- Email Address Input (Regex Validated) -->
          <div class="mb-3">
            <label class="form-label small fw-bold">Contact Email Address</label>
            <input 
              v-model.trim="formData.email" 
              type="email" 
              class="form-control" 
              :class="getFieldClass('email')" 
              placeholder="e.g. marcus.chen@student.monash.edu"
              @blur="touchField('email')"
              @input="validateField('email')"
            >
            <div class="invalid-feedback">{{ errors.email }}</div>
            <div class="form-text small">We will send seedling distribution notifications to this address.</div>
          </div>

          <!-- Victorian Postcode & Street Address Row -->
          <div class="row g-3 mb-3">
            <div class="col-md-4">
              <label class="form-label small fw-bold">Victorian Postcode</label>
              <input 
                v-model.trim="formData.postcode" 
                type="text" 
                maxlength="4"
                class="form-control" 
                :class="getFieldClass('postcode')" 
                placeholder="e.g. 3168"
                @blur="touchField('postcode')"
                @input="validateField('postcode')"
              >
              <div class="invalid-feedback">{{ errors.postcode }}</div>
              <div class="form-text small">Must be a 4-digit VIC postcode (3XXX).</div>
            </div>
            
            <div class="col-md-8">
              <label class="form-label small fw-bold">Street Delivery Address</label>
              <input 
                v-model.trim="formData.address" 
                type="text" 
                class="form-control" 
                :class="getFieldClass('address')" 
                placeholder="e.g. 45 Prince Street, Clayton"
                @blur="touchField('address')"
                @input="validateField('address')"
              >
              <div class="invalid-feedback">{{ errors.address }}</div>
              <div class="form-text small">Provide complete street number and road name.</div>
            </div>
          </div>

          <!-- Step 1 Actions -->
          <div class="d-flex justify-content-end pt-3">
            <button 
              type="button" 
              class="btn btn-success fw-bold px-4" 
              :disabled="!isStep1Valid"
              @click="nextStep(2)"
            >
              Continue to Species Selection <i class="bi bi-arrow-right ms-1"></i>
            </button>
          </div>
        </div>

        <!-- ============================================================= -->
        <!-- STEP 2: Species Selection, Quantity & Habitat Type -->
        <!-- ============================================================= -->
        <div v-if="currentStep === 2">
          <h5 class="fw-bold text-success mb-3">
            Step 2: Indigenous Species & Habitat Allocation
          </h5>

          <!-- Species Selection Dropdown -->
          <div class="mb-3">
            <label class="form-label small fw-bold">Select Indigenous Plant</label>
            <select 
              v-model="formData.plantId" 
              class="form-select" 
              :class="getFieldClass('plantId')"
              @change="validateField('plantId')"
            >
              <option 
                v-for="plant in plantStore.state.plants" 
                :key="plant.id" 
                :value="plant.id"
                :disabled="plant.stock <= 0"
              >
                {{ plant.name }} ({{ plant.category }})
              </option>
            </select>
            <div class="invalid-feedback">{{ errors.plantId }}</div>
          </div>

          <!-- Quantity Selection (Constrained 1 to 5) -->
          <div class="mb-3">
            <label class="form-label small fw-bold">Requested Tube-Stock Seedlings Quantity (1 - 5)</label>
            <input 
              v-model.number="formData.quantity" 
              type="number" 
              min="1" 
              max="5" 
              class="form-control" 
              :class="getFieldClass('quantity')"
              placeholder="1"
              @blur="touchField('quantity')"
              @input="validateField('quantity')"
            >
            <div class="invalid-feedback">{{ errors.quantity }}</div>
            <div class="form-text small">
              Maximum 5 free tube-stocks per Victorian household.
            </div>
          </div>

                    <!-- Target Planting Environment -->
          <div class="mb-4">
            <label class="form-label small fw-bold">Target Planting Environment</label>
            <select 
              v-model="formData.gardenType" 
              class="form-select"
              :class="getFieldClass('gardenType')"
              @change="validateField('gardenType')"
            >
              <option value="Suburban Backyard">Suburban Backyard</option>
              <option value="Balcony Garden">Balcony Garden</option>
              <option value="Front Yard">Front Yard</option>
              <option value="Community Verge">Community Verge</option>
            </select>
            <div class="invalid-feedback">{{ errors.gardenType }}</div>
          </div>

          <!-- Step 2 Actions -->
          <div class="d-flex justify-content-between pt-3">
            <button type="button" class="btn btn-sm" @click="currentStep = 1">
              <i class="bi bi-arrow-left me-1"></i> Back to Personal Details
            </button>
            <button 
              type="button" 
              class="btn btn-success fw-bold px-4" 
              :disabled="!isStep2Valid"
              @click="nextStep(3)"
            >
              Review Summary <i class="bi bi-arrow-right ms-1"></i>
            </button>
          </div>
        </div>

        <!-- ============================================================= -->
        <!-- STEP 3: Review Summary, Agreement & Submission -->
        <!-- ============================================================= -->
        <div v-if="currentStep === 3">
          <h5 class="fw-bold text-success mb-3">
            Step 3: Review Application & Ecological Commitment
          </h5>

          <!-- Application Summary Table -->
          <div class="table-responsive mb-3">
            <table class="table table-bordered align-middle small mb-0">
              <tbody>
                <tr>
                  <th class="table-light text-secondary" style="width: 35%;">Applicant Name</th>
                  <td>{{ formData.fullName }}</td>
                </tr>
                <tr>
                  <th class="table-light text-secondary">Contact Email</th>
                  <td>{{ formData.email }}</td>
                </tr>
                <tr>
                  <th class="table-light text-secondary">Delivery Destination</th>
                  <td>{{ formData.address }}, VIC {{ formData.postcode }}</td>
                </tr>
                <tr>
                  <th class="table-light text-secondary">Selected Indigenous Plant</th>
                  <td>{{ selectedPlantName }}</td>
                </tr>
                <tr>
                  <th class="table-light text-secondary">Requested Quantity</th>
                  <td>{{ formData.quantity }} tube-stock seedlings</td>
                </tr>
                <tr>
                  <th class="table-light text-secondary">Habitat Planting Zone</th>
                  <td>{{ formData.gardenType }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Ecological Care Agreement Checkbox -->
          <div class="mb-4 p-3 bg-light rounded-3">
            <div class="form-check">
              <input 
                v-model="formData.termsAccepted" 
                type="checkbox" 
                class="form-check-input" 
                id="termsCheck"
                :class="{ 'is-invalid': touched.termsAccepted && !formData.termsAccepted }"
                @change="touchField('termsAccepted')"
              >
              <label class="form-check-label small" for="termsCheck">
                I confirm that the delivery address is within Greater Melbourne, and I commit to planting and caring for these indigenous seedlings according to the Urban WildLink wildlife corridor guidelines.
              </label>
              <div class="invalid-feedback">You must accept the ecological stewardship agreement before submitting.</div>
            </div>
          </div>

          <!-- Step 3 Actions -->
          <div class="d-flex justify-content-between pt-3">
            <button type="button" class="btn btn-sm" @click="currentStep = 2">
              <i class="bi bi-arrow-left me-1"></i> Edit Plant Details
            </button>
            <button 
              type="button" 
              class="btn btn-success fw-bold px-4 shadow-sm" 
              :disabled="!formData.termsAccepted"
              @click="handleSubmit"
            >
              Submit Adoption Request
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================= -->
    <!-- Section 4: Success Receipt Screen (Post-Submission) -->
    <!-- ============================================================= -->
    <div v-if="isSubmitted" class="card border-0 bg-white text-center p-4">
      <div class="py-4">
        <i class="bi bi-check-circle-fill text-success display-3 mb-3 d-inline-block"></i>
        <h3 class="fw-bold text-success mb-2">Application Submitted Successfully!</h3>
        <p class="text-secondary small mb-4">
          Your native plant adoption request has been logged and queued for administrative review.
        </p>

        <!-- Digital Receipt Box -->
        <div class="p-3 bg-light rounded-3 d-inline-block text-start mb-4" style="max-width: 500px; width: 100%;">
          <div class="d-flex justify-content-between mb-2 small">
            <span class="text-dark">Application Receipt ID:</span>
            <span>{{ submittedReceipt.id }}</span>
          </div>
          <div class="d-flex justify-content-between mb-2 small">
            <span class="text-dark">Applicant:</span>
            <span>{{ submittedReceipt.applicantName }}</span>
          </div>
          <div class="d-flex justify-content-between mb-2 small">
            <span class="text-dark">Allocated Species:</span>
            <span>{{ submittedReceipt.plantName }} (x{{ submittedReceipt.quantity }})</span>
          </div>
          <div class="d-flex justify-content-between mb-2 small">
            <span class="text-dark">Review Status:</span>
            <span> Pending Review</span>
          </div>
          <div class="d-flex justify-content-between small">
            <span class="text-dark">Submission Time:</span>
            <span>{{ submittedReceipt.submittedAt }}</span>
          </div>
        </div>

        <div>
          <router-link to="/catalog" class="btn btn-sm me-2">
            More Plants
          </router-link>
          <router-link to="/" class="btn btn-success btn-sm fw-bold">
            Return Home
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { plantStore } from '../store/plantStore'

const route = useRoute()
const currentStep = ref(1)
const isSubmitted = ref(false)
const submittedReceipt = ref({})

// Reactive Form Data State Machine
const formData = ref({
  fullName: '',
  email: '',
  postcode: '',
  address: '',
  plantId: '',
  quantity: 1,
  gardenType: 'Suburban Backyard',
  termsAccepted: false
})

const touched = ref({
  fullName: false,
  email: false,
  postcode: false,
  address: false,
  plantId: false,
  quantity: false,
  termsAccepted: false
})

const errors = ref({
  fullName: '',
  email: '',
  postcode: '',
  address: '',
  plantId: '',
  quantity: ''
})

// Auto-select plant if navigated with query param from /catalog
onMounted(() => {
  if (route.query.selectedPlantId) {
    const matched = plantStore.state.plants.find(p => p.id === route.query.selectedPlantId)
    if (matched && matched.stock > 0) {
      formData.value.plantId = matched.id
      validateField('plantId')
    }
  }
})

const selectedPlantName = computed(() => {
  const p = plantStore.state.plants.find(item => item.id === formData.value.plantId)
  return p ? p.name : 'Not selected'
})

// Touch tracker
function touchField(field) {
  touched.value[field] = true
  validateField(field)
}

// Multi-type validation validator functions (BR B.1)
function validateField(field) {
  switch (field) {
    case 'fullName':
      if (!formData.value.fullName) {
        errors.value.fullName = 'Full legal name is required.'
      } else if (formData.value.fullName.length < 2) {
        errors.value.fullName = 'Full name must contain at least 2 characters.'
      } else if (!/^[a-zA-Z\s'-]+$/.test(formData.value.fullName)) {
        errors.value.fullName = 'Full name can only contain alphabetical letters and spaces.'
      } else {
        errors.value.fullName = ''
      }
      break

    case 'email':
      if (!formData.value.email) {
        errors.value.email = 'Contact email address is required.'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
        errors.value.email = 'Please enter a valid email address (e.g. name@domain.com).'
      } else {
        errors.value.email = ''
      }
      break

    case 'postcode':
      if (!formData.value.postcode) {
        errors.value.postcode = 'Postcode is required.'
      } else if (!/^3\d{3}$/.test(formData.value.postcode)) {
        errors.value.postcode = 'Must be a 4-digit Victorian postcode starting with 3 (e.g. 3000, 3168).'
      } else {
        errors.value.postcode = ''
      }
      break

    case 'address':
      if (!formData.value.address) {
        errors.value.address = 'Street delivery address is required.'
      } else if (formData.value.address.length < 5) {
        errors.value.address = 'Please provide a full street address (at least 5 characters).'
      } else {
        errors.value.address = ''
      }
      break

    case 'plantId':
      if (!formData.value.plantId) {
        errors.value.plantId = 'Please select a native plant species.'
      } else {
        errors.value.plantId = ''
      }
      break

    case 'quantity':
      if (!formData.value.quantity) {
        errors.value.quantity = 'Quantity is required.'
      } else if (formData.value.quantity < 1 || formData.value.quantity > 5) {
        errors.value.quantity = 'Quantity must be strictly between 1 and 5 seedlings.'
      } else {
        errors.value.quantity = ''
      }
      break

          case 'gardenType':
      if (!formData.value.gardenType) {
        errors.value.gardenType = 'Please select a planting environment.'
      } else {
        errors.value.gardenType = ''
      }
      break
  }
}

// Validation status class helper for Bootstrap 5 states
function getFieldClass(field) {
  if (!touched.value[field]) return ''
  return errors.value[field] ? 'is-invalid' : ''
}

// Step validity computed guards
const isStep1Valid = computed(() => {
  return (
    formData.value.fullName.length >= 2 &&
    /^[a-zA-Z\s'-]+$/.test(formData.value.fullName) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email) &&
    /^3\d{3}$/.test(formData.value.postcode) &&
    formData.value.address.length >= 5
  )
})

const isStep2Valid = computed(() => {
  return (
    formData.value.plantId !== '' &&
    formData.value.quantity >= 1 &&
    formData.value.quantity <= 5 &&
    formData.value.gardenType !== ''
  )
})

function nextStep(stepNumber) {
  if (stepNumber === 2) {
    ['fullName', 'email', 'postcode', 'address'].forEach(f => touchField(f))
    if (!isStep1Valid.value) return
  }
  if (stepNumber === 3) {
    ['plantId', 'quantity'].forEach(f => touchField(f))
    if (!isStep2Valid.value) return
  }
  currentStep.value = stepNumber
}

// Application Submission
function handleSubmit() {
  if (!formData.value.termsAccepted || !isStep1Valid.value || !isStep2Valid.value) return
  
  const createdApp = plantStore.submitApplication(formData.value)
  submittedReceipt.value = createdApp
  isSubmitted.value = true
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.transition-all {
  transition: width 0.3s ease-in-out;
}
</style>