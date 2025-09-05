import { useEffect, useState } from 'react'
import Card from '@components/Card'
import { motion } from 'framer-motion'
import { supabase } from '@api/supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  useEffect(() => {
    // Supabase handles the access token from the magic link automatically
    // on this page via the URL fragment. No extra code is required.
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg(null)
    if (password !== confirm) {
      setMsg('Las contraseñas no coinciden')
      return
    }
    if (!supabase) {
      setMsg('Supabase no está configurado')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setMsg('Contraseña actualizada. Redirigiendo...')
      setTimeout(() => nav('/login'), 1200)
    } catch (err: any) {
      setMsg(err?.message || 'No se pudo actualizar la contraseña')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <h1 className="text-xl font-semibold mb-2">Restablecer contraseña</h1>
        <p className="text-sm text-zinc-400 mb-6">Ingresa tu nueva contraseña</p>
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2" placeholder="Nueva contraseña" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <input className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2" placeholder="Confirmar contraseña" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} required />
          <motion.button whileTap={{ scale: 0.98 }} disabled={loading} className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 rounded px-3 py-2">{loading ? 'Actualizando...' : 'Actualizar contraseña'}</motion.button>
        </form>
        {msg && <div className="text-sm text-zinc-400 mt-2">{msg}</div>}
      </Card>
    </div>
  )
}
