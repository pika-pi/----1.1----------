import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import TransportCodeGenerator from '../components/TransportCodeGenerator.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/barcode',
    name: 'Barcode',
    component: () => import('../components/BarcodeGenerator.vue')
  },
  {
    path: '/batch',
    name: 'Batch',
    component: () => import('../components/BatchBarcodeGenerator.vue')
  },
  {
    path: '/transport',
    name: 'Transport',
    component: TransportCodeGenerator
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 