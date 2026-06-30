import { useState, useEffect, useRef } from 'react'
import { X, CalendarBlank, Car, Clock, CheckCircle, XCircle, Warning, CreditCard, WhatsappLogo, ArrowRight, ArrowClockwise } from '@phosphor-icons/react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

// Configuration for Booking Status
const STATUS_CONFIG = {
  pending:   { label: 'Menunggu Pembayaran', color: 'bg-amber-100/50 text-amber-700 ring-1 ring-amber-200/50', icon: Clock },
  confirmed: { label: 'Terkonfirmasi', color: 'bg-emerald-100/50 text-emerald-700 ring-1 ring-emerald-200/50', icon: CheckCircle },
  cancelled: { label: 'Dibatalkan', color: 'bg-red-100/50 text-red-700 ring-1 ring-red-200/50', icon: XCircle },
  completed: { label: 'Selesai', color: 'bg-blue-100/50 text-blue-700 ring-1 ring-blue-200/50', icon: CheckCircle },
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

const formatRupiah = (amount) => {
  if (!amount) return '-'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

// Skeleton Loader with haptic pacing
function HistorySkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-1.5 bg-brand-50/30 rounded-[1.5rem] border border-brand-100/50">
          <div className="bg-white rounded-[calc(1.5rem-0.375rem)] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.02)] p-4 space-y-4 animate-pulse">
            <div className="flex justify-between items-center">
              <div className="h-4 w-24 bg-brand-100 rounded-md"></div>
              <div className="h-5 w-28 bg-brand-100 rounded-full"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-brand-100 rounded-xl"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 w-1/2 bg-brand-100 rounded-md"></div>
                <div className="h-3 w-1/3 bg-brand-100 rounded-md"></div>
                <div className="h-4 w-1/4 bg-brand-100 rounded-md mt-2"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function BookingHistory({ open, onClose }) {
  const { user, token } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('active') // 'active' | 'history'
  const panelRef = useRef(null)

  // Simulation state for payment
  const [simulatingPayment, setSimulatingPayment] = useState(null)

  useEffect(() => {
    if (!open || !token) return
    const fetchHistory = async () => {
      setLoading(true)
      setError('')
      try {
        const { data } = await axios.get('/api/bookings/history?per_page=20')
        if (data.success) {
          setBookings(data.data.data || [])
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal memuat riwayat booking')
      } finally {
        // Small delay to let user see skeleton (feels premium)
        setTimeout(() => setLoading(false), 400)
      }
    }
    fetchHistory()
  }, [open, token])

  // ESC to close
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Lock body scroll
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleSimulatePayment = (id) => {
    setSimulatingPayment(id)
    setTimeout(() => {
      // Optimistic UI update
      setBookings(prev => prev.map(b => b.id === id || b.booking_code === id ? { ...b, status: 'confirmed' } : b))
      setSimulatingPayment(null)
    }, 1500)
  }

  // if (!open) return null

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'active') return b.status === 'pending' || b.status === 'confirmed'
    return b.status === 'completed' || b.status === 'cancelled'
  })

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex justify-end" onClick={onClose}>
          {/* Heavy Blur Overlay (High-end Glass effect) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-0 bg-brand-dark/20 backdrop-blur-sm" 
          />

          {/* Slide Panel with Emil Design Eng ease-drawer */}
          <motion.div
            ref={panelRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              mass: 0.8
            }}
            className="relative w-full max-w-md bg-brand-50/50 backdrop-blur-xl border-l border-white/40 shadow-2xl h-[100dvh] flex flex-col origin-right"
            onClick={(e) => e.stopPropagation()}
          >
        {/* Header */}
        <div className="px-6 pt-8 pb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-ink tracking-tight">Riwayat Booking</h2>
            <p className="text-sm text-ink-muted mt-1">{user?.name || 'Pengguna'}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 border border-brand-100 hover:bg-white text-ink-subtle hover:text-ink hover:scale-[0.97] active:scale-95 transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" weight="bold" />
          </button>
        </div>

        {/* Smart Tabs */}
        <div className="px-6 mb-4">
          <div className="flex p-1 bg-white/60 border border-brand-100/50 rounded-2xl">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98] ${
                activeTab === 'active' ? 'bg-white text-ink shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-brand-100/30' : 'text-ink-subtle hover:text-ink'
              }`}
            >
              Aktif
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98] ${
                activeTab === 'history' ? 'bg-white text-ink shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-brand-100/30' : 'text-ink-subtle hover:text-ink'
              }`}
            >
              Riwayat
            </button>
          </div>
        </div>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto px-6 pb-12 pt-2 scrollbar-hide">
          {loading && <HistorySkeleton />}

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 px-4 py-3 rounded-2xl border border-red-100">
              <Warning className="w-4 h-4 shrink-0" weight="fill" />
              {error}
            </div>
          )}

          {!loading && !error && filteredBookings.length === 0 && (
            <div className="text-center py-20 px-4">
              <div className="w-16 h-16 rounded-full bg-white border border-brand-100 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <CalendarBlank className="w-8 h-8 text-ink-subtle" weight="duotone" />
              </div>
              <p className="text-ink font-bold">Belum ada transaksi</p>
              <p className="text-sm text-ink-subtle mt-2 mb-6">Riwayat pemesanan Anda yang {activeTab === 'active' ? 'sedang berjalan' : 'sudah lewat'} akan muncul di sini.</p>
              
              {activeTab === 'active' && (
                <button
                  onClick={onClose}
                  className="group inline-flex items-center justify-center gap-2 pl-5 pr-1.5 py-1.5 bg-brand-dark text-white font-bold text-sm rounded-full transition-all duration-200 hover:bg-brand-dark/90 active:scale-[0.97] ease-[cubic-bezier(0.23,1,0.32,1)]"
                >
                  Booking Sekarang
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" weight="bold" />
                  </div>
                </button>
              )}
            </div>
          )}

          {!loading && filteredBookings.length > 0 && (
            <div className="space-y-4">
              {filteredBookings.map((b) => {
                const statusConf = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending
                const StatusIcon = statusConf.icon
                const identifier = b.id || b.booking_code
                const isSimulating = simulatingPayment === identifier

                return (
                  <div
                    key={identifier}
                    className="p-1.5 bg-brand-50/40 rounded-[1.5rem] border border-brand-100/50 hover:bg-brand-100/30 transition-colors group/card"
                  >
                    <div className="bg-white rounded-[calc(1.5rem-0.375rem)] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.03)] p-4 flex flex-col h-full">
                      {/* Top Code & Status */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] uppercase tracking-[0.15em] font-extrabold text-ink-muted">
                          {b.booking_code || '—'}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${statusConf.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" weight="fill" />
                          {statusConf.label}
                        </span>
                      </div>

                      {/* Car Visual & Info */}
                      <div className="flex items-start gap-4 mb-5">
                        {b.car_image ? (
                          <img
                            src={b.car_image}
                            alt={b.car_name}
                            className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-brand-50"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-brand-50/50 flex items-center justify-center flex-shrink-0 border border-brand-100/50">
                            <Car className="w-6 h-6 text-brand-teal" weight="duotone" />
                          </div>
                        )}
                        <div className="min-w-0 pt-0.5">
                          <p className="font-extrabold text-ink text-base truncate">{b.car_name || 'Mobil tidak tersedia'}</p>
                          <p className="text-xs text-ink-subtle mt-0.5">{b.category_name || '—'}</p>
                          <p className="text-sm font-semibold text-brand-teal mt-2">{formatRupiah(b.price_per_day)} <span className="text-[10px] text-ink-subtle font-normal uppercase tracking-wider">/hari</span></p>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs mb-5 p-3 bg-brand-50/40 rounded-xl border border-brand-50">
                        <div>
                          <span className="text-ink-subtle block mb-0.5">Jemput</span>
                          <span className="font-bold text-ink">{formatDate(b.pickup_date)}</span>
                        </div>
                        <div>
                          <span className="text-ink-subtle block mb-0.5">Kembali</span>
                          <span className="font-bold text-ink">{formatDate(b.return_date)}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-ink-subtle block mb-0.5">Lokasi</span>
                          <span className="font-bold text-ink truncate">{b.pickup_location || '—'}</span>
                        </div>
                      </div>

                      {/* Contextual Action Buttons */}
                      <div className="mt-auto">
                        {b.status === 'pending' && (
                          <button
                            onClick={() => handleSimulatePayment(identifier)}
                            disabled={isSimulating}
                            className="group w-full flex items-center justify-between pl-4 pr-1.5 py-1.5 bg-brand-dark text-white rounded-full transition-all duration-200 active:scale-[0.97] ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-brand-dark/90 hover:shadow-md disabled:opacity-70 disabled:active:scale-100"
                          >
                            <span className="text-sm font-bold">{isSimulating ? 'Memproses...' : 'Bayar Sekarang'}</span>
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                              <CreditCard className={`w-4 h-4 ${isSimulating ? 'animate-pulse' : ''}`} weight="fill" />
                            </div>
                          </button>
                        )}
                        {b.status === 'confirmed' && (
                          <a
                            href="https://wa.me/6281234567890?text=Halo,%20saya%20ingin%20tanya%20mengenai%20booking%20saya"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group w-full flex items-center justify-between pl-4 pr-1.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full transition-all duration-200 active:scale-[0.97] ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-emerald-100"
                          >
                            <span className="text-sm font-bold">Hubungi CS</span>
                            <div className="w-8 h-8 rounded-full bg-emerald-200/50 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                              <WhatsappLogo className="w-4 h-4" weight="fill" />
                            </div>
                          </a>
                        )}
                        {(b.status === 'completed' || b.status === 'cancelled') && (
                          <a
                            href="#booking"
                            onClick={onClose}
                            className="group w-full flex items-center justify-between pl-4 pr-1.5 py-1.5 bg-brand-50 text-brand-dark border border-brand-200/50 rounded-full transition-all duration-200 active:scale-[0.97] ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-brand-100"
                          >
                            <span className="text-sm font-bold">Pesan Ulang</span>
                            <div className="w-8 h-8 rounded-full bg-brand-200/30 flex items-center justify-center group-hover:bg-brand-200/50 transition-colors">
                              <ArrowClockwise className="w-4 h-4" weight="bold" />
                            </div>
                          </a>
                        )}
                      </div>

                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
