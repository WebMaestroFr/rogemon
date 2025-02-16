<template>
  <div class="authProfile">
    <span>{{ email }}</span>
    <button @click="auth.signOut">Sign Out</button>
  </div>
</template>

<script setup lang="ts">
import auth from '@/store/auth'
import { onMounted, ref } from 'vue'

const email = ref<string>()

onMounted(async () => {
  const profile = await auth.fetch<{ email: string }>('/api/auth/profile')
  console.log(profile)
  email.value = profile.email
})
</script>

<style scoped>
.authProfile {
  display: flex;
  gap: 1rem;
}
</style>
