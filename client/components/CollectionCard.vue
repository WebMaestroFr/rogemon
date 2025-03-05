<template>
  <Card class="collection-card" :card="card" :show-image="count > 0">
    <div class="collection-card__buttons">
      <button
        :class="[
          'collection-card__button-decrease',
          count === -1
            ? 'collection-card__button-decrease--on'
            : 'collection-card__button-decrease--off',
        ]"
        @click="$emit('decrease')"
      >
        {{ count > 0 ? '-' : '✗' }}
      </button>
      <button
        :class="[
          'collection-card__button-increase',
          count > 2
            ? 'collection-card__button-increase--on'
            : 'collection-card__button-increase--off',
        ]"
        @click="$emit('increase')"
      >
        {{ count > 0 ? `×${count}` : '✓' }}
      </button>
    </div>
  </Card>
</template>

<script setup lang="ts">
import type { ICard } from '../../env'
import Card from './Card.vue'

defineProps<{ card: ICard; count: number }>()
defineEmits(['decrease', 'increase'])
</script>

<style scoped>
.collection-card__buttons {
  display: flex;
  gap: 0.4rem;
  justify-content: center;
}
.collection-card__buttons button {
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
.collection-card__button-decrease {
  color: red;
  background-color: white;
}
.collection-card__button-decrease--on {
  color: white;
  background-color: red;
}
.collection-card__button-increase {
  color: green;
  background-color: white;
}
.collection-card__button-increase--on {
  color: white;
  background-color: green;
}
</style>
