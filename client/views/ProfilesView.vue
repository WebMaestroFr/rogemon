<template>
  <ProfileView v-for="username of usernames" :key="username" :username="username" />
</template>

<script setup lang="ts">
import { emails } from '@client/stores/collection'
import ProfileView from '../views/ProfileView.vue'

const usernames = emails.map((email) => email.substring(0, email.indexOf('@')))
</script>
