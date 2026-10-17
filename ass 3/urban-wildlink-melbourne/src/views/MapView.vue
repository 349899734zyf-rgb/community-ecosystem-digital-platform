<!--
  MapView.vue
  BR (E.2): Geo Location & Interactive Spatial Map
  
  Interactive Leaflet Map displaying Melbourne urban wildlife corridors and community nurseries.
  Non-trivial Features:
  1. Real-time Live OpenStreetMap Geocoding API with autocomplete for ANY Melbourne street address.
  2. Strict Greater Melbourne geographical boundary bounding box.
  3. Dynamic Distance per Location: Each location's popup card displays calculated real-time distance from the user's location.
  4. Unified Control Action Bar: Search Input, Locate on map, + Add Community Nursery, and Category Filters aligned side-by-side.
  5. Role-based Admin Feature (BR C.2): Administrators can add a new nursery by typing a street address (verified automatically via Geocoding API, NO Lat/Lng required).
-->

<template>
  <div class="container py-4">
    <!-- Header Section -->
    <div class="mb-3">
      <h2 class="fw-bold text-success mb-1">
        Melbourne Nursery Map
      </h2>
      <p class="text-muted small mb-0">
        Search any Melbourne address to view nearby indigenous nurseries and habitat zones with live distances.
      </p>
    </div>

    <!-- Unified Control Bar: Search + Locate on Map + Add Nursery + Category Filters -->
    <div class="card border-0 bg-white p-3 mb-3">
      <div class="d-flex align-items-center gap-2 flex-wrap">
        <!-- 1. Search Input with Live Autocomplete Dropdown -->
        <div class="flex-grow-1 position-relative" style="min-width: 280px;">
          <div class="input-group">
            <span class="input-group-text bg-light text-success border-end-0">
              <i class="bi bi-search"></i>
            </span>
            <input 
              id="addressSearchInput"
              v-model="searchQuery" 
              type="text" 
              class="form-control border-start-0" 
              placeholder="Type Melbourne address"
              autocomplete="off"
              :disabled="isSearching"
              @input="onSearchInputDebounced"
              @keyup.enter="handleSearchSubmit"
              @focus="onInputFocus"
            >
            <button 
              v-if="userLocation || searchQuery" 
              class="btn btn-outline-secondary" 
              type="button" 
              @click="clearUserLocation"
              title="Clear search"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <!-- Live Autocomplete Suggestions Dropdown -->
          <ul 
            v-if="showSuggestions && searchResults.length > 0" 
            class="list-group position-absolute w-100 border mt-1 overflow-auto" 
            style="max-height: 250px; z-index: 1050;"
          >
            <li 
              v-for="(item, idx) in searchResults" 
              :key="idx" 
              class="list-group-item list-group-item-action small py-2 d-flex justify-content-between align-items-center cursor-pointer"
              @mousedown.prevent="applyVerifiedLocation(item)"
            >
              <div class="text-truncate me-2">
                <i class="bi bi-geo-alt-fill text-success me-2"></i>
                <strong>{{ item.cleanName }}</strong>
                <div class="text-muted small text-truncate" style="font-size: 11px;">{{ item.display_name }}</div>
              </div>
              <span class="badge bg-success-subtle text-success border border-success-subtle">Melbourne</span>
            </li>
          </ul>
        </div>

        <!-- 2. Locate on map Button -->
        <button 
          class="btn btn-success fw-bold px-3 d-flex align-items-center gap-1 text-nowrap" 
          type="button" 
          :disabled="isSearching || !searchQuery.trim()"
          @click="handleSearchSubmit"
        >
          <span v-if="isSearching" class="spinner-border spinner-border-sm me-1"></span>
          <i v-else class="bi bi-geo-alt-fill"></i>
        </button>

        <!-- 3. Administrator: Add Community Nursery Button (Moved right next to Locate on map) -->
        <button 
          v-if="currentUser && currentUser.role === 'Administrator'" 
          type="button" 
          class="btn btn-success fw-bold d-flex align-items-center gap-1 text-nowrap"
          @click="openAddNurseryModal"
          title="Register a new community seedling nursery"
        >
          <span>+ Add Community Nursery</span>
        </button>

        <!-- 4. Category Filter Buttons: [All Locations | Nursery | Corridor | Wetland] (Right of Add Nursery) -->
        <div class="btn-group text-nowrap">
          <button 
            v-for="cat in ['All', 'Nursery', 'Corridor', 'Wetland']" 
            :key="cat"
            type="button" 
            class="btn fw-bold"
            :class="selectedCategory === cat ? 'btn-success text-white' : 'btn-outline-success'"
            @click="filterMarkers(cat)"
          >
            {{ cat === 'All' ? 'All Locations' : cat }}
          </button>
        </div>
      </div>

      <!-- Search Feedback Sub-bar -->
      <div class="d-flex justify-content-between align-items-center mt-2 small">
        <div v-if="userLocation" class="text-success fw-bold">
        </div>
        <div v-else-if="searchError" class="text-danger fw-semibold">
          <i class="bi bi-exclamation-triangle-fill me-1"></i> {{ searchError }}
        </div>
      </div>
    </div>

    <!-- Map Canvas Container -->
    <div class="card border-0 p-0 overflow-hidden" style="height: 520px; border-radius: 12px; position: relative;">
      <div id="leaflet-map" style="height: 100%; width: 100%;"></div>
    </div>

    <!-- Color Matched Legend Section -->
    <div class="card border-0 bg-white p-3 mt-3">
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 small">
        <div class="d-flex align-items-center gap-4 flex-wrap">
          <!-- 1. Community Nursery (Green) -->
          <div class="d-flex align-items-center gap-2">
            <span class="legend-dot" style="background-color: #47966d;">
            </span>
            <strong style="color: #47966d;">Community Nursery</strong>
            <span class="text-muted"></span>
          </div>

          <!-- 2. Wildlife Corridor (Blue) -->
          <div class="d-flex align-items-center gap-2">
            <span class="legend-dot" style="background-color: #0d6efd;">
            </span>
            <strong style="color: #0d6efd;">Wildlife Corridor</strong>
            <span class="text-muted"></span>
          </div>

          <!-- 3. Wetland Habitat (Teal) -->
          <div class="d-flex align-items-center gap-2">
            <span class="legend-dot" style="background-color: #2b6e82	;">
            </span>
            <strong style="color: #2b6e82;">Wetland Habitat</strong>
            <span class="text-muted"></span>
          </div>

          <!-- 4. User Selected Location (Orange) -->
          <div v-if="userLocation" class="d-flex align-items-center gap-2">
            <span class="legend-dot" style="background-color: #fd7e14;">
              <i class="bi bi-geo-alt-fill text-white" style="font-size: 11px;"></i>
            </span>
            <strong style="color: #fd7e14;">Your Searched Location</strong>
            <span class="text-muted">({{ userLocation.name }})</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Administrator: Add Nursery Modal (Address Verified via API, NO Lat/Lng required) -->
    <div v-if="showAddModal" class="modal-backdrop fade show"></div>
    <div v-if="showAddModal" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title fw-bold">
              Register New Community Nursery
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="showAddModal = false"></button>
          </div>
          <div class="modal-body p-4">
            <form @submit.prevent="handleVerifyAndSaveNursery" novalidate>
              <!-- Nursery Name -->
              <div class="mb-3">
                <label for="nurseryNameInput" class="form-label small fw-bold">Nursery Name *</label>
                <input 
                  id="nurseryNameInput"
                  v-model.trim="newNurseryForm.name" 
                  type="text" 
                  class="form-control" 
                  :class="{ 'is-invalid': nurseryErrors.name }"
                  placeholder=""
                  @input="validateNurseryField('name')"
                >
                <div class="invalid-feedback">{{ nurseryErrors.name }}</div>
              </div>

              <!-- Nursery Category Dropdown -->
              <div class="mb-3">
                <label for="nurseryCategorySelect" class="form-label small fw-bold">Nursery Category *</label>
                <select 
                  id="nurseryCategorySelect"
                  v-model="newNurseryForm.category" 
                  class="form-select"
                  :class="{ 'is-invalid': nurseryErrors.category }"
                  @change="validateNurseryField('category')"
                >
                  <option value="Nursery">Community Nursery</option>
                  <option value="Corridor">Wildlife Corridor</option>
                  <option value="Wetland">Wetland Habitat</option>
                </select>
                <div class="invalid-feedback">{{ nurseryErrors.category }}</div>
              </div>

              <!-- Real Street Address Input (No lat/lng needed!) -->
              <div class="mb-3">
                <label for="nurseryAddressInput" class="form-label small fw-bold">Physical Street Address (in Greater Melbourne) *</label>
                <input 
                  id="nurseryAddressInput"
                  v-model.trim="newNurseryForm.address" 
                  type="text" 
                  class="form-control" 
                  :class="{ 'is-invalid': nurseryErrors.address || modalAddressError }"
                  placeholder=""
                  @input="validateNurseryField('address')"
                >
                <div class="invalid-feedback">{{ nurseryErrors.address || modalAddressError }}</div>
              </div>

              <!-- Description -->
              <div class="mb-3">
                <label for="nurseryDescInput" class="form-label small fw-bold">Description</label>
                <textarea 
                  id="nurseryDescInput"
                  v-model.trim="newNurseryForm.description" 
                  class="form-control" 
                  rows="2" 
                  placeholder=""
                ></textarea>
              </div>

              <div class="d-flex justify-content-end gap-2 pt-2">
                <button type="button" class="btn btn-secondary btn-sm" @click="showAddModal = false">Cancel</button>
                <button type="submit" class="btn btn-success btn-sm fw-bold" :disabled="isVerifyingModalAddress">
                  <span v-if="isVerifyingModalAddress" class="spinner-border spinner-border-sm me-1"></span>
                  {{ isVerifyingModalAddress ? 'Verifying Address...' : 'Add Nursery' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="toastMessage" class="position-fixed bottom-0 end-0 p-3" style="z-index: 1080;">
      <div class="alert alert-success d-flex align-items-center mb-0" role="alert">
        <i class="bi bi-check-circle-fill me-2 fs-5"></i>
        <div>{{ toastMessage }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { plantStore } from '../store/plantStore'

let map = null
let markerLayerGroup = null
let userMarker = null
let debounceTimer = null

const selectedCategory = ref('All')
const userLocation = ref(null)
const searchQuery = ref('')
const searchResults = ref([])
const showSuggestions = ref(false)
const isSearching = ref(false)
const searchError = ref('')

const showAddModal = ref(false)
const isVerifyingModalAddress = ref(false)
const modalAddressError = ref('')
const toastMessage = ref('')

const currentUser = computed(() => plantStore.state.currentUser)

// Automatically re-render markers when user role changes so delete button visibility updates
watch(currentUser, () => {
  if (markerLayerGroup) {
    filterMarkers(selectedCategory.value)
  }
})

const STORAGE_LOCATIONS_KEY = 'urban_wildlink_map_all_locations_v2'
const STORAGE_NURSERIES_KEY = 'urban_wildlink_map_custom_nurseries'

// Greater Melbourne Metropolitan Bounding Box:
// West: 144.40, North: -37.40, East: 145.65, South: -38.45
const MELBOURNE_BOUNDS = {
  minLon: 144.40,
  maxLon: 145.65,
  minLat: -38.45,
  maxLat: -37.40
}

function isInsideMelbourne(lat, lon) {
  return lat >= MELBOURNE_BOUNDS.minLat && 
         lat <= MELBOURNE_BOUNDS.maxLat && 
         lon >= MELBOURNE_BOUNDS.minLon && 
         lon <= MELBOURNE_BOUNDS.maxLon
}

// 1. Initial Melbourne Points of Interest (Nurseries & Corridors)
const defaultLocations = [
  {
    id: 'nursery-1',
    name: 'Clayton Native Nursery & Hub',
    category: 'Nursery',
    lat: -37.9150,
    lng: 145.1300,
    address: 'Wellington Rd, Clayton VIC 3168',
    description: 'Central seedlings pickup nursery for South-East Melbourne residents.'
  },
  {
    id: 'corridor-1',
    name: 'Yarra Bend Urban Wildlife Corridor',
    category: 'Corridor',
    lat: -37.7950,
    lng: 145.0080,
    address: 'Yarra Bend Park, Fairfield VIC 3078',
    description: 'Vital ecological flight corridor for native flying foxes and honeyeaters.'
  },
  {
    id: 'wetland-1',
    name: 'Dandenong Creek Ecological Wetland',
    category: 'Wetland',
    lat: -37.8920,
    lng: 145.1950,
    address: 'Dandenong Creek Trail, Wantirna VIC 3152',
    description: 'Protected wetland sanctuary hosting native waterfowl and aquatic plants.'
  },
  {
    id: 'corridor-2',
    name: 'Merri Creek Micro-Habitat Zone',
    category: 'Corridor',
    lat: -37.7650,
    lng: 144.9850,
    address: 'Merri Creek Trail, Brunswick East VIC 3057',
    description: 'Community-revegetated habitat strip connecting northern suburbs.'
  },
  {
    id: 'nursery-2',
    name: 'Monash Biodiversity Seedling Nursery',
    category: 'Nursery',
    lat: -37.9105,
    lng: 145.1340,
    address: 'Scenic Blvd, Clayton VIC 3800',
    description: 'Research and seedling propagation center affiliated with Monash University.'
  }
]

function loadStoredLocations() {
  const savedAll = localStorage.getItem(STORAGE_LOCATIONS_KEY)
  if (savedAll) {
    try {
      const parsed = JSON.parse(savedAll)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    } catch (e) {
      console.error('Failed to parse locations from storage:', e)
    }
  }

  // Backward compatibility: migrate if old custom nurseries exist
  const oldCustom = localStorage.getItem(STORAGE_NURSERIES_KEY)
  if (oldCustom) {
    try {
      const extra = JSON.parse(oldCustom)
      const merged = [...defaultLocations, ...extra]
      localStorage.setItem(STORAGE_LOCATIONS_KEY, JSON.stringify(merged))
      return merged
    } catch (e) {
      console.error('Failed to migrate old custom nurseries:', e)
    }
  }

  localStorage.setItem(STORAGE_LOCATIONS_KEY, JSON.stringify(defaultLocations))
  return [...defaultLocations]
}

function saveLocationsToStorage(locations) {
  try {
    localStorage.setItem(STORAGE_LOCATIONS_KEY, JSON.stringify(locations))
  } catch (e) {
    console.error('Failed to save locations to storage:', e)
  }
}

const mapLocations = ref(loadStoredLocations())

// Haversine formula to compute distance in km
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return parseFloat((R * c).toFixed(1))
}

function initMap() {
  map = L.map('leaflet-map').setView([-37.8500, 145.0800], 11)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  markerLayerGroup = L.layerGroup().addTo(map)
  renderMarkers(mapLocations.value)

  // Attach global delete handler for popup button (accessible to administrators)
  window.__deleteMapLocation = (locationId) => {
    handleDeleteLocation(locationId)
  }
}

// Create custom distinct DivIcon markers
function createCustomIcon(category) {
  let bgColor = '#47966d'
  let iconClass = 'bi-flower1'

  const catLower = (category || '').toLowerCase()
  if (category === 'Corridor' || catLower.includes('corridor')) {
    bgColor = '#0d6efd'
    iconClass = 'bi-tree-fill'
  } else if (category === 'Wetland' || catLower.includes('wetland')) {
    bgColor = '#2b6e82'
    iconClass = 'bi-water'
  }

  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="position: relative; width: 32px; height: 32px;">
        <div style="
          background-color: ${bgColor}; 
          color: #ffffff; 
          width: 20px; 
          height: 20px; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
        ">
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18]
  })
}

