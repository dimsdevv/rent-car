import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, GasPump, Gear, ArrowRight, CircleNotch } from '@phosphor-icons/react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import axios from 'axios'

// Fallback data if API is unavailable
const FALLBACK_CARS = [
  {
    name: 'Toyota Avanza',
    category_name: 'MPV',
    price_per_day: 350000,
    price_formatted: 'Rp 350.000',
    image_url: '/img/unsplash/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
    seats: 7,
    fuel: 'Bensin',
    transmission: 'Manual / AT',
    is_featured: false,
  },
  {
    name: 'Honda HR-V',
    category_name: 'SUV',
    price_per_day: 550000,
    price_formatted: 'Rp 550.000',
    image_url: '/img/unsplash/photo-1606611013016-969c19ba27bb?auto=format&fit=crop&w=800&q=80',
    seats: 5,
    fuel: 'Bensin',
    transmission: 'CVT',
    is_featured: true,
  },
  {
    name: 'Mitsubishi Pajero Sport',
    category_name: 'SUV Premium',
    price_per_day: 850000,
    price_formatted: 'Rp 850.000',
    image_url: '/img/unsplash/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80',
    seats: 7,
    fuel: 'Diesel',
    transmission: 'AT',
    is_featured: false,
  },
  {
    name: 'Toyota Alphard',
    category_name: 'Premium',
    price_per_day: 1500000,
    price_formatted: 'Rp 1.500.000',
    image_url: '/img/unsplash/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    seats: 7,
    fuel: 'Bensin',
    transmission: 'AT',
    is_featured: false,
  },
]

function formatPrice(num) {
  return 'Rp ' + Number(num).toLocaleString('id-ID')
}

export default function FleetShowcase() {
  const sectionRef = useScrollReveal()
  const [cars, setCars] = useState(FALLBACK_CARS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchCars() {
      try {
        const res = await axios.get('/api/cars', { params: { per_page: 8 } })
        if (!cancelled && res.data?.success && res.data.data?.data?.length > 0) {
          setCars(res.data.data.data)
        }
      } catch {
        // Keep fallback data
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchCars()
    return () => { cancelled = true }
  }, [])

  // Find featured car (large card) or use index 1 as default
  const featuredIndex = cars.findIndex((c) => c.is_featured)
  const featured = cars[featuredIndex !== -1 ? featuredIndex : 1] || cars[0]
  const others = cars.filter((_, i) => i !== (featuredIndex !== -1 ? featuredIndex : 1))

  const priceFormatted = (car) => car.price_formatted || formatPrice(car.price_per_day)

  return (
    <section id="fleet" className="py-24 lg:py-32 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={sectionRef} className="reveal flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <div className="max-w-xl">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-ink mb-4">
              Armada siap jalan
            </h2>
            <p className="text-lg text-ink-muted leading-relaxed">
              Semua unit terawat, bersih, dan siap antar ke lokasi Anda.
            </p>
          </div>
          <Link
            to="/armada"
            className="group inline-flex items-center gap-2 text-brand-teal font-bold text-sm hover:text-brand-teal/80 transition-colors duration-200"
          >
            Lihat semua armada
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" weight="bold" />
          </Link>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center py-12">
            <CircleNotch className="w-8 h-8 text-brand-teal animate-spin" weight="bold" />
          </div>
        )}

        {/* Car grid: 1 featured (large) + others stacked */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Featured car (large) */}
            {featured && (
              <div className="lg:col-span-7 group bg-surface-raised rounded-[var(--radius-card)] border border-brand-100 overflow-hidden hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-300">
                <div className="aspect-[16/10] overflow-hidden bg-brand-100">
                  <img
                    src={featured.image_url}
                    alt={featured.name}
                    className="w-full h-full object-cover transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 lg:p-8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-brand-teal bg-brand-teal/8 px-2.5 py-1 rounded-full">
                      {featured.category_name}
                    </span>
                    <span className="text-xs text-ink-subtle">Mulai dari</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-ink mb-2">{featured.name}</h3>
                  <div className="flex items-center gap-5 text-ink-muted text-sm mb-4">
                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4" weight="fill" /> {featured.seats} kursi</span>
                    <span className="flex items-center gap-1.5"><GasPump className="w-4 h-4" weight="fill" /> {featured.fuel}</span>
                    <span className="flex items-center gap-1.5"><Gear className="w-4 h-4" weight="fill" /> {featured.transmission}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-ink font-extrabold">{priceFormatted(featured)}<span className="text-ink-subtle font-normal text-sm">/hari</span></p>
                    <Link to="/#booking" className="text-sm font-bold text-brand-teal hover:text-brand-teal/80 transition-colors duration-200">Booking</Link>
                  </div>
                </div>
              </div>
            )}

            {/* Standard cars (stacked) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {others.map((car) => (
                <div key={car.name} className="group flex gap-4 bg-surface-raised rounded-[var(--radius-card)] border border-brand-100 p-4 hover:shadow-[var(--shadow-card)] transition-shadow duration-300">
                  <div className="w-28 h-20 sm:w-32 sm:h-24 rounded-lg overflow-hidden bg-brand-100 shrink-0">
                    <img
                      src={car.image_url}
                      alt={car.name}
                      className="w-full h-full object-cover transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col justify-between min-w-0">
                    <div>
                      <span className="text-[10px] font-bold text-brand-teal uppercase tracking-wide">{car.category_name}</span>
                      <h3 className="text-sm font-extrabold text-ink truncate">{car.name}</h3>
                      <div className="flex items-center gap-3 text-ink-subtle text-xs mt-1">
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" weight="fill" /> {car.seats}</span>
                        <span className="flex items-center gap-1"><Gear className="w-3 h-3" weight="fill" /> {car.transmission}</span>
                      </div>
                    </div>
                    <p className="text-sm font-extrabold text-ink">{priceFormatted(car)}<span className="text-ink-subtle font-normal text-xs">/hari</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
