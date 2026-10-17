<!--
  InventoryTable.vue
  BR (D.3): Interactive Table Component for Master Species Inventory Control
  Encapsulates individual column filtering, multi-column sorting, pagination (10 rows/page), restock controls, and data exports.
-->

<template>
  <div class="card border mb-4 bg-white">
    <!-- Toolbar (Above Table Header) -->
    <div class="card-body p-3 border-bottom d-flex justify-content-end align-items-center flex-wrap gap-2">
      <div class="d-flex gap-2">
        <button 
          class="btn btn-outline-success btn-sm fw-bold py-1 px-3" 
          @click="handleExportInventoryCSV" 
          title="Export flora inventory dataset to CSV file"
        >
          Export CSV
        </button>
        <button 
          class="btn btn-outline-success btn-sm fw-bold py-1 px-3" 
          @click="handleExportPDF" 
          title="Export flora inventory report to PDF file"
        >
          Export PDF
        </button>
        <button 
          v-if="currentUser && currentUser.role === 'Administrator'"
          class="btn btn-success btn-sm fw-bold" 
          @click="$emit('open-add')"
        >
          + Add New Species
        </button>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table mb-0 align-middle small table-fixed admin-custom-table">
        <thead>
          <tr>
            <!-- Alphabetical Species Name Header with Icon -->
            <th style="width: 17%;" class="cursor-pointer user-select-none" @click="toggleInvSort('name')" title="Sort alphabetically">
              Species Name <i class="bi ms-1" :class="getSortIcon(invSortKey, 'name', invSortOrder)"></i>
            </th>
            <th style="width: 11%;">Category</th>
            <!-- Stock Quantity Sortable Header with Icon -->
            <th style="width: 17%;" class="cursor-pointer user-select-none" @click="toggleInvSort('stock')" title="Sort by stock">
              Current Nursery Stock <i class="bi ms-1" :class="getSortIcon(invSortKey, 'stock', invSortOrder)"></i>
            </th>
            <!-- Approved Adoptions Sortable Header with Icon -->
            <th style="width: 14%;" class="cursor-pointer user-select-none" @click="toggleInvSort('adoptedCount')" title="Sort by adoptions">
              Approved Adoptions <i class="bi ms-1" :class="getSortIcon(invSortKey, 'adoptedCount', invSortOrder)"></i>
            </th>
            <th style="width: 18%;">Sun & Water Requirements</th>
            <th class="text-center" style="width: 150px;">Custom Restock</th>
            <th class="text-center" style="width: 75px;">Action</th>
          </tr>
          <!-- BR (D.3) Individual Column Search Row -->
          <tr class="table-filter-row bg-white">
            <th class="p-1">
              <input 
                v-model="invFilters.name" 
                type="text" 
                class="form-control form-control-sm" 
                placeholder="Filter species..."
                aria-label="Filter by species name"
              >
            </th>
            <th class="p-1">
              <select 
                v-model="invFilters.category" 
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
              <select 
                v-model="invFilters.stockStatus" 
                class="form-select form-select-sm"
                aria-label="Filter by stock status"
              >
                <option value="">All</option>
                <option value="in_stock">In Stock (&gt;0)</option>
                <option value="out_of_stock">Out of Stock (0)</option>
              </select>
            </th>
            <th class="p-1"></th>
            <th class="p-1">
              <input 
                v-model="invFilters.requirements" 
                type="text" 
                class="form-control form-control-sm" 
                placeholder="Filter req..."
                aria-label="Filter by sun/water requirements"
              >
            </th>
            <th class="p-1"></th>
            <th class="p-1 text-center">
              <button 
                class="btn text-secondary btn-sm py-0 px-2 fw-semibold" 
                @click="resetInvFilters"
                title="Clear all filters for this table"
              >
                Clear
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="plant in paginatedInventory" :key="plant.id">
            <td>
              {{ plant.name }}<br>
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
                  style="max-width: 55px;"
                  placeholder=""
                >
                <button 
                  class="btn text-success btn-sm fw-bold" 
                  type="button" 
                  @click="handleCustomRestock(plant.id)"
                >
                  Restock
                </button>
                <button 
                  class="btn text-danger btn-sm fw-bold ms-1" 
                  type="button" 
                  @click="handleCustomReduce(plant.id)"
                >
                  Reduce
                </button>
              </div>
            </td>

            <td class="text-center">
              <button 
                class="btn text-success btn-sm fw-bold" 
                type="button"
                @click="$emit('open-edit', plant)"
              >
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Footer -->
    <div class="card-footer bg-white border-top d-flex justify-content-between align-items-center flex-wrap gap-2 py-2 small">
      <span class="text-muted fw-bold">Total: {{ filteredInventory.length }} species</span>
      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-success btn-sm fw-bold" :disabled="invPage <= 1" @click="invPage--">
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
        <button class="btn btn-success btn-sm fw-bold" :disabled="invPage >= totalInvPages" @click="invPage++">
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { plantStore } from '../../store/plantStore'
import { exportInventoryToCSV, exportInventoryToPDF } from '../../utils/exportService'