function renderMarkers(locations) {
  markerLayerGroup.clearLayers()

  const isAdmin = currentUser.value && currentUser.value.role === 'Administrator'

  locations.forEach(loc => {
    let distanceKm = null
    if (userLocation.value) {
      distanceKm = calculateDistance(userLocation.value.lat, userLocation.value.lng, loc.lat, loc.lng)
    }

    const icon = createCustomIcon(loc.category)
    const marker = L.marker([loc.lat, loc.lng], { icon })

    let badgeColor = '#47966d'
    let titleColor = '#47966d'
    const catLower = (loc.category || '').toLowerCase()
    if (loc.category === 'Corridor' || catLower.includes('corridor')) {
      badgeColor = '#0d6efd'
      titleColor = '#0d6efd'
    } else if (loc.category === 'Wetland' || catLower.includes('wetland')) {
      badgeColor = '#2b6e82'
      titleColor = '#23576e'
    }

    // Distance card formatted identically to reference design
    const distanceBox = (userLocation.value && distanceKm !== null) ? `
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; margin-top: 12px; display: flex; align-items: center; gap: 8px; font-size: 13px; color: #334155;">
        <i class="bi bi-geo" style="color: #47966d; font-size: 16px; flex-shrink: 0;"></i>
        <span>Distance from your location: <strong style="color: #0f172a; font-weight: 700;">${distanceKm} km</strong></span>
      </div>
    ` : ''

    // Administrator only: Delete Location button
    const adminActionHtml = isAdmin ? `
      <div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed #cbd5e1; display: flex; justify-content: flex-end;">
        <button 
          type="button" 
          onclick="window.__deleteMapLocation('${loc.id}')"
          style="background: #ffffff; border: 1px solid #dc3545; color: #dc3545; padding: 4px 10px; border-radius: 6px; font-size: 11.5px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;"
          onmouseover="this.style.background='#dc3545'; this.style.color='#ffffff';"
          onmouseout="this.style.background='#ffffff'; this.style.color='#dc3545';"
          title="Remove this location from the map"
        >
          Delete Location
        </button>
      </div>
    ` : ''

    const popupContent = `
      <div style="font-family: inherit; min-width: 240px; max-width: 295px; padding: 2px;">
        <span style="background-color: ${badgeColor}; color: white; padding: 3px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; display: inline-block;">
          ${loc.category}
        </span>
        <h5 style="margin: 10px 0 8px 0; font-weight: 700; color: ${titleColor}; font-size: 17px; line-height: 1.3;">
          ${loc.name}
        </h5>
        <div style="font-size: 13.5px; color: #2d3748; margin-bottom: 8px; display: flex; align-items: flex-start; gap: 6px;">
          <i class="bi bi-geo-alt" style="margin-top: 2px; color: #4a5568; font-size: 14px; flex-shrink: 0;"></i>
          <span>${loc.address}</span>
        </div>
        <div style="font-size: 13px; color: #4a5568; line-height: 1.45;">
          ${loc.description}
        </div>
        ${distanceBox}
        ${adminActionHtml}
      </div>
    `
    marker.bindPopup(popupContent)
    markerLayerGroup.addLayer(marker)
  })
}

