<template>
  <div v-if="auth.getToken()" class="jonatrade">
    <TradeList :emails="emails" />
  </div>
</template>

<script setup lang="ts">
import auth from "../stores/auth";

import TradeList from "../components/TradeList.vue";

const emails = [
  "joni@rogemon.app",
  "maxime@rogemon.app",
  "etienne@rogemon.app",
  "fabi@rogemon.app",
];
</script>

<style scoped>
.jonatrade {
  padding: 1rem 0;
}
</style>
