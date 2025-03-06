<template>
  <div>
    <h2><img :src="'/img/' + expansionId + '_en.png'" :alt="name" /></h2>
    <div>
      <Counter :rarity="['◊', '◊◊', '◊◊◊', '◊◊◊◊']" icon="/img/diamond.png" :cards="cards" :countMap="countMap" />
      <Counter :rarity="['☆', '☆☆', '☆☆☆']" icon="/img/star.png" :cards="cards" :countMap="countMap" />
      <Counter :rarity="['♕', 'Crown Rare']" icon="/img/crown.png" :cards="cards" :countMap="countMap" />
    </div>
    <div class="fillers">
      <Counter :rarity="['◊']" icon="/img/diamond.png" :cards="cards" :countMap="countMap" @click="fill('◊')" />
      <Counter :rarity="['◊◊']" icon="/img/diamond.png" :cards="cards" :countMap="countMap" @click="fill('◊◊')" />
      <Counter :rarity="['◊◊◊']" icon="/img/diamond.png" :cards="cards" :countMap="countMap" @click="fill('◊◊◊')" />
      <Counter :rarity="['◊◊◊◊']" icon="/img/diamond.png" :cards="cards" :countMap="countMap" @click="fill('◊◊◊◊')" />
    </div>
    <div>
      <Counter :rarity="['☆']" icon="/img/star.png" :cards="cards" :countMap="countMap" />
      <Counter :rarity="['☆☆']" icon="/img/star.png" :cards="cards" :countMap="countMap" />
      <Counter :rarity="['☆☆☆']" icon="/img/star.png" :cards="cards" :countMap="countMap" />
    </div>
    <div class="cards">
      <CollectionCard v-for="card in cards" :key="card.id" :card="card" :count="countMap[card.id] || 0"
        class="collection__card" @increase="() => increaseCardRecord(card.id)"
        @decrease="() => decreaseCardRecord(card.id)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { ExpansionId, ICard, ICollectionCount } from '../../env'
import { setCardCount } from '@client/stores/card'
import { loadCollection } from '@client/stores/collection'
import CollectionCard from './CollectionCard.vue'
import Counter from './Counter.vue'

const props = defineProps<{ expansionId: ExpansionId; name: string }>()
const cards = ref<ICard[]>([])
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

function fill(rarity: string) {
  cards.value.filter(c => c.rarity === rarity).forEach(c => !countMap.value[c.id] && increaseCardRecord(c.id))
}
</script>

<style scoped>
.fillers div {
  cursor: pointer;
}

.cards {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  padding: 1rem 0;
  max-width: 750px;
  margin: auto;
}
</style>
