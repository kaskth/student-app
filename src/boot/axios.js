import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

// API_URL is injected at build time via quasar.config.js -> build.env
// process.env.API_URL gets replaced with the actual value during 'quasar build'
const API_URL = process.env.API_URL || 'http://213.199.52.14:3055'
const api = axios.create({ baseURL: `${API_URL}/api` })

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
