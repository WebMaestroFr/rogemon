<template>
  <header class="app__header">
    <h1 @click="toggleAudio">Rogémon</h1>
    <!-- <nav class="app__nav">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav> -->
    <Auth />
  </header>
  <RouterView />
</template>

<script setup lang="ts">
import { onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import Auth from './components/Auth.vue'

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
  justify-content: center;
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
