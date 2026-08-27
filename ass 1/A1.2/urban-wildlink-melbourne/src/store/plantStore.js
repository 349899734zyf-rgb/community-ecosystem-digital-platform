/**
 * References & Acknowledgements:
 * - State Management Architecture: Vue 3 Reactivity API (reactive, computed)
 * - Persistence Pattern: Web Storage API (localStorage) for client-side state preservation
 * - Synthetic Mock Data: Realistic Victorian addresses and email formats.
 */

import { reactive, computed } from 'vue'
import { initialPlants } from '../data/initialPlants'

const PLANTS_STORAGE_KEY = 'urban_wildlink_plants_v2'
const APPLICATIONS_STORAGE_KEY = 'urban_wildlink_applications_v2'
const PROPOSALS_STORAGE_KEY = 'urban_wildlink_species_proposals_v2'

const defaultApplications = [
  {
    id: 'app-101',
    applicantName: 'Emily Watson',
    email: 'emily.watson@gmail.com',
    postcode: '3150',
    address: '12 Coleman Parade, Glen Waverley',
    plantId: 'plant-1',
    plantName: 'Golden Wattle',
    quantity: 2,
    gardenType: 'Suburban Backyard',
    status: 'Approved',
    submittedAt: '2026-08-24 10:30'
  },
  {
    id: 'app-102',
    applicantName: 'Marcus Chen',
    email: 'marcus.chen@student.monash.edu',
    postcode: '3168',
    address: '45 Prince St, Clayton',
    plantId: 'plant-2',
    plantName: 'Silver Banksia',
    quantity: 1,
    gardenType: 'Balcony Garden',
    status: 'Pending',
    submittedAt: '2026-08-25 14:15'
  }
]

const defaultProposals = [
  {
    id: 'prop-201',
    proposerName: 'Marcus Chen',
    email: 'marcus.chen@student.monash.edu',
    plantName: 'Common Everlasting',
    scientificName: 'Chrysocephalum apiculatum',
    category: 'Wildflower',
    wildlifeBenefit: 'Native Hoverflies & Small Bees',
    reason: 'Hardy local butterfly host plant suited for Clayton clay soils.',
    status: 'Pending',
    submittedAt: '2026-08-26 09:40'
  }
]

function loadData(key, fallback) {
  const saved = localStorage.getItem(key)
  if (saved) {
    try { return JSON.parse(saved) } catch (e) { console.error('Error parsing localStorage key:', key, e) }
  }
  return JSON.parse(JSON.stringify(fallback))
}

const state = reactive({
  plants: loadData(PLANTS_STORAGE_KEY, initialPlants),
  applications: loadData(APPLICATIONS_STORAGE_KEY, defaultApplications),
  speciesProposals: loadData(PROPOSALS_STORAGE_KEY, defaultProposals)
})

function saveAll() {
  localStorage.setItem(PLANTS_STORAGE_KEY, JSON.stringify(state.plants))
  localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(state.applications))
  localStorage.setItem(PROPOSALS_STORAGE_KEY, JSON.stringify(state.speciesProposals))
}

