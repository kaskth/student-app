<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { Capacitor } from '@capacitor/core'
import { PrivacyScreen } from '@capacitor-community/privacy-screen'

onMounted(async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      await PrivacyScreen.enable()
    } catch (e) {
      console.warn('PrivacyScreen not available', e)
    }
  }
})
</script>
