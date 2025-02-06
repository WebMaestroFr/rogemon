import { createRouter, createWebHistory } from 'vue-router'
import RogedexView from '../views/RogedexView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'rogedex',
      component: RogedexView,
      // component: () => import('../views/RogedexView.vue'),
    },
  ],
})

export default router
