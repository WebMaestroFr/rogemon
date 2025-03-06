<template>
  <AuthSignIn v-if="!auth.getToken()" />
  <template v-else>
    <nav>
      <Rogemon />
      <img src="/img/splitter.png" class="splitter" />
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

.splitter {
  display: none;
}

@media (max-width: 600px) {
  .splitter {
    position: fixed;
    bottom: 60px;
    display: block;
    width: 100%;
  }

  nav {
    flex-direction: column;
    align-items: center;
  }

  nav span {
    position: fixed;
    bottom: 0;
    background: #e8f1f8;
    width: 100%;
    z-index: 2;
  }

  span img {
    height: 60px
  }

  .authProfile {
    display: none;
  }
}
</style>
