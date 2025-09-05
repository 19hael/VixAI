import { motion } from 'framer-motion'

export default function Card({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
      className={`bg-zinc-900 border border-zinc-800 rounded-lg p-4 ${className}`}>
      {children}
    </motion.div>
  )
}
