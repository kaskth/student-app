import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useStudentAuthStore = defineStore('studentAuth', {
  state: () => ({
    token: null,
    student: null,
    role: 'student', // 'student' | 'parent'
  }),

  persist: true,

  getters: {
    isLoggedIn: (s) => !!s.token && !!s.student,
    isOnline: (s) => s.student?.learningType === 'ONLINE',
    isCenter: (s) => s.student?.learningType === 'CENTER',
  },

  actions: {
    _headers() {
      return { Authorization: `Bearer ${this.token}` }
    },

    async register(payload) {
      try {
        const { data } = await api.post('/student/auth/register', payload)
        if (data.status === 'active') {
          this.token = data.token
          this.student = data.student
          this.role = 'student'
        }
        return { success: true, data }
      } catch (e) {
        return { success: false, message: e?.response?.data?.message || 'فشل التسجيل' }
      }
    },

    async login(phone, password) {
      try {
        const { data } = await api.post('/student/auth/login', { phone, password })
        this.token = data.token
        this.student = data.student
        this.role = 'student'
        return { success: true }
      } catch (e) {
        return { success: false, message: e?.response?.data?.message || 'بيانات خاطئة' }
      }
    },

    async parentLogin(parentPhone, studentPhone) {
      try {
        const { data } = await api.post('/student/auth/parent-login', { parentPhone, studentPhone })
        this.token = data.token
        this.student = data.student
        this.role = 'parent'
        return { success: true }
      } catch (e) {
        return { success: false, message: e?.response?.data?.message || 'بيانات خاطئة' }
      }
    },

    async getRegistrationData() {
      try {
        const { data } = await api.get('/student/auth/registration-data')
        return { success: true, data }
      } catch (e) {
        return { success: false, data: { academicYears: [], centers: [] } }
      }
    },

    logout() {
      this.token = null
      this.student = null
      this.role = 'student'
    },
  },
})
