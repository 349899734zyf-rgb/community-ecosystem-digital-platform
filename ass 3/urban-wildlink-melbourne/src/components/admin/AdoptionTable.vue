<!--
  AdoptionTable.vue
  BR (D.3): Interactive Table Component for Plant Adoption Requests
  Encapsulates individual column filtering, multi-column sorting, pagination (10 rows/page), and data exports.
-->

<template>
  <div class="card border mb-4 bg-white">
    <!-- Toolbar (Above Table Header) -->
    <div class="card-body p-3 border-bottom d-flex justify-content-end align-items-center flex-wrap gap-2">
      <div class="d-flex gap-2">
        <button 
          class="btn btn-outline-success btn-sm fw-bold py-1 px-3" 
          @click="handleExportCSV" 
          title="Export applications dataset to CSV file"
        >
          Export CSV
        </button>
        <button 
          class="btn btn-outline-success btn-sm fw-bold py-1 px-3" 
          @click="handleExportApplicationsPDF" 
          title="Export applications dataset to PDF file"
        >
          Export PDF
        </button>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table mb-0 align-middle small table-fixed admin-custom-table">
        <thead>
          <tr>
            <th style="width: 14%;">Applicant Name</th>
            <th style="width: 20%;">Delivery Address</th>
            <th style="width: 15%;">Requested Plant</th>
            <th style="width: 10%;">Quantity</th>
            <th style="width: 13%;">Garden Type</th>
            <!-- Status Sortable Header with Icon -->
            <th style="width: 10%;" class="cursor-pointer user-select-none" @click="toggleAppSort('status')" title="Sort by status">
              Status <i class="bi ms-1" :class="getSortIcon(appSortKey, 'status', appSortOrder)"></i>
            </th>
            <!-- Submitted Time Sortable Header with Icon -->
            <th style="width: 13%;" class="cursor-pointer user-select-none" @click="toggleAppSort('submittedAt')" title="Sort by time">
              Submitted Time <i class="bi ms-1" :class="getSortIcon(appSortKey, 'submittedAt', appSortOrder)"></i>
            </th>
            <th class="text-center" style="width: 150px;">Action</th>
          </tr>
          <!-- BR (D.3) Individual Column Search Row -->
          <tr class="table-filter-row bg-white">
            <th class="p-1">
              <input 
                v-model="appFilters.applicantName" 
                type="text" 
                class="form-control form-control-sm" 
                placeholder="Filter name..."
                aria-label="Filter by applicant name"
              >
            </th>
            <th class="p-1">
              <input 
                v-model="appFilters.address" 
                type="text" 
                class="form-control form-control-sm" 
                placeholder="Filter address..."
                aria-label="Filter by delivery address"
              >
            </th>
            <th class="p-1">
              <input 
                v-model="appFilters.plantName" 
                type="text" 
                class="form-control form-control-sm" 
                placeholder="Filter plant..."
                aria-label="Filter by plant name"
              >
            </th>
            <th class="p-1"></th>
            <th class="p-1">
              <input 
                v-model="appFilters.gardenType" 
                type="text" 
                class="form-control form-control-sm" 
                placeholder="Filter garden..."
                aria-label="Filter by garden type"
              >
            </th>
            <th class="p-1">
              <select 
                v-model="appFilters.status" 
                class="form-select form-select-sm"
                aria-label="Filter by status"
              >
                <option value="">All</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </th>
            <th class="p-1"></th>
            <th class="p-1 text-center">
              <button 
                class="btn text-secondary btn-sm py-0 px-2 fw-semibold" 
                @click="resetAppFilters"
                title="Clear all filters for this table"
              >
                Clear
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="app in paginatedApplications" :key="app.id">
            <td><span class="text-truncate d-block">{{ app.applicantName }}</span></td>
            <td><span class="text-truncate d-block">{{ app.address }}, VIC {{ app.postcode }}</span></td>
            <td><span class="text-truncate d-block">{{ app.plantName }}</span></td>
            <td>{{ app.quantity }} seedlings</td>
            <td>{{ app.gardenType }}</td>
            <td>
              <span :class="getStatusClass(app.status)">
                {{ app.status }}
              </span>
            </td>
            <td>{{ app.submittedAt }}</td>
            <td class="text-center">
              <!-- Only Administrator sees final Approve and Reject buttons -->
              <div v-if="currentUser && currentUser.role === 'Administrator' && app.status === 'Pending'" class="btn-group d-flex justify-content-center gap-2">
                <button class="btn text-success btn-sm" @click="handleApproveApp(app.id)"><strong>Approve</strong></button>
                <button class="btn text-danger btn-sm" @click="handleRejectApp(app.id)"><strong>Reject</strong></button>
              </div>
              <!-- Volunteers see read-only status indicator -->
              <span v-else-if="app.status === 'Pending'" class="text-muted small">Pending Admin Review</span>
              <!-- Approved applications: BR (D.2) Email with PDF attachment action -->
              <div v-else-if="app.status === 'Approved'" class="d-flex align-items-center justify-content-center">
                <button 
                  class="btn btn-outline-success btn-sm py-0 px-2 fw-semibold" 
                  @click="$emit('open-email', app)" 
                  title="Send confirmation email with PDF certificate attachment"
                >
                  Email
                </button>
              </div>
              <span v-else class="text-muted small"><strong>Completed</strong></span>
            </td>
          </tr>
          <tr v-if="paginatedApplications.length === 0">
            <td colspan="8" class="text-center text-muted py-4">No adoption requests found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Footer -->
    <div class="card-footer bg-white border-top d-flex justify-content-between align-items-center flex-wrap gap-2 py-2 small">
      <span class="text-muted fw-bold">Total: {{ filteredApplications.length }} records</span>
      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-success btn-sm fw-bold" :disabled="appPage <= 1" @click="appPage--">
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
        <button class="btn btn-success btn-sm fw-bold" :disabled="appPage >= totalAppPages" @click="appPage++">
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { plantStore } from '../../store/plantStore'
import { exportApplicationsToCSV, exportApplicationsToPDF } from '../../utils/exportService'

