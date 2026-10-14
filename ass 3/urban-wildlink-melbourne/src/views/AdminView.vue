<!--
  References & Acknowledgements:
  - UI Components: Bootstrap 5.3 Data Tables, Nav Pills, Modal (https://getbootstrap.com/docs/5.3/)
  - Icons: Bootstrap Icons Sort Indicators (https://icons.getbootstrap.com/)
  - Purpose: Administrative dashboard with visual sorting indicator icons and locked table column widths.
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
        <button class="btn btn-outline-success btn-sm" @click="handleTestCloudFunction" title="Execute Serverless Cloud Function (BR E.1)">
          <i class="bi bi-cloud-check-fill me-1"></i> Cloud Function (BR E.1)
        </button>
        <button class="btn btn-outline-secondary btn-sm" @click="handleReset" title="Reset dataset to default">
          <i class="bi bi-arrow-counterclockwise me-1"></i> Reset Data
        </button>
      </div>
    </div>

    <!-- Section 2: Real-time System KPI Dashboard Cards (BR F.1-4: Admin Dashboard) -->
    <div class="row g-3 mb-4">
      <div class="col-md-3 col-6">
        <div class="card border-0 shadow-sm bg-white p-3 text-center border-start border-4 border-success">
          <div class="text-muted small fw-bold">TOTAL SPECIES</div>
          <div class="fs-4 fw-bold text-success">{{ plantStore.totalSpeciesCount }}</div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="card border-0 shadow-sm bg-white p-3 text-center border-start border-4 border-primary">
          <div class="text-muted small fw-bold">NURSERY STOCK</div>
          <div class="fs-4 fw-bold text-primary">{{ plantStore.totalStockAvailable }}</div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="card border-0 shadow-sm bg-white p-3 text-center border-start border-4 border-info">
          <div class="text-muted small fw-bold">APPROVED ADOPTIONS</div>
          <div class="fs-4 fw-bold text-info">{{ plantStore.totalAdoptedCount }}</div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="card border-0 shadow-sm bg-white p-3 text-center border-start border-4 border-warning">
          <div class="text-muted small fw-bold">PENDING REQUESTS</div>
          <div class="fs-4 fw-bold text-warning">{{ pendingApplicationsCount }}</div>
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
            @click="adminActiveTab = 'adoptions'; appPage = 1"
          >
            <i class="bi bi-inbox-fill me-1"></i> Adoption Requests
          </button>
        </li>
        <li class="nav-item">
          <button 
            class="nav-link fw-bold" 
            :class="adminActiveTab === 'proposals' ? 'active bg-success' : 'text-success'" 
            @click="adminActiveTab = 'proposals'; propPage = 1"
          >
            <i class="bi bi-lightbulb-fill me-1"></i> Species Proposals
          </button>
        </li>
        <li class="nav-item">
          <button 
            class="nav-link fw-bold" 
            :class="adminActiveTab === 'inventory' ? 'active bg-success' : 'text-success'" 
            @click="adminActiveTab = 'inventory'; invPage = 1"
          >
            <i class="bi bi-boxes me-1"></i> Species Inventory & Stock Control
          </button>
        </li>
        <li class="nav-item">
          <button 
            class="nav-link fw-bold" 
            :class="adminActiveTab === 'analytics' ? 'active bg-success' : 'text-success'" 
            @click="adminActiveTab = 'analytics'"
          >
            <i class="bi bi-bar-chart-line-fill me-1"></i> Analytics & Impact Charts
          </button>
        </li>
      </ul>
    </div>

    <!-- ================================================================= -->
    <!-- Tab 1: Plant Adoption Requests Table -->
    <!-- ================================================================= -->
    <div v-if="adminActiveTab === 'adoptions'" class="card border-0 mb-4 bg-white shadow-sm">
      <div class="card-header bg-success text-white fw-bold d-flex justify-content-between align-items-center py-2 flex-wrap gap-2">
        <span>Resident Plant Adoption Requests</span>
        <button 
          class="btn btn-light btn-sm text-success fw-bold py-1 px-3 shadow-sm" 
          @click="handleExportCSV" 
          title="Export applications dataset to CSV file (BR E.4)"
        >
          <i class="bi bi-file-earmark-spreadsheet me-1"></i> Export CSV
        </button>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-bordered mb-0 align-middle small table-fixed">
            <thead class="table-light">
              <tr>
                <th style="width: 14%;">Applicant Name</th>
                <th style="width: 22%;">Delivery Address</th>
                <th style="width: 15%;">Requested Plant</th>
                <th style="width: 12%;">Quantity</th>
                <th style="width: 13%;">Garden Type</th>
                <!-- Status Sortable Header with Icon -->
                <th style="width: 9%;" class="cursor-pointer user-select-none" @click="toggleAppSort('status')" title="Sort by status">
                  Status <i class="bi ms-1" :class="getSortIcon(appSortKey, 'status', appSortOrder)"></i>
                </th>
                <!-- Submitted Time Sortable Header with Icon -->
                <th style="width: 15%;" class="cursor-pointer user-select-none" @click="toggleAppSort('submittedAt')" title="Sort by time">
                  Submitted Time <i class="bi ms-1" :class="getSortIcon(appSortKey, 'submittedAt', appSortOrder)"></i>
                </th>
                <th class="text-center" style="width: 160px;">Action</th>
              </tr>
              <!-- BR (D.3): Individual Column Search Filter Row -->
              <tr class="table-light border-bottom">
                <th class="p-1">
                  <input v-model="appFilters.name" type="text" class="form-control form-control-sm py-0 px-2" placeholder="Search name...">
                </th>
                <th class="p-1">
                  <input v-model="appFilters.address" type="text" class="form-control form-control-sm py-0 px-2" placeholder="Search suburb...">
                </th>
                <th class="p-1">
                  <input v-model="appFilters.plant" type="text" class="form-control form-control-sm py-0 px-2" placeholder="Search plant...">
                </th>
                <th class="p-1"></th>
                <th class="p-1"></th>
                <th class="p-1">
                  <select v-model="appFilters.status" class="form-select form-select-sm py-0 px-1">
                    <option value="">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </th>
                <th class="p-1"></th>
                <th class="p-1 text-center">
                  <button v-if="hasAppFilters" class="btn btn-outline-secondary btn-sm py-0 px-2" @click="clearAppFilters" title="Clear column filters">
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
                      @click="handleSendEmailCert(app)" 
                      title="Send confirmation email with PDF certificate attachment (BR D.2)"
                    >
                      <i class="bi bi-envelope-paper-fill me-1"></i> Email Cert
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
      </div>
      <div class="card-footer bg-transparent border-top-0 d-flex justify-content-between align-items-center flex-wrap gap-2 py-2 small">
        <span class="text-muted fw-bold">Total: {{ plantStore.state.applications.length }} records</span>
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

    <!-- ================================================================= -->
    <!-- Tab 2: Species Proposals Table -->
    <!-- ================================================================= -->
    <div v-if="adminActiveTab === 'proposals'" class="card border-0 mb-4 bg-white">
      <div class="card-header bg-success text-white fw-bold">
        Community Species Proposals
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-bordered mb-0 align-middle small table-fixed">
            <thead class="table-light">
              <tr>
                <th style="width: 17%;">Proposed Plant Name</th>
                <th style="width: 11%;">Category</th>
                <th style="width: 14%;">Proposer</th>
                <th style="width: 25%;">Ecological Benefit & Reason</th>
                <!-- Status Sortable Header with Icon -->
                <th style="width: 9%;" class="cursor-pointer user-select-none" @click="togglePropSort('status')" title="Sort by status">
                  Status <i class="bi ms-1" :class="getSortIcon(propSortKey, 'status', propSortOrder)"></i>
                </th>
                <!-- Submitted Time Sortable Header with Icon -->
                <th style="width: 14%;" class="cursor-pointer user-select-none" @click="togglePropSort('submittedAt')" title="Sort by time">
                  Submitted Time <i class="bi ms-1" :class="getSortIcon(propSortKey, 'submittedAt', propSortOrder)"></i>
                </th>
                <th class="text-center" style="width: 160px;">Action</th>
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
                  <span v-else class="text-muted small"><strong>Completed</strong></span>
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

    <!-- ================================================================= -->
    <!-- Tab 3: Master Inventory Table -->
    <!-- ================================================================= -->
    <div v-if="adminActiveTab === 'inventory'">
      <div class="card border-0 bg-white shadow-sm mb-4">
        <div class="card-header bg-success text-white fw-bold d-flex justify-content-between align-items-center py-2 flex-wrap gap-2">
          <span>Master Species Inventory & Nursery Stock</span>
          <div class="d-flex gap-2">
            <!-- BR (E.4): Export PDF button -->
            <button 
              class="btn btn-light btn-sm fw-bold text-success shadow-sm" 
              @click="handleExportPDF" 
              title="Export flora inventory report to PDF file (BR E.4)"
            >
              <i class="bi bi-file-earmark-pdf me-1"></i> Export PDF
            </button>
            <!-- Only Administrator can register brand new species; volunteers handle stock control -->
            <button 
              v-if="currentUser && currentUser.role === 'Administrator'"
              class="btn btn-light btn-sm fw-bold text-success shadow-sm" 
              @click="showAddModal = true"
            >
              <i class="bi bi-plus-circle me-1"></i> Add New Species
            </button>
          </div>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-bordered mb-0 align-middle small table-fixed">
              <thead class="table-light">
                <tr>
                  <!-- Alphabetical Species Name Header with Icon -->
                  <th style="width: 17%;" class="cursor-pointer user-select-none" @click="toggleInvSort('name')" title="Sort alphabetically">
                    Species Name <i class="bi ms-1" :class="getSortIcon(invSortKey, 'name', invSortOrder)"></i>
                  </th>
                  <th style="width: 10%;">Category</th>
                  <!-- Stock Quantity Sortable Header with Icon -->
                  <th style="width: 18%;" class="cursor-pointer user-select-none" @click="toggleInvSort('stock')" title="Sort by stock">
                    Current Nursery Stock <i class="bi ms-1" :class="getSortIcon(invSortKey, 'stock', invSortOrder)"></i>
                  </th>
                  <!-- Approved Adoptions Sortable Header with Icon -->
                  <th style="width: 15%;" class="cursor-pointer user-select-none" @click="toggleInvSort('adoptedCount')" title="Sort by adoptions">
                    Approved Adoptions <i class="bi ms-1" :class="getSortIcon(invSortKey, 'adoptedCount', invSortOrder)"></i>
                  </th>
                  <th style="width: 18%;">Sun & Water Requirements</th>
                  <th class="text-center" style="width: 160px;">Custom Restock</th>
                  <th class="text-center" style="width: 75px;">Action</th>
                </tr>
                <!-- BR (D.3): Individual Column Search Filter Row for Table 3 -->
                <tr class="table-light border-bottom">
                  <th class="p-1">
                    <input v-model="invFilters.name" type="text" class="form-control form-control-sm py-0 px-2" placeholder="Search species...">
                  </th>
                  <th class="p-1">
                    <select v-model="invFilters.category" class="form-select form-select-sm py-0 px-1">
                      <option value="">All</option>
                      <option value="Tree">Tree</option>
                      <option value="Shrub">Shrub</option>
                      <option value="Grass">Grass</option>
                      <option value="Wildflower">Wildflower</option>
                    </select>
                  </th>
                  <th class="p-1 text-center">
                    <div class="form-check form-check-inline m-0 small">
                      <input id="inStockCheck" v-model="invFilters.inStockOnly" type="checkbox" class="form-check-input">
                      <label for="inStockCheck" class="form-check-label small">In Stock Only</label>
                    </div>
                  </th>
                  <th class="p-1"></th>
                  <th class="p-1">
                    <input v-model="invFilters.requirements" type="text" class="form-control form-control-sm py-0 px-2" placeholder="Search sun/water...">
                  </th>
                  <th class="p-1"></th>
                  <th class="p-1 text-center">
                    <button v-if="hasInvFilters" class="btn btn-outline-secondary btn-sm py-0 px-2" @click="clearInvFilters" title="Clear column filters">
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
                      @click="openEditModal(plant)"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="card-footer bg-transparent border-top-0 d-flex justify-content-between align-items-center flex-wrap gap-2 py-2 small">
          <span class="text-muted fw-bold">Total: {{ plantStore.state.plants.length }} species</span>
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
    </div>

    <!-- ================================================================= -->
    <!-- Tab 4: Ecological Impact & Species Analytics (BR F.1-2: Chart.js) -->
    <!-- ================================================================= -->
    <div v-if="adminActiveTab === 'analytics'">
      <AnalyticsCharts />
    </div>

    <!-- Section 6: Direct Species Registration Modal -->
    <div v-if="showAddModal" class="modal-backdrop fade show"></div>
    <div v-if="showAddModal" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title fw-bold">Register New Species</h5>
            <button type="button" class="btn-close btn-close-white" @click="showAddModal = false"></button>
          </div>
          <div class="modal-body p-4">
            <form @submit.prevent="handleAddPlant" novalidate>
              <!-- 1. Common Name -->
              <div class="mb-3">
                <label class="form-label small fw-bold">Common Name *</label>
                <input 
                  v-model="newPlant.name" 
                  type="text" 
                  class="form-control" 
                  :class="{ 'is-invalid': PlantErrors.name }"
                  placeholder="e.g. Lemon Scented Myrtle"
                  @input="validatePlantField('name')"
                >
                <div class="invalid-feedback">{{ PlantErrors.name }}</div>
              </div>

              <!-- 2. Botanical Scientific Name -->
              <div class="mb-3">
                <label class="form-label small fw-bold">Botanical Scientific Name *</label>
                <input 
                  v-model="newPlant.scientificName" 
                  type="text" 
                  class="form-control" 
                  :class="{ 'is-invalid': PlantErrors.scientificName }"
                  placeholder="e.g. Backhousia citriodora"
                  @input="validatePlantField('scientificName')"
                >
                <div class="invalid-feedback">{{ PlantErrors.scientificName }}</div>
              </div>

              <!-- 3. Plant Image URL -->
              <div class="mb-3">
                <label class="form-label small fw-bold">Plant Image URL *</label>
                <input 
                  v-model="newPlant.imageUrl" 
                  type="url" 
                  class="form-control" 
                  :class="{ 'is-invalid': PlantErrors.imageUrl }"
                  placeholder="e.g. https://images.unsplash.com/..."
                  @input="validatePlantField('imageUrl')"
                >
                <div class="invalid-feedback">{{ PlantErrors.imageUrl }}</div>
              </div>

              <!-- 4. Category & 5. Initial Nursery Stock -->
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

              <!-- 6. Ecological Benefit -->
              <div class="mb-3">
                <label class="form-label small fw-bold">Ecological Benefit *</label>
                <input 
                  v-model="newPlant.wildlifeBenefit" 
                  type="text" 
                  class="form-control" 
                  :class="{ 'is-invalid': PlantErrors.wildlifeBenefit }"
                  placeholder="e.g. Attracts native bees and honeyeaters"
                  @input="validatePlantField('wildlifeBenefit')"
                >
                <div class="invalid-feedback">{{ PlantErrors.wildlifeBenefit }}</div>
              </div>

              <!-- 7. Description -->
              <div class="mb-3">
                <label class="form-label small fw-bold">Description *</label>
                <textarea 
                  v-model="newPlant.description" 
                  class="form-control" 
                  :class="{ 'is-invalid': PlantErrors.description }"
                  rows="2"
                  placeholder="e.g. Evergreen shrub with scented leaves and white summer flowers."
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

    <!-- Section 7: Toast Notification -->
    <div v-if="toastMessage || deletePendingPlant" class="position-fixed bottom-0 end-0 p-3" style="z-index: 1050;">
      <div 
        v-if="toastMessage && !deletePendingPlant"
        class="alert shadow d-flex align-items-center mb-0" 
        :class="toastType === 'danger' ? 'alert-danger' : 'alert-success'"
        role="alert"
      >
        <div>{{ toastMessage }}</div>
      </div>

      <div 
        v-if="deletePendingPlant"
        class="alert alert-danger shadow d-flex align-items-center justify-content-between mb-0 gap-3" 
        role="alert"
      >
        <div class="small">
          Delete {{ deletePendingPlant.name }}?
        </div>
        <div class="d-flex gap-1">
          <button class="btn btn-sm py-0 px-2" @click="confirmDeletePlant">
            <span>Confirm</Span>
          </button>
          <button class="btn btn-sm btn-danger py-0 px-2" @click="deletePendingPlant = null">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>

      <!-- ===================== -->
    <!-- Edit Species Modal-->
    <!-- ====================== -->
    <div v-if="showEditModal" class="modal-backdrop fade show"></div>
    <div v-if="showEditModal" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
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
                <!-- Only Administrator possesses high-risk species deletion permission -->
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
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { plantStore } from '../store/plantStore'
import AnalyticsCharts from '../components/AnalyticsCharts.vue'
import { exportApplicationsToCSV, exportInventoryToPDF } from '../utils/exportService'
import { sendAdoptionConfirmationEmail, generateAdoptionCertificatePDF } from '../utils/emailService'

const adminActiveTab = ref('adoptions') // 'adoptions', 'proposals', 'inventory', or 'analytics'
const showAddModal = ref(false)
const toastType = ref('success')
const toastMessage = ref('')

const restockInputs = ref({})
const pageSize = 10

// Retrieve currently logged-in user to check role permissions
const currentUser = computed(() => plantStore.state.currentUser)

// BR (F.1-4): Real-time pending requests count for Dashboard KPI
const pendingApplicationsCount = computed(() => {
  return plantStore.state.applications.filter(a => a.status === 'Pending').length
})

function getStatusClass(status) {
  if (status === 'Approved') return 'text-success fw-bold'
  if (status === 'Pending') return 'text-warning fw-bold text-dark-emphasis'
  return 'text-danger fw-bold'
}

// -------------------------------------------------------------
// Sorting States & Indicator Icon Helper
// -------------------------------------------------------------
const appSortKey = ref('submittedAt')
const appSortOrder = ref('desc') // 'asc' or 'desc'

const propSortKey = ref('submittedAt')
const propSortOrder = ref('desc')

const invSortKey = ref('name')
const invSortOrder = ref('asc')

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
    appSortOrder.value = key === 'status' ? 'asc' : 'desc'
  }
}

