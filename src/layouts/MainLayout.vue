<template>
  <q-layout view="lHh lpr lFf" dir="rtl" class="bg-slate-50">
    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>

    <!-- Bottom Navigation -->
    <q-footer class="bottom-nav">
      <div class="nav-items">
        <router-link v-for="item in navItems" :key="item.path"
          :to="item.path" custom v-slot="{ isActive, isExactActive, navigate }">
          <div class="nav-item" :class="{ 'nav-item--active': item.path === '/' ? isExactActive : isActive }" @click="navigate">
            <div class="nav-icon-wrap" :class="{ 'nav-icon-wrap--active': item.path === '/' ? isExactActive : isActive }">
              <q-icon :name="(item.path === '/' ? isExactActive : isActive) ? item.iconFilled : item.icon" size="22px" />
            </div>
            <span class="nav-label">{{ item.label }}</span>
          </div>
        </router-link>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { useStudentAuthStore } from 'src/stores/auth'

const auth = useStudentAuthStore()

const navItems = [
  { path: '/',          icon: 'home',           iconFilled: 'home',            label: 'الرئيسية' },
  { path: '/sections',  icon: 'play_circle',    iconFilled: 'play_circle_filled', label: 'الدروس' },
  { path: '/exams',     icon: 'description',    iconFilled: 'description',     label: 'الامتحانات' },
  { path: '/profile',   icon: 'person_outline', iconFilled: 'person',          label: 'حسابي' },
]
</script>

<style scoped>
.bottom-nav {
  background: transparent;
  padding: 0 16px;
  padding-bottom: max(env(safe-area-inset-bottom), 16px);
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 2000;
}
.nav-items {
  display: flex;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  padding: 6px 8px;
}
.nav-item {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 8px 4px;
  cursor: pointer; text-decoration: none; color: #94a3b8;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 16px;
}
.nav-item:active { transform: scale(0.92); }
.nav-item--active { color: #2563eb; }

.nav-icon-wrap {
  width: 44px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 12px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.nav-icon-wrap--active {
  background: #eff6ff;
  transform: translateY(-2px);
}

.nav-label { font-size: 11px; font-weight: 800; margin-top: 4px; transition: all 0.3s; }
.nav-item--active .nav-label { color: #1e293b; }
</style>
