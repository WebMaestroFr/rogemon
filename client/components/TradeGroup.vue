<template>
  <div class="tradeGroup">
    <div
      v-if="ask.length"
      :class="{ stacked, clickable: ask.length > 1 }"
      @click="stacked = !stacked"
    >
      <ExpansionCard
        v-for="card in ask"
        :key="card.cardId"
        :card-id="card.cardId"
        :expansion-id="card.expansionId"
      />
    </div>
    <Card v-else :show-image="false" />
    <img src="/icons/trade_arrows.png" />
    <div
      v-if="offer.length"
      :class="{ stacked, clickable: offer.length > 1 }"
      @click="stacked = !stacked"
    >
      <ExpansionCard
        v-for="card in offer"
        :key="card.cardId"
        :card-id="card.cardId"
        :expansion-id="card.expansionId"
      />
    </div>
    <Card v-else :show-image="false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ITradeCard } from '../../env'
import ExpansionCard from './ExpansionCard.vue'
import Card from './Card.vue'

defineProps<{ ask: ITradeCard[]; offer: ITradeCard[] }>()
const stacked = ref(true)
</script>

<style scoped>
.tradeGroup {
  display: flex;
  position: relative;
  justify-content: center;
  align-items: start;
}

img {
  width: 38px;
  margin-top: 58px;
  opacity: 0.6;
}

.clickable {
  cursor: pointer;
}

.stacked > div:not(:first-child) {
  margin-top: -140px;
}

.card {
  height: 150px;
  margin-bottom: 8px;
  z-index: 1;
}
</style>
