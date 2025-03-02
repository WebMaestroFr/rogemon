<template>
  <div class="card">
    <img v-if="showImage" class="card__image" :src="card.image" :alt="card.name" />
    <h3 v-else class="card__id">{{ String(card.id).padStart(3, '0') }}</h3>
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { ICard } from '@/types'

const props = defineProps({
  card: {
    type: Object as PropType<ICard>,
    required: true,
  },
  showImage: {
    type: Boolean,
    default: true,
  },
})
</script>

<style scoped>
.card {
  position: relative;
  aspect-ratio: 367/512;
  box-shadow:
    inset 0.2rem 0.2rem 0.4rem rgba(0, 0, 0, 0.2),
    inset -0.2rem -0.2rem 0.4rem rgba(255, 255, 255, 0.8);
  border-radius: 0.2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0.8em 0.4em;
  background-size: cover;
  gap: 0.5em;
  min-height: 256px;
  max-height: 512px;
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
  color: #888;
}
</style>
