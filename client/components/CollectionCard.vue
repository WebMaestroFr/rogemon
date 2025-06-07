<template>
  <Card
    :card="card"
    :show-image="count > 0"
    :class="['card', status ? 'has-status' : '']"
    @click="handleCardClick"
  >
    <div v-if="TRADABLE_RARITIES.includes(card.rarity)" class="status">
      <button
        :class="['button', 'heart', status === 'ask' ? 'active' : '']"
        @click.stop="emit('ask')"
      />
      <button
        :class="['button', 'gift', status === 'offer' ? 'active' : '']"
        @click.stop="emit('offer')"
      />
    </div>
  </Card>
</template>

<script setup lang="ts">
import type { ICard } from '../../env'
import Card from './Card.vue'

const TRADABLE_RARITIES = ['◊', '◊◊', '◊◊◊', '◊◊◊◊', '☆']

const props = defineProps<{ card: ICard; count: number; status: 'ask' | 'offer' | null }>()
const emit = defineEmits(['miss', 'own', 'ask', 'offer'])

function handleCardClick() {
  if (props.status === null) {
    if (props.count > 0) {
      emit('miss')
    } else {
      emit('own')
    }
  }
}
</script>

<style scoped>
.card {
  cursor: pointer;
  min-width: 60px;
}

.status {
  position: absolute;
  top: 60%;
  left: 0;
  width: 100%;
}
.button {
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}
.has-status .button {
  opacity: 0.33;
}
.card:hover .button {
  opacity: 0.67;
}
.status .button.active,
.status .button:hover {
  opacity: 1;
}

.heart {
  background:
    url('/icons/heart.png') no-repeat,
    #fd619e;
}

.gift {
  background:
    url('/icons/gift.png') no-repeat,
    #8799b1;
}

.button {
  width: 32px;
  height: 32px;
  padding: 8px;
  border-radius: 50%;
  background-position: center center;
  background-size: 70%;
  cursor: pointer;
  box-shadow:
    0.1rem 0.1rem 0.2rem rgba(0, 0, 0, 0.1),
    -0.1rem -0.1rem 0.2rem rgba(0, 0, 0, 0.1),
    -0.1rem 0.1rem 0.2rem rgba(0, 0, 0, 0.1),
    0.1rem -0.1rem 0.2rem rgba(0, 0, 0, 0.1);
}

@media (max-width: 600px) {
  .status {
    position: absolute;
    top: 60%;
    left: 0;
    width: 100%;
    opacity: 1;
  }
  .button {
    width: 20px;
    height: 20px;
    padding: 4px;
    margin: 0;
  }
}
</style>
