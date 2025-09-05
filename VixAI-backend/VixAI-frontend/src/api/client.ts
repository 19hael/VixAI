import axios from 'axios'

const ENV = (import.meta as any).env || {}
export const API_URL = ENV.VITE_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
})
