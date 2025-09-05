import { useEffect, useState } from 'react'
import Card from '@components/Card'
import Table from '@components/Table'
import { lanzarCampana } from '@api/ads'
import { sbSelect } from '@api/supabase'
import { motion } from 'framer-motion'
import Turnstile from '@components/Turnstile'

export default function LaunchCampaign() {
  const [url, setUrl] = useState('')
  const [presupuesto, setPresupuesto] = useState<number | ''>('')
  const [audiencia, setAudiencia] = useState('General')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [rows, setRows] = useState<any[]>([])
  const [captchaToken, setCaptchaToken] = useState<string>('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      const data = await lanzarCampana({ url: url || undefined, presupuesto: typeof presupuesto === 'number' ? presupuesto : undefined, audiencia, captcha_token: captchaToken || undefined })
      setMessage(data?.status || 'Campaña enviada al agente')
      setUrl('')
      setPresupuesto('')
      setAudiencia('General')
      load()
    } catch (e: any) {
      setMessage(e?.message || 'Error lanzando campaña')
    } finally {
      setLoading(false)
    }
  }

  const load = async () => {
    const metrics = await sbSelect('metrics', { order: 'timestamp.desc', limit: '20' })
    setRows(metrics || [])
  }

  useEffect(() => { load() }, [])

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Lanzar Campaña</h1>
      <Card>
        <form onSubmit={submit} className="grid md:grid-cols-4 gap-3">
          <input className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2" placeholder="URL" value={url} onChange={e=>setUrl(e.target.value)} />
          <input className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2" placeholder="Presupuesto" type="number" value={presupuesto} onChange={e=>setPresupuesto(e.target.value === '' ? '' : Number(e.target.value))} />
          <input className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2" placeholder="Audiencia" value={audiencia} onChange={e=>setAudiencia(e.target.value)} />
          <div className="md:col-span-4"><Turnstile onToken={setCaptchaToken} /></div>
          <motion.button whileTap={{ scale: 0.98 }} disabled={loading} className="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 rounded px-4 py-2">{loading ? 'Enviando...' : 'Lanzar'}</motion.button>
        </form>
        {message && <div className="text-sm text-zinc-400 mt-3">{message}</div>}
      </Card>

      <Card>
        <div className="mb-3 text-sm text-zinc-300">Campañas recientes (desde metrics)</div>
        <Table columns={[
          { key: 'timestamp', header: 'Fecha' },
          { key: 'campaign_name', header: 'Campaña' },
          { key: 'impressions', header: 'Imp' },
          { key: 'clicks', header: 'Clicks' },
          { key: 'conversions', header: 'Conv' },
          { key: 'ctr', header: 'CTR' },
          { key: 'cpa', header: 'CPA' },
        ]} data={rows} />
      </Card>
    </div>
  )
}
