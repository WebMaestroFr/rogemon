<template>
  <div v-if="auth.getToken()" class="rogedex">
    <Collection expansionId="A1" name="Genetic Apex" />
    <Collection expansionId="A1a" name="Mythical Island" />
    <Collection expansionId="A2" name="Space-Time Smackdown" />
    <Collection expansionId="A2a" name="Triumphant Light" />
  </div>
</template>

<script setup lang="ts">
import auth from '../stores/auth'

import Collection from '../components/Collection.vue'
</script>

<style scoped>
.rogedex {
  padding: 8px;
}
</style>
