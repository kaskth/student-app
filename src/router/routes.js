const routes = [
  // ── Auth pages — كل صفحة لها مسار خاص ──────────────────────
  {
    path: '/login',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/auth/LoginPage.vue') }],
  },
  {
    path: '/register',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/auth/RegisterPage.vue') }],
  },
  {
    path: '/pending',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/auth/PendingPage.vue') }],
  },

  // ── Main App (Bottom Nav) — requiresAuth ──────────────────────
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '',             component: () => import('pages/home/HomePage.vue') },
      { path: 'sections',     component: () => import('pages/content/SectionsPage.vue') },
      { path: 'sections/:id', component: () => import('pages/content/SectionDetailsPage.vue') },
      { path: 'lessons/:id',  component: () => import('pages/content/LessonPage.vue') },
      { path: 'materials',    component: () => import('pages/content/MaterialsPage.vue') },
      { path: 'exams',        component: () => import('pages/exams/ExamsPage.vue') },
      { path: 'exams/:id',    component: () => import('pages/exams/ExamPage.vue') },
      { path: 'results/:id',  component: () => import('pages/exams/ResultPage.vue') },
      { path: 'question-banks',     component: () => import('pages/exams/QuestionBanksPage.vue') },
      { path: 'question-banks/:id', component: () => import('pages/exams/QuestionBankSolvePage.vue') },
      { path: 'attendance',   component: () => import('pages/profile/AttendancePage.vue') },
      { path: 'profile',      component: () => import('pages/profile/ProfilePage.vue') },
      { path: 'codes',        component: () => import('pages/profile/CodesPage.vue') },
      { path: 'parent',       component: () => import('pages/profile/ParentDashboardPage.vue') },
    ],
  },

  // ── 404 ──────────────────────────────────────────────────────
  {
    path: '/:catchAll(.*)*',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/ErrorNotFound.vue') }],
  },
]

export default routes