function filterMarkers(cat) {
  selectedCategory.value = cat
  if (cat === 'All') {
    renderMarkers(mapLocations.value)
  } else {
    const filtered = mapLocations.value.filter(l => {
      const lCat = (l.category || '').toLowerCase()
      if (cat === 'Nursery') return l.category === 'Nursery' || lCat.includes('nursery')
      if (cat === 'Corridor') return l.category === 'Corridor' || lCat.includes('corridor')
      if (cat === 'Wetland') return l.category === 'Wetland' || lCat.includes('wetland')
      return l.category === cat
    })
    renderMarkers(filtered)
  }
}

// ----------------------------------------------------------------------------
// Real-time Geocoding with Live Autocomplete restricted strictly to Melbourne
// ----------------------------------------------------------------------------
function onInputFocus() {
  if (searchResults.value.length > 0) {
    showSuggestions.value = true
  }
}

function onSearchInputDebounced() {
  clearTimeout(debounceTimer)
  searchError.value = ''
  const q = searchQuery.value.trim()

  if (q.length < 2) {
    searchResults.value = []
    showSuggestions.value = false
    return
  }

  // 300ms debounce for live suggestions
  debounceTimer = setTimeout(() => {
    fetchLiveMelbourneSuggestions(q)
  }, 300)
}

