import { createRouter, createWebHistory } from 'vue-router'

import RogedexView from '../views/RogedexView.vue'
import JonatradeView from '../views/JonatradeView.vue'
import ProfileView from '../views/ProfileView.vue'
import ProfilesView from '../views/ProfilesView.vue'

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
      path: '/profiles/:username',
      name: 'profile',
      component: ProfileView,
      props: true,
    },
    {
      path: '/profiles',
      name: 'profiles',
      component: ProfilesView,
    },
  ],
})

export default router
