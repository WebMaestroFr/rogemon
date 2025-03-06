<template>
  <div v-if="tradesByEmail">
    <div v-for="[email, tradesByRarity] in Object.entries(tradesByEmail)" :key="email">
      <img src="/img/splitter.png" class="splitter" />
      <div class="hollow"><img src="/icons/user.png" />{{ email.substring(0, email.indexOf('@')) }}</div>
      <div class="trades">
        <div v-for="[rarity, tradeGroups] in Object.entries(tradesByRarity)" :key="rarity">
          <img v-for="i in rarity.length" :src="getIcon(rarity)" class="icon" />
          <TradeGroup v-bind="tradeGroups" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { listTradesByEmail } from '@client/stores/trade'
import type { ITradeEmailMap } from '../../env'
import TradeGroup from './TradeGroup.vue'

const props = defineProps<{ emails: string[] }>()
const tradesByEmail = ref<ITradeEmailMap>()

onMounted(async () => {
  tradesByEmail.value = await listTradesByEmail(props.emails)
})

function getIcon(rarity: string) {
  switch (rarity) {
    case '◊':
    case '◊◊':
    case '◊◊◊':
    case '◊◊◊◊': return '/img/diamond.png'
    case '☆':
    case '☆☆':
    case '☆☆☆': return '/img/star.png'
    default: return '/img/crown.png'
  }
}
</script>

<style scoped>
.trades {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px 40px;
  margin: 10px 0;
}

.hollow {
  margin: auto;
}

.hollow img {
  margin-right: 6px;
}

.icon {
  height: 20px;
  margin: 8px 2px;
}

.splitter {
  margin: -20px auto 10px auto;
  width: 450px;
  display: block;
}

@media (max-width: 600px) {
  .splitter {
    width: 100%;
  }
}
</style>
