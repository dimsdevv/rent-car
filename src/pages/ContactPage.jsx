import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin, Phone, EnvelopeSimple, Clock, CircleNotch,
  CheckCircle, Warning, PaperPlaneRight, WhatsappLogo
} from '@phosphor-icons/react'
import FAQ from '../components/FAQ'

const SUBJECTS = [
  { value: '', label: 'Pilih subjek' },
  { value: 'booking', label: 'Pertanyaan Booking' },
  { value: 'armada', label: 'Informasi Armada' },
  { value: 'kerjasama', label: 'Kerjasama Bisnis' },
  { value: 'keluhan', label: 'Keluhan & Saran' },
  { value: 'lainnya', label: 'Lainnya' },
]

const validate = (form) => {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Nama wajib diisi'
  if (!form.email.trim()) errors.email = 'Email wajib diisi'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Format email tidak valid'
  if (form.phone && !/^08[0-9]{8,12}$/.test(form.phone.replace(/[-\s]/g, ''))) errors.phone = 'Format nomor tidak valid'
  if (!form.subject) errors.subject = 'Pilih subjek pesan'
  if (!form.message.trim()) errors.message = 'Pesan wajib diisi'
  else if (form.message.trim().length < 10) errors.message = 'Pesan minimal 10 karakter'
  return errors
}

