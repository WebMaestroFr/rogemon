<template>
  <AuthSignIn v-if="!auth.getToken()" />
  <template v-else>
    <nav>
      <Rogemon />
      <span>
        <RouterLink to="/">
          <img src="/icons/collection.png" :style="{ opacity: route.path === '/' ? 1 : 0.6 }" title="Rogédex" />
        </RouterLink>
        <RouterLink to="/jonatrade">
          <img src="/icons/trade.png" :style="{ opacity: route.path === '/jonatrade' ? 1 : 0.6 }" title="Jonatrade" />
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
  .splitter {
    display: block;
    width: 100%;
    margin: -10px 0 5px 0;
  }

  nav {
    flex-direction: column;
    align-items: center;
  }

  nav span {
    position: fixed;
    bottom: 0;
    background: #f4f7fa;
    width: 100%;
    z-index: 2;
    box-shadow: 0 0 0.4rem rgba(255, 255, 255, 0.8);
  }

  span img {
    height: 60px
  }

  .authProfile {
    display: none;
  }
}
</style>
