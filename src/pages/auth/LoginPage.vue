<template>
  <q-page class="login-page" dir="rtl">
    <!-- Hero -->
    <div class="login-hero">
      <div class="hero-logo">
        <img src="~assets/logo.png" alt="Logo" class="app-logo" />
      </div>
      <div class="hero-sub">تسجيل الدخول إلى حسابك</div>
    </div>

    <!-- Card -->
    <div class="login-card">
      <q-form @submit="submit" class="form-body">

        <div class="form-label">رقم الهاتف</div>
        <q-input v-model="phone" type="tel" outlined dense
          placeholder="01xxxxxxxxx"
          :rules="[v => !!v || 'مطلوب']"
          class="q-mb-sm" />

        <div class="form-label">كلمة المرور</div>
        <q-input v-model="password" :type="showPass ? 'text' : 'password'" outlined dense
          placeholder="كلمة المرور"
          :rules="[v => !!v || 'مطلوب']"
          class="q-mb-lg">
          <template #append>
            <q-icon :name="showPass ? 'visibility_off' : 'visibility'"
              class="cursor-pointer" @click="showPass = !showPass" />
          </template>
        </q-input>

        <q-btn unelevated rounded type="submit" color="primary"
          label="دخول" class="full-width submit-btn" :loading="loading" />

        <div class="divider-row"><span>أو</span></div>

        <q-btn flat rounded color="primary" label="دخول كولي أمر"
          class="full-width" icon="supervised_user_circle" @click="parentMode = true" />

        <div class="register-link">
          ليس لديك حساب؟
          <span @click="$router.push('/register')">سجّل الآن</span>
        </div>
      </q-form>
    </div>

    <!-- Parent Dialog -->
    <q-dialog v-model="parentMode" position="bottom">
      <q-card class="parent-card" dir="rtl">
        <div class="parent-header">
          <q-icon name="supervised_user_circle" size="20px" color="white" />
          <span>دخول ولي الأمر</span>
          <q-btn flat round dense icon="close" color="white" v-close-popup size="sm" style="margin-right:auto" />
        </div>
        <div class="parent-body">
          <q-input v-model="parentPhone" outlined dense label="رقم هاتف ولي الأمر" class="q-mb-sm" />
          <q-input v-model="studentPhone" outlined dense label="رقم هاتف الطالب" class="q-mb-md" />
          <q-btn unelevated rounded color="primary" label="دخول" class="full-width"
            :loading="loading" @click="parentLogin" />
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useStudentAuthStore } from 'src/stores/auth'

const $q = useQuasar()
const router = useRouter()
const auth = useStudentAuthStore()

const phone = ref(''), password = ref(''), showPass = ref(false), loading = ref(false)
const parentMode = ref(false), parentPhone = ref(''), studentPhone = ref('')

const submit = async () => {
  loading.value = true
  const res = await auth.login(phone.value, password.value)
  loading.value = false
  if (res.success) router.push('/')
  else $q.notify({ color: 'negative', message: res.message, icon: 'error' })
}

const parentLogin = async () => {
  loading.value = true
  const res = await auth.parentLogin(parentPhone.value, studentPhone.value)
  loading.value = false
  if (res.success) { parentMode.value = false; router.push('/parent') }
  else $q.notify({ color: 'negative', message: res.message, icon: 'error' })
}
</script>

<style scoped>
.login-page { background: #f0f4f8; min-height: 100vh; }

.login-hero {
  background: linear-gradient(150deg, #0f172a, #1d4ed8);
  padding: 60px 24px 80px;
  display: flex; flex-direction: column; align-items: center; text-align: center;
}
.hero-logo { width: 140px; height: 140px; display: flex; align-items: center; justify-content: center; margin-bottom: 8px; }
.app-logo { width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2)); }
.hero-sub   { font-size: 13px; color: rgba(255,255,255,0.7); margin-top: 4px; }

.login-card {
  margin: -40px 16px 0;
  background: white; border-radius: 22px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  overflow: hidden;
}
.form-body { padding: 24px; }
.form-label { font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 4px; }
.submit-btn { font-size: 15px; font-weight: 800; padding: 14px !important; }

.divider-row { display: flex; align-items: center; gap: 8px; margin: 16px 0; }
.divider-row::before, .divider-row::after { content: ''; flex: 1; height: 1px; background: #e2e8f0; }
.divider-row span { font-size: 12px; color: #94a3b8; font-weight: 600; }

.register-link { text-align: center; font-size: 13px; color: #64748b; margin-top: 16px; }
.register-link span { color: #1d4ed8; font-weight: 700; cursor: pointer; }

.parent-card { border-radius: 22px 22px 0 0; }
.parent-header { display: flex; align-items: center; gap: 8px; padding: 16px; background: linear-gradient(135deg, #1e293b, #1d4ed8); color: white; font-weight: 800; font-size: 15px; }
.parent-body { padding: 16px; }
</style>
