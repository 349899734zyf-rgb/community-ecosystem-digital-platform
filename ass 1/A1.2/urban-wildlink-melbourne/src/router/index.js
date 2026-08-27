/**
 * References & Acknowledgements:
 * - Routing Architecture: Vue Router 4 (https://router.vuejs.org/)
 * - SPA History Mode: HTML5 createWebHistory API
 */

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CatalogView from '../views/CatalogView.vue'
import AdoptView from '../views/AdoptView.vue'
import AdminView from '../views/AdminView.vue'
import AboutView from '../views/AboutView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/catalog', name: 'catalog', component: CatalogView },
  { path: '/adopt', name: 'adopt', component: AdoptView },
  { path: '/admin', name: 'admin', component: AdminView },
  { path: '/about', name: 'about', component: AboutView }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router