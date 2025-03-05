<template>
  <div class="tradeGroup">
    <div>
      <ExpansionCard
        v-for="card in ask"
        :key="`${card.expansionId}-${card.cardId}`"
        :expansion-id="card.expansionId"
      />
    </div>
    <span class="tradeGroup__arrow">⇔</span>
    <div>
      <ExpansionCard
        v-for="card in offer"
        :key="`${card.expansionId}-${card.cardId}`"
        :expansion-id="card.expansionId"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ITradeCard } from '../../env'
import type ExpansionCard from './ExpansionCard.vue'

defineProps<{ ask: ITradeCard[]; offer: ITradeCard[] }>()
</script>

<style scoped>
.tradeGroup {
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
}
.tradeGroup__arrow {
  font-size: 6em;
  line-height: 0;
}
</style>
