<template>
  <div class="collection">
    <h2>{{ props.name }}</h2>
    <div class="collection__cards">
      <Card
        v-for="card in cards"
        :key="card.id"
        class="collection__card"
        :card="card"
        :count="records[card.id]"
        @increase="() => increaseCardRecord(card.id)"
        @decrease="() => decreaseCardRecord(card.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { ICard } from '../../types'
import Card from './Card.vue'
import { type CardCounts, getCardCounts, setCardCount } from '../store/cardCounts'

const props = defineProps<{ id: string; name: string }>()
const cards = ref<ICard[]>()
const initialCounts = getCardCounts(props.id)
const records = ref<CardCounts>(initialCounts)

onMounted(async () => {
  const response = await fetch(`cards/${props.id}.json`)
  cards.value = await response.json()
})

function increaseCardRecord(cardId: string) {
  const cardRecord = records.value[cardId]
  if (cardRecord === undefined || cardRecord === -1) {
    records.value[cardId] = 1
  } else {
    records.value[cardId] += 1
  }
  setCardCount(props.id, cardId, records.value[cardId])
}
function decreaseCardRecord(cardId: string) {
  const cardRecord = records.value[cardId]
  if (cardRecord === -1) {
    records.value[cardId] = 0
  } else if (cardRecord === undefined || cardRecord <= 1) {
    records.value[cardId] = -1
  } else {
    records.value[cardId] -= 1
  }
  setCardCount(props.id, cardId, records.value[cardId])
}
</script>

<style scoped>
.collection__cards {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  padding: 1rem 0;
}
</style>
