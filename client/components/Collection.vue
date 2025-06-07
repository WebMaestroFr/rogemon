<template>
  <div class="collection">
    <h2>
      <img :src="'/img/' + expansionId + '_en.png'" :alt="name" />
      <img v-if="hasMedal" src="/img/medal.png" class="medal" />
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
        @own="() => markOwn(card.id)"
        @miss="() => markMiss(card.id)"
        @ask="() => markAsk(card.id)"
        @offer="() => markOffer(card.id)"
      />
    </div>
    <img src="/img/splitter.png" class="splitter" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { ExpansionId, ICard, ICollection } from '../../env'
import { setCardCount, setCardStatus } from '@client/stores/card'
import { getUserCollection, loadUserCollection } from '@client/stores/collection'
import CollectionCard from './CollectionCard.vue'
import Counter from './Counter.vue'

const props = defineProps<{ expansionId: ExpansionId; name: string }>()

const initialCollection = getUserCollection(props.expansionId)

const cards = ref<ICard[]>([])
const countMap = ref<ICollection['countMap']>(initialCollection.countMap)
const statusMap = ref<ICollection['statusMap']>(initialCollection.statusMap)

const emit = defineEmits(['loaded'])

onMounted(async () => {
  const cardsResponse = await fetch(`cards/${props.expansionId}.json`)
  cards.value = await cardsResponse.json()
  const collection = await loadUserCollection(props.expansionId)
  countMap.value = collection.countMap
  statusMap.value = collection.statusMap
  emit('loaded')
})

function markOwn(cardId: string) {
  countMap.value[cardId] = 1
  setCardCount(props.expansionId, cardId, countMap.value[cardId])
}

function markMiss(cardId: string) {
  countMap.value[cardId] = 0
  setCardCount(props.expansionId, cardId, countMap.value[cardId])
}

function markAsk(cardId: string) {
  if (statusMap.value[cardId] === 'ask') {
    statusMap.value[cardId] = null
  } else {
    statusMap.value[cardId] = 'ask'
  }
  setCardStatus(props.expansionId, cardId, statusMap.value[cardId])
}

function markOffer(cardId: string) {
  if (statusMap.value[cardId] === 'offer') {
    statusMap.value[cardId] = null
  } else {
    statusMap.value[cardId] = 'offer'
  }
  setCardStatus(props.expansionId, cardId, statusMap.value[cardId])
}

function fill(rarity: string) {
  const cardsToFill = cards.value.filter(
    (card) => card.rarity === rarity && !statusMap.value[card.id],
  )
  if (cardsToFill.length === 0) {
    return
  }
  const isComplete = cardsToFill.every((card) => countMap.value[card.id] > 0)
  if (isComplete) {
    if (window.confirm(`Are you sure to mark all ${rarity} cards as missing?`)) {
      cardsToFill.forEach((card) => (countMap.value[card.id] = 0))
    }
  } else if (window.confirm(`Are you sure to mark all ${rarity} cards as owned?`)) {
    cardsToFill.forEach((card) => !countMap.value[card.id] && markOwn(card.id))
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

const rarity = ['◊', '◊◊', '◊◊◊', '◊◊◊◊']
const baseCards = computed(() => cards.value.filter((c) => rarity.includes(c.rarity)))

const obtainedCards = computed(() => {
  const obtained = Object.entries(countMap.value)
    .filter(([_, count]) => count > 0)
    .map(([id, _]) => id)
  return cards.value.filter((c) => obtained.includes(c.id))
})

const hasShinies = computed(() => cards.value.some((c) => c.rarity === '✵'))
const hasMedal = computed(() => baseCards.value.every((c) => obtainedCards.value.includes(c)))
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

.medal {
  width: 40px;
  position: absolute;
  margin-left: -20px;
  margin-top: -20px;
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

.collection:last-child .scroller,
.collection:last-child .splitter {
  visibility: hidden;
}

@media (max-width: 600px) {
  img {
    height: 50px;
  }

  .medal {
    width: 30px;
    height: 30px;
  }
}
</style>
