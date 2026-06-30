import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, GasPump, Gear, ArrowRight, CircleNotch, Star } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'
import axios from 'axios'
import CarDetailModal from './CarDetailModal'
import BookingModal from './BookingModal'

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

// Stagger animation variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 24,
    },
  },
}

export default function FleetShowcase() {
  const sectionRef = useScrollReveal()
  const [cars, setCars] = useState(FALLBACK_CARS)
  const [loading, setLoading] = useState(true)
  const [selectedCar, setSelectedCar] = useState(null)
  const [bookingCar, setBookingCar] = useState(null)

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

  // Show max 4 cars on homepage
  const displayCars = cars.slice(0, 4)

  const priceFormatted = (car) => car.price_formatted || formatPrice(car.price_per_day)

  return (
    <>
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

          {/* Car grid — uniform 4 columns */}
          {!loading && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
            >
              {displayCars.map((car) => (
                <motion.div
                  key={car.id || car.name}
                  variants={cardVariants}
                  className="group bg-surface-raised rounded-2xl border border-brand-100 overflow-hidden cursor-pointer
                    hover:shadow-[0_8px_30px_oklch(0.2_0.02_200/0.12)] hover:-translate-y-1
                    transition-all duration-300 ease-[var(--ease-out)]"
                  onClick={() => setSelectedCar(car)}
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-brand-100">
                    <img
                      src={car.image_url}
                      alt={car.name}
                      className="w-full h-full object-cover transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Badges overlay */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-white bg-brand-teal/85 backdrop-blur-sm px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                        {car.category_name}
                      </span>
                      {car.is_featured ? (
                        <span className="text-[10px] font-bold text-amber-100 bg-amber-500/80 backdrop-blur-sm px-2 py-0.5 rounded-full uppercase tracking-wide flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5" weight="fill" />
                          Unggulan
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-base font-extrabold text-ink mb-2.5 truncate">{car.name}</h3>

                    {/* Specs */}
                    <div className="flex items-center gap-3 text-ink-muted text-xs mb-4">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" weight="fill" /> {car.seats}
                      </span>
                      <span className="flex items-center gap-1">
                        <GasPump className="w-3.5 h-3.5" weight="fill" /> {car.fuel}
                      </span>
                      <span className="flex items-center gap-1">
                        <Gear className="w-3.5 h-3.5" weight="fill" /> {car.transmission}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="pt-3.5 border-t border-brand-100">
                      <span className="text-[10px] text-ink-subtle uppercase tracking-wide">Mulai dari</span>
                      <p className="text-base font-extrabold text-ink">
                        {priceFormatted(car)}
                        <span className="text-ink-subtle font-normal text-xs">/hari</span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Car Detail Modal */}
      <CarDetailModal
        open={!!selectedCar}
        onClose={() => setSelectedCar(null)}
        car={selectedCar}
        onBooking={(car) => {
          setSelectedCar(null)
          setTimeout(() => setBookingCar(car), 200)
        }}
      />

      {/* Booking Modal */}
      <BookingModal
        open={!!bookingCar}
        onClose={() => setBookingCar(null)}
        car={bookingCar}
      />
    </>
  )
}