const emit = defineEmits(['open-email', 'toast'])

const pageSize = 10
const currentUser = computed(() => plantStore.state.currentUser)

// Column filters
const appFilters = ref({
  applicantName: '',
  address: '',
  plantName: '',
  gardenType: '',
  status: ''
})

// Sorting state
const appSortKey = ref('submittedAt')
const appSortOrder = ref('desc')
const statusWeight = { 'Pending': 1, 'Approved': 2, 'Rejected': 3 }

function getSortIcon(activeKey, targetKey, order) {
  if (activeKey !== targetKey) return 'bi-arrow-down-up opacity-50 small'
  return order === 'asc' ? 'bi-sort-up text-success fw-bold' : 'bi-sort-down text-success fw-bold'
}

function toggleAppSort(key) {
  if (appSortKey.value === key) {
    appSortOrder.value = appSortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    appSortKey.value = key
    appSortOrder.value = 'asc'
  }
}

function resetAppFilters() {
  appFilters.value = {
    applicantName: '',
    address: '',
    plantName: '',
    gardenType: '',
    status: ''
  }
  appPage.value = 1
}

function getStatusClass(status) {
  if (status === 'Approved') return 'text-success fw-bold'
  if (status === 'Pending') return 'text-warning fw-bold text-dark-emphasis'
  return 'text-danger fw-bold'
}

// Filtered applications
const filteredApplications = computed(() => {
  return plantStore.state.applications.filter(app => {
    const nameMatch = !appFilters.value.applicantName || 
      (app.applicantName || '').toLowerCase().includes(appFilters.value.applicantName.toLowerCase().trim())
    const addressMatch = !appFilters.value.address || 
      (app.address || '').toLowerCase().includes(appFilters.value.address.toLowerCase().trim())
    const plantMatch = !appFilters.value.plantName || 
      (app.plantName || '').toLowerCase().includes(appFilters.value.plantName.toLowerCase().trim())
    const gardenMatch = !appFilters.value.gardenType || 
      (app.gardenType || '').toLowerCase().includes(appFilters.value.gardenType.toLowerCase().trim())
    const statusMatch = !appFilters.value.status || app.status === appFilters.value.status
    return nameMatch && addressMatch && plantMatch && gardenMatch && statusMatch
  })
})