// Australian Unit parser helper
function parseUnitAddress(raw) {
  const match = raw.match(/^(\d+)\/(\d+)\s*(.*)/)
  if (match) {
    return {
      hasUnit: true,
      unitNo: match[1],
      streetNo: match[2],
      streetName: match[3],
      sanitizedQuery: `${match[2]} ${match[3]}`.trim()
    }
  }
  return { hasUnit: false, sanitizedQuery: raw }
}

async function fetchLiveMelbourneSuggestions(queryText) {
  try {
    const parsed = parseUnitAddress(queryText)
    // Strictly bounded to Greater Melbourne and forced English language
    const endpoint = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(parsed.sanitizedQuery + ', Melbourne, Victoria, Australia')}&viewbox=144.40,-37.40,145.65,-38.45&bounded=1&countrycodes=au&limit=6&addressdetails=1&accept-language=en`

    const res = await fetch(endpoint)
    if (!res.ok) return

    const data = await res.json()
    if (!data || data.length === 0) {
      // Try searching just the street name without house number if not found
      if (parsed.streetName) {
        const fbUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(parsed.streetName + ', Melbourne, Victoria')}&viewbox=144.40,-37.40,145.65,-38.45&bounded=1&countrycodes=au&limit=4&addressdetails=1&accept-language=en`
        const fbRes = await fetch(fbUrl)
        const fbData = await fbRes.json()
        filterAndDisplayResults(fbData, parsed)
      } else {
        searchResults.value = []
        showSuggestions.value = false
      }
      return
    }

    filterAndDisplayResults(data, parsed)
  } catch (err) {
    console.warn('Geocoding autocomplete notice:', err)
  }
}

