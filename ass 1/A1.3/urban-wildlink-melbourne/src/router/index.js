/**
 * References & Acknowledgements:
 * - Routing Architecture: Vue Router 4 (https://router.vuejs.org/)
 * - Role-Based Navigation Guards: router.beforeEach Hook Pattern (https://router.vuejs.org/guide/advanced/navigation-guards.html)
 * - Purpose: Client-Side Routing and Role-Based Access Control (BR C.2)
 */

// Import Vue Router core modules
import { createRouter, createWebHistory } from 'vue-router'

// Import view components
import HomeView from '../views/HomeView.vue'
import CatalogView from '../views/CatalogView.vue'
import AdoptView from '../views/AdoptView.vue'
import AdminView from '../views/AdminView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'

// Import global reactive store to inspect active user role
import { plantStore } from '../store/plantStore'

// Define application route mapping table
const routes = [
  // 1. Home view route
  { path: '/', name: 'home', component: HomeView },

  // 2. Plant catalog view route
  { path: '/catalog', name: 'catalog', component: CatalogView },

  // 3. Plant adoption wizard route
  { 
    path: '/adopt', 
    name: 'adopt', 
    component: AdoptView,
    meta: { 
      requiresAuth: true,
      allowedRoles: ['Resident', 'Volunteer', 'Administrator']
    } 
  },

  // 4. User login route
  { path: '/login', name: 'login', component: LoginView },

  // 5. User registration route
  { path: '/register', name: 'register', component: RegisterView },

  // 6. Admin & Nursery console
  { 
    path: '/admin', 
    name: 'admin', 
    component: AdminView,
    meta: { 
      requiresAuth: true, 
      allowedRoles: ['Volunteer', 'Administrator'] 
    } 
  },

  // 7. About page route (Publicly accessible)
  { path: '/about', name: 'about', component: AboutView }
]

// Create Vue Router instance
const router = createRouter({
  // Use HTML5 Web History mode
  history: createWebHistory(),
  routes,
  // Scroll to top upon route transition
  scrollBehavior() {
    return { top: 0 }
  }
})

// Global before-each navigation guard: implement role-based access control (BR C.2)
router.beforeEach((to, from, next) => {
  // Check whether target route requires authentication
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  // Get allowed roles list from route metadata
  const allowedRoles = to.meta.allowedRoles
  
  // Retrieve currently authenticated user from plantStore
  const currentUser = plantStore.state.currentUser

  // Case 1: Route requires authentication, but user is not logged in
  if (requiresAuth && !currentUser) {
    // Redirect unauthenticated visitor to login page
    next({ path: '/login', query: { redirect: to.fullPath } })
    return
  }

  // Case 2: User is logged in, but their role lacks required permissions
  if (allowedRoles && currentUser && !allowedRoles.includes(currentUser.role)) {
    // Notify user of insufficient permissions and redirect safely
    alert(`Access Denied! You are currently signed in as [${currentUser.role}]. This page requires [${allowedRoles.join(', ')}] privileges.`)
    next({ path: '/catalog' })
    return
  }

  // Case 3: Authorization check passed, allow navigation
  next()
})

// Export router instance for main.js registration
export default router