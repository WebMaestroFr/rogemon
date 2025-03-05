<template>
  <Card v-if="card" :card="card" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { loadCard } from '@client/stores/card'
import type { ICard, ExpansionId } from '../../env'
import Card from './Card.vue'

const props = defineProps<{ expansionId: ExpansionId; cardId: string }>()
const card = ref<ICard>()

onMounted(async () => {
  card.value = await loadCard(props.expansionId, props.cardId)
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
