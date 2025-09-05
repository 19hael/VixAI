import { useState } from 'react'
import { motion } from 'framer-motion'
import Card from '@components/Card'
import { useAuthStore } from '@store/auth'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '@api/supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()
  const { setUser } = useAuthStore()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg(null)
    setLoading(true)
    try {
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        const user = data.user
        setUser({ id: user.id, email: user.email || email, name: user.user_metadata?.name, role: 'user' })
      } else {
        const isAdmin = email === 'support@vixai.lat'
        const id = isAdmin ? 'fc4d9a5a-c2ea-4d49-83b9-6421d13feae3' : crypto.randomUUID()
        setUser({ id, email, name: email.split('@')[0], role: isAdmin ? 'admin' : 'user' })
      }
      nav('/dashboard')
    } catch (err: any) {
      setMsg(err?.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <h1 className="text-xl font-semibold mb-2">Entrar</h1>
        <p className="text-sm text-zinc-400 mb-6">Bienvenido a VixAI</p>
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2" placeholder="Contraseña" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <motion.button whileTap={{ scale: 0.98 }} disabled={loading} className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 rounded px-3 py-2">{loading ? 'Entrando...' : 'Entrar'}</motion.button>
        </form>
        {msg && <div className="text-sm text-red-400 mt-2">{msg}</div>}
        <div className="text-sm text-zinc-400 mt-4">¿No tienes cuenta? <Link to="/register" className="text-primary-400">Regístrate</Link></div>
        <div className="text-sm text-zinc-400 mt-2">¿Olvidaste tu contraseña? <Link to="/forgot" className="text-primary-400">Recuperar</Link></div>
      </Card>
    </div>
  )
}
