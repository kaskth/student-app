<template>
  <q-page class="parent-page" dir="rtl">
    <div class="parent-hero">
      <q-btn flat round icon="arrow_forward" color="white" @click="$router.back()" />
      <div class="hero-text">
        <div class="hero-title">لوحة ولي الأمر</div>
        <div class="hero-sub">متابعة أداء الطالب</div>
      </div>
      <q-icon name="supervised_user_circle" size="28px" color="white" />
    </div>

    <div v-if="loading" class="center-box"><q-spinner-ios color="primary" size="40px" /></div>

    <div v-else-if="data" class="parent-body">
      <!-- Student Info -->
      <div class="student-card">
        <div class="student-avatar"><q-icon name="person" size="30px" color="white" /></div>
        <div>
          <div class="student-name">{{ data.student.name }}</div>
          <div class="student-info">{{ data.student.academicYear?.name }} · {{ data.student.learningType === 'ONLINE' ? 'أونلاين' : data.student.center?.name }}</div>
        </div>
      </div>

      <!-- Attendance Stats -->
      <div class="section-title"><q-icon name="event_available" size="14px" color="primary" />الحضور والغياب</div>
      <div class="stat-row">
        <div class="stat-tile stat-tile--green"><div class="sn">{{ data.stats.presentCount }}</div><div class="sl">حضر</div></div>
        <div class="stat-tile stat-tile--red"><div class="sn">{{ data.stats.totalSessions - data.stats.presentCount }}</div><div class="sl">غاب</div></div>
        <div class="stat-tile stat-tile--blue"><div class="sn">{{ data.stats.attendanceRate }}%</div><div class="sl">معدل الحضور</div></div>
      </div>

      <!-- Recent Attendance -->
      <div class="att-list" v-if="data.recentAttendance?.length">
        <div v-for="a in data.recentAttendance" :key="a.id" class="att-row">
          <div class="att-dot" :class="['PRESENT','ONLINE','MAKEUP'].includes(a.status) ? 'dot--present' : 'dot--absent'" />
          <div class="flex-1">
            <div class="att-ses">{{ a.session?.title }}</div>
            <div class="att-date">{{ formatDate(a.session?.scheduledAt) }}</div>
          </div>
          <div class="att-chip" :class="['PRESENT','ONLINE','MAKEUP'].includes(a.status) ? 'chip--green' : 'chip--red'">
            {{ { PRESENT: 'حضور', ABSENT: 'غياب', ONLINE: 'أون', MAKEUP: 'تعويض' }[a.status] || a.status }}
          </div>
        </div>
      </div>

      <!-- Exam Results -->
      <div class="section-title" v-if="data.recentExams?.length"><q-icon name="description" size="14px" color="purple" />آخر الامتحانات</div>
      <div class="exam-list">
        <div v-for="r in data.recentExams" :key="r.id" class="exam-row">
          <div class="exam-ic" :class="r.score >= (r.exam.passScore || 0) ? 'ic--pass' : 'ic--fail'">
            <q-icon :name="r.score >= (r.exam.passScore || 0) ? 'check' : 'close'" size="14px" color="white" />
          </div>
          <div class="flex-1">
            <div class="exam-name">{{ r.exam.title }}</div>
            <div class="exam-date">{{ formatDate(r.completedAt) }}</div>
          </div>
          <div class="exam-score" :class="r.score >= (r.exam.passScore || 0) ? 'sc--pass' : 'sc--fail'">
            {{ r.score }}/{{ r.exam.totalScore }}
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStudentProfileStore } from 'src/stores/student'

const store = useStudentProfileStore()
const loading = ref(true)
const data = ref(null)

onMounted(async () => {
  data.value = await store.fetchParentDashboard()
  loading.value = false
})

const formatDate = (d) => d ? new Date(d).toLocaleDateString('ar-EG', { weekday: 'short', day: 'numeric', month: 'short' }) : ''
</script>

<style scoped>
.parent-page { background: #f0f4f8; min-height: 100vh; }
.parent-hero {
  background: linear-gradient(150deg, #1e293b, #059669);
  padding: 16px;
  padding-top: max(env(safe-area-inset-top), 16px);
  display: flex; align-items: center; gap: 10px;
}
.hero-text { flex: 1; }
.hero-title { font-size: 20px; font-weight: 900; color: white; }
.hero-sub   { font-size: 12px; color: rgba(255,255,255,0.65); }
.center-box { display: flex; justify-content: center; padding: 80px; }

.parent-body { padding: 12px 12px 80px; display: flex; flex-direction: column; gap: 12px; }

.student-card { background: linear-gradient(135deg, #1d4ed8, #3b82f6); border-radius: 18px; padding: 16px; display: flex; align-items: center; gap: 12px; box-shadow: 0 4px 14px rgba(29,78,216,0.25); }
.student-avatar { width: 52px; height: 52px; background: rgba(255,255,255,0.18); border-radius: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.student-name { font-size: 18px; font-weight: 900; color: white; }
.student-info { font-size: 12px; color: rgba(255,255,255,0.75); }

.section-title { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 800; color: #334155; }
.stat-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.stat-tile { background: white; border-radius: 14px; padding: 12px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.sn { font-size: 20px; font-weight: 900; color: #1e293b; }
.sl { font-size: 10px; color: #94a3b8; font-weight: 600; }
.stat-tile--green .sn { color: #059669; }
.stat-tile--red   .sn { color: #dc2626; }
.stat-tile--blue  .sn { color: #2563eb; }

.att-list { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.att-row  { display: flex; align-items: center; gap: 10px; padding: 11px 14px; border-bottom: 1px solid #f8fafc; }
.att-row:last-child { border-bottom: none; }
.att-dot  { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.dot--present { background: #10b981; }
.dot--absent  { background: #ef4444; }
.att-ses  { font-size: 13px; font-weight: 700; color: #1e293b; }
.att-date { font-size: 11px; color: #94a3b8; }
.att-chip { font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 20px; }
.chip--green { background: #ecfdf5; color: #059669; }
.chip--red   { background: #fef2f2; color: #dc2626; }

.exam-list { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.exam-row  { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-bottom: 1px solid #f8fafc; }
.exam-row:last-child { border-bottom: none; }
.exam-ic   { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ic--pass  { background: #10b981; }
.ic--fail  { background: #ef4444; }
.exam-name { font-size: 13px; font-weight: 700; color: #1e293b; }
.exam-date { font-size: 11px; color: #94a3b8; }
.exam-score { font-size: 14px; font-weight: 800; }
.sc--pass  { color: #059669; }
.sc--fail  { color: #dc2626; }
.flex-1 { flex: 1; min-width: 0; }
</style>