function filterAndDisplayResults(data, parsed) {
  // Filter: MUST be strictly within Greater Melbourne boundaries
  const melbourneOnly = (data || []).filter(item => {
    const lat = parseFloat(item.lat)
    const lon = parseFloat(item.lon)
    return isInsideMelbourne(lat, lon)
  })

  searchResults.value = melbourneOnly.map(item => {
    const parts = item.display_name.split(',')
    let clean = parts.slice(0, 3).join(',').trim()

    // Prepend original unit number if user entered one
    if (parsed.hasUnit) {
      clean = `${parsed.unitNo}/${clean}`
    }

    return {
      ...item,
      cleanName: clean
    }
  })

  showSuggestions.value = searchResults.value.length > 0
}

async function handleSearchSubmit() {
  const query = searchQuery.value.trim()
  if (!query) return

  isSearching.value = true
  searchError.value = ''
  showSuggestions.value = false

  try {
    const parsed = parseUnitAddress(query)
    const endpoint = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(parsed.sanitizedQuery + ', Melbourne, Victoria, Australia')}&viewbox=144.40,-37.40,145.65,-38.45&bounded=1&countrycodes=au&limit=4&addressdetails=1&accept-language=en`

    const response = await fetch(endpoint)
    const data = await response.json()

    // Filter to Melbourne only
    const melbData = (data || []).filter(d => isInsideMelbourne(parseFloat(d.lat), parseFloat(d.lon)))

    if (melbData.length === 0) {
      searchError.value = `Address "${query}" not found within Greater Melbourne. Please check spelling.`
      isSearching.value = false
      return
    }

    applyVerifiedLocation(melbData[0])
  } catch (err) {
    console.error('Search error:', err)
    searchError.value = 'Geocoding request failed. Please check internet connection.'
  } finally {
    isSearching.value = false
  }
}

function applyVerifiedLocation(item) {
  searchResults.value = []
  showSuggestions.value = false

  const lat = parseFloat(item.lat)
  const lng = parseFloat(item.lon)
  
  const shortName = item.cleanName || item.display_name.split(',').slice(0, 2).join(',').trim()

  userLocation.value = {
    name: shortName,
    fullAddress: item.display_name,
    lat,
    lng
  }
  searchQuery.value = shortName

  // 1. Remove previous user marker
  if (userMarker) {
    map.removeLayer(userMarker)
  }

  // 2. Create distinct Orange User Location Marker
  const userPinIcon = L.divIcon({
    className: 'custom-user-pin',
    html: `
      <div style="
        background-color: #fd7e14; 
        color: #ffffff; 
        width: 36px; 
        height: 36px; 
        border-radius: 50%; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        box-shadow: 0 4px 12px rgba(253, 126, 20, 0.55);
      ">
        <i class="bi bi-geo-alt-fill" style="font-size: 18px;"></i>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20]
  })

  userMarker = L.marker([lat, lng], { icon: userPinIcon }).addTo(map)
  userMarker.bindPopup(`
    <div style="min-width: 200px;">
      <span class="badge" style="background-color: #fd7e14;">Your Starting Location</span>
      <h6 style="margin: 6px 0 2px 0; font-weight: bold; color: #fd7e14;">${shortName}</h6>
      <p class="small text-muted mb-0" style="font-size: 11px;">${item.display_name}</p>
    </div>
  `).openPopup()

  // 3. Re-render all markers so their popup cards show distances to this user location
  renderMarkers(mapLocations.value)

  // 4. Center map on searched user location
  map.setView([lat, lng], 13)
}

