<template>
  <div class="collection">
    <img src="/img/splitter.png" class="splitter" />
    <h2>
      <img :src="'/img/' + expansionId + '_en.png'" :alt="name" />
      <img v-if="hasMedal" src="/img/medal.png" class="medal" />
    </h2>
    <div class="counters">
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
          v-else
          :rarity="['♕', 'Crown Rare']"
          icon="/icons/crown.png"
          :cards="cards"
          :count-map="countMap"
        />
      </div>
      <div>
        <Counter :rarity="['☆']" icon="/icons/star.png" :cards="cards" :count-map="countMap" />
        <Counter :rarity="['☆☆']" icon="/icons/star.png" :cards="cards" :count-map="countMap" />
        <Counter :rarity="['☆☆☆']" icon="/icons/star.png" :cards="cards" :count-map="countMap" />
      </div>
      <div v-if="hasShinies">
        <Counter
          v-if="hasShinies"
          :rarity="['✵']"
          icon="/icons/shiny.png"
          :cards="cards"
          :count-map="countMap"
        />
        <Counter
          v-if="hasShinies"
          :rarity="['✵✵']"
          icon="/icons/shiny.png"
          :cards="cards"
          :count-map="countMap"
        />
        <Counter
          v-if="hasShinies"
          :rarity="['♕', 'Crown Rare']"
          icon="/icons/crown.png"
          :cards="cards"
          :count-map="countMap"
        />
      </div>
    </div>
    <div class="best-cards">
      <Card v-for="card in bestCards" :key="card.id" :card="card" :show-image="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { ExpansionId, ICard, ICollectionCount } from '../../env'
import { loadCollectionByUsername } from '@client/stores/collection'
import Counter from './Counter.vue'
import Card from './Card.vue'

const props = defineProps<{ expansionId: ExpansionId; name: string; username: string }>()
const cards = ref<ICard[]>([])
const countMap = ref<ICollectionCount>({})

onMounted(async () => {
  const cardsResponse = await fetch(`../cards/${props.expansionId}.json`)
  cards.value = await cardsResponse.json()
  countMap.value = await loadCollectionByUsername(props.expansionId, props.username)
})

const rarity = ['◊', '◊◊', '◊◊◊', '◊◊◊◊']
const baseCards = computed(() => cards.value.filter((c) => rarity.includes(c.rarity)))

const obtainedCards = computed(() => {
  const obtained = Object.entries(countMap.value)
    .filter(([_, count]) => count > 0)
    .map(([id, _]) => id)
  return cards.value.filter((c) => obtained.includes(c.id))
})

const bestCards = computed(() => {
  return obtainedCards.value.slice(Math.max(obtainedCards.value.length - 10, 0)).reverse()
})

const hasMedal = computed(() => baseCards.value.every((c) => obtainedCards.value.includes(c)))
const hasShinies = computed(() => cards.value.some((c) => c.rarity === '✵'))
</script>

<style scoped>
.medal {
  width: 40px;
  position: absolute;
  margin-left: -20px;
  margin-top: -20px;
}

.counters {
  margin-top: 10px;
}

.best-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin: 20px 0;
}

.best-cards div {
  width: 9%;
}

@media (max-width: 600px) {
  img {
    height: 50px;
  }

  .medal {
    width: 30px;
    height: 30px;
  }

  .best-cards div {
    width: 18%;
  }
}
</style>
