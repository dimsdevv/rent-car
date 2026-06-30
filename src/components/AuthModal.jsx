import { useState, useEffect, useRef } from 'react'
import { X, CircleNotch, Warning, Eye, EyeSlash, UserCirclePlus, SignIn } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const TABS = { LOGIN: 'login', REGISTER: 'register' }

const validateLogin = (form) => {
  const errors = {}
  if (!form.email.trim()) errors.email = 'Email wajib diisi'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Format email tidak valid'
  if (!form.password) errors.password = 'Password wajib diisi'
  return errors
}

const validateRegister = (form) => {
  const errors = {}
  if (form.name.trim().length < 2) errors.name = 'Nama minimal 2 karakter'
  if (!form.email.trim()) errors.email = 'Email wajib diisi'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Format email tidak valid'
  if (form.password.length < 8) errors.password = 'Password minimal 8 karakter'
  if (form.phone && !/^08[0-9]{8,12}$/.test(form.phone.replace(/[-\s]/g, ''))) errors.phone = 'Format nomor tidak valid'
  return errors
}

export default function AuthModal({ open, onClose }) {
  const { login, register } = useAuth()
  const [tab, setTab] = useState(TABS.LOGIN)
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const overlayRef = useRef(null)

  // Reset form on tab switch
  useEffect(() => {
    setForm({ name: '', email: '', phone: '', password: '' })
    setErrors({})
    setTouched({})
    setServerError('')
  }, [tab])

  // Reset everything on close
  useEffect(() => {
    if (!open) {
      setForm({ name: '', email: '', phone: '', password: '' })
      setErrors({})
      setTouched({})
      setServerError('')
      setLoading(false)
    }
  }, [open])

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

  // Removed early return to allow exit animations

  const validate = tab === TABS.LOGIN ? validateLogin : validateRegister
  const currentErrors = validate(form)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleBlur = (e) => setTouched({ ...touched, [e.target.name]: true })

  const getFieldState = (name) => {
    if (!touched[name]) return 'idle'
    if (currentErrors[name]) return 'error'
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
    setServerError('')
    const allTouched = Object.keys(form).reduce((acc, k) => ({ ...acc, [k]: true }), {})
    setTouched(allTouched)

    const validationErrors = validate(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setLoading(true)
    try {
      if (tab === TABS.LOGIN) {
        await login(form.email, form.password)
      } else {
        await register(form.name, form.email, form.password, form.phone)
      }
      onClose()
    } catch (err) {
      const resp = err.response?.data
      if (resp?.errors) {
        setErrors(resp.errors)
        // Mark server-errored fields as touched
        setTouched(prev => ({ ...prev, ...Object.keys(resp.errors).reduce((a, k) => ({ ...a, [k]: true }), {}) }))
      }
      setServerError(resp?.message || 'Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          ref={overlayRef}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-surface-raised rounded-[var(--radius-card)] shadow-[var(--shadow-form)]"
          >
            {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-ink-subtle hover:text-ink hover:bg-brand-50 transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" weight="bold" />
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-4">
          <h2 className="text-2xl font-extrabold text-ink">
            {tab === TABS.LOGIN ? 'Masuk ke Akun Anda' : 'Buat Akun Baru'}
          </h2>
          <p className="text-sm text-ink-muted mt-1">
            {tab === TABS.LOGIN ? 'Selamat datang kembali di JelajahCar' : 'Daftar untuk pengalaman booking lebih mudah'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="px-8 flex border-b border-brand-100">
          {Object.entries(TABS).map(([key, val]) => (
            <button
              key={val}
              onClick={() => setTab(val)}
              className={`flex-1 pb-3 text-sm font-bold transition-colors relative ${
                tab === val ? 'text-brand-teal' : 'text-ink-subtle hover:text-ink-muted'
              }`}
            >
              {val === TABS.LOGIN ? 'Masuk' : 'Daftar'}
              {tab === val && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-teal rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
          {/* Register: Name field */}
          {tab === TABS.REGISTER && (
            <div>
              <label htmlFor="auth-name" className="block text-sm font-semibold text-ink mb-1.5">Nama Lengkap</label>
              <input
                type="text" id="auth-name" name="name" value={form.name}
                onChange={handleChange} onBlur={handleBlur}
                placeholder="Nama lengkap Anda" className={inputClasses('name')}
              />
              {getFieldState('name') === 'error' && (
                <p className="flex items-center gap-1 text-xs text-red-600 mt-1.5">
                  <Warning className="w-3 h-3" weight="fill" /> {currentErrors.name}
                </p>
              )}
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="auth-email" className="block text-sm font-semibold text-ink mb-1.5">Email</label>
            <input
              type="email" id="auth-email" name="email" value={form.email}
              onChange={handleChange} onBlur={handleBlur}
              placeholder="email@contoh.com" className={inputClasses('email')}
            />
            {getFieldState('email') === 'error' && (
              <p className="flex items-center gap-1 text-xs text-red-600 mt-1.5">
                <Warning className="w-3 h-3" weight="fill" /> {currentErrors.email}
              </p>
            )}
          </div>

          {/* Register: Phone (optional) */}
          {tab === TABS.REGISTER && (
            <div>
              <label htmlFor="auth-phone" className="block text-sm font-semibold text-ink mb-1.5">
                No. Telepon <span className="text-ink-subtle font-normal">(opsional)</span>
              </label>
              <input
                type="tel" id="auth-phone" name="phone" value={form.phone}
                onChange={handleChange} onBlur={handleBlur}
                placeholder="0812-xxxx-xxxx" className={inputClasses('phone')}
              />
              {getFieldState('phone') === 'error' && (
                <p className="flex items-center gap-1 text-xs text-red-600 mt-1.5">
                  <Warning className="w-3 h-3" weight="fill" /> {currentErrors.phone}
                </p>
              )}
            </div>
          )}

          {/* Password */}
          <div>
            <label htmlFor="auth-password" className="block text-sm font-semibold text-ink mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                id="auth-password" name="password" value={form.password}
                onChange={handleChange} onBlur={handleBlur}
                placeholder={tab === TABS.LOGIN ? 'Masukkan password' : 'Minimal 8 karakter'}
                className={`${inputClasses('password')} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink-muted transition-colors"
              >
                {showPass ? <EyeSlash className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {getFieldState('password') === 'error' && (
              <p className="flex items-center gap-1 text-xs text-red-600 mt-1.5">
                <Warning className="w-3 h-3" weight="fill" /> {currentErrors.password}
              </p>
            )}
          </div>

          {/* Server error */}
          {serverError && (
            <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 px-4 py-3 rounded-[var(--radius-input)] border border-red-100">
              <Warning className="w-4 h-4 shrink-0" weight="fill" />
              {serverError}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-brand-teal text-white font-bold rounded-[var(--radius-button)] transition-all duration-200 ease-[var(--ease-out)] hover:bg-brand-teal/90 hover:shadow-lg hover:shadow-brand-teal/15 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <CircleNotch className="w-5 h-5 animate-spin" weight="bold" />
                Memproses...
              </>
            ) : tab === TABS.LOGIN ? (
              <>
                <SignIn className="w-5 h-5" weight="bold" />
                Masuk
              </>
            ) : (
              <>
                <UserCirclePlus className="w-5 h-5" weight="bold" />
                Daftar Sekarang
              </>
            )}
          </button>

          {/* Toggle link */}
          <p className="text-center text-sm text-ink-muted pt-2">
            {tab === TABS.LOGIN ? (
              <>Belum punya akun? <button type="button" onClick={() => setTab(TABS.REGISTER)} className="text-brand-teal font-semibold hover:underline">Daftar</button></>
            ) : (
              <>Sudah punya akun? <button type="button" onClick={() => setTab(TABS.LOGIN)} className="text-brand-teal font-semibold hover:underline">Masuk</button></>
            )}
          </p>
        </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
