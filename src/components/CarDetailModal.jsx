import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Users, GasPump, Gear, Star, CalendarCheck } from '@phosphor-icons/react'

function formatPrice(num) {
  return 'Rp ' + Number(num).toLocaleString('id-ID')
}

export default function CarDetailModal({ open, onClose, car, onBooking }) {
  const overlayRef = useRef(null)

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

  const priceFormatted = (c) => c.price_formatted || formatPrice(c.price_per_day)

  const specs = car ? [
    { icon: Users, label: `${car.seats} Kursi`, weight: 'fill' },
    { icon: GasPump, label: car.fuel, weight: 'fill' },
    { icon: Gear, label: car.transmission, weight: 'fill' },
  ] : []

  return (
    <AnimatePresence>
      {open && car && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
          onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{
              type: 'spring',
              stiffness: 320,
              damping: 30,
              mass: 0.8,
            }}
            className="relative w-full max-w-lg bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 active:scale-95 transition-all duration-200"
            >
              <X className="w-4 h-4" weight="bold" />
            </button>

            {/* Image hero */}
            <div className="relative aspect-[16/10] overflow-hidden bg-brand-100 shrink-0">
              <img
                src={car.image_url}
                alt={car.name}
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Badges on image */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="text-[11px] font-bold text-white bg-brand-teal/90 backdrop-blur-sm px-3 py-1 rounded-full uppercase tracking-wide">
                  {car.category_name}
                </span>
                {car.is_featured ? (
                  <span className="text-[11px] font-bold text-amber-100 bg-amber-500/80 backdrop-blur-sm px-3 py-1 rounded-full uppercase tracking-wide flex items-center gap-1">
                    <Star className="w-3 h-3" weight="fill" />
                    Unggulan
                  </span>
                ) : null}
              </div>

              {/* Name overlay on bottom of image */}
              <div className="absolute bottom-4 left-5 right-14">
                <h2 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-sm">
                  {car.name}
                </h2>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6">
              {/* Specs grid */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {specs.map((spec, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-1.5 py-3 px-2 bg-brand-50 rounded-xl border border-brand-100"
                  >
                    <spec.icon className="w-5 h-5 text-brand-teal" weight={spec.weight} />
                    <span className="text-xs font-semibold text-ink text-center leading-tight">{spec.label}</span>
                  </div>
                ))}
              </div>

              {/* Description */}
              {car.description && (
                <div className="mb-5">
                  <h4 className="text-sm font-bold text-ink mb-1.5">Tentang Kendaraan</h4>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    {car.description}
                  </p>
                </div>
              )}

              {/* Price + CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-brand-100">
                <div>
                  <span className="text-xs text-ink-subtle block">Mulai dari</span>
                  <p className="text-xl font-extrabold text-ink">
                    {priceFormatted(car)}
                    <span className="text-ink-subtle font-normal text-sm">/hari</span>
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose()
                    if (onBooking) onBooking(car)
                  }}
                  className="px-6 py-3 bg-brand-teal text-white text-sm font-bold rounded-xl hover:bg-brand-teal/90 active:scale-[0.97] transition-all duration-200 flex items-center gap-2"
                >
                  <CalendarCheck className="w-4 h-4" weight="bold" />
                  Booking Sekarang
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
