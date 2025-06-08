<template>
  <Card
    :card="card"
    :show-image="count > 0"
    :class="['card', status ? 'has-status' : '']"
    @click="count > 0 ? $emit('miss') : $emit('own')"
  >
    <div v-if="TRADABLE_RARITIES.includes(card.rarity)" class="status">
      <Tooltip content="I want to receive this card!">
        <button
          :class="['button', 'ask', status === 'ask' ? 'active' : '']"
          @click.stop="$emit('ask')"
        />
      </Tooltip>
      <Tooltip content="I can send this card!">
        <button
          :class="['button', 'offer', status === 'offer' ? 'active' : '']"
          @click.stop="$emit('offer')"
        />
      </Tooltip>
    </div>
  </Card>
</template>

<script setup lang="ts">
import type { ICard } from '../../env'
import Card from './Card.vue'
import Tooltip from './Tooltip.vue'

const TRADABLE_RARITIES = ['◊', '◊◊', '◊◊◊', '◊◊◊◊', '☆']

defineProps<{ card: ICard; count: number; status: 'ask' | 'offer' | null }>()
defineEmits(['miss', 'own', 'ask', 'offer'])
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
  transition:
    opacity 0.2s ease-in-out,
    background-color 0.2s ease-in-out;
  width: 32px;
  height: 32px;
  padding: 8px;
  border-radius: 50%;
  background-color: #8799b1;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 70%;
  cursor: pointer;
  box-shadow:
    0.1rem 0.1rem 0.2rem rgba(0, 0, 0, 0.1),
    -0.1rem -0.1rem 0.2rem rgba(0, 0, 0, 0.1),
    -0.1rem 0.1rem 0.2rem rgba(0, 0, 0, 0.1),
    0.1rem -0.1rem 0.2rem rgba(0, 0, 0, 0.1);
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

.ask {
  background-image: url('/icons/trade_arrow_ask-white.png');
}
.ask:hover,
.ask.active {
  background-color: darkred;
}

.offer {
  background-image: url('/icons/trade_arrow_offer-white.png');
}
.offer:hover,
.offer.active {
  background-color: darkgreen;
}

/* .button.active:hover {
  background-color: #8799b1;
} */

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
