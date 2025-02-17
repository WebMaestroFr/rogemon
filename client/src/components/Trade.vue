<template>
  <div class="trade">{{ JSON.stringify(trade) }}</div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { ITrade } from '@/store/trade'

const props = defineProps({
  trade: {
    type: Object as PropType<ITrade>,
    required: true,
  },
})
</script>

<style scoped>
.trade {
  position: relative;
}
</style>
