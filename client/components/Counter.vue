<template>
  <div class="hollow">
    <img v-for="i in rarity[0].length" :src="icon" />
    <span>{{ count }} / <small v-text="filteredCards.length" /></span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ICard, ICollectionCount } from '../../env'

const props = defineProps<{
  rarity: string[],
  icon: string,
  cards: ICard[],
  countMap: ICollectionCount,
}>()

const filteredCards = computed(() => props.cards.filter(c => props.rarity.includes(c.rarity)));

const count = computed(() => {
  const ids = filteredCards.value.map(c => c.id);
  return Object.entries(props.countMap).filter(([id, count]) => ids.includes(id) && count > 0).length;
});
</script>

<style scoped>
span,
small {
  font-weight: bold;
}
</style>
