<template>
  <div v-if="userCard && otherCard" class="trade">
    <Card :card="userCard" />
    <span class="trade__arrow">⇔</span>
    <Card :card="otherCard" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { loadCard } from '@client/stores/card'
import type { ITrade, ICard } from '../../env'
import Card from './Card.vue'

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
