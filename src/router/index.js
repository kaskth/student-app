import { route } from 'quasar/wrappers'
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { useStudentAuthStore } from 'src/stores/auth'

export default route(function () {
  const router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createWebHashHistory(),
  })

  router.beforeEach((to) => {
    const auth = useStudentAuthStore()

    // حماية الصفحات المحمية
    if (to.meta.requiresAuth && !auth.isLoggedIn) {
      return '/login'
    }

    // إذا مسجل دخول ويحاول يفتح login/register → اتجه للرئيسية
    if (auth.isLoggedIn && ['/login', '/register'].includes(to.path)) {
      return '/'
    }
  })

  return router
})
