<template>
  <Card :card="card" :show-image="count > 0" @click="count ? empty() : $emit('increase')">
    <span v-if="status === 'ask'" class="round heart status" @click.stop="$emit('ask')" />
    <span v-else-if="status === 'offer'" class="round gift status" @click.stop="$emit('offer')" />
    <div v-if="!status && tradable.includes(card.rarity)" class="actions">
      <button class="round heart" @click.stop="$emit('ask')" />
      <button class="round gift" @click.stop="offer" />
    </div>
  </Card>
</template>

<script setup lang="ts">
import type { ICard } from '../../env'
import Card from './Card.vue'

const tradable = ['◊', '◊◊', '◊◊◊', '◊◊◊◊', '☆']

const props = defineProps<{ card: ICard; count: number; status: 'ask' | 'offer' | null }>()
const emit = defineEmits(['decrease', 'increase', 'ask', 'offer'])

function empty() {
  for (let i = 0; i < props.count; i++) emit('decrease')
  if (props.status === 'offer') emit('offer')
}

function offer() {
  emit('offer')
  if (!props.count) emit('increase')
}
</script>

<style scoped>
.card {
  cursor: pointer;
  min-width: 60px;
}

.card:hover .actions {
  opacity: 1;
}

.actions {
  position: absolute;
  top: 60%;
  left: 0;
  width: 100%;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.heart {
  background:
    url('/icons/heart.png') no-repeat,
    #fd619e;
}

.heart:not(.status) {
  margin-right: 10%;
}

.gift {
  background:
    url('/icons/gift.png') no-repeat,
    #8799b1;
}

.round {
  width: 32px;
  height: 32px;
  padding: 8px;
  border-radius: 50%;
  background-position: center center;
  background-size: 70%;
  cursor: pointer;
  box-shadow:
    0.1rem 0.1rem 0.2rem rgba(0, 0, 0, 0.1),
    -0.1rem -0.1rem 0.2rem rgba(0, 0, 0, 0.1),
    -0.1rem 0.1rem 0.2rem rgba(0, 0, 0, 0.1),
    0.1rem -0.1rem 0.2rem rgba(0, 0, 0, 0.1);
}

.status {
  position: absolute;
  top: 0;
  right: 0;
}

@media (max-width: 600px) {
  .actions {
    position: absolute;
    top: 60%;
    left: 0;
    width: 100%;
    opacity: 1;
  }
  .round {
    width: 20px;
    height: 20px;
    padding: 4px;
    margin: 0;
  }
}
</style>
