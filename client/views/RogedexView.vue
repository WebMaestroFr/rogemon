<template>
  <LoadingSpinner v-if="loaded < allCollections" />
  <Collection
    v-for="(name, id) in expansions"
    v-show="loaded === allCollections"
    :key="id"
    :expansion-id="id"
    :name="name"
    @loaded="loaded++"
  />
</template>

<script setup lang="ts">
import { expansions } from '@client/stores/collection'
import Collection from '../components/Collection.vue'
import LoadingSpinner from '@client/components/LoadingSpinner.vue'
import { ref } from 'vue'

const loaded = ref(0)
const allCollections = Object.keys(expansions).length
</script>
