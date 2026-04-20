<template>
  <q-page class="pend-page" dir="rtl">
    <div class="pend-body">
      <div class="pend-icon">
        <q-icon name="schedule" size="48px" color="white" />
      </div>
      <div class="pend-title">طلبك قيد المراجعة</div>
      <div class="pend-sub">تم إرسال طلب التسجيل بنجاح! سيقوم المسئول بمراجعته وتفعيل حسابك في أقرب وقت.</div>
      <div class="pend-card">
        <div class="pend-row"><q-icon name="person" size="18px" color="primary" /><span>{{ auth.student?.name }}</span></div>
        <div class="pend-row"><q-icon name="phone" size="18px" color="primary" /><span>{{ auth.student?.phone }}</span></div>
        <div class="pend-row"><q-icon name="location_on" size="18px" color="primary" /><span>طالب سنتر — ينتظر التفعيل</span></div>
      </div>
      <q-btn unelevated rounded color="white" text-color="primary"
        label="تسجيل الخروج والمغادرة"
        class="logout-btn" @click="logout" />
      <div class="pend-hint">هل تم تفعيل حسابك؟</div>
      <q-btn flat rounded color="white" label="دخول مجدداً" @click="$router.push('/login')" />
    </div>
  </q-page>
</template>

<script setup>
import { useStudentAuthStore } from 'src/stores/auth'
import { useRouter } from 'vue-router'

const auth = useStudentAuthStore()
const router = useRouter()
const logout = () => { auth.logout(); router.push('/login') }
</script>

<style scoped>
.pend-page { background: linear-gradient(150deg, #0f172a, #1d4ed8); min-height: 100vh; }
.pend-body { display: flex; flex-direction: column; align-items: center; padding: 80px 24px 40px; text-align: center; }
.pend-icon { width: 88px; height: 88px; background: rgba(255,255,255,0.15); border-radius: 100%; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
.pend-title { font-size: 24px; font-weight: 900; color: white; margin-bottom: 8px; }
.pend-sub { font-size: 13px; color: rgba(255,255,255,0.75); line-height: 1.6; max-width: 300px; margin-bottom: 28px; }
.pend-card { background: rgba(255,255,255,0.1); border-radius: 18px; padding: 16px; width: 100%; max-width: 320px; margin-bottom: 28px; }
.pend-row { display: flex; align-items: center; gap: 10px; padding: 8px 0; font-weight: 700; color: white; font-size: 14px; }
.pend-row:not(:last-child) { border-bottom: 1px solid rgba(255,255,255,0.1); }
.logout-btn { width: 100%; max-width: 280px; padding: 12px !important; font-weight: 800; margin-bottom: 16px; }
.pend-hint { font-size: 12px; color: rgba(255,255,255,0.6); margin-bottom: 4px; }
</style>
