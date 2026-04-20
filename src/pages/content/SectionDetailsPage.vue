<template>
  <q-page class="sec-dt-page" dir="rtl">
    <!-- نفس SectionsPage لكن مع section واحد -->
    <div class="hero">
      <q-btn flat round icon="arrow_forward" color="white" @click="$router.back()" />
      <div class="hero-title">تفاصيل الكورس</div>
    </div>
    <div class="body-pad"><div class="text-grey-5 text-center q-pt-xl">جارٍ التحميل...</div></div>
  </q-page>
</template>
<script setup></script>
<style scoped>
.sec-dt-page { background: #f0f4f8; min-height: 100vh; }
.hero { background: linear-gradient(150deg, #0f172a, #1d4ed8); padding: 16px; padding-top: max(env(safe-area-inset-top),16px); display: flex; align-items: center; gap: 10px; }
.hero-title { font-size: 20px; font-weight: 900; color: white; }
.body-pad { padding: 16px; }
</style>
