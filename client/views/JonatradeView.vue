<template>
  <div v-if="tradesByEmail">
    <div v-for="[email, tradesByRarity] in Object.entries(tradesByEmail)" :key="email" class="user">
      <img src="/img/splitter.png" class="splitter" />
      <a class="hollow" :href="'/profiles/' + getUsername(email)">
        <img src="/icons/user.png" />{{ getUsername(email) }}
      </a>
      <img src="/icons/down.png" class="scroller" @click="scrollToNext" />
      <div class="trades">
        <div v-for="[rarity, tradeGroups] in Object.entries(tradesByRarity)" :key="rarity">
          <img v-for="i in rarity.length" :key="i" :src="getIcon(rarity)" class="icon" />
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
import TradeGroup from '../components/TradeGroup.vue'

const emails = ['test@test.tt', 'test2@test.tt']
const tradesByEmail = ref<ITradeEmailMap>()

onMounted(async () => {
  tradesByEmail.value = await listTradesByEmail(emails)
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

.splitter {
  margin: -50px auto 30px auto;
  width: 450px;
  display: block;
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

.user:last-child .scroller {
  visibility: hidden;
}

@media (max-width: 600px) {
  .splitter {
    width: 100%;
    margin-top: -35px;
  }
}
</style>