// Sorted applications
const sortedApplications = computed(() => {
  const list = [...filteredApplications.value]
  const key = appSortKey.value
  const order = appSortOrder.value === 'asc' ? 1 : -1

  return list.sort((a, b) => {
    if (key === 'status') {
      const wa = statusWeight[a.status] || 99
      const wb = statusWeight[b.status] || 99
      return (wa - wb) * order
    }
    if (key === 'submittedAt') {
      const da = new Date(a.submittedAt || 0).getTime()
      const db = new Date(b.submittedAt || 0).getTime()
      return (da - db) * order
    }
    const valA = String(a[key] || '').toLowerCase()
    const valB = String(b[key] || '').toLowerCase()
    return valA.localeCompare(valB) * order
  })
})

// Pagination state
const appPage = ref(1)
const appPageInput = ref(1)
const totalAppPages = computed(() => Math.max(1, Math.ceil(sortedApplications.value.length / pageSize)))

const paginatedApplications = computed(() => {
  const start = (appPage.value - 1) * pageSize
  return sortedApplications.value.slice(start, start + pageSize)
})

watch(appPage, (newVal) => {
  appPageInput.value = newVal
})

watch(filteredApplications, () => {
  appPage.value = 1
})

function jumpAppPage() {
  let val = parseInt(appPageInput.value, 10)
  if (isNaN(val) || val < 1) val = 1
  if (val > totalAppPages.value) val = totalAppPages.value
  appPage.value = val
  appPageInput.value = val
}

// Approval and rejection
function handleApproveApp(appId) {
  const res = plantStore.approveApplication(appId)
  emit('toast', res.message, res.success ? 'success' : 'danger')
}

function handleRejectApp(appId) {
  plantStore.rejectApplication(appId)
  emit('toast', 'Application rejected.', 'success')
}

// Data exports
function handleExportCSV() {
  exportApplicationsToCSV(sortedApplications.value)
}

function handleExportApplicationsPDF() {
  exportApplicationsToPDF(sortedApplications.value)
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.table-fixed {
  table-layout: fixed !important;
  width: 100% !important;
}
.admin-custom-table {
  border-collapse: collapse !important;
  width: 100% !important;
  background-color: #ffffff !important;
  border: 1px solid #dee2e6 !important;
  margin-bottom: 0 !important;
}
.admin-custom-table th,
.admin-custom-table td {
  background-color: #ffffff !important;
  border: 1px solid #dee2e6 !important;
  vertical-align: middle !important;
  height: 52px !important;
  padding: 0.4rem 0.6rem !important;
}
.admin-custom-table thead th {
  background-color: #ffffff !important;
  color: #212529 !important;
  font-weight: 600 !important;
  border: 1px solid #dee2e6 !important;
  border-bottom: 1px solid #dee2e6 !important;
}
.admin-custom-table tbody tr {
  height: 52px !important;
  background-color: #ffffff !important;
}
.admin-custom-table tbody tr:hover td {
  background-color: #fcfcfc !important;
}
.admin-custom-table td {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
.admin-custom-table thead tr.table-filter-row th {
  height: auto !important;
  padding: 0.35rem 0.4rem !important;
  background-color: #ffffff !important;
}
.admin-custom-table thead tr.table-filter-row input,
.admin-custom-table thead tr.table-filter-row select {
  font-size: 0.8rem !important;
  height: 30px !important;
  padding: 0.15rem 0.45rem !important;
  border: 1px solid #ced4da !important;
  background-color: #ffffff !important;
  border-radius: 4px !important;
}
.admin-custom-table thead tr.table-filter-row input:focus,
.admin-custom-table thead tr.table-filter-row select:focus {
  border-color: #dee2e6 !important;
  box-shadow: none !important;
  outline: none !important;
}
</style>
