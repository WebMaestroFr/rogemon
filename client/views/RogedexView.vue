<template>
  <Collection v-for="(name, id) in expansions" :key="id" :expansion-id="id" :name="name" />
</template>

<script setup lang="ts">
import { expansions } from '@client/stores/collection'
import Collection from '../components/Collection.vue'
</script>