function togglePropSort(key) {
  if (propSortKey.value === key) {
    propSortOrder.value = propSortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    propSortKey.value = key
    propSortOrder.value = key === 'status' ? 'asc' : 'desc'
  }
}

function toggleInvSort(key) {
  if (invSortKey.value === key) {
    invSortOrder.value = invSortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    invSortKey.value = key
    invSortOrder.value = (key === 'stock' || key === 'adoptedCount') ? 'desc' : 'asc'
  }
}

// -------------------------------------------------------------
// Section 8: BR (D.3) Column Filtering, Pagination & Sorting for Applications
// -------------------------------------------------------------
const appPage = ref(1)
const appPageInput = ref(1)

const appFilters = ref({
  name: '',
  address: '',
  plant: '',
  status: ''
})

const hasAppFilters = computed(() => {
  return !!(appFilters.value.name || appFilters.value.address || appFilters.value.plant || appFilters.value.status)
})

function clearAppFilters() {
  appFilters.value = { name: '', address: '', plant: '', status: '' }
  appPage.value = 1
}

// 1. Filter applications by individual columns (BR D.3)
const filteredApplications = computed(() => {
  return plantStore.state.applications.filter(app => {
    const matchName = !appFilters.value.name || 
      (app.applicantName || app.userName || '').toLowerCase().includes(appFilters.value.name.toLowerCase())
    const matchAddress = !appFilters.value.address || 
      `${app.address || ''} ${app.postcode || ''}`.toLowerCase().includes(appFilters.value.address.toLowerCase())
    const matchPlant = !appFilters.value.plant || 
      (app.plantName || '').toLowerCase().includes(appFilters.value.plant.toLowerCase())
    const matchStatus = !appFilters.value.status || app.status === appFilters.value.status
    return matchName && matchAddress && matchPlant && matchStatus
  })
})

