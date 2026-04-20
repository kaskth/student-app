<template>
  <q-page class="solve-page" dir="rtl">
    <div class="page-header">
      <q-btn flat round icon="arrow_forward" color="dark" @click="$router.back()" />
      <div class="header-title ellipsis">{{ qbStore.currentBank?.title || 'تدريب' }}</div>
      <div style="width: 40px"></div>
    </div>

    <div v-if="qbStore.loading" class="q-pa-md q-gutter-md flex-center">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <div v-else-if="!questions.length" class="empty-state">
      <q-icon name="hourglass_empty" size="64px" color="grey-4" />
      <div class="empty-text">لا توجد أسئلة في هذا البنك حتى الآن</div>
    </div>

    <div v-else class="content-container">
      <!-- Progress Bar -->
      <div class="progress-section">
        <div class="progress-labels">
          <span class="text-weight-bold text-primary">السؤال {{ currentIndex + 1 }}</span>
          <span class="text-grey-6">من {{ questions.length }}</span>
        </div>
        <q-linear-progress :value="(currentIndex + 1) / questions.length" color="primary" rounded size="8px" class="q-mt-sm" />
      </div>

      <!-- Question Card -->
      <transition name="slide-fade" mode="out-in">
        <q-card :key="currentQuestion.id" class="question-card q-mt-md">
          <q-card-section>
            <!-- Image if exists -->
            <div v-if="currentQuestion.imageUrl" class="q-mb-md rounded-borders overflow-hidden">
              <q-img :src="getMediaUrl(currentQuestion.imageUrl)" style="max-height: 200px" fit="contain" />
            </div>
            
            <div class="question-text">{{ currentQuestion.text }}</div>
          </q-card-section>

          <q-card-section class="options-section">
            <div 
              v-for="opt in ['A', 'B', 'C', 'D']" 
              :key="opt"
              class="option-item"
              :class="getOptionClass(opt)"
              @click="selectOption(opt)"
            >
              <div class="opt-letter">{{ opt }}</div>
              <div class="opt-text">{{ currentQuestion[`option${opt}`] }}</div>
              <q-icon v-if="isAnswered && opt === currentQuestion.correctOption" name="check_circle" color="white" size="20px" />
              <q-icon v-if="isAnswered && selectedOption === opt && opt !== currentQuestion.correctOption" name="cancel" color="white" size="20px" />
            </div>
          </q-card-section>

          <!-- Note / Explanation Section (Shown after answering) -->
          <transition name="fade">
            <q-card-section v-if="isAnswered && (currentQuestion.noteText || currentQuestion.noteAudioUrl)" class="note-section">
              <div class="note-title"><q-icon name="lightbulb" color="warning" /> توضيح الإجابة</div>
              <div v-if="currentQuestion.noteText" class="note-text q-mt-sm">{{ currentQuestion.noteText }}</div>
              <audio v-if="currentQuestion.noteAudioUrl" :src="getMediaUrl(currentQuestion.noteAudioUrl)" controls class="full-width q-mt-sm" />
            </q-card-section>
          </transition>
        </q-card>
      </transition>

      <!-- Navigation Buttons -->
      <div class="nav-buttons q-mt-xl">
        <q-btn 
          flat color="grey-7" label="السابق" icon="chevron_right" 
          :disable="currentIndex === 0" 
          @click="currentIndex--" 
        />
        <q-btn 
          unelevated color="primary" 
          :label="currentIndex === questions.length - 1 ? 'إنهاء' : 'التالي'" 
          icon-right="chevron_left" 
          @click="nextQuestion" 
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStudentQuestionBanksStore } from 'src/stores/student'
import { useQuasar } from 'quasar'

const route = useRoute()
const router = useRouter()
const qbStore = useStudentQuestionBanksStore()
const $q = useQuasar()

const currentIndex = ref(0)
const answers = ref({}) // map of questionId -> selected option ('A', 'B', etc)

const questions = computed(() => qbStore.currentBank?.questions || [])
const currentQuestion = computed(() => questions.value[currentIndex.value] || {})

