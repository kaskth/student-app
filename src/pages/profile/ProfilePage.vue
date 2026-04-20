<template>
  <q-page class="profile-page" dir="rtl">
    <div class="profile-hero">
      <div class="profile-avatar">
        <q-icon name="person" size="36px" color="white" />
      </div>
      <div class="profile-name">{{ auth.student?.name }}</div>
      <div class="profile-badge">
        <q-icon :name="auth.isOnline ? 'wifi' : 'location_on'" size="13px" />
        {{ auth.isOnline ? 'أونلاين' : 'سنتر' }} · {{ auth.student?.academicYearName }}
      </div>
    </div>

    <div class="profile-body">
      <!-- Stats -->
      <div class="stats-grid" v-if="store.profile">
        <div class="stat-tile">
          <div class="stat-n">{{ store.profile.stats.attendanceRate }}%</div>
          <div class="stat-l">الحضور</div>
        </div>
        <div class="stat-tile">
          <div class="stat-n">{{ store.profile.stats.totalExams }}</div>
          <div class="stat-l">امتحانات</div>
        </div>
        <div class="stat-tile">
          <div class="stat-n">{{ store.profile.stats.examsPassed }}</div>
          <div class="stat-l">نجحت فيها</div>
        </div>
        <div class="stat-tile">
          <div class="stat-n">{{ store.profile.stats.activeCodes }}</div>
          <div class="stat-l">كودات</div>
        </div>
      </div>

      <!-- Menu Items -->
      <div class="menu-section">
        <div class="menu-item" @click="$router.push('/codes')">
          <div class="menu-icon menu-icon--purple"><q-icon name="qr_code" size="20px" color="white" /></div>
          <div class="menu-label">كوداتي وإضافة كود</div>
          <q-icon name="chevron_left" size="20px" color="grey-4" />
        </div>
        <div class="menu-item" v-if="auth.isCenter" @click="$router.push('/attendance')">
          <div class="menu-icon menu-icon--blue"><q-icon name="how_to_reg" size="20px" color="white" /></div>
          <div class="menu-label">سجل الحضور والغياب</div>
          <q-icon name="chevron_left" size="20px" color="grey-4" />
        </div>
        <div class="menu-item" v-if="auth.student?.parentPhone" @click="$router.push('/parent')">
          <div class="menu-icon menu-icon--green"><q-icon name="supervised_user_circle" size="20px" color="white" /></div>
          <div class="menu-label">لوحة ولي الأمر</div>
          <q-icon name="chevron_left" size="20px" color="grey-4" />
        </div>
      </div>

      <!-- Info Card -->
      <div class="info-card" v-if="store.profile">
        <div class="info-row"><q-icon name="phone" size="16px" color="grey-5" /><span>{{ store.profile.phone }}</span></div>
        <div class="info-row" v-if="store.profile.parentPhone"><q-icon name="family_restroom" size="16px" color="grey-5" /><span>{{ store.profile.parentPhone }}</span></div>
        <div class="info-row"><q-icon name="school" size="16px" color="grey-5" /><span>{{ store.profile.academicYear?.name }}</span></div>
        <div class="info-row" v-if="store.profile.center"><q-icon name="location_on" size="16px" color="grey-5" /><span>{{ store.profile.center?.name }}</span></div>
      </div>

      <q-btn flat rounded color="negative" icon="logout" label="تسجيل الخروج"
        class="full-width logout-btn" @click="logout" />
    </div>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStudentAuthStore } from 'src/stores/auth'
import { useStudentProfileStore } from 'src/stores/student'
import { useQuasar } from 'quasar'

const auth = useStudentAuthStore()
const store = useStudentProfileStore()
const router = useRouter()
const $q = useQuasar()

onMounted(() => store.fetchProfile())

const logout = () => {
  $q.dialog({ title: 'تسجيل الخروج', message: 'هل تريد تسجيل الخروج؟', cancel: true, persistent: true })
    .onOk(() => { auth.logout(); router.push('/login') })
}
</script>

<style scoped>
.profile-page { background: #f0f4f8; min-height: 100vh; }

.profile-hero {
  background: linear-gradient(150deg, #0f172a, #1d4ed8);
  padding: 40px 16px 52px;
  padding-top: max(env(safe-area-inset-top), 40px);
  display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px;
}
.profile-avatar { width: 72px; height: 72px; background: rgba(255,255,255,0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.profile-name { font-size: 22px; font-weight: 900; color: white; }
.profile-badge { display: inline-flex; align-items: center; gap: 5px; background: rgba(255,255,255,0.12); border-radius: 20px; padding: 5px 12px; font-size: 12px; color: rgba(255,255,255,0.85); font-weight: 700; }

.profile-body { padding: 12px 12px 80px; margin-top: -30px; display: flex; flex-direction: column; gap: 12px; }

.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; background: white; border-radius: 18px; padding: 14px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
.stat-tile { text-align: center; }
.stat-n { font-size: 20px; font-weight: 900; color: #1e293b; }
.stat-l { font-size: 10px; color: #94a3b8; font-weight: 600; }

.menu-section { background: white; border-radius: 18px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.06); }
.menu-item { display: flex; align-items: center; gap: 12px; padding: 14px 16px; cursor: pointer; border-bottom: 1px solid #f8fafc; transition: background 0.15s; }
.menu-item:last-child { border-bottom: none; }
.menu-item:hover { background: #f8fafc; }
.menu-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.menu-icon--purple { background: linear-gradient(135deg, #7c3aed, #8b5cf6); }
.menu-icon--blue   { background: linear-gradient(135deg, #1d4ed8, #3b82f6); }
.menu-icon--green  { background: linear-gradient(135deg, #059669, #10b981); }
.menu-label { flex: 1; font-size: 14px; font-weight: 700; color: #1e293b; }

.info-card { background: white; border-radius: 18px; padding: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); }
.info-row { display: flex; align-items: center; gap: 10px; padding: 8px 0; font-size: 13px; color: #334155; font-weight: 600; }
.info-row:not(:last-child) { border-bottom: 1px solid #f8fafc; }

.logout-btn { font-weight: 700; margin-top: 4px; }
</style>
