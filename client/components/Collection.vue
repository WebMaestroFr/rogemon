<template>
  <div class="collection">
    <h2>{{ name }}</h2>
    <div class="collection__cards">
      <CollectionCard
        v-for="card in cards"
        :key="card.id"
        :card="card"
        :count="countMap[card.id] || 0"
        class="collection__card"
        @increase="() => increaseCardRecord(card.id)"
        @decrease="() => decreaseCardRecord(card.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { ExpansionId, ICard, ICollectionCount } from '../../env'
import { setCardCount } from '@client/stores/card'
import { loadCollection } from '@client/stores/collection'
import CollectionCard from './CollectionCard.vue'

const props = defineProps<{ expansionId: ExpansionId; name: string }>()
const cards = ref<ICard[]>()
const countMap = ref<ICollectionCount>({})

onMounted(async () => {
  const cardsResponse = await fetch(`cards/${props.expansionId}.json`)
  cards.value = await cardsResponse.json()
  countMap.value = await loadCollection(props.expansionId)
})

function increaseCardRecord(cardId: string) {
  if (countMap.value[cardId] === undefined || countMap.value[cardId] === -1) {
    countMap.value[cardId] = 1
  } else if (cardId in countMap.value) {
    countMap.value[cardId] += 1
  }
  setCardCount(props.expansionId, cardId, countMap.value[cardId])
}
function decreaseCardRecord(cardId: string) {
  if (countMap.value[cardId] === -1) {
    countMap.value[cardId] = 0
  } else if (countMap.value[cardId] === undefined || countMap.value[cardId] <= 1) {
    countMap.value[cardId] = -1
  } else {
    countMap.value[cardId] -= 1
  }
  setCardCount(props.expansionId, cardId, countMap.value[cardId])
}
</script>

<style scoped>
.collection__cards {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  padding: 1rem 0;
}
.collection__card__buttons {
  display: flex;
  gap: 0.4rem;
  justify-content: center;
}
.collection__card__buttons button {
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
.collection__card__button-decrease {
  color: red;
  background-color: white;
}
.collection__card__button-decrease--on {
  color: white;
  background-color: red;
}
.collection__card__button-increase {
  color: green;
  background-color: white;
}
.collection__card__button-increase--on {
  color: white;
  background-color: green;
}
</style>
