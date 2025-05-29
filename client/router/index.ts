import { createRouter, createWebHistory } from 'vue-router'

import RogedexView from '../views/RogedexView.vue'
import JonatradeView from '../views/JonatradeView.vue'
import ProfileView from '../views/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'rogedex',
      component: RogedexView,
    },
    {
      path: '/jonatrade',
      name: 'jonatrade',
      component: JonatradeView,
    },
    {
      path: '/profile/:username',
      name: 'profile',
      component: ProfileView,
      props: true,
    },
  ],
})

export default router
