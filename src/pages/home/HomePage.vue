<template>
  <q-page class="home-page" dir="rtl">
    <!-- Hero Card — يظهر دائماً بغض النظر عن API -->
    <div class="home-hero safe-top">
      <div class="hero-bg-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
      </div>
      <div class="hero-content">
        <div class="hero-top">
          <div>
            <div class="hero-greeting">مرحباً بعودتك 👋</div>
            <div class="hero-name">{{ auth.student?.name || 'طالب' }}</div>
          </div>
          <div class="hero-avatar">
            <q-avatar size="48px" class="glass-avatar">
              <q-icon name="person" size="28px" color="white" />
            </q-avatar>
          </div>
        </div>
        <div class="hero-badge" :class="auth.isOnline ? 'badge-online' : 'badge-center'">
          <q-icon :name="auth.isOnline ? 'wifi' : 'location_on'" size="14px" />
          {{ auth.isOnline ? 'طالب أونلاين' : 'طالب سنتر' }}
        </div>
      </div>
    </div>

    <div class="home-body">
      <!-- Stats Row -->
      <div v-if="profileLoading" class="stats-row stats-row--loading">
        <q-skeleton type="rect" height="70px" class="flex-1 rounded-borders" />
        <q-skeleton type="rect" height="70px" class="flex-1 rounded-borders q-mx-sm" />
        <q-skeleton type="rect" height="70px" class="flex-1 rounded-borders" />
      </div>
      <div v-else-if="profile" class="stats-row">
        <div class="stat-card">
          <div class="stat-icon bg-blue-1 text-blue-8"><q-icon name="fact_check" /></div>
          <div class="stat-info">
            <div class="stat-num">{{ profile.stats?.attendanceRate ?? 0 }}%</div>
            <div class="stat-lbl">الحضور</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon bg-purple-1 text-purple-8"><q-icon name="workspace_premium" /></div>
          <div class="stat-info">
            <div class="stat-num">{{ profile.stats?.totalExams ?? 0 }}</div>
            <div class="stat-lbl">امتحانات</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon bg-orange-1 text-orange-8"><q-icon name="vpn_key" /></div>
          <div class="stat-info">
            <div class="stat-num">{{ profile.stats?.activeCodes ?? 0 }}</div>
            <div class="stat-lbl">كودات</div>
          </div>
        </div>
      </div>

      <!-- Quick Actions — تظهر دائماً -->
      <div class="section-title q-mt-md">الوصول السريع</div>
      <div class="quick-grid">
        <div class="quick-card" @click="$router.push('/sections')">
          <div class="quick-icon-box bg-blue-1 text-blue-6"><q-icon name="play_circle_filled" size="26px" /></div>
          <div class="quick-label">الدروس</div>
        </div>
        <div class="quick-card" @click="$router.push('/exams')">
          <div class="quick-icon-box bg-purple-1 text-purple-6"><q-icon name="description" size="26px" /></div>
          <div class="quick-label">الامتحانات</div>
        </div>
        <div class="quick-card" @click="showQrDialog = true">
          <div class="quick-icon-box bg-orange-1 text-orange-6"><q-icon name="qr_code_2" size="26px" /></div>
          <div class="quick-label">الحضور</div>
        </div>
        <div class="quick-card" @click="$router.push('/question-banks')">
          <div class="quick-icon-box bg-indigo-1 text-indigo-6"><q-icon name="quiz" size="26px" /></div>
          <div class="quick-label">بنك الأسئلة</div>
        </div>
        <div class="quick-card" @click="$router.push('/materials')">
          <div class="quick-icon-box bg-red-1 text-red-6"><q-icon name="picture_as_pdf" size="26px" /></div>
          <div class="quick-label">الملازم</div>
        </div>
        <div class="quick-card" @click="$router.push('/codes')">
          <div class="quick-icon-box bg-teal-1 text-teal-6"><q-icon name="vpn_key" size="26px" /></div>
          <div class="quick-label">الكودات</div>
        </div>
      </div>

      <!-- Attendance QR Dialog -->
      <q-dialog v-model="showQrDialog" position="bottom">
        <q-card class="qr-dialog-card">
          <q-card-section class="column items-center q-pt-xl q-pb-lg">
            <div class="qr-title">كود الحضور الخاص بك</div>
            <div class="qr-subtitle">يرجى إظهار هذا الكود للمساعد لمسحه وتسجيل حضورك.</div>
            
            <div class="qr-container q-my-md">
              <qrcode-vue :value="String(auth.student?.id || '')" :size="200" level="H" />
            </div>
            
            <div class="qr-id-badge">
              ID: <strong>#{{ auth.student?.id }}</strong>
            </div>
            <div class="qr-name q-mt-sm">{{ auth.student?.name }}</div>
          </q-card-section>
          <q-card-actions align="center" class="q-pb-md">
            <q-btn flat rounded color="primary" label="إغلاق" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Recent Exams -->
      <template v-if="recentExams.length">
        <div class="section-title">آخر الامتحانات</div>
        <div class="exam-list">
          <div v-for="e in recentExams" :key="e.id" class="exam-row"
            @click="$router.push('/exams')">
            <div class="exam-icon"
              :class="e.lastResult?.passed ? 'exam-icon--pass' : e.lastResult ? 'exam-icon--fail' : 'exam-icon--new'">
              <q-icon
                :name="e.lastResult?.passed ? 'check' : e.lastResult ? 'close' : 'description'"
                size="16px" color="white" />
            </div>
            <div class="flex-1">
              <div class="exam-title">{{ e.title }}</div>
              <div class="exam-meta">{{ e.totalScore }} درجة · {{ e.durationMinutes }} دقيقة</div>
            </div>
            <div v-if="e.lastResult" class="exam-score"
              :class="e.lastResult.passed ? 'score--pass' : 'score--fail'">
              {{ e.lastResult.score }}
            </div>
            <div v-else class="exam-status">متاح</div>
          </div>
        </div>
      </template>

      <!-- API Error Notice -->
      <div v-if="apiError" class="api-notice">
        <q-icon name="wifi_off" size="16px" color="orange" />
        <span>تعذّر الاتصال بالخادم. تأكد أن Backend شغّال.</span>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStudentAuthStore } from 'src/stores/auth'
