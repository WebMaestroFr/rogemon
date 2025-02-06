<template>
  <!-- <div class="card" :style="{ backgroundImage: `url(${props.card.image})` }"> -->
  <div class="card">
    <h3>{{ String(props.card.id).padStart(3, '0') }}</h3>
    <div class="card__buttons">
      <button>✗</button>
      <button>✓</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ICard } from '../../types'

const props = defineProps<{ card: ICard }>()
</script>

<style scoped>
.card {
  aspect-ratio: 2/3;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 0.2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0.5rem;
  background-size: cover;
}
.card__buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}
</style>
