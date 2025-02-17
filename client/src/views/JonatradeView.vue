<template>
  <div v-if="auth.getToken()" class="jonatrade">
    <TradeList :userEmails="userEmails" />
  </div>
</template>

<script setup lang="ts">
import auth from '@/store/auth'
import TradeList from '@/components/TradeList.vue'
const userEmails = ['joni@rogemon.app', 'maxime@rogemon.app', 'etienne@rogemon.app']
</script>

<style scoped>
.jonatrade {
  padding: 1rem 0;
}
</style>
