import { useState } from 'react'
import Card from '@components/Card'
import { motion, AnimatePresence } from 'framer-motion'
import { generarAnuncio } from '@api/ads'
import Turnstile from '@components/Turnstile'

export default function GenerateAd() {
  const [url, setUrl] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [presupuesto, setPresupuesto] = useState<number | ''>('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [captchaToken, setCaptchaToken] = useState<string>('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const data = await generarAnuncio({ url: url || undefined, descripcion: descripcion || undefined, idioma: 'es', captcha_token: captchaToken || undefined })
      setResult(data)
    } catch (err: any) {
      setError(err?.message ?? 'Error al generar anuncio')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Generación de Anuncios (MVP)</h1>
      <Card>
        <form onSubmit={onSubmit} className="grid md:grid-cols-3 gap-3">
          <input className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 md:col-span-1" placeholder="URL del negocio" value={url} onChange={e=>setUrl(e.target.value)} />
          <input className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 md:col-span-1" placeholder="Descripción (opcional)" value={descripcion} onChange={e=>setDescripcion(e.target.value)} />
          <input className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 md:col-span-1" placeholder="Presupuesto inicial" type="number" value={presupuesto} onChange={e=>setPresupuesto(e.target.value === '' ? '' : Number(e.target.value))} />
          <div className="md:col-span-3"><Turnstile onToken={setCaptchaToken} /></div>
          <div className="md:col-span-3 flex justify-end">
            <motion.button whileTap={{ scale: 0.98 }} disabled={loading} className="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 px-4 py-2 rounded">{loading ? 'Generando...' : 'Generar'}</motion.button>
          </div>
        </form>
      </Card>

      {error && <div className="text-sm text-red-400">{error}</div>}

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="grid md:grid-cols-3 gap-4">
            {result.anuncios?.slice(0, 3).map((a: any) => (
              <Card key={a.variant_id}>
                <div className="text-primary-300 font-medium mb-2">{a.titulo}</div>
                <div className="text-zinc-300 mb-2">{a.descripcion}</div>
                <div className="text-zinc-400 text-sm">CTA: {a.cta}</div>
              </Card>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
