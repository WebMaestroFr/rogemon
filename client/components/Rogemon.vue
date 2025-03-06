<template>
  <img src="/img/rogemon.png" alt="Rogémon" @click="toggleAudio" />
</template>

<script setup lang="ts">
const audio = new Audio('audio/theme.mp3')
const toggleAudio = () => audio.paused ? audio.play() : audio.pause();
</script>

<style scoped>
img {
  width: 250px;
  cursor: pointer;
}
</style>
