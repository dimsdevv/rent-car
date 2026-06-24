import { Tag, ArrowRight, AirplaneTilt, CalendarDots, Percent } from '@phosphor-icons/react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const PROMOS = [
  {
    icon: Percent,
    badge: 'Hemat',
    badgeColor: 'bg-brand-teal/[0.08] text-brand-teal ring-1 ring-brand-teal/15',
    title: 'Sewa 3 Hari, Diskon 15%',
    body: 'Berlaku untuk semua jenis kendaraan. Semakin lama, semakin hemat.',
    accent: 'brand-teal',
    gradientFrom: 'from-brand-teal/[0.04]',
  },
  {
    icon: AirplaneTilt,
    badge: 'Eksklusif',
    badgeColor: 'bg-brand-gold/10 text-brand-dark ring-1 ring-brand-gold/20',
    title: 'Gratis Antar Bandara',
    body: 'Khusus penjemputan di bandara utama. Tanpa biaya tambahan.',
    accent: 'brand-gold',
    gradientFrom: 'from-brand-gold/[0.04]',
  },
  {
    icon: CalendarDots,
    badge: 'Weekend',
    badgeColor: 'bg-brand-teal/[0.08] text-brand-teal ring-1 ring-brand-teal/15',
    title: 'Weekend Special',
    body: 'Harga spesial setiap Jumat sampai Minggu. Kuota terbatas.',
    accent: 'brand-teal',
    gradientFrom: 'from-brand-teal/[0.04]',
  },
  {
    icon: Tag,
    badge: 'Best Deal',
    badgeColor: 'bg-brand-gold/10 text-brand-dark ring-1 ring-brand-gold/20',
    title: 'Paket Mingguan -25%',
    body: 'Sewa 7 hari, bayar hanya 75%. Ideal untuk perjalanan panjang.',
    accent: 'brand-gold',
    gradientFrom: 'from-brand-gold/[0.04]',
  },
]

export default function PromoDeals() {
  const headerRef = useScrollReveal()

  return (
    <section className="py-20 lg:py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="reveal flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 lg:mb-14">
          <div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-ink mb-3">
              Promo spesial untuk Anda
            </h2>
            <p className="text-base text-ink-muted leading-relaxed max-w-lg">
              Penawaran terbatas yang bisa menghemat biaya perjalanan Anda.
            </p>
          </div>
          <a
            href="#booking"
            className="group inline-flex items-center gap-2 text-brand-teal font-bold text-sm hover:text-brand-teal/80 transition-colors duration-200 shrink-0"
          >
            Lihat semua promo
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" weight="bold" />
          </a>
        </div>

        {/* Mobile: horizontal scroll-snap, Desktop: grid */}
        <div className="
          flex lg:grid lg:grid-cols-4 gap-4 lg:gap-5
          overflow-x-auto snap-x snap-mandatory
          lg:overflow-visible
          -mx-6 px-6 lg:mx-0 lg:px-0
          scrollbar-hide
          pb-4 lg:pb-0
        ">
          {PROMOS.map((promo) => {
            const Icon = promo.icon

            return (
              <a
                key={promo.title}
                href="#booking"
                className="
                  group flex-shrink-0 w-[80vw] sm:w-[60vw] lg:w-auto
                  snap-start
                  p-1.5 bg-brand-50/40 rounded-2xl border border-brand-100/50
                  hover:border-brand-teal/20
                  transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)]
                  active:scale-[0.98]
                "
              >
                {/* Inner card - Double-Bezel */}
                <div className={`
                  relative bg-white rounded-[calc(1rem-0.375rem)] p-5 lg:p-6 h-full
                  flex flex-col overflow-hidden
                  shadow-[0_1px_4px_-1px_rgba(0,0,0,0.03)]
                  transition-shadow duration-400 ease-[cubic-bezier(0.23,1,0.32,1)]
                  group-hover:shadow-[0_4px_20px_-4px_rgba(42,157,143,0.08)]
                `}>
                  {/* Subtle gradient accent */}
                  <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-30 bg-gradient-radial ${promo.gradientFrom} to-transparent pointer-events-none`} />

                  <div className="relative">
                    {/* Badge */}
                    <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full mb-4 ${promo.badgeColor}`}>
                      {promo.badge}
                    </span>

                    {/* Icon */}
                    <div className="w-11 h-11 rounded-xl bg-brand-50 border border-brand-100/60 flex items-center justify-center mb-4 transition-colors duration-300 group-hover:bg-brand-teal/[0.06] group-hover:border-brand-teal/15">
                      <Icon className="w-5 h-5 text-brand-teal" weight="duotone" />
                    </div>

                    {/* Text */}
                    <h3 className="text-base font-extrabold text-ink mb-1.5 leading-snug">{promo.title}</h3>
                    <p className="text-sm text-ink-muted leading-relaxed mb-5">{promo.body}</p>
                  </div>

                  {/* CTA footer */}
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-brand-100/50">
                    <span className="text-xs font-semibold text-brand-teal">Booking Sekarang</span>
                    <div className="w-6 h-6 rounded-full bg-brand-teal/[0.06] flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:bg-brand-teal/[0.14] group-hover:translate-x-0.5">
                      <ArrowRight className="w-3 h-3 text-brand-teal" weight="bold" />
                    </div>
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
