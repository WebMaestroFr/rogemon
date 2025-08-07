<template>
  <div class="hollow" :class="{ full: isFull }">
    <img v-for="i in rarity[0].length" :key="i" :src="icon" />
    <span>{{ count }} / <small v-text="filteredCards.length" /></span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ICard, ICollection } from '../../env'

const props = defineProps<{
  rarity: string[]
  icon: string
  cards: ICard[]
  countMap: ICollection['countMap']
}>()

const filteredCards = computed(() => props.cards.filter((c) => props.rarity.includes(c.rarity)))

const count = computed(() => {
  const ids = filteredCards.value.map((c) => c.id)
  return Object.entries(props.countMap).filter(([id, count]) => ids.includes(id) && count > 0)
    .length
})

const isFull = computed(() => count.value === filteredCards.value.length)
</script>

<style scoped>
span,
small {
  font-weight: bold;
}

.full {
  background: #cfdbe0;
}

@media (max-width: 600px) {
  .hollow {
    font-size: 0.8rem;
    line-height: 1rem;
    padding: 1px 6px;
  }

  .hollow span {
    padding-left: 4px;
  }

  .hollow img {
    height: 0.7rem;
    margin-top: 2px;
  }
}
</style>
