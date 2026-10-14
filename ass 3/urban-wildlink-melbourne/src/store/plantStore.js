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
const ADMIN_AUTH_KEY = 'urban_wildlink_is_admin'
const USERS_STORAGE_KEY = 'urban_wildlink_users_v3'
const CURRENT_USER_KEY = 'urban_wildlink_current_user_v3'

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
    imageUrl:'https://www.gardensonline.com.au/Uploads/Product/5879/Chrysocephalum-Apiculatum-1b.jpg',
    category: 'Wildflower',
    wildlifeBenefit: 'Native Hoverflies & Small Bees',
    reason: 'Hardy local butterfly host plant suited for Clayton clay soils.',
    status: 'Pending',
    submittedAt: '2026-08-26 09:40'
  }
]

// Resident / Volunteer / Administrator
const defaultUsers = [
  {
    id: 'user-admin',
    fullName: 'Sarah Jenkins',
    email: 'admin@wildlink.org.au',
    password: 'Password123!',
    role: 'Administrator',
    createdAt: '2026-08-20'
  },
  {
    id: 'user-volunteer',
    fullName: 'David Miller',
    email: 'volunteer@wildlink.org.au',
    password: 'Password123!',
    role: 'Volunteer',
    createdAt: '2026-08-22'
  },
  {
    id: 'user-resident',
    fullName: 'Marcus Chen',
    email: 'marcus.chen@student.monash.edu',
    password: 'Password123!',
    role: 'Resident',
    createdAt: '2026-08-25'
  }
]

function loadData(key, fallback) {
  const saved = localStorage.getItem(key)
  if (saved) {
    try { return JSON.parse(saved) } catch (e) { console.error('Error parsing localStorage key:', key, e) }
  }
  return JSON.parse(JSON.stringify(fallback))
}

// Global Reactive State
const state = reactive({
  isAdmin: false, 
  currentUser: loadData(CURRENT_USER_KEY, null),
  users: loadData(USERS_STORAGE_KEY, defaultUsers),
  plants: ensurePlantReviews(loadData(PLANTS_STORAGE_KEY, initialPlants)),
  applications: loadData(APPLICATIONS_STORAGE_KEY, defaultApplications),
  speciesProposals: loadData(PROPOSALS_STORAGE_KEY, defaultProposals)
})

// Enrich initial plants with sample community reviews (BR C.3)
function ensurePlantReviews(plants) {
  return plants.map(plant => {
    // If plant image is missing or empty, assign a vibrant native wildflower photo
    if (!plant.imageUrl || plant.imageUrl.trim() === '') {
      plant.imageUrl = 'https://www.gardensonline.com.au/Uploads/Product/5879/Chrysocephalum-Apiculatum-1b.jpg'
    }
    
    if (!plant.reviews || plant.reviews.length === 0) {
      // Provide two default authentic Melbourne gardening reviews
      plant.reviews = [
        {
          id: `rev-${plant.id}-1`,
          userName: 'Marcus Chen',
          userRole: 'Resident',
          rating: 5,
          comment: 'Thriving wonderfully in Clayton clay soil. Attracted native bees within weeks!',
          date: '2026-08-28'
        },
        {
          id: `rev-${plant.id}-2`,
          userName: 'Emily Watson',
          userRole: 'Resident',
          rating: 4,
          comment: 'Very hardy indigenous species. Survived Melbourne winter frost without any protection.',
          date: '2026-08-30'
        }
      ]
    }
    return plant
  })
}

