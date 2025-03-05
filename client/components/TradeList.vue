<template>
  <div class="trade-list">
    <div class="trade-list__email" v-if="trades" v-for="email in Object.keys(trades)" :key="email">
      <h2>{{ email }}</h2>
      <Trade v-for="trade in trades[email]" :key="trade.key" :trade="trade" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { loadTrades } from '@client/stores/trade'
import type { ITrade } from '../../env'

import Trade from './Trade.vue'

const props = defineProps<{ emails: string[] }>()
const trades = ref<{ [email: string]: ITrade[] }>()

onMounted(async () => {
  trades.value = await loadTrades(props.emails)
})
</script>

<style scoped>
.trade-list {
  display: flex;
  gap: 2rem;
  padding: 1rem 0;
}
.trade-list__email {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 0;
}
</style>
