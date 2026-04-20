import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

// API_URL is embedded at build time via quasar.config.js build.env
// Falls back to server IP for production Capacitor builds
const API_URL = process.env.API_URL || 'http://213.199.52.14:3055'
const api = axios.create({ baseURL: `${API_URL}/api` })

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
