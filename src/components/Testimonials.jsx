import { useState, useEffect } from 'react'
import { Star, ChatCircleText, CircleNotch } from '@phosphor-icons/react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import axios from 'axios'

// Fallback data if API is unavailable
const FALLBACK_TESTIMONIALS = [
  {
    name: 'Andi Pratama',
    role: 'Business Trip, Jakarta',
    rating: 5,
    text: 'Proses booking sangat cepat. Konfirmasi langsung masuk WhatsApp, tidak perlu telepon berulang. Mobil bersih dan AC dingin, sangat membantu untuk meeting klien.',
    is_featured: true,
  },
  {
    name: 'Sari Dewi',
    role: 'Liburan Keluarga, Bali',
    rating: 5,
    text: 'Bawa keluarga 5 orang, dikasih MPV yang nyaman. Anak-anak senang, supir ramah dan tahu jalan. Pasti repeat order.',
    is_featured: false,
  },
  {
    name: 'Budi Hartono',
    role: 'Airport Transfer, Surabaya',
    rating: 5,
    text: 'Pes landing jam 2 pagi, supir sudah standby. Harga sudah termasuk tol dan parkir, tidak ada biaya tambahan. Transparan banget.',
    is_featured: false,
  },
  {
    name: 'Maya Anggraini',
    role: 'Wedding Trip, Yogyakarta',
    rating: 5,
    text: 'Untuk wedding trip kami, mobilnya dihias cantik tanpa biaya tambahan. Detail kecil yang bikin terkesan.',
    is_featured: true,
  },
]

function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-4 h-4 text-brand-gold" weight="fill" />
      ))}
    </div>
  )
}

export default function Testimonials() {
  const sectionRef = useScrollReveal()
  const [testimonials, setTestimonials] = useState(FALLBACK_TESTIMONIALS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchTestimonials() {
      try {
        const res = await axios.get('/api/testimonials', { params: { per_page: 10 } })
        if (!cancelled && res.data?.success && res.data.data?.data?.length > 0) {
          setTestimonials(res.data.data.data)
        }
      } catch {
        // Keep fallback data
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchTestimonials()
    return () => { cancelled = true }
  }, [])

  // Safely access testimonials by index
  const t = (i) => testimonials[i] || { name: '', role: '', rating: 5, text: '', is_featured: false }

  return (
    <section id="testimonials" className="py-24 lg:py-32 px-6 lg:px-8 bg-brand-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={sectionRef} className="reveal max-w-xl mb-16">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-ink mb-4">
            Kata mereka yang sudah pakai
          </h2>
          <p className="text-lg text-ink-muted leading-relaxed">
            Lebih dari 10.000 pelanggan puas. Ini cerita mereka.
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center py-12">
            <CircleNotch className="w-8 h-8 text-brand-teal animate-spin" weight="bold" />
          </div>
        )}

        {/* Asymmetric grid: featured + small + small + featured */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Large featured testimonial */}
            <div className="lg:col-span-7 p-8 lg:p-10 bg-surface-raised rounded-[var(--radius-card)] border border-brand-100 relative">
              <ChatCircleText className="w-10 h-10 text-brand-teal/15 absolute top-6 right-6" weight="fill" />
              <Stars count={t(0).rating} />
              <p className="text-lg lg:text-xl text-ink leading-relaxed mt-5 mb-6 max-w-[52ch]">
                {t(0).text}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-teal/10 flex items-center justify-center">
                  <span className="text-brand-teal font-extrabold text-sm">{t(0).name?.[0]}</span>
                </div>
                <div>
                  <p className="font-bold text-ink text-sm">{t(0).name}</p>
                  <p className="text-ink-subtle text-xs">{t(0).role}</p>
                </div>
              </div>
            </div>

            {/* Small testimonial */}
            <div className="lg:col-span-5 p-6 lg:p-8 bg-surface-raised rounded-[var(--radius-card)] border border-brand-100">
              <Stars count={t(1).rating} />
              <p className="text-ink-muted leading-relaxed mt-4 mb-5">
                {t(1).text}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-gold/15 flex items-center justify-center">
                  <span className="text-brand-dark font-extrabold text-xs">{t(1).name?.[0]}</span>
                </div>
                <div>
                  <p className="font-bold text-ink text-sm">{t(1).name}</p>
                  <p className="text-ink-subtle text-xs">{t(1).role}</p>
                </div>
              </div>
            </div>

            {/* Small testimonial */}
            <div className="lg:col-span-5 p-6 lg:p-8 bg-surface-raised rounded-[var(--radius-card)] border border-brand-100">
              <Stars count={t(2).rating} />
              <p className="text-ink-muted leading-relaxed mt-4 mb-5">
                {t(2).text}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-gold/15 flex items-center justify-center">
                  <span className="text-brand-dark font-extrabold text-xs">{t(2).name?.[0]}</span>
                </div>
                <div>
                  <p className="font-bold text-ink text-sm">{t(2).name}</p>
                  <p className="text-ink-subtle text-xs">{t(2).role}</p>
                </div>
              </div>
            </div>

            {/* Large featured testimonial (dark) */}
            <div className="lg:col-span-7 p-8 lg:p-10 bg-brand-dark rounded-[var(--radius-card)] text-white relative overflow-hidden">
              <div
                className="absolute -right-16 -top-16 w-56 h-56 rounded-full opacity-10"
                style={{ background: 'radial-gradient(circle, #E9C46A 0%, transparent 70%)' }}
              />
              <ChatCircleText className="w-10 h-10 text-brand-gold/20 absolute top-6 right-6" weight="fill" />
              <div className="relative">
                <Stars count={t(3).rating} />
                <p className="text-lg lg:text-xl text-white/90 leading-relaxed mt-5 mb-6 max-w-[52ch]">
                  {t(3).text}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center">
                    <span className="text-brand-gold font-extrabold text-sm">{t(3).name?.[0]}</span>
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{t(3).name}</p>
                    <p className="text-white/60 text-xs">{t(3).role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
