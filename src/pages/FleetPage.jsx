import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, GasPump, Gear, CircleNotch, Car, MagnifyingGlass } from '@phosphor-icons/react'
import axios from 'axios'

const CATEGORIES = [
  { slug: '', label: 'Semua' },
  { slug: 'city-car', label: 'City Car' },
  { slug: 'mpv', label: 'MPV' },
  { slug: 'suv', label: 'SUV' },
  { slug: 'sedan', label: 'Sedan' },
  { slug: 'premium', label: 'Premium' },
]

function formatPrice(num) {
  return 'Rp ' + Number(num).toLocaleString('id-ID')
}

export default function FleetPage() {
  const [cars, setCars] = useState([])
  const [categories, setCategories] = useState(CATEGORIES)
  const [activeCategory, setActiveCategory] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    async function fetchCars() {
      try {
        const params = { per_page: 50 }
        if (activeCategory) params.category = activeCategory
        const res = await axios.get('/api/cars', { params })
        if (!cancelled && res.data?.success) {
          setCars(res.data.data.data || [])
          // Use categories from API if available
          if (res.data.data.categories?.length) {
            setCategories([
              { slug: '', label: 'Semua' },
              ...res.data.data.categories.map(c => ({ slug: c.slug, label: c.name }))
            ])
          }
        }
      } catch {
        // Keep empty
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchCars()
    return () => { cancelled = true }
  }, [activeCategory])

  return (
    <>
      {/* Compact header */}
      <section className="bg-brand-dark pt-28 pb-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl lg:text-5xl font-extrabold text-white mb-3">
            Armada Kami
          </h1>
          <p className="text-brand-200/80 text-lg max-w-xl leading-relaxed">
            Pilih dari berbagai tipe kendaraan terawat, siap antar ke lokasi Anda. Semua harga sudah termasuk asuransi dasar.
          </p>
        </div>
      </section>

      {/* Category filter tabs */}
      <section className="sticky top-16 lg:top-[72px] z-sticky bg-white/95 backdrop-blur-md border-b border-brand-100 px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 ease-[var(--ease-out)] ${
                  activeCategory === cat.slug
                    ? 'bg-brand-teal text-white shadow-sm'
                    : 'bg-brand-50 text-ink-muted hover:bg-brand-100 hover:text-ink'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Car grid */}
      <section className="py-16 lg:py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading && (
            <div className="flex justify-center py-20">
              <CircleNotch className="w-8 h-8 text-brand-teal animate-spin" weight="bold" />
            </div>
          )}

          {!loading && cars.length === 0 && (
            <div className="text-center py-20">
              <Car className="w-14 h-14 text-ink-subtle mx-auto mb-4" weight="duotone" />
              <p className="text-ink-muted font-medium text-lg">Belum ada armada untuk kategori ini</p>
              <p className="text-sm text-ink-subtle mt-1">Coba pilih kategori lain atau hubungi kami.</p>
              <button
                onClick={() => setActiveCategory('')}
                className="mt-4 px-5 py-2.5 bg-brand-teal text-white text-sm font-bold rounded-[var(--radius-button)] hover:bg-brand-teal/90 transition-colors"
              >
                Lihat Semua Armada
              </button>
            </div>
          )}

          {!loading && cars.length > 0 && (
            <>
              <p className="text-sm text-ink-subtle mb-8">
                Menampilkan <span className="font-bold text-ink">{cars.length}</span> kendaraan
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {cars.map((car) => (
                  <div
                    key={car.id || car.name}
                    className="group bg-surface-raised rounded-[var(--radius-card)] border border-brand-100 overflow-hidden hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-300"
                  >
                    {/* Image */}
                    <div className="aspect-[16/10] overflow-hidden bg-brand-100">
                      <img
                        src={car.image_url}
                        alt={car.name}
                        className="w-full h-full object-cover transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-5 lg:p-6">
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-[11px] font-bold text-brand-teal bg-brand-teal/8 px-2.5 py-1 rounded-full uppercase tracking-wide">
                          {car.category_name}
                        </span>
                        {car.is_featured ? (
                          <span className="text-[10px] font-bold text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded-full uppercase tracking-wide">
                            Unggulan
                          </span>
                        ) : null}
                      </div>

                      <h3 className="text-lg font-extrabold text-ink mb-3">{car.name}</h3>

                      {/* Specs */}
                      <div className="flex items-center gap-4 text-ink-muted text-sm mb-4">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-4 h-4" weight="fill" /> {car.seats} kursi
                        </span>
                        <span className="flex items-center gap-1.5">
                          <GasPump className="w-4 h-4" weight="fill" /> {car.fuel}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Gear className="w-4 h-4" weight="fill" /> {car.transmission}
                        </span>
                      </div>

                      {/* Description */}
                      {car.description && (
                        <p className="text-sm text-ink-muted leading-relaxed mb-4 line-clamp-2">
                          {car.description}
                        </p>
                      )}

                      {/* Price + CTA */}
                      <div className="flex items-center justify-between pt-4 border-t border-brand-100">
                        <div>
                          <span className="text-xs text-ink-subtle block">Mulai dari</span>
                          <p className="text-lg font-extrabold text-ink">
                            {formatPrice(car.price_per_day)}
                            <span className="text-ink-subtle font-normal text-sm">/hari</span>
                          </p>
                        </div>
                        <Link
                          to="/#booking"
                          className="px-5 py-2.5 bg-brand-teal text-white text-sm font-bold rounded-[var(--radius-button)] hover:bg-brand-teal/90 transition-colors duration-200"
                        >
                          Booking
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
