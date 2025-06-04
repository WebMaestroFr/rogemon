<template>
  <div class="collection">
    <img src="/img/splitter.png" class="splitter" />
    <h2>
      <img :src="'/img/' + expansionId + '_en.png'" :alt="name" />
      <img src="/icons/down.png" class="scroller" @click="scrollToNext" />
    </h2>
    <div>
      <Counter
        :rarity="['◊', '◊◊', '◊◊◊', '◊◊◊◊']"
        icon="/icons/collection_diamond.png"
        :cards="cards"
        :count-map="countMap"
      />
      <Counter
        :rarity="['☆', '☆☆', '☆☆☆']"
        icon="/icons/collection_star.png"
        :cards="cards"
        :count-map="countMap"
      />
      <Counter
        v-if="hasShinies"
        :rarity="['✵', '✵✵']"
        icon="/icons/collection_shiny.png"
        :cards="cards"
        :count-map="countMap"
      />
      <Counter
        :rarity="['♕', 'Crown Rare']"
        icon="/icons/crown.png"
        :cards="cards"
        :count-map="countMap"
      />
    </div>
    <div class="fillers">
      <Counter
        :rarity="['◊']"
        icon="/icons/diamond.png"
        :cards="cards"
        :count-map="countMap"
        @click="fill('◊')"
      />
      <Counter
        :rarity="['◊◊']"
        icon="/icons/diamond.png"
        :cards="cards"
        :count-map="countMap"
        @click="fill('◊◊')"
      />
      <Counter
        :rarity="['◊◊◊']"
        icon="/icons/diamond.png"
        :cards="cards"
        :count-map="countMap"
        @click="fill('◊◊◊')"
      />
      <Counter
        :rarity="['◊◊◊◊']"
        icon="/icons/diamond.png"
        :cards="cards"
        :count-map="countMap"
        @click="fill('◊◊◊◊')"
      />
    </div>
    <div>
      <Counter :rarity="['☆']" icon="/icons/star.png" :cards="cards" :count-map="countMap" />
      <Counter :rarity="['☆☆']" icon="/icons/star.png" :cards="cards" :count-map="countMap" />
      <Counter :rarity="['☆☆☆']" icon="/icons/star.png" :cards="cards" :count-map="countMap" />
    </div>
    <div v-if="hasShinies">
      <Counter :rarity="['✵']" icon="/icons/shiny.png" :cards="cards" :count-map="countMap" />
      <Counter :rarity="['✵✵']" icon="/icons/shiny.png" :cards="cards" :count-map="countMap" />
    </div>
    <div class="cards">
      <CollectionCard
        v-for="card in cards"
        :key="card.id"
        :card="card"
        :count="countMap[card.id] || 0"
        :status="statusMap[card.id] || null"
        class="collection__card"
        @increase="() => increaseCardCount(card.id)"
        @decrease="() => decreaseCardCount(card.id)"
        @ask="() => askCard(card.id)"
        @offer="() => offerCard(card.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { ExpansionId, ICard, ICollection } from '../../env'
import { setCardCount, setCardStatus } from '@client/stores/card'
import { loadCollection } from '@client/stores/collection'
import CollectionCard from './CollectionCard.vue'
import Counter from './Counter.vue'
import { getCollection } from '@client/stores/collection'

const props = defineProps<{ expansionId: ExpansionId; name: string }>()

const initialCollection = getCollection(props.expansionId)

const cards = ref<ICard[]>([])
const countMap = ref<ICollection['countMap']>(initialCollection.countMap)
const statusMap = ref<ICollection['statusMap']>(initialCollection.statusMap)

onMounted(async () => {
  const cardsResponse = await fetch(`cards/${props.expansionId}.json`)
  cards.value = await cardsResponse.json()
  const collection = await loadCollection(props.expansionId)
  countMap.value = collection.countMap
  statusMap.value = collection.statusMap
})

function increaseCardCount(cardId: string) {
  if (!countMap.value[cardId]) {
    countMap.value[cardId] = 1
  } else {
    countMap.value[cardId] += 1
  }
  setCardCount(props.expansionId, cardId, countMap.value[cardId])
}

function decreaseCardCount(cardId: string) {
  if (!countMap.value[cardId]) {
    countMap.value[cardId] = 0
  } else {
    countMap.value[cardId] -= 1
  }
  setCardCount(props.expansionId, cardId, countMap.value[cardId])
}

function askCard(cardId: string) {
  if (statusMap.value[cardId] === 'ask') {
    statusMap.value[cardId] = null
  } else {
    statusMap.value[cardId] = 'ask'
  }
  setCardStatus(props.expansionId, cardId, statusMap.value[cardId])
}

function offerCard(cardId: string) {
  if (statusMap.value[cardId] === 'offer') {
    statusMap.value[cardId] = null
  } else {
    statusMap.value[cardId] = 'offer'
  }
  setCardStatus(props.expansionId, cardId, statusMap.value[cardId])
}

function fill(rarity: string) {
  if (window.confirm(`Are you sure to fill all ${rarity} cards?`)) {
    cards.value
      .filter((c) => c.rarity === rarity)
      .forEach((c) => !countMap.value[c.id] && increaseCardCount(c.id))
  }
}

function scrollToNext() {
  for (const h2 of document.querySelectorAll('h2')) {
    if (h2.offsetTop > window.scrollY + window.innerHeight) {
      window.scrollTo({ top: h2.offsetTop - 20, behavior: 'smooth' })
      return
    }
  }
}

const hasShinies = computed(() => cards.value.some((c) => c.rarity === '✵'))
</script>

<style scoped>
.collection {
  margin-bottom: 20px;
}

.fillers div {
  cursor: pointer;
}

.fillers div:hover {
  background-color: #cfdbe0;
}

.cards {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  padding: 1rem 0;
  max-width: 750px;
  margin: auto;
}

.splitter {
  margin: -50px 0 30px 0;
  width: 450px;
}

.scroller {
  float: right;
  width: 20px;
  height: 20px;
  margin-left: -20px;
  cursor: pointer;
  opacity: 0.6;
}

.scroller:hover {
  opacity: 1;
}

.collection:last-child .scroller {
  visibility: hidden;
}

@media (max-width: 600px) {
  .splitter {
    width: 100%;
    margin-top: -35px;
  }

  img {
    height: 50px;
  }
}
</style>
