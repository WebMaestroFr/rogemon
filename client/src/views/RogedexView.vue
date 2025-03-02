<template>
  <div v-if="auth.getToken()" class="rogedex">
    <Collection expansionId="A1" name="Genetic Apex" />
    <Collection expansionId="A1a" name="Mythical Island" />
    <!-- <Collection expansionId="A2" name="Space-Time Smackdown" /> -->
  </div>
</template>

<script setup lang="ts">
import Collection from '@/components/Collection.vue'
import auth from '@/store/auth'
</script>

<style scoped>
.rogedex {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fill, minmax(512px, 1fr));
  grid-template-rows: masonry;
  padding: 1rem 0;
}
</style>
