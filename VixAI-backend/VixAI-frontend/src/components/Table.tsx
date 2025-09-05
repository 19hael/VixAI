type Col<T> = { key: keyof T | string; header: string; render?: (row: T) => React.ReactNode }

export default function Table<T extends Record<string, any>>({
  columns,
  data,
}: {
  columns: Col<T>[]
  data: T[]
}) {
  return (
    <div className="overflow-auto border border-zinc-800 rounded-lg">
      <table className="min-w-full text-sm">
        <thead className="bg-zinc-900/70 text-zinc-400">
          <tr>
            {columns.map((c) => (
              <th key={String(c.key)} className="text-left px-3 py-2 font-medium border-b border-zinc-800">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="odd:bg-zinc-900/30">
              {columns.map((c) => (
                <td key={String(c.key)} className="px-3 py-2 border-b border-zinc-800">
                  {c.render ? c.render(row) : String(row[c.key as keyof T] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
