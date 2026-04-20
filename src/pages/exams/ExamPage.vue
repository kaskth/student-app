<template>
  <q-page class="exam-page" dir="rtl">
    <!-- Loading -->
    <div v-if="loading" class="center-box">
      <q-spinner-ios color="primary" size="44px" />
      <div class="text-grey-5 q-mt-sm">جارٍ تحميل الامتحان...</div>
    </div>

    <!-- Exam UI -->
    <template v-else-if="examData">
      <!-- Header -->
      <div class="exam-header">
        <div class="header-row">
          <div class="exam-title">{{ examData.title || 'الامتحان' }}</div>
          <div class="timer-wrap" :class="{ 'timer--warn': timeLeft < 120 }">
            <q-icon name="timer" size="16px" />
            <span>{{ formatTime(timeLeft) }}</span>
          </div>
        </div>
        <div class="progress-row">
          <div class="progress-label">{{ currentQ + 1 }} / {{ examData.questions.length }}</div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: ((currentQ + 1) / examData.questions.length * 100) + '%' }" />
          </div>
        </div>
      </div>

      <!-- Question -->
      <div class="question-wrap">
        <div class="q-number">السؤال {{ currentQ + 1 }}</div>
        <div class="q-text" v-if="currentQuestion.text">{{ currentQuestion.text }}</div>
        <img v-if="currentQuestion.image" :src="currentQuestion.image" class="q-image" @contextmenu.prevent />

        <!-- Choices -->
        <div class="choices-list">
          <div v-for="choice in currentQuestion.choices" :key="choice.id"
            class="choice-item"
            :class="{ 'choice-item--selected': answers[currentQuestion.id] === String(choice.id) }"
            @click="answers[currentQuestion.id] = String(choice.id)">
            <div class="choice-radio" :class="{ 'choice-radio--active': answers[currentQuestion.id] === String(choice.id) }">
              <div class="choice-dot" />
            </div>
            <span class="choice-text">{{ choice.text }}</span>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="exam-nav">
        <q-btn flat rounded icon="chevron_right" color="grey-7"
          :disable="currentQ === 0" @click="currentQ--" label="السابق" />
        <div class="answered-count">{{ answeredCount }}/{{ examData.questions.length }} أجبت</div>
        <q-btn v-if="currentQ < examData.questions.length - 1"
          unelevated rounded icon-right="chevron_left" color="primary"
          @click="currentQ++" label="التالي" />
        <q-btn v-else unelevated rounded color="positive"
          icon="check" @click="confirmSubmit" label="تسليم" :loading="submitting" />
      </div>
    </template>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStudentExamsStore } from 'src/stores/student'
import { useQuasar } from 'quasar'

const route = useRoute()
const router = useRouter()
const store = useStudentExamsStore()
const $q = useQuasar()

const loading = ref(true), submitting = ref(false)
const examData = ref(null)
const currentQ = ref(0)
const answers = reactive({})
const timeLeft = ref(0)
let timer = null

const currentQuestion = computed(() => examData.value?.questions[currentQ.value])
const answeredCount = computed(() => Object.keys(answers).length)

onMounted(async () => {
  try {
    const data = await store.startExam(route.params.id)
    examData.value = data
    timeLeft.value = (data.durationMinutes || 60) * 60
    timer = setInterval(() => {
      if (timeLeft.value <= 0) { clearInterval(timer); autoSubmit() }
      else timeLeft.value--
    }, 1000)
  } finally { loading.value = false }
})
onUnmounted(() => clearInterval(timer))

const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

const confirmSubmit = () => {
  const unanswered = examData.value.questions.length - answeredCount.value
  $q.dialog({
    title: 'تسليم الامتحان؟',
    message: unanswered > 0 ? `تبقّت ${unanswered} أسئلة بدون إجابة. هل تريد التسليم؟` : 'هل أنت متأكد من تسليم الامتحان؟',
    cancel: { label: 'تراجع', flat: true },
    ok: { label: 'تسليم', color: 'positive', unelevated: true },
  }).onOk(submit)
}

const submit = async () => {
  submitting.value = true
  clearInterval(timer)
  try {
    const result = await store.submitExam(route.params.id, examData.value.resultId, answers)
    router.replace({ path: `/results/${route.params.id}`, query: { score: result.score, total: result.totalScore, passed: result.passed } })
  } finally { submitting.value = false }
}
const autoSubmit = () => {
  $q.notify({ color: 'warning', message: 'انتهى الوقت! جارٍ التسليم التلقائي...' })
  submit()
}
</script>

<style scoped>
.exam-page { background: #f8fafc; min-height: 100vh; display: flex; flex-direction: column; }
.center-box { display: flex; flex-direction: column; align-items: center; padding: 100px 16px; flex: 1; }

.exam-header {
  background: linear-gradient(135deg, #1e293b, #7c3aed);
  padding: 16px;
  padding-top: max(env(safe-area-inset-top), 16px);
}
.header-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.exam-title { font-size: 16px; font-weight: 800; color: white; flex: 1; }
.timer-wrap { display: flex; align-items: center; gap: 5px; background: rgba(255,255,255,0.15); padding: 5px 12px; border-radius: 20px; color: white; font-weight: 800; font-size: 14px; }
.timer--warn { background: #dc2626; animation: pulse 1s infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }

.progress-row { display: flex; align-items: center; gap: 8px; }
.progress-label { font-size: 11px; color: rgba(255,255,255,0.7); white-space: nowrap; }
.progress-bar { flex: 1; height: 5px; background: rgba(255,255,255,0.2); border-radius: 3px; overflow: hidden; }
.progress-fill { height: 100%; background: white; border-radius: 3px; transition: width 0.3s; }

.question-wrap { flex: 1; padding: 20px 16px; overflow-y: auto; }
.q-number { font-size: 11px; font-weight: 700; color: #64748b; margin-bottom: 8px; }
.q-text { font-size: 16px; font-weight: 700; color: #1e293b; line-height: 1.6; margin-bottom: 16px; }
.q-image { width: 100%; border-radius: 12px; margin-bottom: 16px; pointer-events: none; }

.choices-list { display: flex; flex-direction: column; gap: 10px; }
.choice-item { display: flex; align-items: center; gap: 12px; padding: 14px; background: white; border-radius: 14px; border: 2px solid #e2e8f0; cursor: pointer; transition: all 0.18s; box-shadow: 0 1px 6px rgba(0,0,0,0.04); }
.choice-item--selected { border-color: #1d4ed8; background: #eff6ff; }
.choice-radio { width: 20px; height: 20px; border-radius: 50%; border: 2px solid #cbd5e1; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.choice-radio--active { border-color: #1d4ed8; background: #1d4ed8; }
.choice-dot { width: 8px; height: 8px; border-radius: 50%; background: white; display: none; }
.choice-radio--active .choice-dot { display: block; }
.choice-text { font-size: 14px; font-weight: 600; color: #334155; }

.exam-nav { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: white; border-top: 1px solid #f1f5f9; box-shadow: 0 -4px 16px rgba(0,0,0,0.04); padding-bottom: max(env(safe-area-inset-bottom), 12px); }
.answered-count { font-size: 12px; font-weight: 700; color: #64748b; }
</style>
