<template>
  <Card :card="card" :show-image="count > 0" @click="$emit('increase')">
    <span v-show="count > 0" class="trash" @click.stop="$emit('decrease')"
      ><img src="/icons/trash.png"
    /></span>
    <span v-show="count > 0" class="counter" v-text="count" />
  </Card>
</template>

<script setup lang="ts">
import type { ICard } from '../../env'
import Card from './Card.vue'

defineProps<{ card: ICard; count: number }>()
defineEmits(['decrease', 'increase'])
</script>

<style scoped>
.card {
  cursor: pointer;
  min-width: 60px;
}

.card:hover .trash {
  opacity: 1;
}

.trash {
  position: absolute;
  top: 0;
  right: 0;
  opacity: 0;
  transition: opacity 0.2s;
  background: #444;
  border-bottom-left-radius: 10px;
  padding: 0 16px;
  line-height: 20px;
}

img {
  width: 16px;
  vertical-align: text-top;
}

.counter {
  position: absolute;
  bottom: 0;
  left: 0;
  display: inline-block;
  background: #444;
  color: white;
  font-weight: bold;
  padding: 0 20px;
  border-top-right-radius: 10px;
}

@media (max-width: 600px) {
  .trash {
    opacity: 1;
  }
}
</style>
