<template>
  <div class="tradeList">
    <Trade v-for="trade in trades" :key="trade.key" class="tradeList__trade" :trade="trade" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Trade from '@/components/Trade.vue'
import { type ITrade, loadTrades } from '@/store/trade'

const props = defineProps<{ userEmails: string[] }>()
const trades = ref<ITrade[]>()

onMounted(async () => {
  trades.value = await loadTrades(props.userEmails)
})
</script>

<style scoped>
.tradeList {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 0;
}
</style>
