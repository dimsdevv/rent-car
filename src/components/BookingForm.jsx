import { useState, useEffect } from 'react'
import { MagnifyingGlass, CalendarBlank, MapPin, Car, CircleNotch, CheckCircle, Warning, UserCircle } from '@phosphor-icons/react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const LOCATIONS = [
  'Jakarta',
  'Bandung',
  'Surabaya',
  'Bali (Denpasar)',
  'Yogyakarta',
  'Semarang',
  'Medan',
  'Makassar',
]

const CAR_TYPES = [
  { value: '', label: 'Semua tipe' },
  { value: 'city-car', label: 'City Car' },
  { value: 'mpv', label: 'MPV' },
  { value: 'suv', label: 'SUV' },
  { value: 'sedan', label: 'Sedan' },
  { value: 'premium', label: 'Premium' },
]

const validate = (form) => {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Nama lengkap wajib diisi'
  if (!form.email.trim()) errors.email = 'Email wajib diisi'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Format email tidak valid'
  if (!form.phone.trim()) errors.phone = 'No. telepon wajib diisi'
  else if (!/^08[0-9]{8,12}$/.test(form.phone.replace(/[-\s]/g, ''))) errors.phone = 'Format nomor tidak valid'
  if (!form.pickup_location) errors.pickup_location = 'Pilih kota penjemputan'
  if (!form.pickup_date) errors.pickup_date = 'Tanggal jemput wajib diisi'
  if (!form.return_date) errors.return_date = 'Tanggal kembali wajib diisi'
  else if (form.pickup_date && new Date(form.return_date) <= new Date(form.pickup_date)) {
    errors.return_date = 'Harus setelah tanggal jemput'
  }
  return errors
}

