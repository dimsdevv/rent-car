import { useState, useEffect, useRef } from 'react'
import { X, CalendarBlank, MapPin, CheckCircle, Car, UserCircle } from '@phosphor-icons/react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function BookingModal({ open, onClose, car }) {
  const { user, token } = useAuth()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    pickup_location: '',
    pickup_date: '',
    return_date: '',
  })
  const [status, setStatus] = useState('idle') // idle, loading, success, error
  const [error, setError] = useState('')

  // Prefill user data if logged in
  useEffect(() => {
    if (open && user) {
      setForm(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      }))
    }
  }, [open, user])

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

  // Reset state when closed
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStatus('idle')
        setError('')
      }, 300)
    }
  }, [open])

  if (!open || !car) return null

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setStatus('loading')

    try {
      await axios.post('/api/booking.php', {
        ...form,
        car_id: car.id,
        car_type: car.category_name || '',
      }, {
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
      })
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.')
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center" onClick={onClose}>
      {/* Heavy Blur Overlay */}
      <div className="absolute inset-0 bg-brand-dark/40 backdrop-blur-md transition-opacity duration-400 ease-[cubic-bezier(0.32,0.72,0,1)]" />

      {/* Modal Content - Slide up on mobile, scale in on desktop */}
      <div
        className="relative w-full max-w-2xl bg-brand-50/50 backdrop-blur-xl sm:rounded-[2rem] rounded-t-[2rem] border sm:border-white/40 border-b-0 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-[slideUp_400ms_cubic-bezier(0.32,0.72,0,1)] sm:animate-[scaleIn_300ms_cubic-bezier(0.23,1,0.32,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-white/20 bg-white/40">
          <h2 className="text-xl font-extrabold text-ink tracking-tight">Booking Kendaraan</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-brand-100 hover:bg-brand-50 text-ink-subtle hover:text-ink hover:scale-[0.97] active:scale-95 transition-all duration-200"
          >
            <X className="w-5 h-5" weight="bold" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {status === 'success' ? (
            <div className="p-10 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-600" weight="fill" />
              </div>
              <h3 className="text-2xl font-extrabold text-ink mb-2">Booking Berhasil!</h3>
              <p className="text-ink-muted mb-8 max-w-sm">
                Pemesanan untuk <strong>{car.name}</strong> telah kami terima. Anda bisa mengecek detailnya di Riwayat Booking.
              </p>
              <button
                onClick={() => {
                  onClose()
                  window.dispatchEvent(new CustomEvent('open-history'))
                }}
                className="px-8 py-3.5 bg-brand-dark text-white font-bold rounded-full hover:bg-brand-dark/90 active:scale-[0.97] transition-all duration-200"
              >
                Lihat Riwayat Booking
              </button>
            </div>
          ) : (
            <div className="p-6">
              {/* Selected Car Info (Double Bezel) */}
              <div className="p-1.5 bg-white/40 rounded-2xl border border-brand-100/50 mb-6">
                <div className="bg-white rounded-[calc(1rem-0.375rem)] shadow-sm p-4 flex gap-4 items-center">
                  <div className="w-20 h-20 rounded-xl bg-brand-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {car.image_url ? (
                      <img src={car.image_url} alt={car.name} className="w-full h-full object-cover" />
                    ) : (
                      <Car className="w-8 h-8 text-brand-teal" weight="duotone" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-lg text-ink">{car.name}</h4>
                    <p className="text-xs text-ink-subtle uppercase tracking-wider mb-1">{car.category_name}</p>
                    <p className="text-brand-teal font-bold">{formatRupiah(car.price_per_day)} <span className="text-xs font-normal text-ink-subtle">/hari</span></p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm font-medium">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-ink mb-1.5">Nama Lengkap</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-brand-100 bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal transition-all"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-1.5">Email</label>
                    <input
                      required
                      type="email"
                      className="w-full px-4 py-3 rounded-xl border border-brand-100 bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal transition-all"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-1.5">No. WhatsApp</label>
                    <input
                      required
                      type="tel"
                      className="w-full px-4 py-3 rounded-xl border border-brand-100 bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal transition-all"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-ink mb-1.5">Lokasi Jemput</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle w-5 h-5" />
                      <input
                        required
                        type="text"
                        placeholder="Contoh: Bandara Soekarno Hatta"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-brand-100 bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal transition-all"
                        value={form.pickup_location}
                        onChange={(e) => setForm({ ...form, pickup_location: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-1.5">Tanggal Jemput</label>
                    <div className="relative">
                      <CalendarBlank className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle w-5 h-5" />
                      <input
                        required
                        type="date"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-brand-100 bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal transition-all text-ink"
                        value={form.pickup_date}
                        onChange={(e) => setForm({ ...form, pickup_date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-1.5">Tanggal Kembali</label>
                    <div className="relative">
                      <CalendarBlank className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle w-5 h-5" />
                      <input
                        required
                        type="date"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-brand-100 bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal transition-all text-ink"
                        value={form.return_date}
                        onChange={(e) => setForm({ ...form, return_date: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 pb-2 border-t border-brand-100/50 mt-6">
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-3.5 bg-brand-dark text-white font-bold rounded-xl active:scale-[0.98] transition-all duration-200 hover:bg-brand-dark/90 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
                  >
                    {status === 'loading' ? 'Memproses...' : 'Konfirmasi Booking'}
                  </button>
                  {!user && (
                    <p className="text-center text-xs text-ink-subtle mt-3 flex items-center justify-center gap-1">
                      <UserCircle weight="fill" className="w-4 h-4" />
                      Login untuk melacak status pesanan Anda.
                    </p>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
