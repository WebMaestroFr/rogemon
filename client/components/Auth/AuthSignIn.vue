<template>
  <form class="authSignIn" @submit.prevent="auth.signInOrUp({ email, password })">
    <input v-model="email" type="text" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button type="submit">Sign In</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import auth from '@client/stores/auth'

const email = ref('')
const password = ref('')
</script>

<style scoped>
.authSignIn {
  display: flex;
  gap: 1rem;
}
</style>
