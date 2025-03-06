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
