import Card from './Card'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts'

export function LineChartCard({ title, data, dataKeys }: { title: string; data: any[]; dataKeys: { key: string; color: string; name?: string }[] }) {
  return (
    <Card>
      <div className="mb-3 text-sm text-zinc-300">{title}</div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="timestamp" stroke="#a1a1aa" />
            <YAxis stroke="#a1a1aa" />
            <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', color: '#e4e4e7' }} />
            <Legend />
            {dataKeys.map((d) => (
              <Line type="monotone" key={d.key} dataKey={d.key} stroke={d.color} name={d.name ?? d.key} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

export function BarChartCard({ title, data, dataKeys }: { title: string; data: any[]; dataKeys: { key: string; color: string; name?: string }[] }) {
  return (
    <Card>
      <div className="mb-3 text-sm text-zinc-300">{title}</div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="timestamp" stroke="#a1a1aa" />
            <YAxis stroke="#a1a1aa" />
            <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', color: '#e4e4e7' }} />
            <Legend />
            {dataKeys.map((d) => (
              <Bar key={d.key} dataKey={d.key} fill={d.color} name={d.name ?? d.key} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
