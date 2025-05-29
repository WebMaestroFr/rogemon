<template>
  <img src="/img/splitter.png" class="splitter" />
  <div class="hollow"><img src="/icons/user.png" />{{ username }}</div>
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

<style scoped>
.splitter {
  margin: -50px auto 20px auto;
  width: 450px;
  display: block;
}

.hollow {
  margin-bottom: 15px;
}

@media (max-width: 600px) {
  .splitter {
    width: 100%;
    margin-top: -35px;
  }
}
</style>
