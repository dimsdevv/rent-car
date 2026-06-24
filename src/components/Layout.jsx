import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import ScrollToTop from './ScrollToTop'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppButton from './WhatsAppButton'
import BackToTop from './BackToTop'
import AuthModal from './AuthModal'
import BookingHistory from './BookingHistory'

export default function Layout() {
  const [authOpen, setAuthOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <ScrollToTop />
      <Navbar onOpenAuth={() => setAuthOpen(true)} onOpenHistory={() => setHistoryOpen(true)} />
      <main className="animate-[pageFadeIn_200ms_ease-out]">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <BookingHistory open={historyOpen} onClose={() => setHistoryOpen(false)} />
    </div>
  )
}
