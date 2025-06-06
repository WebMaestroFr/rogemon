<template>
  <LoadingSpinner v-if="!loaded" />
  <div
    v-for="[email, tradesByRarity] in Object.entries(tradesByEmail)"
    :key="email"
    class="user"
    v-show="loaded"
  >
    <a class="hollow" :href="'/profiles/' + getUsername(email)">
      <img src="/icons/user.png" />{{ getUsername(email) }}
    </a>
    <img src="/icons/down.png" class="scroller" @click="scrollToNext" />
    <div class="trades">
      <template v-for="rarity in rarities">
        <div v-if="tradesByRarity[rarity]" :key="rarity">
          <img v-for="i in rarity.length" :key="i" :src="getIcon(rarity)" class="icon" />
          <TradeGroup v-if="tradesByRarity[rarity]" v-bind="tradesByRarity[rarity]" />
        </div>
      </template>
    </div>
    <img src="/img/splitter.png" class="splitter" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { listTradesByEmail } from '@client/stores/trade'
import type { ITradeEmailMap } from '../../env'
import TradeGroup from '../components/TradeGroup.vue'
import { emails } from '@client/stores/collection'
import LoadingSpinner from '@client/components/LoadingSpinner.vue'

const tradesByEmail = ref<ITradeEmailMap>({})
const rarities = ['◊◊◊◊', '◊◊◊', '◊◊', '◊', '☆']
const loaded = ref(false)

onMounted(async () => {
  tradesByEmail.value = await listTradesByEmail(emails)
  loaded.value = true
})

function getIcon(rarity: string) {
  switch (rarity) {
    case '◊':
    case '◊◊':
    case '◊◊◊':
    case '◊◊◊◊':
      return '/img/diamond.png'
    case '☆':
    case '☆☆':
    case '☆☆☆':
      return '/img/star.png'
    default:
      return '/img/crown.png'
  }
}

function getUsername(email: string) {
  return email.substring(0, email.indexOf('@'))
}

function scrollToNext() {
  for (const scroller of document.querySelectorAll('.scroller')) {
    const next = scroller as HTMLImageElement
    if (next.offsetTop > window.scrollY + window.innerHeight) {
      window.scrollTo({ top: next.offsetTop - 20, behavior: 'smooth' })
      return
    }
  }
}
</script>

<style scoped>
.trades {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px 40px;
  margin: 10px 0 20px 0;
}

.hollow {
  margin: auto;
  text-decoration: none;
}

.hollow img {
  margin-right: 6px;
}

.icon {
  height: 20px;
  margin: 8px 2px;
}

.scroller {
  float: right;
  width: 20px;
  height: 20px;
  margin-top: 10px;
  margin-left: -20px;
  cursor: pointer;
  opacity: 0.6;
}

.scroller:hover {
  opacity: 1;
}

.user:last-child .scroller,
.user:last-child .splitter {
  visibility: hidden;
}
</style>