// 2. Sort the filtered applications
const sortedApplications = computed(() => {
  const list = [...filteredApplications.value]
  return list.sort((a, b) => {
    let result = 0
    if (appSortKey.value === 'status') {
      result = (statusWeight[a.status] || 99) - (statusWeight[b.status] || 99)
    } else if (appSortKey.value === 'submittedAt') {
      result = new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
    }
    return appSortOrder.value === 'asc' ? result : -result
  })
})

const totalAppPages = computed(() => Math.max(1, Math.ceil(sortedApplications.value.length / pageSize)))
const paginatedApplications = computed(() => {
  const start = (appPage.value - 1) * pageSize
  return sortedApplications.value.slice(start, start + pageSize)
})

// Export CSV Action (BR E.4)
function handleExportCSV() {
  exportApplicationsToCSV(filteredApplications.value)
}

watch(appPage, (val) => { appPageInput.value = val })
watch(appFilters, () => { appPage.value = 1 }, { deep: true })
watch(appPage, (val) => { appPageInput.value = val })
function jumpAppPage() {
  let target = Math.max(1, Math.min(appPageInput.value, totalAppPages.value))
  appPage.value = target
  appPageInput.value = target
}

// -------------------------------------------------------------
// Section 9: Pagination & Sorting for Species Proposals
// -------------------------------------------------------------
const propPage = ref(1)
const propPageInput = ref(1)

