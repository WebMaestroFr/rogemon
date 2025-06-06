<template>
  <div class="recap">
    <div class="hollow"><img src="/icons/user.png" />{{ username }}</div>
    <Recap
      v-for="(name, id) of expansions"
      :key="id"
      :expansion-id="id"
      :name="name"
      :username="username"
      @loaded="loaded++"
    />
    <img src="/img/splitter.png" class="splitter" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Recap from '../components/Recap.vue'
import { expansions } from '@client/stores/collection'
defineProps<{ username: string }>()

const emit = defineEmits(['loaded'])
const loaded = ref(0)
watch(loaded, (newValue) => {
  if (newValue === Object.keys(expansions).length) emit('loaded')
})
</script>

<style scoped>
.hollow {
  margin-bottom: 15px;
}

.recap:last-child .splitter {
  display: none;
}
</style>
