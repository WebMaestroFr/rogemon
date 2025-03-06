<template>
  <form @submit.prevent="auth.signInOrUp({ email, password })">
    <Rogemon />
    <div class="hollow"><img src="/icons/email.png" /><input type="text" v-model="email" placeholder="Email" /></div>
    <div class="hollow"><img src="/icons/pw.png" /><input type="password" v-model="password" placeholder="Password" />
    </div>
    <button :disabled="email.length < 10 || password.length < 6" type="submit">Sign in</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Rogemon from '../Rogemon.vue'
import auth from '@client/stores/auth'

const email = ref('')
const password = ref('')
</script>

<style scoped>
form {
  padding-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

input {
  background: none;
  border: none;
  outline: none;
  padding-left: 6px;
  width: 140px;
}

button {
  width: 190px;
}
</style>