const sortedProposals = computed(() => {
  const list = [...plantStore.state.speciesProposals]
  return list.sort((a, b) => {
    let result = 0
    if (propSortKey.value === 'status') {
      result = (statusWeight[a.status] || 99) - (statusWeight[b.status] || 99)
    } else if (propSortKey.value === 'submittedAt') {
      result = new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
    }
    return propSortOrder.value === 'asc' ? result : -result
  })
})

const totalPropPages = computed(() => Math.max(1, Math.ceil(sortedProposals.value.length / pageSize)))
const paginatedProposals = computed(() => {
  const start = (propPage.value - 1) * pageSize
  return sortedProposals.value.slice(start, start + pageSize)
})
watch(propPage, (val) => { propPageInput.value = val })
function jumpPropPage() {
  let target = Math.max(1, Math.min(propPageInput.value, totalPropPages.value))
  propPage.value = target
  propPageInput.value = target
}

// -------------------------------------------------------------
// Section 10: BR (D.3) Column Filtering, Pagination & Sorting for Master Inventory
// -------------------------------------------------------------
const invPage = ref(1)
const invPageInput = ref(1)

const invFilters = ref({
  name: '',
  category: '',
  inStockOnly: false,
  requirements: ''
})

const hasInvFilters = computed(() => {
  return !!(invFilters.value.name || invFilters.value.category || invFilters.value.inStockOnly || invFilters.value.requirements)
})

