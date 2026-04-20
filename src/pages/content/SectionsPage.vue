<template>
  <q-page class="sec-page" dir="rtl">
    <div class="sec-hero">
      <div class="hero-title">الكورسات والدروس</div>
      <div class="hero-sub">{{ auth.student?.academicYearName }}</div>
    </div>

    <div class="sec-body">
      <div v-if="store.loading" class="center-box">
        <q-spinner-ios color="primary" size="40px" />
      </div>

      <div v-else-if="!store.sections.length" class="empty-box">
        <q-icon name="menu_book" size="52px" color="grey-3" />
        <div class="empty-txt">لا توجد كورسات بعد</div>
      </div>

      <div v-else class="sections-list">
        <div v-for="section in store.sections" :key="section.id" class="section-card">
          <!-- Section Header -->
          <div class="section-header" @click="toggleSection(section.id)">
            <div class="section-icon"><q-icon name="folder_open" size="20px" color="primary" /></div>
            <div class="flex-1">
              <div class="section-title">{{ section.title }}</div>
              <div class="section-meta">{{ section.lessons.length }} درس</div>
            </div>
            <q-icon :name="expanded[section.id] ? 'expand_less' : 'expand_more'" size="22px" color="grey-5" />
          </div>

          <!-- Lessons -->
          <q-slide-transition>
            <div v-if="expanded[section.id]" class="lessons-list">
              <div v-for="lesson in section.lessons" :key="lesson.id"
                class="lesson-row"
                :class="{ 'lesson-row--locked': lesson.access === 'locked' }"
                @click="openLesson(lesson)">
                <div class="lesson-thumb">
                  <img v-if="lesson.thumbnailUrl" :src="lesson.thumbnailUrl" />
                  <q-icon v-else name="play_circle" size="20px" :color="lesson.access === 'open' ? 'primary' : 'grey-4'" />
                </div>
                <div class="flex-1">
                  <div class="lesson-title">{{ lesson.title }}</div>
                  <div class="lesson-types">
                    <span v-for="t in lesson.accessTypes" :key="t" class="type-chip" :class="`type-${t.toLowerCase()}`">{{ typeLabel(t) }}</span>
                  </div>
                </div>
                <div class="lesson-status">
                  <q-icon v-if="lesson.access === 'open'" name="play_arrow" size="20px" color="primary" />
                  <q-icon v-else name="lock" size="18px" color="grey-4" />
                </div>
              </div>
            </div>
          </q-slide-transition>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStudentAuthStore } from 'src/stores/auth'
import { useStudentContentStore } from 'src/stores/student'
import { useQuasar } from 'quasar'

const auth = useStudentAuthStore()
const store = useStudentContentStore()
const router = useRouter()
const $q = useQuasar()
const expanded = reactive({})

onMounted(async () => {
  await store.fetchSections()
  // expand first section by default
  if (store.sections[0]) expanded[store.sections[0].id] = true
})

const toggleSection = (id) => { expanded[id] = !expanded[id] }

const openLesson = (lesson) => {
  if (lesson.access === 'locked') {
    $q.notify({ color: 'warning', message: 'هذا الدرس يتطلب اشتراكاً أو كوداً للوصول', icon: 'lock' })
    return
  }
  router.push(`/lessons/${lesson.id}`)
}

const typeLabel = (t) => ({
  FREE: 'مجاني', PAID: 'مدفوع', SUBSCRIPTION: 'اشتراك',
  ATTENDANCE: 'حضور', CODE: 'كود',
}[t] || t)
</script>

<style scoped>
.sec-page { background: #f8fafc; min-height: 100vh; padding-bottom: 90px; }

.sec-hero {
  background: linear-gradient(135deg, #1e3a8a, #3b82f6);
  padding: 24px 20px 40px;
  padding-top: max(env(safe-area-inset-top), 24px);
  border-bottom-left-radius: 32px; border-bottom-right-radius: 32px;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.2);
}
.hero-title { font-size: 22px; font-weight: 900; color: white; }
.hero-sub   { font-size: 12px; color: rgba(255,255,255,0.65); margin-top: 4px; font-weight: 600; }

.sec-body { padding: 12px 16px 20px; margin-top: -30px; position: relative; z-index: 10; }
.center-box { display: flex; justify-content: center; padding: 60px; }
.empty-box  { display: flex; flex-direction: column; align-items: center; padding: 60px; gap: 10px; }
.empty-txt  { font-size: 14px; font-weight: 700; color: #94a3b8; }

.sections-list { display: flex; flex-direction: column; gap: 14px; }
.section-card { 
  background: white; border-radius: 20px; overflow: hidden; 
  box-shadow: 0 4px 15px rgba(0,0,0,0.04); border: 1px solid #f1f5f9; 
}

.section-header { display: flex; align-items: center; gap: 12px; padding: 16px; cursor: pointer; transition: background 0.2s; }
.section-header:active { background: #f8fafc; }
.section-icon { width: 42px; height: 42px; background: #eff6ff; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.section-title { font-size: 15px; font-weight: 800; color: #1e293b; }
.section-meta  { font-size: 12px; color: #94a3b8; margin-top: 2px; font-weight: 600; }

.lessons-list { border-top: 1px solid #f1f5f9; }
.lesson-row { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-bottom: 1px solid #f8fafc; cursor: pointer; transition: background 0.15s; }
.lesson-row:last-child { border-bottom: none; }
.lesson-row--locked { opacity: 0.65; }
.lesson-row:hover { background: #f8fafc; }

.lesson-thumb { width: 44px; height: 44px; border-radius: 10px; background: #f1f5f9; overflow: hidden; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.lesson-thumb img { width: 100%; height: 100%; object-fit: cover; }
.lesson-title { font-size: 13px; font-weight: 700; color: #1e293b; margin-bottom: 4px; }
.lesson-types { display: flex; gap: 4px; flex-wrap: wrap; }
.type-chip { font-size: 9px; font-weight: 700; padding: 2px 7px; border-radius: 20px; }
.type-free  { background: #ecfdf5; color: #059669; }
.type-paid  { background: #fef3c7; color: #d97706; }
.type-attendance { background: #eff6ff; color: #2563eb; }
.type-code  { background: #f5f3ff; color: #7c3aed; }
.type-subscription { background: #fdf2f8; color: #be185d; }

.lesson-status { flex-shrink: 0; }
.flex-1 { flex: 1; min-width: 0; }
</style>
