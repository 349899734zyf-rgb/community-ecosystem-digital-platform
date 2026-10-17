<!--
  ProposalTable.vue
  BR (D.3): Interactive Table Component for Community Species Proposals
  Encapsulates individual column filtering, multi-column sorting, pagination (10 rows/page), and data exports.
-->

<template>
  <div class="card border mb-4 bg-white">
    <!-- Toolbar (Above Table Header) -->
    <div class="card-body p-3 border-bottom d-flex justify-content-end align-items-center flex-wrap gap-2">
      <div class="d-flex gap-2">
        <button 
          class="btn btn-outline-success btn-sm fw-bold py-1 px-3" 
          @click="handleExportProposalsCSV" 
          title="Export community proposals dataset to CSV file"
        >
          Export CSV
        </button>
        <button 
          class="btn btn-outline-success btn-sm fw-bold py-1 px-3" 
          @click="handleExportProposalsPDF" 
          title="Export community proposals dataset to PDF file"
        >
          Export PDF
        </button>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table mb-0 align-middle small table-fixed admin-custom-table">
        <thead>
          <tr>
            <th style="width: 17%;">Proposed Plant Name</th>
            <th style="width: 11%;">Category</th>
            <th style="width: 14%;">Proposer</th>
            <th style="width: 25%;">Ecological Benefit & Reason</th>
            <!-- Status Sortable Header with Icon -->
            <th style="width: 10%;" class="cursor-pointer user-select-none" @click="togglePropSort('status')" title="Sort by status">
              Status <i class="bi ms-1" :class="getSortIcon(propSortKey, 'status', propSortOrder)"></i>
            </th>
            <!-- Submitted Time Sortable Header with Icon -->
            <th style="width: 13%;" class="cursor-pointer user-select-none" @click="togglePropSort('submittedAt')" title="Sort by time">
              Submitted Time <i class="bi ms-1" :class="getSortIcon(propSortKey, 'submittedAt', propSortOrder)"></i>
            </th>
            <th class="text-center" style="width: 150px;">Action</th>
          </tr>
          <!-- BR (D.3) Individual Column Search Row -->
          <tr class="table-filter-row bg-white">
            <th class="p-1">
              <input 
                v-model="propFilters.plantName" 
                type="text" 
                class="form-control form-control-sm" 
                placeholder="Filter plant..."
                aria-label="Filter by proposed plant name"
              >
            </th>
            <th class="p-1">
              <select 
                v-model="propFilters.category" 
                class="form-select form-select-sm"
                aria-label="Filter by category"
              >
                <option value="">All</option>
                <option value="Tree">Tree</option>
                <option value="Shrub">Shrub</option>
                <option value="Grass">Grass</option>
                <option value="Wildflower">Wildflower</option>
              </select>
            </th>
            <th class="p-1">
              <input 
                v-model="propFilters.proposerName" 
                type="text" 
                class="form-control form-control-sm" 
                placeholder="Filter proposer..."
                aria-label="Filter by proposer name"
              >
            </th>
            <th class="p-1">
              <input 
                v-model="propFilters.benefit" 
                type="text" 
                class="form-control form-control-sm" 
                placeholder="Filter reason..."
                aria-label="Filter by benefit or reason"
              >
            </th>
            <th class="p-1">
              <select 
                v-model="propFilters.status" 
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
                @click="resetPropFilters"
                title="Clear all filters for this table"
              >
                Clear
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="prop in paginatedProposals" :key="prop.id">
            <td>{{ prop.plantName }}</td>
            <td>{{ prop.category }}</td>
            <td>{{ prop.proposerName }}</td>
            <td>{{ prop.wildlifeBenefit }}<br><span class="text-dark">{{ prop.reason }}</span></td>
            <td>
              <span :class="getStatusClass(prop.status)">
                {{ prop.status }}
              </span>
            </td>
            <td>{{ prop.submittedAt }}</td>
            <td class="text-center">
              <!-- Only Administrator sees final Approve and Reject buttons for species proposals -->
              <div v-if="currentUser && currentUser.role === 'Administrator' && prop.status === 'Pending'" class="btn-group d-flex justify-content-center gap-2">
                <button class="btn text-success btn-sm" @click="handleApproveProposal(prop.id)">
                  <strong>Approve</strong>
                </button>
                <button class="btn text-danger btn-sm" @click="handleRejectProposal(prop.id)">
                  <strong>Reject</strong>
                </button>
              </div>
              <!-- Volunteers see read-only status indicator awaiting administrator review -->
              <span v-else-if="prop.status === 'Pending'" class="text-muted small">Pending Admin Review</span>
              <!-- Approved proposals: BR (D.2) Email approval notice with PDF attachment -->
              <div v-else-if="prop.status === 'Approved'" class="d-flex align-items-center justify-content-center">
                <button 
                  class="btn btn-outline-success btn-sm py-0 px-2 fw-semibold" 
                  @click="$emit('open-email', prop)" 
                  title="Send confirmation email with PDF certificate attachment"
                >
                  Email
                </button>
              </div>
              <span v-else class="text-muted small"><strong>Completed</strong></span>
            </td>
          </tr>
          <tr v-if="paginatedProposals.length === 0">
            <td colspan="7" class="text-center text-muted py-4">No species proposals found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Footer -->
    <div class="card-footer bg-white border-top d-flex justify-content-between align-items-center flex-wrap gap-2 py-2 small">
      <span class="text-muted fw-bold">Total: {{ filteredProposals.length }} records</span>
      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-success btn-sm fw-bold" :disabled="propPage <= 1" @click="propPage--">
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
        <button class="btn btn-success btn-sm fw-bold" :disabled="propPage >= totalPropPages" @click="propPage++">
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { plantStore } from '../../store/plantStore'
import { exportProposalsToCSV, exportProposalsToPDF } from '../../utils/exportService'

