<template>
  <div class="authProfile">
    <div class="hollow" @click="auth.signOut"><img src="/icons/logout.png" /><span v-text="email" /></div>
  </div>
</template>

<script setup lang="ts">
import auth from '@client/stores/auth'
import { onMounted, ref } from 'vue'

const email = ref<string>()

onMounted(async () => {
  const profile = await auth.fetch<{ email: string }>('/api/auth/profile')
  email.value = profile.email
})
</script>

<style scoped>
.authProfile {
  margin-top: 12px;
  width: 238px;
  text-align: right;
}

.hollow {
  cursor: pointer;
  color: #99adc6;
}

.hollow span {
  padding-left: 8px;
}
</style>
