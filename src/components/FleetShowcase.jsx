import { Users, GasPump, Gear, ArrowRight } from '@phosphor-icons/react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const cars = [
  {
    name: 'Toyota Avanza',
    category: 'MPV',
    price: '350.000',
    image: '/img/unsplash/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
    seats: 7,
    fuel: 'Bensin',
    transmission: 'Manual / AT',
    featured: false,
  },
  {
    name: 'Honda HR-V',
    category: 'SUV',
    price: '550.000',
    image: '/img/unsplash/photo-1606611013016-969c19ba27bb?auto=format&fit=crop&w=800&q=80',
    seats: 5,
    fuel: 'Bensin',
    transmission: 'CVT',
    featured: true,
  },
  {
    name: 'Mitsubishi Pajero Sport',
    category: 'SUV Premium',
    price: '850.000',
    image: '/img/unsplash/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80',
    seats: 7,
    fuel: 'Diesel',
    transmission: 'AT',
    featured: false,
  },
  {
    name: 'Toyota Alphard',
    category: 'Premium',
    price: '1.500.000',
    image: '/img/unsplash/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    seats: 7,
    fuel: 'Bensin',
    transmission: 'AT',
    featured: false,
  },
]

export default function FleetShowcase() {
  const sectionRef = useScrollReveal()

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
          <a
            href="#booking"
            className="group inline-flex items-center gap-2 text-brand-teal font-bold text-sm hover:text-brand-teal/80 transition-colors duration-200"
          >
            Lihat semua armada
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" weight="bold" />
          </a>
        </div>

        {/* Car grid: 1 featured (large) + 3 standard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Featured car (large) */}
          <div className="lg:col-span-7 group bg-surface-raised rounded-[var(--radius-card)] border border-brand-100 overflow-hidden hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-300">
            <div className="aspect-[16/10] overflow-hidden bg-brand-100">
              <img
                src={cars[1].image}
                alt={cars[1].name}
                className="w-full h-full object-cover transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-105"
              />
            </div>
            <div className="p-6 lg:p-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-brand-teal bg-brand-teal/8 px-2.5 py-1 rounded-full">{cars[1].category}</span>
                <span className="text-xs text-ink-subtle">Mulai dari</span>
              </div>
              <h3 className="text-xl font-extrabold text-ink mb-2">{cars[1].name}</h3>
              <div className="flex items-center gap-5 text-ink-muted text-sm mb-4">
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4" weight="fill" /> {cars[1].seats} kursi</span>
                <span className="flex items-center gap-1.5"><GasPump className="w-4 h-4" weight="fill" /> {cars[1].fuel}</span>
                <span className="flex items-center gap-1.5"><Gear className="w-4 h-4" weight="fill" /> {cars[1].transmission}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-ink font-extrabold">Rp {cars[1].price}<span className="text-ink-subtle font-normal text-sm">/hari</span></p>
                <a href="#booking" className="text-sm font-bold text-brand-teal hover:text-brand-teal/80 transition-colors duration-200">Booking</a>
              </div>
            </div>
          </div>

          {/* Standard cars (stacked) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {cars.filter((_, i) => i !== 1).map((car) => (
              <div key={car.name} className="group flex gap-4 bg-surface-raised rounded-[var(--radius-card)] border border-brand-100 p-4 hover:shadow-[var(--shadow-card)] transition-shadow duration-300">
                <div className="w-28 h-20 sm:w-32 sm:h-24 rounded-lg overflow-hidden bg-brand-100 shrink-0">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-between min-w-0">
                  <div>
                    <span className="text-[10px] font-bold text-brand-teal uppercase tracking-wide">{car.category}</span>
                    <h3 className="text-sm font-extrabold text-ink truncate">{car.name}</h3>
                    <div className="flex items-center gap-3 text-ink-subtle text-xs mt-1">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" weight="fill" /> {car.seats}</span>
                      <span className="flex items-center gap-1"><Gear className="w-3 h-3" weight="fill" /> {car.transmission}</span>
                    </div>
                  </div>
                  <p className="text-sm font-extrabold text-ink">Rp {car.price}<span className="text-ink-subtle font-normal text-xs">/hari</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
