<template>
  <div class="rogedex">
    <Collection id="A1" name="Genetic Apex" />
    <Collection id="A1a" name="Mythical Island" />
    <Collection id="A2" name="Space-Time Smackdown" />
    <Collection id="P-A" name="Promo-A" />
  </div>
</template>

<script setup lang="ts">
import Collection from '@/components/Collection.vue'
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
