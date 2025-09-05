import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useAuthStore } from '@store/auth'

export default function AppLayout() {
  const [open, setOpen] = useState(true)
  const { user, logout } = useAuthStore()
  const nav = useNavigate()
  const location = useLocation()
  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/generar', label: 'Generar' },
    { to: '/lanzar', label: 'Lanzar' },
    { to: '/admin', label: 'Admin' },
  ]
  return (
    <div className="h-screen flex">
      <motion.aside animate={{ width: open ? 240 : 72 }} className="bg-zinc-900 border-r border-zinc-800 p-3 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-primary-400 font-semibold">VixAI</div>
          <button onClick={() => setOpen((v) => !v)} className="text-zinc-400 hover:text-zinc-200">{open ? '⟨' : '⟩'}</button>
        </div>
        <nav className="space-y-1">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `block rounded px-3 py-2 ${isActive ? 'bg-primary-900 text-primary-300' : 'text-zinc-300 hover:bg-zinc-800'}`}>{open ? l.label : l.label[0]}</NavLink>
          ))}
        </nav>
      </motion.aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-zinc-800 flex items-center justify-between px-4">
          <div className="text-sm text-zinc-400">{location.pathname}</div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="text-zinc-300 text-sm">{user.email}</div>
                <button className="bg-primary-600 hover:bg-primary-700 px-3 py-1 rounded" onClick={() => { logout(); nav('/login') }}>Salir</button>
              </>
            ) : (
              <button className="bg-primary-600 hover:bg-primary-700 px-3 py-1 rounded" onClick={() => nav('/login')}>Entrar</button>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 bg-zinc-950">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