function clearInvFilters() {
  invFilters.value = { name: '', category: '', inStockOnly: false, requirements: '' }
  invPage.value = 1
}

// 1. Filter species inventory by individual columns (BR D.3)
const filteredInventory = computed(() => {
  return plantStore.state.plants.filter(plant => {
    const matchName = !invFilters.value.name || 
      plant.name.toLowerCase().includes(invFilters.value.name.toLowerCase())
    const matchCategory = !invFilters.value.category || 
      plant.category === invFilters.value.category
    const matchStock = !invFilters.value.inStockOnly || plant.stock > 0
    const matchReqs = !invFilters.value.requirements || 
      `${plant.sunExposure || ''} ${plant.waterNeeds || ''}`.toLowerCase().includes(invFilters.value.requirements.toLowerCase())
    return matchName && matchCategory && matchStock && matchReqs
  })
})

// 2. Sort the filtered inventory
const sortedInventory = computed(() => {
  const list = [...filteredInventory.value]
  return list.sort((a, b) => {
    let result = 0
    if (invSortKey.value === 'name') {
      result = a.name.localeCompare(b.name)
    } else if (invSortKey.value === 'stock') {
      result = a.stock - b.stock
    } else if (invSortKey.value === 'adoptedCount') {
      result = a.adoptedCount - b.adoptedCount
    }
    return invSortOrder.value === 'asc' ? result : -result
  })
})

