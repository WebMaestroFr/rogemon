<template>
  <AuthSignIn v-if="!auth.getToken()" />
  <template v-else>
    <nav>
      <Rogemon />
      <span>
        <RouterLink to="/">
          <img
            src="/icons/collection.png"
            :style="{ opacity: route.path === '/' ? 1 : 0.6 }"
            title="Rogédex"
          />
        </RouterLink>
        <RouterLink to="/jonatrade">
          <img
            src="/icons/trade.png"
            :style="{ opacity: route.path === '/jonatrade' ? 1 : 0.6 }"
            title="Jonatrade"
          />
        </RouterLink>
        <RouterLink to="/profiles">
          <img
            src="/icons/friends.png"
            :style="{ opacity: route.path === '/profiles' ? 1 : 0.6 }"
            title="Friends"
          />
        </RouterLink>
      </span>
      <AuthProfile />
    </nav>
    <img src="/img/splitter.png" class="splitter" />
    <RouterView />
  </template>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import auth from './stores/auth'

import Rogemon from './components/Rogemon.vue'
import AuthProfile from './components/Auth/AuthProfile.vue'
import AuthSignIn from './components/Auth/AuthSignIn.vue'

const route = useRoute()
</script>

<style scoped>
nav {
  display: flex;
  justify-content: space-between;
  white-space: nowrap;
}

@media (max-width: 600px) {
  nav {
    flex-direction: column;
    align-items: center;
  }

  nav span {
    position: fixed;
    bottom: 0;
    background: #e5f0f2;
    width: 100%;
    z-index: 2;
    box-shadow: 0 0px 40px #99adc6;
  }

  nav span img {
    width: auto;
    height: 60px;
  }

  .authProfile {
    display: none;
  }
}
</style>
