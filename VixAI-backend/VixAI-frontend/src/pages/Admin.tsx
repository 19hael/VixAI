import { useEffect, useState } from 'react'
import Card from '@components/Card'
import Table from '@components/Table'
import { sbSelect } from '@api/supabase'
import { motion } from 'framer-motion'

export default function Admin() {
  const [users, setUsers] = useState<any[]>([])
  const [changes, setChanges] = useState<any[]>([])
  const [important, setImportant] = useState<any[]>([])
  const [optimizations, setOptimizations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const [u, ch, imp, opt] = await Promise.all([
        sbSelect('users', { order: 'created_at.desc', limit: '50' }),
        sbSelect('changes', { order: 'created_at.desc', limit: '50' }),
        sbSelect('important_records', { order: 'created_at.desc', limit: '50' }),
        sbSelect('optimizations', { order: 'created_at.desc', limit: '50' })
      ])
      setUsers(u || [])
      setChanges(ch || [])
      setImportant(imp || [])
      setOptimizations(opt || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <motion.button whileTap={{ scale: 0.98 }} onClick={load} className="bg-zinc-800 border border-zinc-700 rounded px-3 py-1">Refrescar</motion.button>
      </div>

      <div className="grid xl:grid-cols-2 gap-4">
        <Card>
          <div className="mb-3 text-sm text-zinc-300">Usuarios</div>
          <Table columns={[
            { key: 'created_at', header: 'Fecha' },
            { key: 'email', header: 'Email' },
            { key: 'name', header: 'Nombre' },
            { key: 'role', header: 'Rol' },
            { key: 'active', header: 'Activo' },
          ]} data={users} />
        </Card>
        <Card>
          <div className="mb-3 text-sm text-zinc-300">Optimizaciones</div>
          <Table columns={[
            { key: 'created_at', header: 'Fecha' },
            { key: 'campaign_name', header: 'Campaña' },
            { key: 'new_ad_resource_name', header: 'Nuevo Ad' },
          ]} data={optimizations} />
        </Card>
      </div>

      <div className="grid xl:grid-cols-2 gap-4">
        <Card>
          <div className="mb-3 text-sm text-zinc-300">Registros Importantes</div>
          <Table columns={[
            { key: 'created_at', header: 'Fecha' },
            { key: 'title', header: 'Título' },
            { key: 'severity', header: 'Severidad' },
            { key: 'tags', header: 'Tags' },
          ]} data={important} />
        </Card>
        <Card>
          <div className="mb-3 text-sm text-zinc-300">Histórico de Cambios</div>
          <Table columns={[
            { key: 'created_at', header: 'Fecha' },
            { key: 'user_id', header: 'Usuario' },
            { key: 'entity_type', header: 'Entidad' },
            { key: 'action', header: 'Acción' },
          ]} data={changes} />
        </Card>
      </div>

      {loading && <div className="text-sm text-zinc-400">Cargando...</div>}
    </div>
  )
}
