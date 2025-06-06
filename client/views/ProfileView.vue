<template>
  <div class="hollow"><img src="/icons/user.png" />{{ username }}</div>
  <div class="recap">
    <Recap
      v-for="(name, id) of expansions"
      :key="id"
      :expansion-id="id"
      :name="name"
      :username="username"
    />
    <img src="/img/splitter.png" class="splitter" />
  </div>
</template>

<script setup lang="ts">
import Recap from '../components/Recap.vue'
import { expansions } from '@client/stores/collection'
defineProps<{ username: string }>()
</script>

<style scoped>
.hollow {
  margin-bottom: 15px;
}

.recap:last-child .splitter {
  display: none;
}
</style>