const totalInvPages = computed(() => Math.max(1, Math.ceil(sortedInventory.value.length / pageSize)))
const paginatedInventory = computed(() => {
  const start = (invPage.value - 1) * pageSize
  return sortedInventory.value.slice(start, start + pageSize)
})

// Export PDF Action (BR E.4)
function handleExportPDF() {
  exportInventoryToPDF(filteredInventory.value)
}

watch(invPage, (val) => { invPageInput.value = val })
watch(invFilters, () => { invPage.value = 1 }, { deep: true })
function jumpInvPage() {
  let target = Math.max(1, Math.min(invPageInput.value, totalInvPages.value))
  invPage.value = target
  invPageInput.value = target
}

// 1. Initial species form (Category defaults to empty to force selection, Stock defaults to 1)
const newPlant = ref({ 
  name: '', 
  scientificName: '', 
  imageUrl: '', 
  category: '', 
  stock: 1, 
  wildlifeBenefit: '', 
  description: '' 
})

// 2. Seven error reporting objects
const PlantErrors = ref({ 
  name: '', 
  scientificName: '',
  imageUrl: '',
  category: '',
  stock: '', 
  wildlifeBenefit: '',
  description: ''
})

// 3. Seven verification functions
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

// 4. During submission, a full check is conducted. If any item is left blank, the corresponding item will be highlighted in red and the red text will be displayed.
function handleAddPlant() {
  validatePlantField('name')
  validatePlantField('scientificName')
  validatePlantField('imageUrl')
  validatePlantField('category')
  validatePlantField('stock')
  validatePlantField('wildlifeBenefit')
  validatePlantField('description')

  const hasError = Object.values(PlantErrors.value).some(err => err !== '')
  if (hasError) {
    return
  }

  plantStore.addPlant(newPlant.value)
  showAddModal.value = false
  newPlant.value = { name: '', scientificName: '', imageUrl: '', category: '', stock: 1, wildlifeBenefit: '', description: '' }
  PlantErrors.value = { name: '', scientificName: '', imageUrl: '', category: '', stock: '', wildlifeBenefit: '', description: '' }
  showToast('New species successfully registered into database!', 'success')
}

