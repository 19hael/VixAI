import { Route, Routes, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Login from '@pages/Login'
import Register from '@pages/Register'
import ForgotPassword from '@pages/ForgotPassword'
import ResetPassword from '@pages/ResetPassword'
import GenerateAd from '@pages/GenerateAd'
import LaunchCampaign from '@pages/LaunchCampaign'
import Dashboard from '@pages/Dashboard'
import Admin from '@pages/Admin'
import AppLayout from '@layouts/AppLayout'
import { useAuthStore } from '@store/auth'

const Page = ({ children }: { children: React.ReactNode }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
    {children}
  </motion.div>
)

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AdminRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuthStore()
  const isAdmin = user && user.id === 'fc4d9a5a-c2ea-4d49-83b9-6421d13feae3' && user.email === 'support@vixai.lat'
  if (!isAdmin) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Page><Login /></Page>} />
        <Route path="/register" element={<Page><Register /></Page>} />
        <Route path="/forgot" element={<Page><ForgotPassword /></Page>} />
        <Route path="/reset" element={<Page><ResetPassword /></Page>} />
        <Route element={<AppLayout />}> 
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<PrivateRoute><Page><Dashboard /></Page></PrivateRoute>} />
          <Route path="/generar" element={<PrivateRoute><Page><GenerateAd /></Page></PrivateRoute>} />
          <Route path="/lanzar" element={<PrivateRoute><Page><LaunchCampaign /></Page></PrivateRoute>} />
          <Route path="/admin" element={<AdminRoute><Page><Admin /></Page></AdminRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  )
}
