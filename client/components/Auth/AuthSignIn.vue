<template>
  <form class="authSignIn" @submit.prevent="auth.signIn({ email, password })">
    <input type="text" v-model="email" placeholder="Email" />
    <input type="password" v-model="password" placeholder="Password" />
    <button type="submit">Sign In or Up</button>
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
