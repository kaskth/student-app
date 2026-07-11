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

  document.addEventListener('touchend', (e) => {
    const active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        active.blur();
      }
    }
  }, { passive: false });
})
</script>
