import { api } from './client'

export type GeneratePayload = { url?: string; descripcion?: string; idioma?: string; captcha_token?: string }

export async function generarAnuncio(payload: GeneratePayload) {
  const { data } = await api.post('/v1/generar-anuncio', payload)
  return data
}

export type LaunchPayload = { url?: string; presupuesto?: number; audiencia?: string; captcha_token?: string }

export async function lanzarCampana(payload: LaunchPayload) {
  const { data } = await api.post('/v1/lanzar-campana', payload)
  return data
}
