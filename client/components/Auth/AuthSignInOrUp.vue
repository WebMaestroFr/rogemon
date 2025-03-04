<template>
  <form
    class="authSignInOrUp"
    @submit.prevent="auth.signInOrUp({ email, password })"
  >
    <input type="text" v-model="email" placeholder="Email" />
    <input type="password" v-model="password" placeholder="Password" />
    <button type="submit">Sign In or Up</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import auth from "@client/stores/auth";

const email = ref("");
const password = ref("");
</script>

<style scoped>
.authSignInOrUp {
  display: flex;
  gap: 1rem;
}
</style>