const emit = defineEmits(['open-add', 'open-edit', 'toast'])

const pageSize = 10
const restockInputs = ref({})
const currentUser = computed(() => plantStore.state.currentUser)

// Column filters
const invFilters = ref({
  name: '',
  category: '',
  stockStatus: '',
  requirements: ''
})

// Sorting state
const invSortKey = ref('name')
const invSortOrder = ref('asc')

function getSortIcon(activeKey, targetKey, order) {
  if (activeKey !== targetKey) return 'bi-arrow-down-up opacity-50 small'
  return order === 'asc' ? 'bi-sort-up text-success fw-bold' : 'bi-sort-down text-success fw-bold'
}

function toggleInvSort(key) {
  if (invSortKey.value === key) {
    invSortOrder.value = invSortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    invSortKey.value = key
    invSortOrder.value = 'asc'
  }
}

function resetInvFilters() {
  invFilters.value = {
    name: '',
    category: '',
    stockStatus: '',
    requirements: ''
  }
  invPage.value = 1
}

// Filtered inventory
const filteredInventory = computed(() => {
  return plantStore.state.plants.filter(plant => {
    const nameMatch = !invFilters.value.name || 
      plant.name.toLowerCase().includes(invFilters.value.name.toLowerCase().trim())
    const catMatch = !invFilters.value.category || plant.category === invFilters.value.category
    let stockMatch = true
    if (invFilters.value.stockStatus === 'in_stock') {
      stockMatch = plant.stock > 0
    } else if (invFilters.value.stockStatus === 'out_of_stock') {
      stockMatch = plant.stock <= 0
    }
    const reqMatch = !invFilters.value.requirements ||
      (plant.sunExposure + ' ' + plant.waterNeeds).toLowerCase().includes(invFilters.value.requirements.toLowerCase().trim())
    return nameMatch && catMatch && stockMatch && reqMatch
  })
})

// Sorted inventory
const sortedInventory = computed(() => {
  const list = [...filteredInventory.value]
  const key = invSortKey.value
  const order = invSortOrder.value === 'asc' ? 1 : -1

  return list.sort((a, b) => {
    if (key === 'stock') {
      return (Number(a.stock || 0) - Number(b.stock || 0)) * order
    }
    if (key === 'adoptedCount') {
      return (Number(a.adoptedCount || 0) - Number(b.adoptedCount || 0)) * order
    }
    const valA = String(a[key] || '').toLowerCase()
    const valB = String(b[key] || '').toLowerCase()
    return valA.localeCompare(valB) * order
  })
})

// Pagination state
const invPage = ref(1)
const invPageInput = ref(1)
const totalInvPages = computed(() => Math.max(1, Math.ceil(sortedInventory.value.length / pageSize)))

const paginatedInventory = computed(() => {
  const start = (invPage.value - 1) * pageSize
  return sortedInventory.value.slice(start, start + pageSize)
})

watch(invPage, (newVal) => {
  invPageInput.value = newVal
})

watch(filteredInventory, () => {
  invPage.value = 1
})

function jumpInvPage() {
  let val = parseInt(invPageInput.value, 10)
  if (isNaN(val) || val < 1) val = 1
  if (val > totalInvPages.value) val = totalInvPages.value
  invPage.value = val
  invPageInput.value = val
}

// Custom restock and reduce
function handleCustomRestock(plantId) {
  const qty = parseInt(restockInputs.value[plantId])
  if (!qty || qty <= 0) {
    emit('toast', 'Please enter a valid restock quantity.', 'danger')
    return
  }
  const newStock = plantStore.restockPlant(plantId, qty)
  restockInputs.value[plantId] = null
  emit('toast', `Restocked ${qty} seedlings! Current inventory ${newStock}`, 'success')
}

function handleCustomReduce(plantId) {
  const qty = parseInt(restockInputs.value[plantId])
  if (!qty || qty <= 0) {
    emit('toast', 'Please enter a valid quantity to reduce.', 'danger')
    return
  }
  const newStock = plantStore.reducePlantStock(plantId, qty)
  restockInputs.value[plantId] = null
  emit('toast', `Reduced ${qty} seedlings! Current inventory ${newStock}`, 'success')
}

// Data exports
function handleExportInventoryCSV() {
  exportInventoryToCSV(sortedInventory.value)
}

function handleExportPDF() {
  exportInventoryToPDF(sortedInventory.value)
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
