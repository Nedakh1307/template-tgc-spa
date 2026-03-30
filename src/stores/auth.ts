import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { useStorage } from '../composables/useStorage'
import type { AuthResponse, User } from '../types'

export const useAuthStore = defineStore('auth', () => {
  const storage = useStorage()

  const token = ref<string | null>(storage.get<string>('token'))
  const user = ref<User | null>(storage.get<User>('user'))

  const isAuthenticated = computed(() => !!token.value)

  function login(authData: AuthResponse) {
    token.value = authData.token
    user.value = authData.user
    storage.set('token', authData.token)
    storage.set('user', authData.user)
  }

  function logout() {
    token.value = null
    user.value = null
    storage.remove('token')
    storage.remove('user')
  }

  return { token, user, isAuthenticated, login, logout }
})
