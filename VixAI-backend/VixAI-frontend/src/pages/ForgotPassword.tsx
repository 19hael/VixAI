import { useState } from 'react'
import Card from '@components/Card'
import { motion } from 'framer-motion'
import { supabase } from '@api/supabaseClient'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg(null)
    setLoading(true)
    try {
      if (!supabase) throw new Error('Supabase no está configurado')
      const redirectTo = window.location.origin + '/reset'
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
      if (error) throw error
      setMsg('Hemos enviado un enlace para restablecer tu contraseña. Revisa tu email.')
    } catch (err: any) {
      setMsg(err?.message || 'Error al enviar el correo de recuperación')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <h1 className="text-xl font-semibold mb-2">Recuperar contraseña</h1>
        <p className="text-sm text-zinc-400 mb-6">Ingresa tu email y te enviaremos un enlace</p>
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <motion.button whileTap={{ scale: 0.98 }} disabled={loading} className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 rounded px-3 py-2">{loading ? 'Enviando...' : 'Enviar enlace'}</motion.button>
        </form>
        {msg && <div className="text-sm text-zinc-400 mt-2">{msg}</div>}
      </Card>
    </div>
  )
}
