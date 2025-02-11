<template>
  <form class="auth" @submit.prevent="signInOrUp({ email, password })">
    <input type="text" v-model="email" placeholder="Email" />
    <input type="password" v-model="password" placeholder="Password" />
    <button type="submit">Sign Up</button>
  </form>
</template>

<script setup lang="ts">
import { signInOrUp } from '../store/auth'
import { ref } from 'vue'

const email = ref('')
const password = ref('')
</script>

<style scoped>
.auth {
  display: flex;
  gap: 1rem;
}
</style>
