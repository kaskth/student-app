import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

// In PRODUCTION (APK): process.env.API_URL is injected by quasar.config.js -> build.env
//   → always connects to the real server: http://213.199.52.14:3055
// In DEVELOPMENT (quasar dev): process.env.API_URL is undefined
//   → falls back to window.location.hostname (local IP auto-detected in browser)
const API_URL = process.env.API_URL || `http://${window.location.hostname}:3055`
const api = axios.create({ baseURL: `${API_URL}/api` })

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