const emit = defineEmits(['open-email', 'toast'])

const pageSize = 10
const currentUser = computed(() => plantStore.state.currentUser)

// Column filters
const propFilters = ref({
  plantName: '',
  category: '',
  proposerName: '',
  benefit: '',
  status: ''
})

// Sorting state
const propSortKey = ref('submittedAt')
const propSortOrder = ref('desc')
const statusWeight = { 'Pending': 1, 'Approved': 2, 'Rejected': 3 }

function getSortIcon(activeKey, targetKey, order) {
  if (activeKey !== targetKey) return 'bi-arrow-down-up opacity-50 small'
  return order === 'asc' ? 'bi-sort-up text-success fw-bold' : 'bi-sort-down text-success fw-bold'
}

function togglePropSort(key) {
  if (propSortKey.value === key) {
    propSortOrder.value = propSortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    propSortKey.value = key
    propSortOrder.value = 'asc'
  }
}

function resetPropFilters() {
  propFilters.value = {
    plantName: '',
    category: '',
    proposerName: '',
    benefit: '',
    status: ''
  }
  propPage.value = 1
}

function getStatusClass(status) {
  if (status === 'Approved') return 'text-success fw-bold'
  if (status === 'Pending') return 'text-warning fw-bold text-dark-emphasis'
  return 'text-danger fw-bold'
}

// Filtered proposals
const filteredProposals = computed(() => {
  return plantStore.state.speciesProposals.filter(prop => {
    const plantMatch = !propFilters.value.plantName || 
      (prop.plantName || '').toLowerCase().includes(propFilters.value.plantName.toLowerCase().trim())
    const catMatch = !propFilters.value.category || prop.category === propFilters.value.category
    const proposerMatch = !propFilters.value.proposerName || 
      (prop.proposerName || '').toLowerCase().includes(propFilters.value.proposerName.toLowerCase().trim())
    const benefitMatch = !propFilters.value.benefit || 
      (prop.wildlifeBenefit || '').toLowerCase().includes(propFilters.value.benefit.toLowerCase().trim()) ||
      (prop.reason || '').toLowerCase().includes(propFilters.value.benefit.toLowerCase().trim())
    const statusMatch = !propFilters.value.status || prop.status === propFilters.value.status
    return plantMatch && catMatch && proposerMatch && benefitMatch && statusMatch
  })
})

// Sorted proposals
const sortedProposals = computed(() => {
  const list = [...filteredProposals.value]
  const key = propSortKey.value
  const order = propSortOrder.value === 'asc' ? 1 : -1

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
const propPage = ref(1)
const propPageInput = ref(1)
const totalPropPages = computed(() => Math.max(1, Math.ceil(sortedProposals.value.length / pageSize)))

const paginatedProposals = computed(() => {
  const start = (propPage.value - 1) * pageSize
  return sortedProposals.value.slice(start, start + pageSize)
})

watch(propPage, (newVal) => {
  propPageInput.value = newVal
})

watch(filteredProposals, () => {
  propPage.value = 1
})

function jumpPropPage() {
  let val = parseInt(propPageInput.value, 10)
  if (isNaN(val) || val < 1) val = 1
  if (val > totalPropPages.value) val = totalPropPages.value
  propPage.value = val
  propPageInput.value = val
}

// Approval and rejection
function handleApproveProposal(proposalId) {
  plantStore.approveSpeciesProposal(proposalId)
  emit('toast', 'Proposal Approved! New species is now live in the resident catalog.', 'success')
}

function handleRejectProposal(proposalId) {
  plantStore.rejectSpeciesProposal(proposalId)
  emit('toast', 'Proposal Rejected.', 'success')
}

// Data exports
function handleExportProposalsCSV() {
  exportProposalsToCSV(sortedProposals.value)
}

function handleExportProposalsPDF() {
  exportProposalsToPDF(sortedProposals.value)
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