function saveAll() {
  localStorage.setItem(PLANTS_STORAGE_KEY, JSON.stringify(state.plants))
  localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(state.applications))
  localStorage.setItem(PROPOSALS_STORAGE_KEY, JSON.stringify(state.speciesProposals))
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(state.users))
  if (state.currentUser) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(state.currentUser))
  } else {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

export const plantStore = {
  state,

  // Section 1: User Authentication & Role-Based Control
  
  // 1. User login (supports email and password verification for any registered role)
  loginUser(email, password) {
    const user = state.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase())
    if (!user) {
      return { success: false, message: 'Account does not exist. Please check your email or register.' }
    }
    if (user.password !== password) {
      return { success: false, message: 'Incorrect password. Please try again.' }
    }
   // Login successful, update the current user's status
    state.currentUser = user
    state.isAdmin = (user.role === 'Administrator')
    saveAll()
    return { success: true, message: `Welcome back, ${user.fullName}! Logged in as ${user.role}.`, user }
  },
  // 2. New user registration (including role selection: Resident / Volunteer / Administrator)
  registerUser(userData) {
    const existing = state.users.find(u => u.email.toLowerCase() === userData.email.trim().toLowerCase())
    if (existing) {
      return { success: false, message: 'This email address is already registered. Please log in instead.' }
    }
    const newUser = {
      id: `user-${Date.now()}`,
      fullName: userData.fullName.trim(),
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      role: userData.role || 'Resident',
      createdAt: new Date().toLocaleDateString()
    }
    state.users.push(newUser)
    // Automatically log them in after successful registration
    state.currentUser = newUser
    state.isAdmin = (newUser.role === 'Administrator')
    saveAll()
    return { success: true, message: 'Registration successful! Welcome to Urban WildLink.', user: newUser }
  },
  // 3. User logs out
  logoutUser() {
    state.currentUser = null
    state.isAdmin = false
    saveAll()
  },

  // Section 2: Resident Adoption Application Submission
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

  // Section 3: Resident Species Suggestion Submission
  submitSpeciesProposal(proposalData) {
    const newProposal = {
      id: `prop-${Date.now()}`,
      proposerName: proposalData.proposerName,
      email: proposalData.email,
      imageUrl: proposalData.imageUrl || '', 
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

  // Section 4: Nursery Inventory Stock Control
  restockPlant(plantId, amount = 5) {
    const plant = state.plants.find(p => p.id === plantId)
    if (plant) {
      plant.stock += amount
      saveAll()
      return plant.stock
    }
    return 0
  },

  // Section 5: Direct Species Registration
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

  // Reduce the inventory of specific plant seedlings (cannot be reduced to a negative number)
  reducePlantStock(plantId, amount = 1) {
    const plant = state.plants.find(p => p.id === plantId)
    if (plant) {
      plant.stock = Math.max(0, plant.stock - amount)
      saveAll()
      return plant.stock
    }
    return 0
  },
  // Completely delete a certain species variety
  deletePlant(plantId) {
    state.plants = state.plants.filter(p => p.id !== plantId)
    saveAll()
  },

  // Update the information of existing species
  updatePlant(updatedData) {
    const index = state.plants.findIndex(p => p.id === updatedData.id)
    if (index !== -1) {
      state.plants[index] = {
        ...state.plants[index],
        name: updatedData.name,
        scientificName: updatedData.scientificName,
        imageUrl: updatedData.imageUrl,
        category: updatedData.category,
        stock: parseInt(updatedData.stock) || 0,
        wildlifeBenefit: updatedData.wildlifeBenefit,
        description: updatedData.description
      }
      saveAll()
      return true
    }
    return false
  },

  // Section 6: Community Proposal Review Operations
  approveSpeciesProposal(proposalId) {
    const prop = state.speciesProposals.find(p => p.id === proposalId)
    if (prop && prop.status === 'Pending') {
      const newPlant = {
        id: `plant-${Date.now()}`,
        name: prop.plantName,
        scientificName: prop.scientificName,
        imageUrl: prop.imageUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRw2XaFC9xHD0cj1ofwdb-Jf34kpNzPLKFozGbWa-sy6A&s=10',
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

  // Section 7: Adoption Application Review Operations
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

  // Section 8: Dataset Reset Utility
  resetToDefault() {
    state.plants = ensurePlantReviews(JSON.parse(JSON.stringify(initialPlants)))
    state.applications = JSON.parse(JSON.stringify(defaultApplications))
    state.speciesProposals = JSON.parse(JSON.stringify(defaultProposals))
    saveAll()
  },

  // Section 9: Aggregated Rating & Community Reviews
  // 1. Dynamically calculate aggregated average rating and total review count
  getPlantRating(plant) {
    if (!plant || !plant.reviews || plant.reviews.length === 0) {
      return { average: '0.0', count: 0 }
    }
    // Sum all user star ratings
    const totalStars = plant.reviews.reduce((acc, rev) => acc + Number(rev.rating), 0)
    const avgScore = (totalStars / plant.reviews.length).toFixed(1)
    return { average: avgScore, count: plant.reviews.length }
  },

  // 2. Submit new plant rating review and persist to LocalStorage
  addPlantReview(plantId, reviewData) {
    const plant = state.plants.find(p => p.id === plantId)
    if (!plant) {
      return { success: false, message: 'Target species not found.' }
    }
    if (!plant.reviews) {
      plant.reviews = []
    }
    // Construct new review record
    const newReview = {
      id: `rev-${Date.now()}`,
      userName: reviewData.userName,
      userRole: reviewData.userRole || 'Resident',
      rating: Number(reviewData.rating),
      comment: reviewData.comment.trim(),
      date: new Date().toISOString().split('T')[0]
    }
    plant.reviews.unshift(newReview)
    saveAll()
    return { success: true, message: 'Review and rating submitted successfully!' }
  },

  // Section 9: Real-Time Summary Metric Getters
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