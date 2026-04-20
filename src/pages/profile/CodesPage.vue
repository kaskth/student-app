<template>
  <q-page class="codes-page" dir="rtl">
    <div class="codes-hero">
      <q-btn flat round icon="arrow_forward" color="white" @click="$router.back()" />
      <div class="hero-text">
        <div class="hero-title">الكودات</div>
        <div class="hero-sub">{{ codes.length }} كود مُفعَّل</div>
      </div>
    </div>

    <div class="codes-body">
      <!-- Redeem Form -->
      <div class="redeem-card">
        <div class="redeem-title"><q-icon name="qr_code_scanner" size="18px" color="primary" />تفعيل كود جديد</div>
        <div class="redeem-row">
          <q-input v-model="codeInput" outlined dense placeholder="أدخل الكود هنا..."
            class="flex-1" style="direction:ltr" @keyup.enter="redeem" />
          <q-btn unelevated rounded color="primary" label="تفعيل"
            :loading="redeeming" :disable="!codeInput.trim()" @click="redeem" />
        </div>
      </div>

      <!-- My Codes -->
      <div class="section-title"><q-icon name="list_alt" size="15px" color="primary" />كوداتي</div>
      <div v-if="loading" class="center-box"><q-spinner-ios color="primary" size="36px" /></div>

      <div v-else-if="!codes.length" class="empty-box">
        <q-icon name="qr_code" size="48px" color="grey-3" />
        <div class="empty-txt">لا توجد كودات مفعّلة</div>
      </div>

      <div v-else class="codes-list">
        <div v-for="c in codes" :key="c.id" class="code-card">
          <div class="code-icon"><q-icon name="qr_code" size="22px" color="primary" /></div>
          <div class="flex-1">
            <div class="code-val">{{ c.code }}</div>
            <div class="code-meta">{{ c.group?.title }} · {{ typeLabel(c.group?.codeType) }}</div>
          </div>
          <div class="code-exp" v-if="c.expiresAt">
            <div class="exp-label">ينتهي</div>
            <div class="exp-date" :class="{ 'exp-soon': isExpiringSoon(c.expiresAt) }">{{ formatDate(c.expiresAt) }}</div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStudentProfileStore } from 'src/stores/student'
import { useQuasar } from 'quasar'

const store = useStudentProfileStore()
const $q = useQuasar()

const loading = ref(true), redeeming = ref(false)
const codeInput = ref('')
const codes = ref([])

onMounted(async () => {
  codes.value = await store.getMyCodes()
  loading.value = false
})

const redeem = async () => {
  if (!codeInput.value.trim()) return
  redeeming.value = true
  const res = await store.redeemCode(codeInput.value.trim())
  redeeming.value = false
  if (res.success) {
    $q.notify({ color: 'positive', message: res.data.message, icon: 'check_circle' })
    codeInput.value = ''
    codes.value = await store.getMyCodes()
  } else {
    $q.notify({ color: 'negative', message: res.message, icon: 'error' })
  }
}

const typeLabel = (t) => ({ LESSON: 'درس', MONTHLY: 'شهري' }[t] || t || '')
const formatDate = (d) => d ? new Date(d).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'
const isExpiringSoon = (d) => d && (new Date(d) - new Date()) < 3 * 24 * 60 * 60 * 1000
</script>

<style scoped>
.codes-page { background: #f0f4f8; min-height: 100vh; }
.codes-hero {
  background: linear-gradient(150deg, #1e293b, #7c3aed);
  padding: 16px;
  padding-top: max(env(safe-area-inset-top), 16px);
  display: flex; align-items: center; gap: 10px;
}
.hero-text { flex: 1; }
.hero-title { font-size: 20px; font-weight: 900; color: white; }
.hero-sub   { font-size: 12px; color: rgba(255,255,255,0.65); }

.codes-body { padding: 12px 12px 80px; display: flex; flex-direction: column; gap: 12px; }

.redeem-card { background: white; border-radius: 18px; padding: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); }
.redeem-title { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 800; color: #334155; margin-bottom: 10px; }
.redeem-row { display: flex; gap: 8px; align-items: flex-start; }

.section-title { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 800; color: #334155; }
.center-box { display: flex; justify-content: center; padding: 40px; }
.empty-box  { display: flex; flex-direction: column; align-items: center; padding: 40px; gap: 10px; }
.empty-txt  { font-size: 13px; font-weight: 700; color: #94a3b8; }

.codes-list { display: flex; flex-direction: column; gap: 8px; }
.code-card { background: white; border-radius: 16px; padding: 14px; display: flex; align-items: center; gap: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.code-icon { width: 42px; height: 42px; background: #eff6ff; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.code-val  { font-size: 14px; font-weight: 800; color: #1e293b; font-family: monospace; }
.code-meta { font-size: 11px; color: #94a3b8; margin-top: 2px; }
.code-exp  { text-align: left; flex-shrink: 0; }
.exp-label { font-size: 10px; color: #94a3b8; }
.exp-date  { font-size: 12px; font-weight: 700; color: #334155; }
.exp-soon  { color: #dc2626; }
.flex-1 { flex: 1; min-width: 0; }
</style>
