import { MapPin, ArrowRight } from '@phosphor-icons/react'
import { useScrollReveal, useStaggerReveal } from '../hooks/useScrollReveal'

const CITIES = [
  { name: 'Bandung',      units: 45, popular: true },
  { name: 'Jakarta',      units: 38, popular: true },
  { name: 'Surabaya',     units: 25, popular: true },
  { name: 'Bali',         units: 20, popular: true },
  { name: 'Yogyakarta',   units: 18, popular: false },
  { name: 'Semarang',     units: 15, popular: false },
  { name: 'Malang',       units: 12, popular: false },
  { name: 'Cirebon',      units: 8,  popular: false },
]

export default function CoverageMap() {
  const headerRef = useScrollReveal()
  const gridRef = useStaggerReveal()

  return (
    <section id="coverage" className="py-24 lg:py-32 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="reveal max-w-xl mb-16 lg:mb-20">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-ink mb-4">
            Jangkauan layanan kami
          </h2>
          <p className="text-lg text-ink-muted leading-relaxed">
            Tersedia di kota-kota besar di seluruh Indonesia. Pilih kota Anda dan mulai booking.
          </p>
        </div>

        {/* City Grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {CITIES.map((city, i) => (
            <a
              key={city.name}
              href="#booking"
              data-reveal
              data-reveal-delay={String(i * 60)}
              className="group relative p-1.5 bg-brand-50/40 rounded-2xl border border-brand-100/50 hover:border-brand-teal/20 transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-brand-teal/[0.03]"
            >
              {/* Inner card (Double-Bezel architecture) */}
              <div className="bg-white rounded-[calc(1rem-0.375rem)] p-5 flex flex-col h-full shadow-[0_1px_4px_-1px_rgba(0,0,0,0.03)] transition-shadow duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:shadow-[0_4px_16px_-4px_rgba(42,157,143,0.1)]">
                {/* Top row: pin icon + popular badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-teal/[0.06] border border-brand-teal/10 flex items-center justify-center transition-colors duration-300 group-hover:bg-brand-teal/[0.12]">
                    <MapPin className="w-5 h-5 text-brand-teal" weight="duotone" />
                  </div>
                  {city.popular && (
                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-brand-teal bg-brand-teal/[0.06] px-2 py-0.5 rounded-full ring-1 ring-brand-teal/10">
                      Populer
                    </span>
                  )}
                </div>

                {/* City name + unit count */}
                <h3 className="text-lg font-extrabold text-ink mb-1">{city.name}</h3>
                <p className="text-sm text-ink-muted mb-4">
                  <span className="font-bold text-ink">{city.units}</span> unit tersedia
                </p>

                {/* CTA - nested arrow pattern */}
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-brand-100/60">
                  <span className="text-xs font-semibold text-brand-teal">Booking di sini</span>
                  <div className="w-7 h-7 rounded-full bg-brand-teal/[0.06] flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:bg-brand-teal/[0.14] group-hover:translate-x-0.5">
                    <ArrowRight className="w-3.5 h-3.5 text-brand-teal" weight="bold" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