const OFFICE_INFO = [
  { icon: MapPin, label: 'Alamat', value: 'Jl. Sudirman No. 123\nJakarta Pusat 10220' },
  { icon: Phone, label: 'Telepon', value: '0812-3456-7890' },
  { icon: EnvelopeSimple, label: 'Email', value: 'info@jelajahcar.id' },
  { icon: Clock, label: 'Jam Operasional', value: 'Senin - Minggu\n07.00 - 22.00 WIB' },
]

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', subject: '', message: '',
  })
  const [status, setStatus] = useState('idle')
  const [touched, setTouched] = useState({})

  const errors = validate(form)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleBlur = (e) => setTouched({ ...touched, [e.target.name]: true })

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

  const handleSubmit = (e) => {
    e.preventDefault()
    const allTouched = Object.keys(form).reduce((acc, k) => ({ ...acc, [k]: true }), {})
    setTouched(allTouched)

    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) return

    setStatus('success')
  }

  if (status === 'success') {
    return (
      <>
        <section className="bg-brand-dark pt-28 pb-16 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl lg:text-5xl font-extrabold text-white mb-3">Hubungi Kami</h1>
            <p className="text-brand-200/80 text-lg max-w-xl leading-relaxed">
              Tim kami siap membantu Anda. Silakan hubungi lewat form, telepon, atau WhatsApp.
            </p>
          </div>
        </section>
        <section className="py-24 px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <CheckCircle className="w-16 h-16 text-brand-teal mx-auto mb-6" weight="fill" />
            <h2 className="text-2xl font-extrabold text-ink mb-3">Pesan Terkirim!</h2>
            <p className="text-ink-muted leading-relaxed mb-8">
              Terima kasih telah menghubungi kami. Tim kami akan membalas pesan Anda dalam 1x24 jam kerja.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => { setStatus('idle'); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); setTouched({}) }}
                className="px-6 py-3 bg-brand-teal text-white font-bold rounded-[var(--radius-button)] hover:bg-brand-teal/90 transition-colors"
              >
                Kirim Pesan Lagi
              </button>
              <Link
                to="/"
                className="px-6 py-3 border border-brand-200 text-ink font-bold rounded-[var(--radius-button)] hover:bg-brand-50 transition-colors"
              >
                Kembali
              </Link>
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      {/* Compact header */}
      <section className="bg-brand-dark pt-28 pb-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl lg:text-5xl font-extrabold text-white mb-3">
            Hubungi Kami
          </h1>
          <p className="text-brand-200/80 text-lg max-w-xl leading-relaxed">
            Tim kami siap membantu Anda. Silakan hubungi lewat form, telepon, atau WhatsApp.
          </p>
        </div>
      </section>

      {/* Contact form + info */}
      <section className="py-16 lg:py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Form - wider column */}
            <div className="lg:col-span-7">
              <div className="bg-surface-raised rounded-[var(--radius-card)] shadow-[var(--shadow-form)] p-6 sm:p-8 lg:p-10">
                <h2 className="text-xl font-extrabold text-ink mb-2">Kirim Pesan</h2>
                <p className="text-sm text-ink-muted mb-8">Isi form di bawah dan kami akan merespons secepatnya.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name + Email row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-semibold text-ink mb-1.5">Nama Lengkap</label>
                      <input
                        type="text" id="contact-name" name="name" value={form.name}
                        onChange={handleChange} onBlur={handleBlur}
                        placeholder="Nama Anda" className={inputClasses('name')}
                      />
                      {getFieldState('name') === 'error' && (
                        <p className="flex items-center gap-1 text-xs text-red-600 mt-1.5">
                          <Warning className="w-3 h-3" weight="fill" /> {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-semibold text-ink mb-1.5">Email</label>
                      <input
                        type="email" id="contact-email" name="email" value={form.email}
                        onChange={handleChange} onBlur={handleBlur}
                        placeholder="email@contoh.com" className={inputClasses('email')}
                      />
                      {getFieldState('email') === 'error' && (
                        <p className="flex items-center gap-1 text-xs text-red-600 mt-1.5">
                          <Warning className="w-3 h-3" weight="fill" /> {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone + Subject row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-phone" className="block text-sm font-semibold text-ink mb-1.5">
                        No. Telepon <span className="text-ink-subtle font-normal">(opsional)</span>
                      </label>
                      <input
                        type="tel" id="contact-phone" name="phone" value={form.phone}
                        onChange={handleChange} onBlur={handleBlur}
                        placeholder="0812-xxxx-xxxx" className={inputClasses('phone')}
                      />
                      {getFieldState('phone') === 'error' && (
                        <p className="flex items-center gap-1 text-xs text-red-600 mt-1.5">
                          <Warning className="w-3 h-3" weight="fill" /> {errors.phone}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="contact-subject" className="block text-sm font-semibold text-ink mb-1.5">Subjek</label>
                      <select
                        id="contact-subject" name="subject" value={form.subject}
                        onChange={handleChange} onBlur={handleBlur}
                        className={`${inputClasses('subject')} appearance-none`}
                      >
                        {SUBJECTS.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                      {getFieldState('subject') === 'error' && (
                        <p className="flex items-center gap-1 text-xs text-red-600 mt-1.5">
                          <Warning className="w-3 h-3" weight="fill" /> {errors.subject}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-semibold text-ink mb-1.5">Pesan</label>
                    <textarea
                      id="contact-message" name="message" value={form.message}
                      onChange={handleChange} onBlur={handleBlur}
                      rows={5}
                      placeholder="Tulis pesan Anda di sini..."
                      className={`${inputClasses('message')} resize-none`}
                    />
                    {getFieldState('message') === 'error' && (
                      <p className="flex items-center gap-1 text-xs text-red-600 mt-1.5">
                        <Warning className="w-3 h-3" weight="fill" /> {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-teal text-white font-bold rounded-[var(--radius-button)] transition-all duration-200 ease-[var(--ease-out)] hover:bg-brand-teal/90 hover:shadow-lg hover:shadow-brand-teal/15"
                  >
                    <PaperPlaneRight className="w-5 h-5" weight="fill" />
                    Kirim Pesan
                  </button>
                </form>
              </div>
            </div>

            {/* Office info - narrower column */}
            <div className="lg:col-span-5">
              <div className="space-y-6">
                {/* Info cards */}
                <div className="bg-surface-raised rounded-[var(--radius-card)] border border-brand-100 p-6 lg:p-8">
                  <h3 className="text-lg font-extrabold text-ink mb-6">Informasi Kantor</h3>
                  <div className="space-y-5">
                    {OFFICE_INFO.map((item) => {
                      const Icon = item.icon
                      return (
                        <div key={item.label} className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-brand-teal/8 flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5 text-brand-teal" weight="fill" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-ink-subtle uppercase tracking-wide mb-0.5">{item.label}</p>
                            <p className="text-sm text-ink whitespace-pre-line leading-relaxed">{item.value}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* WhatsApp CTA */}
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 bg-emerald-50 border border-emerald-200/50 rounded-[var(--radius-card)] hover:bg-emerald-100/50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                    <WhatsappLogo className="w-6 h-6 text-white" weight="fill" />
                  </div>
                  <div>
                    <p className="font-bold text-ink">Chat via WhatsApp</p>
                    <p className="text-sm text-ink-muted">Respon lebih cepat, langsung ke tim kami</p>
                  </div>
                </a>

                {/* Map placeholder */}
                <div className="bg-brand-50 rounded-[var(--radius-card)] border border-brand-100 aspect-[4/3] flex flex-col items-center justify-center">
                  <MapPin className="w-10 h-10 text-brand-teal/40 mb-2" weight="duotone" />
                  <p className="text-sm text-ink-subtle font-medium">Peta Lokasi</p>
                  <p className="text-xs text-ink-subtle/70">Jl. Sudirman No. 123, Jakarta Pusat</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <FAQ />
    </>
  )
}
