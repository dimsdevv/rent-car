import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollToTop from './ScrollToTop'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppButton from './WhatsAppButton'
import BackToTop from './BackToTop'
import AuthModal from './AuthModal'
import BookingHistory from './BookingHistory'
import LiveActivityToast from './LiveActivityToast'

export default function Layout() {
  const [authOpen, setAuthOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleOpenHistory = () => setHistoryOpen(true)
    window.addEventListener('open-history', handleOpenHistory)
    return () => window.removeEventListener('open-history', handleOpenHistory)
  }, [])

  return (
    <div className="min-h-screen">
      <ScrollToTop />
      <Navbar onOpenAuth={() => setAuthOpen(true)} onOpenHistory={() => setHistoryOpen(true)} />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex-1"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <BookingHistory open={historyOpen} onClose={() => setHistoryOpen(false)} />
      <LiveActivityToast />
    </div>
  )
}
