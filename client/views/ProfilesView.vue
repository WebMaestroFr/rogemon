<template>
  <LoadingSpinner v-if="loaded < allProfiles" />
  <ProfileView
    v-for="email of emails"
    v-show="loaded === allProfiles"
    :key="email"
    :email="email"
    @loaded="loaded++"
  />
</template>

<script setup lang="ts">
import { emails } from '@client/stores/collection'
import ProfileView from '../views/ProfileView.vue'
import LoadingSpinner from '@client/components/LoadingSpinner.vue'
import { ref } from 'vue'

const loaded = ref(0)
const allProfiles = emails.length
</script>
