<template>
  <Recap
    v-for="(name, id) of expansions"
    :key="id"
    :expansion-id="id"
    :name="name"
    :username="username"
  />
</template>

<script setup lang="ts">
import Recap from '../components/Recap.vue'
import { expansions } from '@client/stores/collection'
defineProps<{ username: string }>()
</script>
