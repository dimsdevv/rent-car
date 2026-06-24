import { useState, useEffect, useRef } from 'react'
import { X, CalendarBlank, Car, CircleNotch, Clock, CheckCircle, XCircle, Warning } from '@phosphor-icons/react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: 'bg-amber-100 text-amber-700',    icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700',        icon: XCircle },
  completed: { label: 'Completed', color: 'bg-blue-100 text-blue-700',      icon: CheckCircle },
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

const formatRupiah = (amount) => {
  if (!amount) return '-'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

export default function BookingHistory({ open, onClose }) {
  const { user, token } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const panelRef = useRef(null)

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
        setLoading(false)
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

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[90]" onClick={onClose}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_150ms_ease-out]" />

      {/* Panel */}
      <div
        ref={panelRef}
        className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-surface-raised shadow-2xl animate-[slideInRight_300ms_var(--ease-out-quart)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-brand-100">
          <div>
            <h2 className="text-lg font-extrabold text-ink">Riwayat Booking</h2>
            <p className="text-sm text-ink-muted">{user?.name || 'Pengguna'}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-ink-subtle hover:text-ink hover:bg-brand-50 transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" weight="bold" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100%-80px)] px-6 py-5">
          {loading && (
            <div className="flex items-center justify-center py-16">
              <CircleNotch className="w-8 h-8 text-brand-teal animate-spin" weight="bold" />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 px-4 py-3 rounded-[var(--radius-input)] border border-red-100">
              <Warning className="w-4 h-4 shrink-0" weight="fill" />
              {error}
            </div>
          )}

          {!loading && !error && bookings.length === 0 && (
            <div className="text-center py-16">
              <CalendarBlank className="w-12 h-12 text-ink-subtle mx-auto mb-3" weight="duotone" />
              <p className="text-ink-muted font-medium">Belum ada riwayat booking</p>
              <p className="text-sm text-ink-subtle mt-1">Mulai booking mobil pertama Anda!</p>
              <a
                href="#booking"
                onClick={onClose}
                className="inline-block mt-4 px-6 py-2.5 bg-brand-teal text-white text-sm font-bold rounded-[var(--radius-button)] hover:bg-brand-teal/90 transition-colors"
              >
                Booking Sekarang
              </a>
            </div>
          )}

          {!loading && bookings.length > 0 && (
            <div className="space-y-4">
              {bookings.map((b) => {
                const statusConf = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending
                const StatusIcon = statusConf.icon
                return (
                  <div
                    key={b.id || b.booking_code}
                    className="bg-white rounded-[var(--radius-card)] border border-brand-100 p-4 hover:shadow-[var(--shadow-card)] transition-shadow"
                  >
                    {/* Top row: code + status */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-ink-muted tracking-wider uppercase">
                        {b.booking_code || '—'}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${statusConf.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" weight="fill" />
                        {statusConf.label}
                      </span>
                    </div>

                    {/* Car info */}
                    <div className="flex items-start gap-3 mb-3">
                      {b.car_image ? (
                        <img
                          src={b.car_image}
                          alt={b.car_name}
                          className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0">
                          <Car className="w-6 h-6 text-brand-teal" weight="duotone" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-bold text-ink text-sm truncate">{b.car_name || 'Mobil tidak tersedia'}</p>
                        <p className="text-xs text-ink-subtle">{b.category_name || '—'}</p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-ink-subtle block">Jemput</span>
                        <span className="font-semibold text-ink">{formatDate(b.pickup_date)}</span>
                      </div>
                      <div>
                        <span className="text-ink-subtle block">Kembali</span>
                        <span className="font-semibold text-ink">{formatDate(b.return_date)}</span>
                      </div>
                      <div>
                        <span className="text-ink-subtle block">Lokasi</span>
                        <span className="font-semibold text-ink">{b.pickup_location || '—'}</span>
                      </div>
                      <div>
                        <span className="text-ink-subtle block">Harga/hari</span>
                        <span className="font-semibold text-ink">{formatRupiah(b.price_per_day)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
