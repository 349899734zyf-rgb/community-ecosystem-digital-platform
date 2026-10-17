/**
 * mockData.js
 * Initial seed datasets for local application state and offline fallback.
 * Contains default adoption applications, community species proposals, and multi-role accounts.
 */

export const defaultApplications = [
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

export const defaultProposals = [
  {
    id: 'prop-201',
    proposerName: 'Marcus Chen',
    email: 'marcus.chen@student.monash.edu',
    plantName: 'Common Everlasting',
    scientificName: 'Chrysocephalum apiculatum',
    imageUrl: 'https://www.gardensonline.com.au/Uploads/Product/5879/Chrysocephalum-Apiculatum-1b.jpg',
    category: 'Wildflower',
    wildlifeBenefit: 'Native Hoverflies & Small Bees',
    reason: 'Hardy local butterfly host plant suited for Clayton clay soils.',
    status: 'Pending',
    submittedAt: '2026-08-26 09:40'
  }
]

export const defaultUsers = [
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