export const plantStore = {
  state,

  // 1. Submit adoption application
  submitApplication(formData) {
    const plant = state.plants.find(p => p.id === formData.plantId)
    const newApp = {
      id: `app-${Date.now()}`,
      applicantName: formData.fullName,
      email: formData.email,
      postcode: formData.postcode,
      address: formData.address,
      plantId: formData.plantId,
      plantName: plant ? plant.name : 'Unknown Plant',
      quantity: parseInt(formData.quantity) || 1,
      gardenType: formData.gardenType,
      status: 'Pending',
      submittedAt: new Date().toLocaleString()
    }
    state.applications.unshift(newApp)
    saveAll()
    return newApp
  },

  // 2. Submit species suggestion
  submitSpeciesProposal(proposalData) {
    const newProposal = {
      id: `prop-${Date.now()}`,
      proposerName: proposalData.proposerName,
      email: proposalData.email,
      plantName: proposalData.plantName,
      scientificName: proposalData.scientificName || 'Indigenous species',
      category: proposalData.category || 'Shrub',
      wildlifeBenefit: proposalData.wildlifeBenefit || 'Native Wildlife',
      reason: proposalData.reason || 'Requested by community member for local biodiversity.',
      status: 'Pending',
      submittedAt: new Date().toLocaleString()
    }
    state.speciesProposals.unshift(newProposal)
    saveAll()
    return newProposal
  },

  // 3. Restock inventory
  restockPlant(plantId, amount = 5) {
    const plant = state.plants.find(p => p.id === plantId)
    if (plant) {
      plant.stock += amount
      saveAll()
      return plant.stock
    }
    return 0
  },

  // 4. Add new species
  addPlant(newPlantData) {
    const newPlant = {
      id: `plant-${Date.now()}`,
      name: newPlantData.name,
      scientificName: newPlantData.scientificName || 'Indigenous species',
      imageUrl: newPlantData.imageUrl || '',
      category: newPlantData.category || 'Shrub',
      sunExposure: newPlantData.sunExposure || 'Full Sun',
      waterNeeds: newPlantData.waterNeeds || 'Low',
      wildlifeBenefit: newPlantData.wildlifeBenefit || 'Native Wildlife',
      stock: parseInt(newPlantData.stock) || 10,
      adoptedCount: 0,
      description: newPlantData.description || 'Added by Administrator.'
    }
    state.plants.unshift(newPlant)
    saveAll()
  },

  // 5. Approve / reject proposals
  approveSpeciesProposal(proposalId) {
    const prop = state.speciesProposals.find(p => p.id === proposalId)
    if (prop && prop.status === 'Pending') {
      const newPlant = {
        id: `plant-${Date.now()}`,
        name: prop.plantName,
        scientificName: prop.scientificName,
        category: prop.category,
        sunExposure: 'Full Sun to Part Shade',
        waterNeeds: 'Low to Medium',
        wildlifeBenefit: prop.wildlifeBenefit,
        stock: 15,
        adoptedCount: 0,
        description: `Approved native species proposed by ${prop.proposerName}. ${prop.reason}`
      }
      state.plants.unshift(newPlant)
      prop.status = 'Approved'
      saveAll()
      return true
    }
    return false
  },

  rejectSpeciesProposal(proposalId) {
    const prop = state.speciesProposals.find(p => p.id === proposalId)
    if (prop && prop.status === 'Pending') {
      prop.status = 'Rejected'
      saveAll()
      return true
    }
    return false
  },

  // 6. Approve / reject adoption applications
  approveApplication(appId) {
    const app = state.applications.find(a => a.id === appId)
    if (app && app.status === 'Pending') {
      const plant = state.plants.find(p => p.id === app.plantId)
      if (plant && plant.stock >= app.quantity) {
        plant.stock -= app.quantity
        plant.adoptedCount += app.quantity
        app.status = 'Approved'
        saveAll()
        return { success: true, message: 'Application approved and stock allocated.' }
      } else {
        return { success: false, message: 'Insufficient nursery stock available.' }
      }
    }
    return { success: false, message: 'Failed to process approval.' }
  },

  rejectApplication(appId) {
    const app = state.applications.find(a => a.id === appId)
    if (app && app.status === 'Pending') {
      app.status = 'Rejected'
      saveAll()
      return true
    }
    return false
  },

  // 7. Reset utility
  resetToDefault() {
    state.plants = JSON.parse(JSON.stringify(initialPlants))
    state.applications = JSON.parse(JSON.stringify(defaultApplications))
    state.speciesProposals = JSON.parse(JSON.stringify(defaultProposals))
    saveAll()
  },

  // 8. Safe computed properties
  get totalSpeciesCount() {
    return (state.plants || []).length
  },
  get totalAdoptedCount() {
    return (state.plants || []).reduce((sum, p) => sum + (p.adoptedCount || 0), 0)
  },
  get totalStockAvailable() {
    return (state.plants || []).reduce((sum, p) => sum + (p.stock || 0), 0)
  },
  get pendingApplicationsCount() {
    return (state.applications || []).filter(a => a.status === 'Pending').length
  },
  get pendingProposalsCount() {
    return (state.speciesProposals || []).filter(p => p.status === 'Pending').length
  }
}