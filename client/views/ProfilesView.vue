<template>
  <LoadingSpinner v-if="loaded < allProfiles" />
  <ProfileView
    v-for="username of usernames"
    v-show="loaded === allProfiles"
    :key="username"
    :username="username"
    @loaded="loaded++"
  />
</template>

<script setup lang="ts">
import { emails } from '@client/stores/collection'
import ProfileView from '../views/ProfileView.vue'
import LoadingSpinner from '@client/components/LoadingSpinner.vue'
import { ref } from 'vue'

const usernames = emails.map((email) => email.substring(0, email.indexOf('@')))
const loaded = ref(0)
const allProfiles = emails.length
</script>