function clearUserLocation() {
  userLocation.value = null
  searchQuery.value = ''
  searchResults.value = []
  showSuggestions.value = false
  searchError.value = ''

  if (userMarker) {
    map.removeLayer(userMarker)
    userMarker = null
  }
  renderMarkers(mapLocations.value)
  map.setView([-37.8500, 145.0800], 11)
}

// ----------------------------------------------------------------------------
// Administrator Add Nursery Form (Verified via Geocoding API, No Lat/Lng required)
// ----------------------------------------------------------------------------
const newNurseryForm = ref({
  name: '',
  category: 'Nursery',
  address: '',
  description: ''
})

const nurseryErrors = ref({
  name: '',
  category: '',
  address: ''
})

function validateNurseryField(field) {
  if (field === 'name') {
    nurseryErrors.value.name = newNurseryForm.value.name.trim() ? '' : 'Nursery name is required.'
  }
  if (field === 'category') {
    nurseryErrors.value.category = newNurseryForm.value.category ? '' : 'Please select a nursery category.'
  }
  if (field === 'address') {
    modalAddressError.value = ''
    nurseryErrors.value.address = newNurseryForm.value.address.trim() ? '' : 'Physical street address is required.'
  }
}

function openAddNurseryModal() {
  newNurseryForm.value = {
    name: '',
    category: 'Nursery',
    address: '',
    description: ''
  }
  nurseryErrors.value = {
    name: '',
    category: '',
    address: ''
  }
  modalAddressError.value = ''
  showAddModal.value = true
}