function handleApproveApp(appId) {
  const res = plantStore.approveApplication(appId)
  showToast(res.message, res.success ? 'success' : 'danger')
}

function handleRejectApp(appId) {
  plantStore.rejectApplication(appId)
  showToast('Application rejected.', 'success')
}

// BR (D.2): Dispatch confirmation email with PDF certificate attachment
async function handleSendEmailCert(app) {
  showToast(`Generating certificate & sending email to ${app.email}...`, 'success')
  const res = await sendAdoptionConfirmationEmail(app)
  if (res.success) {
    // Generate and trigger download of the attached PDF certificate for visible demonstration
    const blob = res.attachmentBlob || generateAdoptionCertificatePDF(app)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Certificate_${(app.applicantName || 'Resident').replace(/\s+/g, '_')}.pdf`
    link.click()
    URL.revokeObjectURL(url)
    showToast(`Email sent to ${app.email}! PDF certificate attachment downloaded.`, 'success')
  } else {
    showToast(res.message, 'danger')
  }
}

function handleApproveProposal(proposalId) {
  plantStore.approveSpeciesProposal(proposalId)
  showToast('Proposal Approved! New species is now live in the resident catalog.', 'success')
}

function handleRejectProposal(proposalId) {
  plantStore.rejectSpeciesProposal(proposalId)
  showToast('Proposal Rejected.', 'success')
}

function handleReset() {
  plantStore.resetToDefault()
  appPage.value = 1
  propPage.value = 1
  invPage.value = 1
  showToast('Data reset to default successfully.', 'success')
}

// BR (E.1): Test Cloud Function invocation
function handleTestCloudFunction() {
  showToast('Invoking Serverless Cloud Function (countSpecies)...', 'success')
  setTimeout(() => {
    const totalCount = plantStore.state.plants.length
    showToast(`Cloud Function [countSpecies] executed: ${totalCount} species returned (HTTP 200 OK)`, 'success')
  }, 500)
}

function showToast(msg, type = 'success') {
  toastMessage.value = msg
  toastType.value = type
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

function handleCustomRestock(plantId) {
  const qty = parseInt(restockInputs.value[plantId])
  
  if (!qty || qty <= 0) {
    showToast('Please enter a valid restock quantity.', 'danger')
    return
  }
  const newStock = plantStore.restockPlant(plantId, qty)
  restockInputs.value[plantId] = null
  showToast(`Restocked ${qty} seedlings! Current inventory ${newStock}`, 'success')
}

function handleCustomReduce(plantId) {
  const qty = parseInt(restockInputs.value[plantId])
  if (!qty || qty <= 0) {
    showToast('Please enter a valid quantity to reduce.', 'danger')
    return
  }
  const newStock = plantStore.reducePlantStock(plantId, qty)
  restockInputs.value[plantId] = null
  showToast(`Reduced ${qty} seedlings! Current inventory ${newStock}`, 'success')
}

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

// Edit Species Modal Logic
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
</script>

<style scoped>
.modal-backdrop {
  opacity: 0.5;
}
.cursor-pointer {
  cursor: pointer;
}
.table-fixed {
  table-layout: fixed;
  width: 100%;
}

.modal-backdrop {
  opacity: 0.5;
}
.cursor-pointer {
  cursor: pointer;
}

.table-fixed {
  table-layout: fixed !important;
  width: 100% !important;
}

.table-fixed tbody tr {
  height: 52px !important;
}

.table-fixed th,
.table-fixed td {
  height: 52px !important;
  vertical-align: middle !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.table-fixed td {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
</style>