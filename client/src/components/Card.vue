<template>
  <div class="card">
    <img v-if="props.count > 0" class="card__image" :src="props.card.image" :alt="card.name" />
    <h3 v-else class="card__id">{{ String(props.card.id).padStart(3, '0') }}</h3>
    <div class="card__buttons">
      <button
        :class="[
          'card__button-decrease',
          props.count === -1 ? 'card__button-decrease--on' : 'card__button-decrease--off',
        ]"
        @click="$emit('decrease')"
      >
        {{ props.count > 0 ? '-' : '✗' }}
      </button>
      <button
        :class="[
          'card__button-increase',
          props.count > 2 ? 'card__button-increase--on' : 'card__button-increase--off',
        ]"
        @click="$emit('increase')"
      >
        {{ props.count > 0 ? `×${props.count}` : '✓' }}
      </button>
    </div>
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
  count: {
    type: Number,
    default: 0,
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
}
.card__image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.5;
}
.card__id {
  font-size: 2em;
  font-weight: bold;
  color: #888;
}
.card__buttons {
  display: flex;
  gap: 0.4rem;
  justify-content: center;
}
.card__buttons button {
  border: none;
  border-radius: 50%;
  padding: 0;
  text-align: center;
  width: 2.4rem;
  height: 2.4rem;
  cursor: pointer;
  font-size: 1.6rem;
  box-shadow: 0.1rem 0.1rem 0.2rem rgba(0, 0, 0, 0.2);
}
.card__button-decrease {
  color: red;
  background-color: white;
}
.card__button-decrease--on {
  color: white;
  background-color: red;
}
.card__button-increase {
  color: green;
  background-color: white;
}
.card__button-increase--on {
  color: white;
  background-color: green;
}
</style>
