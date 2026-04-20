<template>
  <q-page class="reg-page" dir="rtl">
    <!-- Hero -->
    <div class="reg-hero">
      <q-btn flat round icon="arrow_forward" color="white"
        class="back-btn" @click="step > 1 ? step-- : $router.push('/login')" />
      <div class="hero-title">إنشاء حساب جديد</div>
      <div class="hero-steps">
        <div v-for="i in 3" :key="i"
          class="step-dot" :class="{ 'step-dot--active': step >= i, 'step-dot--done': step > i }" />
      </div>
    </div>

    <div class="reg-card">
      <!-- STEP 1: بيانات أساسية -->
      <q-form v-if="step === 1" @submit="step = 2" class="step-form">
        <div class="step-title">البيانات الأساسية</div>

        <div class="field-label">الاسم الكامل</div>
        <q-input v-model="form.name" outlined dense placeholder="محمد أحمد"
          :rules="[v => !!v?.trim() || 'الاسم مطلوب']" class="q-mb-sm" />

        <div class="field-label">رقم هاتفك</div>
        <q-input v-model="form.phone" outlined dense type="tel" placeholder="01xxxxxxxxx"
          :rules="[v => !!v?.trim() || 'الهاتف مطلوب']" class="q-mb-sm" />

        <div class="field-label">رقم هاتف ولي الأمر (اختياري)</div>
        <q-input v-model="form.parentPhone" outlined dense type="tel" placeholder="01xxxxxxxxx" class="q-mb-sm" />

        <div class="field-label">كلمة المرور</div>
        <q-input v-model="form.password" :type="showPass ? 'text' : 'password'" outlined dense
          placeholder="6 أحرف على الأقل"
          :rules="[v => v?.length >= 6 || 'كلمة المرور قصيرة']" class="q-mb-lg">
          <template #append>
            <q-icon :name="showPass ? 'visibility_off' : 'visibility'"
              class="cursor-pointer" @click="showPass = !showPass" />
          </template>
        </q-input>

        <q-btn unelevated rounded type="submit" color="primary" label="التالي ←" class="full-width next-btn" />
      </q-form>

      <!-- STEP 2: المرحلة الدراسية -->
      <div v-else-if="step === 2" class="step-form">
        <div class="step-title">المرحلة الدراسية</div>
        <div class="step-sub">اختر سنتك الدراسية</div>

        <div v-if="loadingData" class="flex-center q-py-xl"><q-spinner-ios color="primary" size="36px" /></div>
        <div v-else class="year-list">
          <div v-for="yr in years" :key="yr.id"
            class="year-card" :class="{ 'year-card--selected': form.academicYearId === yr.id }"
            @click="form.academicYearId = yr.id">
            <q-icon name="school" size="20px" :color="form.academicYearId === yr.id ? 'white' : 'primary'" />
            <span>{{ yr.name }}</span>
            <q-icon v-if="form.academicYearId === yr.id" name="check_circle" size="18px" color="white" style="margin-right:auto" />
          </div>
        </div>

        <q-btn unelevated rounded color="primary" label="التالي ←"
          :disable="!form.academicYearId" class="full-width next-btn q-mt-lg"
          @click="step = 3" />
      </div>

      <!-- STEP 3: نوع التعليم -->
      <div v-else-if="step === 3" class="step-form">
        <div class="step-title">نوع التعليم</div>

        <div class="type-grid">
          <div class="type-card" :class="{ 'type-card--active': form.learningType === 'ONLINE' }"
            @click="form.learningType = 'ONLINE'; form.centerId = null">
            <q-icon name="wifi" size="28px" :color="form.learningType === 'ONLINE' ? 'white' : 'primary'" />
            <div class="type-name">أونلاين</div>
            <div class="type-desc">يشاهد الدروس من المنزل ويبدأ فوراً</div>
            <q-icon v-if="form.learningType === 'ONLINE'" name="check_circle" size="16px" color="white" class="type-check" />
          </div>
          <div class="type-card" :class="{ 'type-card--active': form.learningType === 'CENTER' }"
            @click="form.learningType = 'CENTER'">
            <q-icon name="location_on" size="28px" :color="form.learningType === 'CENTER' ? 'white' : 'primary'" />
            <div class="type-name">سنتر</div>
            <div class="type-desc">يحضر بشكل منتظم ويحتاج موافقة المسئول</div>
            <q-icon v-if="form.learningType === 'CENTER'" name="check_circle" size="16px" color="white" class="type-check" />
          </div>
        </div>

        <!-- اختيار السنتر -->
        <div v-if="form.learningType === 'CENTER'" class="centers-section">
          <div class="field-label q-mt-md">اختر السنتر</div>
          <div class="center-list">
            <div v-for="c in centers" :key="c.id"
              class="center-item" :class="{ 'center-item--selected': form.centerId === c.id }"
              @click="form.centerId = c.id">
              <q-icon name="location_on" size="16px" />
              <span>{{ c.name }}</span>
              <q-icon v-if="form.centerId === c.id" name="check" size="16px" style="margin-right:auto" />
            </div>
          </div>
        </div>

        <q-btn unelevated rounded color="positive" label="إنشاء الحساب"
          :disable="!form.learningType || (form.learningType === 'CENTER' && !form.centerId)"
          class="full-width next-btn q-mt-lg" :loading="loading"
          @click="register" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useStudentAuthStore } from 'src/stores/auth'

