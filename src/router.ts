import { createRouter, createWebHistory } from 'vue-router'

import HomePage from './pages/HomePage.vue'
import { useAuthStore } from './stores/auth'

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
} as const

const routes = [
  { path: ROUTES.HOME, component: HomePage, meta: { requiresAuth: true } },
  {
    path: ROUTES.LOGIN,
    component: () => import('./pages/LoginPage.vue'),
    meta: { guestOnly: true },
  },
  {
    path: ROUTES.REGISTER,
    component: () => import('./pages/RegisterPage.vue'),
    meta: { guestOnly: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next(ROUTES.LOGIN)
  } else if (to.meta.guestOnly && auth.isAuthenticated) {
    next(ROUTES.HOME)
  } else {
    next()
  }
})

export default router
