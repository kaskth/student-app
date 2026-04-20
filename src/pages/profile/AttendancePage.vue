<template>
  <q-page class="att-page" dir="rtl">
    <div class="att-hero">
      <q-btn flat round icon="arrow_forward" color="white" @click="$router.back()" />
      <div class="hero-text">
        <div class="hero-title">سجل الحضور</div>
        <div class="hero-sub">{{ rate }}% معدل الحضور</div>
      </div>
    </div>

    <!-- Summary -->
    <div class="att-summary">
      <div class="sum-tile sum-tile--green"><div class="sum-n">{{ presentCount }}</div><div class="sum-l">حضور</div></div>
      <div class="sum-div" />
      <div class="sum-tile sum-tile--red"><div class="sum-n">{{ absentCount }}</div><div class="sum-l">غياب</div></div>
      <div class="sum-div" />
      <div class="sum-tile"><div class="sum-n">{{ store.attendance.length }}</div><div class="sum-l">إجمالي</div></div>
    </div>

    <div class="att-body">
      <div v-if="loading" class="center-box"><q-spinner-ios color="primary" size="40px" /></div>

      <div v-else-if="!store.attendance.length" class="empty-box">
        <q-icon name="event_busy" size="52px" color="grey-3" />
        <div class="empty-txt">لا يوجد سجل حضور بعد</div>
      </div>

      <div v-else class="att-list">
        <div v-for="a in store.attendance" :key="a.id" class="att-row">
          <div class="att-dot" :class="`dot--${a.status.toLowerCase()}`" />
          <div class="flex-1">
            <div class="att-session">{{ a.session?.title || 'حصة' }}</div>
            <div class="att-date">{{ formatDate(a.session?.scheduledAt) }}</div>
          </div>
          <div class="att-status-chip" :class="`chip--${a.status.toLowerCase()}`">{{ statusLabel(a.status) }}</div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStudentProfileStore } from 'src/stores/student'

const store = useStudentProfileStore()
const loading = ref(true)

onMounted(async () => {
  await store.fetchAttendance()
  loading.value = false
})

const presentCount = computed(() => store.attendance.filter(a => ['PRESENT','ONLINE','MAKEUP'].includes(a.status)).length)
const absentCount  = computed(() => store.attendance.filter(a => a.status === 'ABSENT').length)
const rate         = computed(() => store.attendance.length ? Math.round(presentCount.value / store.attendance.length * 100) : 0)

const statusLabel = (s) => ({ PRESENT: 'حضور', ABSENT: 'غياب', ONLINE: 'أونلاين', MAKEUP: 'تعويض', LATE: 'متأخر' }[s] || s)
const formatDate  = (d) => d ? new Date(d).toLocaleDateString('ar-EG', { weekday: 'short', day: 'numeric', month: 'short' }) : ''
</script>

<style scoped>
.att-page { background: #f0f4f8; min-height: 100vh; }
.att-hero {
  background: linear-gradient(150deg, #0f172a, #1d4ed8);
  padding: 16px;
  padding-top: max(env(safe-area-inset-top), 16px);
  display: flex; align-items: center; gap: 10px;
}
.hero-text { flex: 1; }
.hero-title { font-size: 20px; font-weight: 900; color: white; }
.hero-sub   { font-size: 12px; color: rgba(255,255,255,0.65); }

.att-summary { display: flex; background: white; margin: -1px 12px 0; border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); padding: 14px; }
.sum-tile { flex: 1; text-align: center; }
.sum-n { font-size: 22px; font-weight: 900; color: #1e293b; }
.sum-l { font-size: 11px; color: #94a3b8; font-weight: 600; }
.sum-tile--green .sum-n { color: #059669; }
.sum-tile--red   .sum-n { color: #dc2626; }
.sum-div { width: 1px; background: #e2e8f0; margin: 4px 0; }

.att-body { padding: 12px 12px 80px; margin-top: 10px; }
.center-box { display: flex; justify-content: center; padding: 60px; }
.empty-box  { display: flex; flex-direction: column; align-items: center; padding: 60px; gap: 10px; }
.empty-txt  { font-size: 14px; font-weight: 700; color: #94a3b8; }

.att-list { display: flex; flex-direction: column; gap: 0; background: white; border-radius: 18px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.06); }
.att-row { display: flex; align-items: center; gap: 12px; padding: 13px 14px; border-bottom: 1px solid #f8fafc; }
.att-row:last-child { border-bottom: none; }
.att-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.dot--present, .dot--online, .dot--makeup { background: #10b981; }
.dot--absent { background: #ef4444; }
.dot--late   { background: #f59e0b; }
.att-session { font-size: 13px; font-weight: 700; color: #1e293b; }
.att-date    { font-size: 11px; color: #94a3b8; }
.att-status-chip { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; white-space: nowrap; }
.chip--present, .chip--online, .chip--makeup { background: #ecfdf5; color: #059669; }
.chip--absent { background: #fef2f2; color: #dc2626; }
.chip--late   { background: #fffbeb; color: #d97706; }
.flex-1 { flex: 1; min-width: 0; }
</style>
