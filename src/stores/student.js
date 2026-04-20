import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { useStudentAuthStore } from './auth'

const h = () => ({ Authorization: `Bearer ${useStudentAuthStore().token}` })

export const useStudentContentStore = defineStore('studentContent', {
  state: () => ({ sections: [], loading: false, error: null }),
  actions: {
    async fetchSections() {
      this.loading = true; this.error = null
      try {
        const { data } = await api.get('/student/content/sections', { headers: h() })
        this.sections = data
        return { success: true }
      } catch (e) {
        this.error = e?.response?.data?.message || 'فشل تحميل المحتوى'
        return { success: false }
      } finally { this.loading = false }
    },
    async getLessonDetails(id) {
      const { data } = await api.get(`/student/content/lessons/${id}`, { headers: h() })
      return data
    },
    async getVideoUrl(lessonId) {
      const { data } = await api.get(`/student/content/lessons/${lessonId}/video`, { headers: h() })
      return data
    },
  },
})

export const useStudentMaterialsStore = defineStore('studentMaterials', {
  state: () => ({ categories: [], loading: false, error: null }),
  actions: {
    async fetchMaterials() {
      this.loading = true; this.error = null
      try {
        const { data } = await api.get('/student/content/materials', { headers: h() })
        this.categories = data
        return { success: true }
      } catch (e) {
        this.error = e?.response?.data?.message || 'فشل تحميل الملفات'
        return { success: false }
      } finally { this.loading = false }
    }
  }
})

export const useStudentQuestionBanksStore = defineStore('studentQuestionBanks', {
  state: () => ({ banks: [], currentBank: null, loading: false }),
  actions: {
    async fetchBanks() {
      this.loading = true
      try {
        const { data } = await api.get('/student/question-banks', { headers: h() })
        this.banks = data
      } finally { this.loading = false }
    },
    async getBankDetails(id) {
      this.loading = true
      try {
        const { data } = await api.get(`/student/question-banks/${id}`, { headers: h() })
        this.currentBank = data
        return data
      } finally { this.loading = false }
    }
  }
})

export const useStudentExamsStore = defineStore('studentExams', {
  state: () => ({ exams: [], loading: false }),
  actions: {
    async fetchExams() {
      this.loading = true
      try {
        const { data } = await api.get('/student/exams', { headers: h() })
        this.exams = data
      } finally { this.loading = false }
    },
    async startExam(id) {
      const { data } = await api.post(`/student/exams/${id}/start`, {}, { headers: h() })
      return data
    },
    async submitExam(id, resultId, answers) {
      const { data } = await api.post(`/student/exams/${id}/submit`, { resultId, answers }, { headers: h() })
      return data
    },
    async getResults() {
      const { data } = await api.get('/student/exams/results', { headers: h() })
      return data
    },
  },
})

export const useStudentProfileStore = defineStore('studentProfile', {
  state: () => ({ profile: null, attendance: [], loading: false }),
  actions: {
    async fetchProfile() {
      this.loading = true
      try {
        const { data } = await api.get('/student/profile', { headers: h() })
        this.profile = data
      } finally { this.loading = false }
    },
    async fetchAttendance() {
      const { data } = await api.get('/student/attendance', { headers: h() })
      this.attendance = data
    },
    async fetchParentDashboard() {
      const { data } = await api.get('/student/parent-dashboard', { headers: h() })
      return data
    },
    async redeemCode(code) {
      try {
        const { data } = await api.post('/student/codes/redeem', { code }, { headers: h() })
        return { success: true, data }
      } catch (e) {
        return { success: false, message: e?.response?.data?.message || 'كود غير صحيح' }
      }
    },
    async getMyCodes() {
      const { data } = await api.get('/student/codes', { headers: h() })
      return data
    },
  },
})
