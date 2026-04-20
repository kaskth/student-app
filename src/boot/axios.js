import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

// Read from .env file during build, otherwise fallback to local IP
const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3000`
const api = axios.create({ baseURL: `${API_URL}/api` })

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