const selectedOption = computed(() => answers.value[currentQuestion.value?.id])
const isAnswered = computed(() => !!selectedOption.value)

onMounted(async () => {
  try {
    await qbStore.getBankDetails(route.params.id)
  } catch (e) {
    $q.notify({ message: e?.response?.data?.message || 'خطأ في جلب الأسئلة', color: 'negative' })
    router.back()
  }
})

const getMediaUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `http://${window.location.hostname}:3000${path}`
}

const selectOption = (opt) => {
  if (isAnswered.value) return // prevent changing answer in practice mode
  answers.value[currentQuestion.value.id] = opt
  
  if (opt === currentQuestion.value.correctOption) {
    // Correct! 
    playBeep('success')
  } else {
    // Wrong!
    playBeep('error')
  }
}

const getOptionClass = (opt) => {
  if (!isAnswered.value) return 'opt-idle'
  
  if (opt === currentQuestion.value.correctOption) return 'opt-correct'
  if (opt === selectedOption.value) return 'opt-wrong'
  return 'opt-dimmed'
}

const nextQuestion = () => {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
  } else {
    // Finished
    $q.notify({ message: 'أتممت أسئلة هذا البنك بنجاح!', color: 'positive', icon: 'emoji_events' })
    router.back()
  }
}

function playBeep(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    if (type === 'success') {
      osc.type = 'sine'; osc.frequency.setValueAtTime(800, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1)
      gain.gain.setValueAtTime(0.3, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
      osc.start(); osc.stop(ctx.currentTime + 0.1)
    } else {
      osc.type = 'sawtooth'; osc.frequency.setValueAtTime(200, ctx.currentTime)
      gain.gain.setValueAtTime(0.3, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)
      osc.start(); osc.stop(ctx.currentTime + 0.2)
    }
  } catch(e) {}
}
</script>

<style scoped>
.solve-page { background: #f8fafc; min-height: 100vh; padding-bottom: 20px; }

.page-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  margin-bottom: 16px; border-bottom-left-radius: 20px; border-bottom-right-radius: 20px;
}
.header-title { font-size: 16px; font-weight: 800; color: #1e293b; max-width: 60vw; }

.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; text-align: center; }
.empty-text { margin-top: 16px; font-size: 16px; color: #64748b; font-weight: 600; }

.content-container { padding: 0 16px; }

.progress-section { background: white; padding: 12px 16px; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.progress-labels { display: flex; justify-content: space-between; font-size: 13px; }

.question-card { border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
.question-text { font-size: 18px; font-weight: 800; color: #1e293b; line-height: 1.5; }

.options-section { display: flex; flex-direction: column; gap: 10px; padding-top: 0; }
.option-item {
  display: flex; align-items: center; gap: 12px; padding: 14px 16px;
  border-radius: 14px; font-weight: 700; font-size: 15px; cursor: pointer;
  transition: all 0.3s ease; border: 2px solid transparent;
}
.opt-idle { background: #f1f5f9; color: #334155; border-color: #e2e8f0; }
.opt-idle:active { transform: scale(0.98); background: #e2e8f0; }

.opt-correct { background: #10b981; color: white; border-color: #059669; }
.opt-wrong { background: #ef4444; color: white; border-color: #dc2626; }
.opt-dimmed { background: #f8fafc; color: #cbd5e1; border-color: #f1f5f9; pointer-events: none; }

.opt-letter { 
  width: 28px; height: 28px; border-radius: 8px; 
  background: rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center;
  font-size: 14px;
}

.opt-text { flex: 1; }

.note-section { background: #fffbeb; border-top: 1px solid #fef3c7; }
.note-title { font-weight: 800; color: #d97706; font-size: 13px; }
.note-text { font-size: 14px; color: #92400e; line-height: 1.5; }

.nav-buttons { display: flex; justify-content: space-between; align-items: center; }

/* Transitions */
.slide-fade-enter-active { transition: all 0.3s ease-out; }
.slide-fade-leave-active { transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1); }
.slide-fade-enter-from { transform: translateX(20px); opacity: 0; }
.slide-fade-leave-to { transform: translateX(-20px); opacity: 0; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
