<template>
  <AuthSignIn v-if="!auth.getToken()" />
  <template v-else>
    <nav>
      <Rogemon />
      <span>
        <RouterLink to="/">
          <img src="/img/collection.png" :style="{ opacity: route.path === '/' ? 1 : 0.6 }" title="Rogédex" />
        </RouterLink>
        <RouterLink to="/jonatrade">
          <img src="/img/trade.png" :style="{ opacity: route.path === '/jonatrade' ? 1 : 0.6 }" title="Jonatrade" />
        </RouterLink>
      </span>
      <AuthProfile />
    </nav>
    <RouterView />
  </template>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import auth from './stores/auth'

import Rogemon from './components/Rogemon.vue'
import AuthProfile from './components/Auth/AuthProfile.vue'
import AuthSignIn from './components/Auth/AuthSignIn.vue'

const route = useRoute();
</script>

<style scoped>
nav {
  display: flex;
  justify-content: space-between;
}

@media (max-width: 600px) {
  nav {
    flex-direction: column;
    align-items: center;
  }

  span img {
    height: 80px
  }

  .authProfile {
    display: none;
  }
}
</style>
