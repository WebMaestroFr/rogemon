<template>
  <div class="collection">
    <img src="/img/splitter.png" class="splitter" />
    <h2>
      <img :src="'/img/' + expansionId + '_en.png'" :alt="name" /><img
        src="/icons/down.png"
        class="scroller"
        @click="scrollToNext"
      />
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
    <div class="cards">
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
  cards.value
    .filter((c) => c.rarity === rarity)
    .forEach((c) => !countMap.value[c.id] && increaseCardRecord(c.id))
}

function scrollToNext() {
  for (const h2 of document.querySelectorAll('h2')) {
    if (h2.offsetTop > window.scrollY + window.innerHeight) {
      document.querySelector('#app')!.scrollTo({ top: h2.offsetTop - 20, behavior: 'smooth' })
      return
    }
  }
}
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
  margin-top: 10px;
  margin-left: -20px;
  cursor: pointer;
  opacity: 0.6;
}

.scroller:hover {
  opacity: 1;
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