import { useStudentProfileStore, useStudentExamsStore } from 'src/stores/student'

import QrcodeVue from 'qrcode.vue'

const auth = useStudentAuthStore()
const profileStore = useStudentProfileStore()
const examsStore = useStudentExamsStore()

const profile = ref(null)
const recentExams = ref([])
const profileLoading = ref(true)
const apiError = ref(false)
const showQrDialog = ref(false)

onMounted(async () => {
  try {
    await Promise.all([
      profileStore.fetchProfile().catch(() => {}),
      examsStore.fetchExams().catch(() => {}),
    ])
    profile.value = profileStore.profile
    recentExams.value = examsStore.exams.slice(0, 3)
    if (!profile.value) apiError.value = true
  } catch {
    apiError.value = true
  } finally {
    profileLoading.value = false
  }
})
</script>

<style scoped>
.home-page { background: #f8fafc; min-height: 100vh; padding-bottom: 90px; }

/* Hero Section */
.home-hero {
  position: relative;
  background: linear-gradient(135deg, #1e3a8a, #2563eb, #3b82f6);
  padding: 24px 20px 60px; /* Extra bottom padding for overlap */
  border-bottom-left-radius: 32px;
  border-bottom-right-radius: 32px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(37, 99, 235, 0.2);
}
.hero-bg-shapes {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: 1; pointer-events: none;
}
.shape { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.05); }
.shape-1 { width: 150px; height: 150px; top: -50px; right: -20px; }
.shape-2 { width: 200px; height: 200px; bottom: -80px; left: -40px; }

.hero-content { position: relative; z-index: 2; }
.hero-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.hero-greeting { font-size: 13px; color: rgba(255,255,255,0.8); font-weight: 600; margin-bottom: 2px; }
.hero-name { font-size: 24px; font-weight: 900; color: white; letter-spacing: -0.5px; }
.glass-avatar { background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border: 2px solid rgba(255,255,255,0.3); }

.hero-badge { 
  display: inline-flex; align-items: center; gap: 6px; 
  border-radius: 20px; padding: 6px 14px; font-size: 12px; font-weight: 700; 
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.badge-online { background: rgba(255,255,255,0.2); backdrop-filter: blur(8px); color: white; border: 1px solid rgba(255,255,255,0.3); }
.badge-center { background: #f59e0b; color: white; border: 1px solid rgba(255,255,255,0.2); }

/* Body Content */
.home-body { padding: 0 16px 20px; display: flex; flex-direction: column; gap: 16px; margin-top: -30px; position: relative; z-index: 10; }
.section-title { font-size: 15px; font-weight: 800; color: #1e293b; display: flex; align-items: center; gap: 8px; }
.section-title::before { content: ''; display: block; width: 4px; height: 14px; background: #2563eb; border-radius: 4px; }

/* Stats Cards (Overlapping) */
.stats-row { display: flex; gap: 12px; }
.stat-card {
  flex: 1; background: white; border-radius: 20px; padding: 16px 12px;
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid rgba(255,255,255,0.8);
  transition: transform 0.2s;
}
.stat-card:active { transform: translateY(2px); }
.stat-icon { width: 36px; height: 36px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
.stat-info { text-align: center; }
.stat-num { font-size: 18px; font-weight: 900; color: #0f172a; line-height: 1.1; }
.stat-lbl { font-size: 11px; color: #64748b; font-weight: 700; margin-top: 2px; }

/* Quick Actions Grid */
.quick-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.quick-card { 
  background: white; border-radius: 16px; padding: 16px 8px; 
  display: flex; flex-direction: column; align-items: center; gap: 10px; 
  cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.03); 
  border: 1px solid #f1f5f9; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.quick-card:active { transform: scale(0.95); box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.quick-icon-box { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
.quick-label { font-size: 12px; font-weight: 800; color: #475569; }

/* Exam List */
.exam-list { display: flex; flex-direction: column; gap: 10px; }
.exam-row { display: flex; align-items: center; gap: 12px; background: white; border-radius: 16px; padding: 14px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); cursor: pointer; transition: transform 0.2s; border: 1px solid #f1f5f9; }
.exam-row:active { transform: scale(0.98); }
.exam-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; }
.exam-icon--new { background: #3b82f6; }
.exam-icon--pass { background: #10b981; }
.exam-icon--fail { background: #ef4444; }
.exam-title { font-size: 14px; font-weight: 800; color: #1e293b; margin-bottom: 2px; }
.exam-meta { font-size: 11px; color: #64748b; font-weight: 600; }
.exam-status { font-size: 11px; font-weight: 700; color: #4f46e5; background: #e0e7ff; padding: 4px 10px; border-radius: 12px; }
.exam-score { font-size: 14px; font-weight: 900; }
.score--pass { color: #10b981; }
.score--fail { color: #ef4444; }

/* Error Notice */
.api-notice { display: flex; align-items: center; gap: 10px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 14px; padding: 12px 16px; font-size: 12px; color: #92400e; font-weight: 700; box-shadow: 0 4px 12px rgba(245,158,11,0.1); }

/* QR Dialog */
.qr-dialog-card { border-top-left-radius: 28px; border-top-right-radius: 28px; background: #f8fafc; }
.qr-title { font-size: 18px; font-weight: 900; color: #1e293b; }
.qr-subtitle { font-size: 13px; color: #64748b; text-align: center; margin-top: 6px; padding: 0 20px; font-weight: 500; }
.qr-container { padding: 20px; background: white; border-radius: 20px; box-shadow: 0 8px 30px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
.qr-id-badge { background: #eff6ff; padding: 6px 16px; border-radius: 20px; font-size: 15px; color: #2563eb; letter-spacing: 1px; font-weight: 800; border: 1px solid #bfdbfe; }
.qr-name { font-size: 16px; font-weight: 800; color: #334155; }

.flex-1 { flex: 1; min-width: 0; }
</style>
