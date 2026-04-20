import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

// API_URL is ALWAYS set by quasar.config.js build.env:
// - dev mode:  http://localhost:3055
// - prod build (APK): http://213.199.52.14:3055
const API_URL = process.env.API_URL
const api = axios.create({ baseURL: `${API_URL}/api` })

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
