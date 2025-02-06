<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header class="app__header">
    <h1>Rogédex</h1>
    <nav class="app__nav">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </header>
  <RouterView />
</template>

<style scoped>
.app__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}
.app__nav {
  display: flex;
  gap: 0 1rem;
  padding: 1rem 0;
}
</style>
