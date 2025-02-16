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
import Card from '@/components/Card.vue'
import {
  type CardCount,
  getCollectionCount,
  loadCollectionCount,
  setCardCount,
} from '@/store/cardCounts'
import type { ICard } from '@/types'

const props = defineProps<{ id: string; name: string }>()
const cards = ref<ICard[]>()
const records = ref<CardCount>({})

onMounted(async () => {
  const cardsResponse = await fetch(`cards/${props.id}.json`)
  cards.value = await cardsResponse.json()
  const cardCountResponse = await loadCollectionCount(props.id)
  if (cardCountResponse) records.value = cardCountResponse.count
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
