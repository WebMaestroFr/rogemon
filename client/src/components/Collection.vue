<template>
  <div class="collection">
    <h2>{{ props.name }}</h2>
    <div class="collection__cards">
      <Card v-for="card in cards" :key="card.id" class="collection__card" :card="card" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { ICard } from '../../types'
import Card from '@/components/Card.vue'

const props = defineProps<{ id: string; name: string }>()
const cards = ref<ICard[]>()

onMounted(async () => {
  const response = await fetch(`cards/${props.id}.json`)
  cards.value = await response.json()
})
</script>

<style scoped>
.collection__cards {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  padding: 1rem 0;
}
</style>
