import { useState } from 'react'
import Card from '@components/Card'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '@store/auth'
import { supabase } from '@api/supabaseClient'

export default function Register() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [fax, setFax] = useState('')
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
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name, phone, fax } }
        })
        if (error) throw error
        setMsg('Cuenta creada. Revisa tu email para confirmar tu cuenta.')
      } else {
        // Fallback local (sin Supabase configurado)
        const id = crypto.randomUUID()
        setUser({ id, email, name, role: 'user' })
        nav('/dashboard')
      }
    } catch (err: any) {
      setMsg(err?.message || 'Error al registrar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <h1 className="text-xl font-semibold mb-2">Registro</h1>
        <p className="text-sm text-zinc-400 mb-6">Crea tu cuenta para comenzar</p>
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2" placeholder="Nombre" value={name} onChange={e=>setName(e.target.value)} required />
          <input className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2" placeholder="Teléfono" value={phone} onChange={e=>setPhone(e.target.value)} required />
          <input className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2" placeholder="Fax (opcional)" value={fax} onChange={e=>setFax(e.target.value)} />
          <input className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2" placeholder="Contraseña" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <motion.button whileTap={{ scale: 0.98 }} disabled={loading} className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 rounded px-3 py-2">{loading ? 'Creando...' : 'Crear cuenta'}</motion.button>
        </form>
        {msg && <div className="text-sm text-zinc-400 mt-2">{msg}</div>}
        <div className="text-sm text-zinc-400 mt-4">¿Ya tienes cuenta? <Link to="/login" className="text-primary-400">Entrar</Link></div>
      </Card>
    </div>
  )
}
