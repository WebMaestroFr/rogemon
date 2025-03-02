<template>
  <div v-if="userCard && otherCard" class="trade">
    <Card :card="userCard" />
    <span class="trade__arrow">⇔</span>
    <Card :card="otherCard" />
  </div>
</template>

<script setup lang="ts">
import type { ICard, ITrade } from '@/types'

import Card from './Card.vue'
import { loadCard } from '@/store/card'
import { onMounted, ref } from 'vue'

const props = defineProps<{ trade: ITrade }>()
const userCard = ref<ICard>()
const otherCard = ref<ICard>()

onMounted(async () => {
  const [userTradeCard, otherTradeCard] = props.trade.cards
  userCard.value = await loadCard(userTradeCard.expansionId, userTradeCard.cardId)
  otherCard.value = await loadCard(otherTradeCard.expansionId, otherTradeCard.cardId)
})
</script>

<style scoped>
.trade {
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
}
.trade__arrow {
  font-size: 6em;
  line-height: 0;
}
</style>
