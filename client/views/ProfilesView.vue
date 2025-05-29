<template>
  <ProfileView v-for="username of usernames" :key="username" :username="username" />
</template>

<script setup lang="ts">
import ProfileView from '../views/ProfileView.vue'
import { loadUsers } from '@client/stores/users'
import { onMounted, ref } from 'vue'

const usernames = ref<string[]>([])
onMounted(async () => {
  const users = await loadUsers()
  if (users) usernames.value = users
})
</script>
