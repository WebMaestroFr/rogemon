<template>
  <div v-if="tradesByEmail" class="trade-list">
    <div
      v-for="[email, tradesByRarity] in tradesByEmail.entries()"
      :key="email"
      class="trade-list__email"
    >
      <h2>{{ email }}</h2>
      <div v-for="[rarity, tradeGroups] in tradesByRarity.entries()" :key="rarity">
        <h3>{{ rarity }}</h3>
        <TradeGroup v-bind="tradeGroups" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { listTradesByEmail } from '@client/stores/trade'
import type { ITradeEmailMap } from '../../env'
import type TradeGroup from './TradeGroup.vue'

const props = defineProps<{ emails: string[] }>()
const tradesByEmail = ref<ITradeEmailMap>()

onMounted(async () => {
  tradesByEmail.value = await listTradesByEmail(props.emails)
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
