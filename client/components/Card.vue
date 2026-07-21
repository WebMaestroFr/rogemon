<template>
  <div class="card" :class="{ shaded: showImage }">
    <img
      v-if="showImage && card"
      class="card__image"
      :src="card.image"
      :alt="card.name"
      loading="lazy"
    />
    <h3 v-else-if="card" class="card__id">{{ String(card.id).padStart(3, '0') }}</h3>
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { ICard } from '../../env'

const { showImage = true } = defineProps<{
  card?: ICard
  showImage: boolean
}>()
</script>

<style scoped>
.card {
  position: relative;
  aspect-ratio: 367/512;
  box-shadow:
    inset 0.2rem 0.2rem 0.4rem rgba(153, 173, 198, 0.4),
    inset -0.2rem -0.2rem 0.4rem rgba(255, 255, 255, 0.8);
  border-radius: 0.2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0.8em 0.4em;
  background-size: cover;
}

.card.shaded {
  box-shadow: 0 0 0.4rem rgba(153, 173, 198, 0.8);
}

.card__image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.card__id {
  font-size: 2em;
  font-weight: bold;
  color: #99adc6;
  margin-top: -50%;
}

@media (max-width: 600px) {
  .card__id {
    font-size: 1em;
  }
}
</style>
