<template>
  <q-page class="exams-page" dir="rtl">
    <div class="ex-hero">
      <div class="hero-title">الامتحانات</div>
      <div class="hero-sub">{{ store.exams.length }} امتحان متاح</div>
    </div>

    <div class="ex-body">
      <div v-if="store.loading" class="center-box">
        <q-spinner-ios color="primary" size="40px" />
      </div>

      <div v-else-if="!store.exams.length" class="empty-box">
        <q-icon name="description" size="52px" color="grey-3" />
        <div class="empty-txt">لا توجد امتحانات متاحة</div>
      </div>

      <div v-else class="exam-list">
        <div v-for="exam in store.exams" :key="exam.id" class="exam-card"
          @click="goExam(exam)">
          <!-- Status Badge -->
          <div class="status-bar" :class="`status--${exam.status}`" />

          <div class="exam-inner">
            <div class="exam-header">
              <div class="exam-icon" :class="`exam-icon--${exam.status}`">
                <q-icon :name="statusIcon(exam.status)" size="20px" color="white" />
              </div>
              <div class="flex-1">
                <div class="exam-name">{{ exam.title }}</div>
                <div class="exam-type">{{ typeLabel(exam.type) }}</div>
              </div>
              <div v-if="exam.lastResult" class="result-badge" :class="exam.lastResult.passed ? 'result-pass' : 'result-fail'">
                {{ exam.lastResult.score }}/{{ exam.totalScore }}
              </div>
            </div>

            <div class="exam-chips">
              <div class="chip chip--grey"><q-icon name="schedule" size="13px" />{{ exam.durationMinutes }} دقيقة</div>
              <div class="chip chip--blue"><q-icon name="star" size="13px" />{{ exam.totalScore }} درجة</div>
              <div v-if="exam.passScore" class="chip chip--green"><q-icon name="check_circle" size="13px" />نجاح: {{ exam.passScore }}</div>
            </div>

            <div class="exam-cta" :class="`cta--${exam.status}`">
              {{ ctaLabel(exam.status) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStudentExamsStore } from 'src/stores/student'
import { useQuasar } from 'quasar'

const store = useStudentExamsStore()
const router = useRouter()
const $q = useQuasar()

onMounted(() => store.fetchExams())

const statusIcon = (s) => ({ available: 'description', in_progress: 'pending', completed: 'check_circle', can_retake: 'replay' }[s] || 'description')
const typeLabel = (t) => ({ FREE: 'مجاني', PAID: 'مدفوع', SUBSCRIPTION: 'اشتراك', ATTENDANCE: 'حضور', CUSTOM: 'مخصص' }[t] || t)
const ctaLabel = (s) => ({ available: 'ابدأ الامتحان ←', in_progress: 'أكمل الإجابة ←', completed: 'تم التسليم ✓', can_retake: 'إعادة المحاولة ←' }[s] || '')

const goExam = (exam) => {
  if (exam.status === 'completed') {
    $q.notify({ color: 'info', message: 'لقد أتممت هذا الامتحان بالفعل.', icon: 'info' })
    return
  }
  router.push(`/exams/${exam.id}`)
}
</script>

<style scoped>
.exams-page { background: #f8fafc; min-height: 100vh; padding-bottom: 90px; }

.ex-hero {
  background: linear-gradient(135deg, #1e3a8a, #8b5cf6);
  padding: 24px 20px 40px;
  padding-top: max(env(safe-area-inset-top), 24px);
  border-bottom-left-radius: 32px; border-bottom-right-radius: 32px;
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.2);
}
.hero-title { font-size: 22px; font-weight: 900; color: white; }
.hero-sub   { font-size: 12px; color: rgba(255,255,255,0.65); margin-top: 4px; }

.ex-body { padding: 12px 16px 20px; margin-top: -30px; position: relative; z-index: 10; }
.center-box { display: flex; justify-content: center; padding: 60px; }
.empty-box  { display: flex; flex-direction: column; align-items: center; padding: 60px; gap: 10px; }
.empty-txt  { font-size: 14px; font-weight: 700; color: #94a3b8; }

.exam-list { display: flex; flex-direction: column; gap: 12px; }

.exam-card { 
  background: white; border-radius: 20px; overflow: hidden; 
  box-shadow: 0 4px 15px rgba(0,0,0,0.04); border: 1px solid #f1f5f9;
  cursor: pointer; display: flex; transition: transform 0.2s; 
}
.exam-card:active { transform: scale(0.98); }
.status-bar { width: 6px; flex-shrink: 0; }
.status--available  .status-bar, .status-bar { background: #3b82f6; }
.status--in_progress { background: #f59e0b; }
.status--completed   { background: #10b981; }
.status--can_retake  { background: #8b5cf6; }

.exam-inner { flex: 1; padding: 14px; display: flex; flex-direction: column; gap: 8px; }
.exam-header { display: flex; align-items: center; gap: 10px; }
.exam-icon { width: 38px; height: 38px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.exam-icon--available   { background: #3b82f6; }
.exam-icon--in_progress { background: #f59e0b; }
.exam-icon--completed   { background: #10b981; }
.exam-icon--can_retake  { background: #8b5cf6; }

.exam-name  { font-size: 14px; font-weight: 800; color: #1e293b; }
.exam-type  { font-size: 11px; color: #94a3b8; }
.result-badge { padding: 4px 10px; border-radius: 20px; font-size: 13px; font-weight: 800; }
.result-pass { background: #ecfdf5; color: #059669; }
.result-fail { background: #fef2f2; color: #dc2626; }

.exam-chips { display: flex; gap: 6px; flex-wrap: wrap; }
.chip { display: flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
.chip--grey  { background: #f1f5f9; color: #475569; }
.chip--blue  { background: #eff6ff; color: #2563eb; }
.chip--green { background: #ecfdf5; color: #059669; }

.exam-cta { font-size: 12px; font-weight: 800; color: #3b82f6; }
.cta--completed { color: #10b981; }
.cta--in_progress { color: #f59e0b; }

.flex-1 { flex: 1; min-width: 0; }
</style>
