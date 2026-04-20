<template>
  <q-page class="lesson-page" dir="rtl">
    <div v-if="loading" class="center-box">
      <q-spinner-ios color="primary" size="44px" />
    </div>

    <template v-else-if="lesson">
      <!-- Video Player -->
      <div class="video-wrap" @contextmenu.prevent>
        <div v-if="videoLoading" class="video-loading">
          <q-spinner-ios color="white" size="36px" />
        </div>
        <iframe
          v-if="signedUrl"
          :src="signedUrl"
          class="video-frame"
          allowfullscreen
          allow="encrypted-media"
          sandbox="allow-same-origin allow-scripts allow-forms"
          referrerpolicy="strict-origin"
          @load="videoLoading = false"
        />
        <div v-else-if="!lesson.hasVideo" class="no-video">
          <q-icon name="video_library" size="40px" color="grey-4" />
          <div class="text-grey-5 q-mt-sm">لا يوجد فيديو لهذا الدرس</div>
        </div>
      </div>

      <!-- Info -->
      <div class="lesson-body">
        <div class="lesson-title-row">
          <q-btn flat round icon="arrow_forward" color="primary" @click="$router.back()" />
          <div class="lesson-title">{{ lesson.title }}</div>
        </div>
        <div class="lesson-desc" v-if="lesson.description">{{ lesson.description }}</div>
        <div class="types-row">
          <span v-for="t in lesson.accessTypes" :key="t" class="type-badge type-badge--{{ t.toLowerCase() }}">{{ typeLabel(t) }}</span>
        </div>
        <div class="security-notice">
          <q-icon name="security" size="14px" color="grey-4" />
          <span>محتوى محمي — الاستخدام الشخصي فقط</span>
        </div>
      </div>
    </template>

    <div v-else class="center-box">
      <q-icon name="error_outline" size="44px" color="negative" />
      <div class="text-negative q-mt-sm">الدرس غير متاح</div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStudentContentStore } from 'src/stores/student'

const route = useRoute()
const store = useStudentContentStore()

const lesson = ref(null)
const signedUrl = ref(null)
const loading = ref(true)
const videoLoading = ref(true)

onMounted(async () => {
  try {
    lesson.value = await store.getLessonDetails(route.params.id)
    if (lesson.value.hasVideo) {
      const res = await store.getVideoUrl(route.params.id)
      signedUrl.value = res.signedUrl
    }
  } catch (e) {
    lesson.value = null
  } finally {
    loading.value = false
  }
})

const typeLabel = (t) => ({
  FREE: 'مجاني', PAID: 'مدفوع', SUBSCRIPTION: 'اشتراك',
  ATTENDANCE: 'حضور', CODE: 'كود',
}[t] || t)
</script>

<style scoped>
.lesson-page { background: #0f172a; min-height: 100vh; }
.center-box { display: flex; flex-direction: column; align-items: center; padding: 100px 16px; }

.video-wrap {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 */
  background: #000;
  user-select: none;
  -webkit-user-select: none;
}
.video-frame {
  position: absolute; inset: 0;
  width: 100%; height: 100%; border: none;
  /* pointer-events: none; — سيعيق التحكم في الفيديو، نتركه */
}
.video-loading {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.5);
}
.no-video {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
}

.lesson-body {
  background: white;
  border-radius: 22px 22px 0 0;
  padding: 16px;
  margin-top: 0;
  min-height: calc(100vh - 56.25vw);
}
.lesson-title-row { display: flex; align-items: center; gap: 6px; margin-bottom: 8px; }
.lesson-title { font-size: 17px; font-weight: 900; color: #1e293b; flex: 1; }
.lesson-desc { font-size: 13px; color: #64748b; line-height: 1.6; margin-bottom: 10px; }
.types-row { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
.type-badge { font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; background: #eff6ff; color: #2563eb; }
.security-notice { display: flex; align-items: center; gap: 6px; font-size: 10px; color: #cbd5e1; }
</style>