export default function BookingForm() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    pickup_location: '',
    pickup_date: '',
    return_date: '',
    car_type: '',
  })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [touched, setTouched] = useState({})

  // Auto-fill from user profile
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }))
    }
  }, [user])

  const errors = validate(form)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true })
  }

  const getFieldState = (name) => {
    if (!touched[name]) return 'idle'
    if (errors[name]) return 'error'
    if (form[name]) return 'valid'
    return 'idle'
  }

  const inputClasses = (name) => {
    const state = getFieldState(name)
    const base = 'w-full px-4 py-3 bg-surface rounded-[var(--radius-input)] text-ink placeholder:text-ink-subtle focus:outline-none transition-colors duration-200'
    if (state === 'error') return `${base} border border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-400`
    if (state === 'valid') return `${base} border border-brand-teal/40 focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal`
    return `${base} border border-brand-200/50 focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Mark all as touched to show errors
    const allTouched = Object.keys(form).reduce((acc, k) => ({ ...acc, [k]: true }), {})
    setTouched(allTouched)

    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setError('Mohon lengkapi semua field yang wajib diisi dengan benar.')
      return
    }

    setStatus('loading')

    try {
      await axios.post('/api/booking.php', form, {
        headers: { 'Content-Type': 'application/json' },
      })
      setStatus('success')
      setForm({
        name: '',
        email: '',
        phone: '',
        pickup_location: '',
        pickup_date: '',
        return_date: '',
        car_type: '',
      })
      setTouched({})
    } catch (err) {
      setStatus('error')
      setError(err.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.')
    }
  }

  if (status === 'success') {
    return (
      <section id="booking" className="relative -mt-10 z-20 px-6 lg:px-8 max-w-5xl mx-auto mb-24">
        <div className="bg-surface-raised rounded-[var(--radius-card)] shadow-[var(--shadow-form)] p-10 text-center">
          <CheckCircle className="w-14 h-14 text-brand-teal mx-auto mb-4" weight="fill" />
          <h3 className="text-2xl font-extrabold text-ink mb-2">Booking Berhasil!</h3>
          <p className="text-ink-muted max-w-md mx-auto mb-6">
            Tim kami akan menghubungi Anda dalam 1x24 jam untuk konfirmasi detail perjalanan.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="px-6 py-3 bg-brand-teal text-white font-bold rounded-[var(--radius-button)] hover:bg-brand-teal/90 transition-colors duration-200"
          >
            Booking Lagi
          </button>
        </div>
      </section>
    )
  }

  return (
    <section id="booking" className="relative -mt-10 z-20 px-6 lg:px-8 max-w-5xl mx-auto mb-24">
      <div className="bg-surface-raised rounded-[var(--radius-card)] shadow-[var(--shadow-form)] p-6 sm:p-8 lg:p-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-brand-teal/10 flex items-center justify-center">
            <MagnifyingGlass className="w-5 h-5 text-brand-teal" weight="bold" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-ink">Booking Mobil</h2>
            <p className="text-sm text-ink-muted">Isi form di bawah untuk reservasi kendaraan</p>
          </div>
        </div>
        {user && (
          <p className="flex items-center gap-1.5 text-xs text-brand-teal mb-6">
            <UserCircle className="w-4 h-4" weight="fill" />
            Data terisi otomatis dari profil Anda
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact info row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-ink mb-1.5">
                Nama Lengkap
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="John Doe"
                className={inputClasses('name')}
              />
              {getFieldState('name') === 'error' && (
                <p className="flex items-center gap-1 text-xs text-red-600 mt-1.5">
                  <Warning className="w-3 h-3" weight="fill" /> {errors.name}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-ink mb-1.5">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="email@contoh.com"
                className={inputClasses('email')}
              />
              {getFieldState('email') === 'error' && (
                <p className="flex items-center gap-1 text-xs text-red-600 mt-1.5">
                  <Warning className="w-3 h-3" weight="fill" /> {errors.email}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-ink mb-1.5">
                No. Telepon
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="0812-xxxx-xxxx"
                className={inputClasses('phone')}
              />
              {getFieldState('phone') === 'error' && (
                <p className="flex items-center gap-1 text-xs text-red-600 mt-1.5">
                  <Warning className="w-3 h-3" weight="fill" /> {errors.phone}
                </p>
              )}
            </div>
          </div>

          {/* Booking details row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <label htmlFor="pickup_location" className="block text-sm font-semibold text-ink mb-1.5">
                Lokasi Jemput
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle pointer-events-none" weight="fill" />
                <select
                  id="pickup_location"
                  name="pickup_location"
                  value={form.pickup_location}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${inputClasses('pickup_location')} pl-10 appearance-none`}
                >
                  <option value="">Pilih kota</option>
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              {getFieldState('pickup_location') === 'error' && (
                <p className="flex items-center gap-1 text-xs text-red-600 mt-1.5">
                  <Warning className="w-3 h-3" weight="fill" /> {errors.pickup_location}
                </p>
              )}
            </div>

            <div className="relative">
              <label htmlFor="pickup_date" className="block text-sm font-semibold text-ink mb-1.5">
                Tanggal Jemput
              </label>
              <div className="relative">
                <CalendarBlank className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle pointer-events-none" weight="fill" />
                <input
                  type="date"
                  id="pickup_date"
                  name="pickup_date"
                  value={form.pickup_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${inputClasses('pickup_date')} pl-10`}
                />
              </div>
              {getFieldState('pickup_date') === 'error' && (
                <p className="flex items-center gap-1 text-xs text-red-600 mt-1.5">
                  <Warning className="w-3 h-3" weight="fill" /> {errors.pickup_date}
                </p>
              )}
            </div>

            <div className="relative">
              <label htmlFor="return_date" className="block text-sm font-semibold text-ink mb-1.5">
                Tanggal Kembali
              </label>
              <div className="relative">
                <CalendarBlank className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle pointer-events-none" weight="fill" />
                <input
                  type="date"
                  id="return_date"
                  name="return_date"
                  value={form.return_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${inputClasses('return_date')} pl-10`}
                />
              </div>
              {getFieldState('return_date') === 'error' && (
                <p className="flex items-center gap-1 text-xs text-red-600 mt-1.5">
                  <Warning className="w-3 h-3" weight="fill" /> {errors.return_date}
                </p>
              )}
            </div>

            <div className="relative">
              <label htmlFor="car_type" className="block text-sm font-semibold text-ink mb-1.5">
                Tipe Mobil
              </label>
              <div className="relative">
                <Car className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle pointer-events-none" weight="fill" />
                <select
                  id="car_type"
                  name="car_type"
                  value={form.car_type}
                  onChange={handleChange}
                  className={`${inputClasses('car_type')} pl-10 appearance-none`}
                >
                  {CAR_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 px-4 py-3 rounded-[var(--radius-input)] border border-red-100">
              <Warning className="w-4 h-4 shrink-0" weight="fill" />
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full sm:w-auto px-10 py-4 bg-brand-teal text-white font-bold rounded-[var(--radius-button)] transition-all duration-200 ease-[var(--ease-out)] hover:bg-brand-teal/90 hover:shadow-lg hover:shadow-brand-teal/15 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <>
                <CircleNotch className="w-5 h-5 animate-spin" weight="bold" />
                Memproses...
              </>
            ) : (
              <>
                <MagnifyingGlass className="w-5 h-5" weight="bold" />
                Cari & Booking
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  )
}
