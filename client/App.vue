<template>
  <header class="app__header">
    <h1 @click="toggleAudio">Rogémon</h1>
    <nav class="app__nav">
      <RouterLink to="/">Rogédex</RouterLink>
      <RouterLink to="/jonatrade">Jonatrade</RouterLink>
    </nav>
    <AuthProfile v-if="auth.getToken()" />
    <AuthSignIn v-else />
  </header>
  <RouterView />
</template>

<script setup lang="ts">
import { onUnmounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import auth from './stores/auth'

import AuthProfile from './components/Auth/AuthProfile.vue'
import AuthSignIn from './components/Auth/AuthSignIn.vue'

const audio = new Audio('audio/theme.mp3')
onUnmounted(() => {
  audio.pause()
})
function toggleAudio() {
  if (audio.paused) {
    audio.play()
  } else {
    audio.pause()
  }
}
</script>

<style scoped>
.app__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}
.app__header h1 {
  cursor: pointer;
}
.app__nav {
  display: flex;
  gap: 0 1rem;
  padding: 1rem 0;
}
</style>
