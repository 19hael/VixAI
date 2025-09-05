import { useEffect, useMemo, useState } from 'react'
import Card from '@components/Card'
import Table from '@components/Table'
import { LineChartCard, BarChartCard } from '@components/Charts'
import { sbSelect } from '@api/supabase'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const [metrics, setMetrics] = useState<any[]>([])
  const [optimizations, setOptimizations] = useState<any[]>([])
  const [important, setImportant] = useState<any[]>([])
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const [m, o, imp, l] = await Promise.all([
        sbSelect('metrics', { order: 'timestamp.asc', limit: '50' }),
        sbSelect('optimizations', { order: 'created_at.desc', limit: '20' }),
        sbSelect('important_records', { order: 'created_at.desc', limit: '20' }),
        sbSelect('logs', { order: 'created_at.desc', limit: '20' }),
      ])
      setMetrics(m || [])
      setOptimizations(o || [])
      setImportant(imp || [])
      setLogs(l || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const chartData = useMemo(() => {
    return (metrics || []).map((x: any) => ({
      timestamp: x.timestamp || x.created_at,
      impressions: Number(x.impressions || 0),
      clicks: Number(x.clicks || 0),
      conversions: Number(x.conversions || 0),
      ctr: Number(x.ctr || 0),
      cost: Number(x.cost || 0),
      cpa: Number(x.cpa || 0),
    }))
  }, [metrics])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <motion.button whileTap={{ scale: 0.98 }} onClick={load} className="bg-zinc-800 border border-zinc-700 rounded px-3 py-1">Refrescar</motion.button>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <LineChartCard title="Clicks / Conversions" data={chartData} dataKeys={[
          { key: 'clicks', color: '#fb7185', name: 'Clicks' },
          { key: 'conversions', color: '#22c55e', name: 'Conv' },
        ]} />
        <BarChartCard title="Impresiones y CTR" data={chartData} dataKeys={[
          { key: 'impressions', color: '#3b82f6', name: 'Imp' },
          { key: 'ctr', color: '#f59e0b', name: 'CTR' },
        ]} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <div className="mb-3 text-sm text-zinc-300">Optimizaciones recientes</div>
          <Table columns={[
            { key: 'created_at', header: 'Fecha' },
            { key: 'campaign_name', header: 'Campaña' },
            { key: 'new_ad_resource_name', header: 'Nuevo Ad' },
          ]} data={optimizations} />
        </Card>
        <Card>
          <div className="mb-3 text-sm text-zinc-300">Alertas importantes</div>
          <Table columns={[
            { key: 'created_at', header: 'Fecha' },
            { key: 'title', header: 'Título' },
            { key: 'severity', header: 'Severidad' },
          ]} data={important} />
        </Card>
      </div>

      <Card>
        <div className="mb-3 text-sm text-zinc-300">Logs</div>
        <Table columns={[{ key: 'created_at', header: 'Fecha' }, { key: 'level', header: 'Nivel' }, { key: 'source', header: 'Origen' }, { key: 'message', header: 'Mensaje' }]} data={logs} />
      </Card>

      {loading && <div className="text-sm text-zinc-400">Cargando...</div>}
    </div>
  )
}