const $q = useQuasar()
const router = useRouter()
const auth = useStudentAuthStore()

const step = ref(1), loading = ref(false), loadingData = ref(false), showPass = ref(false)
const years = ref([]), centers = ref([])

const form = ref({
  name: '', phone: '', parentPhone: '', password: '',
  academicYearId: null, learningType: null, centerId: null,
})

onMounted(async () => {
  loadingData.value = true
  const res = await auth.getRegistrationData()
  years.value = res.data.academicYears
  centers.value = res.data.centers
  loadingData.value = false
})

const register = async () => {
  loading.value = true
  const res = await auth.register({
    name: form.value.name,
    phone: form.value.phone,
    parentPhone: form.value.parentPhone || undefined,
    password: form.value.password,
    learningType: form.value.learningType,
    academicYearId: form.value.academicYearId,
    centerId: form.value.centerId || undefined,
  })
  loading.value = false

  if (!res.success) {
    $q.notify({ color: 'negative', message: res.message, icon: 'error' })
    return
  }

  if (res.data.status === 'pending') {
    router.push('/pending')
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
.reg-page { background: #f0f4f8; min-height: 100vh; }

.reg-hero {
  background: linear-gradient(150deg, #0f172a, #1d4ed8);
  padding: 18px 16px 48px;
  padding-top: max(env(safe-area-inset-top), 18px);
  display: flex; flex-direction: column; gap: 8px;
}
.back-btn { background: rgba(255,255,255,0.12); align-self: flex-start; }
.hero-title { font-size: 22px; font-weight: 900; color: white; }
.hero-steps { display: flex; gap: 6px; }
.step-dot { width: 24px; height: 5px; border-radius: 3px; background: rgba(255,255,255,0.25); transition: all 0.3s; }
.step-dot--active { background: white; }
.step-dot--done { background: #10b981; }

.reg-card { margin: -28px 14px 24px; background: white; border-radius: 22px; box-shadow: 0 8px 28px rgba(0,0,0,0.08); }
.step-form { padding: 22px; }
.step-title { font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 4px; }
.step-sub   { font-size: 12px; color: #64748b; margin-bottom: 14px; }
.field-label { font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 4px; }
.next-btn { font-size: 15px; font-weight: 800; padding: 12px !important; }

/* Year Cards */
.year-list { display: flex; flex-direction: column; gap: 8px; }
.year-card { display: flex; align-items: center; gap: 10px; padding: 14px; border-radius: 14px; background: #f8fafc; border: 2px solid #e2e8f0; cursor: pointer; font-weight: 700; color: #334155; transition: all 0.2s; }
.year-card--selected { background: linear-gradient(135deg, #1d4ed8, #3b82f6); color: white; border-color: transparent; }

/* Type Grid */
.type-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.type-card { position: relative; padding: 16px 12px; border-radius: 16px; background: #f8fafc; border: 2px solid #e2e8f0; cursor: pointer; text-align: center; transition: all 0.2s; }
.type-card--active { background: linear-gradient(135deg, #1d4ed8, #3b82f6); border-color: transparent; }
.type-name { font-size: 14px; font-weight: 800; margin-top: 8px; color: inherit; }
.type-desc { font-size: 10px; color: inherit; opacity: 0.7; margin-top: 4px; line-height: 1.4; }
.type-card--active .type-name, .type-card--active .type-desc { color: white; }
.type-check { position: absolute; top: 8px; left: 8px; }

/* Center List */
.center-list { display: flex; flex-direction: column; gap: 6px; max-height: 200px; overflow-y: auto; }
.center-item { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-radius: 10px; background: #f8fafc; border: 1.5px solid #e2e8f0; cursor: pointer; font-size: 13px; font-weight: 700; color: #334155; }
.center-item--selected { background: #eff6ff; border-color: #3b82f6; color: #1d4ed8; }

.flex-center { display: flex; justify-content: center; }
</style>