async function handleVerifyAndSaveNursery() {
  validateNurseryField('name')
  validateNurseryField('category')
  validateNurseryField('address')
  const hasError = Object.values(nurseryErrors.value).some(err => err !== '')
  if (hasError) return

  isVerifyingModalAddress.value = true
  modalAddressError.value = ''

  try {
    const rawAddress = newNurseryForm.value.address.trim()
    const parsed = parseUnitAddress(rawAddress)

    // Call Geocoding API with strict Melbourne bounds (forced English language)
    const endpoint = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(parsed.sanitizedQuery + ', Melbourne, Victoria, Australia')}&viewbox=144.40,-37.40,145.65,-38.45&bounded=1&countrycodes=au&limit=1&addressdetails=1&accept-language=en`

    const response = await fetch(endpoint)
    const data = await response.json()

    // Must be inside Melbourne bounds
    const melbMatch = (data || []).find(d => isInsideMelbourne(parseFloat(d.lat), parseFloat(d.lon)))

    if (!melbMatch) {
      modalAddressError.value = 'Address could not be verified in Greater Melbourne. Please check street name and suburb.'
      isVerifyingModalAddress.value = false
      return
    }

    const resolvedLat = parseFloat(melbMatch.lat)
    const resolvedLng = parseFloat(melbMatch.lon)
    const resolvedCategory = newNurseryForm.value.category || 'Nursery'

    const newNursery = {
      id: `nursery-${Date.now()}`,
      name: newNurseryForm.value.name,
      category: resolvedCategory,
      lat: resolvedLat,
      lng: resolvedLng,
      address: melbMatch.display_name,
      description: newNurseryForm.value.description || 'Community indigenous seedling propagation and distribution hub.'
    }

    // Add to reactive locations & save
    mapLocations.value.push(newNursery)
    saveLocationsToStorage(mapLocations.value)

    showAddModal.value = false
    filterMarkers(selectedCategory.value)

    // Pan to the newly created nursery
    map.setView([resolvedLat, resolvedLng], 14)

    toastMessage.value = `Verified & Registered "${newNursery.name}" (${newNursery.category}) in Melbourne!`
    setTimeout(() => {
      toastMessage.value = ''
    }, 5000)
  } catch (err) {
    console.error('Error verifying nursery address:', err)
    modalAddressError.value = 'Address verification service temporarily unreachable. Please check connection.'
  } finally {
    isVerifyingModalAddress.value = false
  }
}

// ----------------------------------------------------------------------------
// Administrator Delete Location Feature (Role-based BR C.2)
// ----------------------------------------------------------------------------
function handleDeleteLocation(locationId) {
  if (!currentUser.value || currentUser.value.role !== 'Administrator') {
    alert('Unauthorized: Only administrators can remove locations from the map.')
    return
  }

  const targetLoc = mapLocations.value.find(l => l.id === locationId)
  if (!targetLoc) return

  const confirmed = confirm(`Are you sure you want to remove "${targetLoc.name}" from the Melbourne habitat map?`)
  if (!confirmed) return

  // 1. Remove from reactive array
  mapLocations.value = mapLocations.value.filter(l => l.id !== locationId)

  // 2. Persist to localStorage
  saveLocationsToStorage(mapLocations.value)

  // 3. Close open popup on map
  if (map) {
    map.closePopup()
  }

  // 4. Re-render filtered markers
  filterMarkers(selectedCategory.value)

  // 5. Toast notification
  toastMessage.value = `Removed "${targetLoc.name}" from Melbourne habitat map!`
  setTimeout(() => {
    toastMessage.value = ''
  }, 4000)
}

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (map) {
    map.remove()
  }
  clearTimeout(debounceTimer)
  delete window.__deleteMapLocation
})
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.modal-backdrop {
  opacity: 0.5;
}

/* Legend circular dot styling */
.legend-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 10px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.18);
}
:deep(.custom-map-pin),
:deep(.custom-user-pin) {
  background: none;
  border: none;
}
</style>
