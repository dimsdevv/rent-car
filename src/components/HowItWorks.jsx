import { MagnifyingGlass, CalendarCheck, CreditCard, Car } from '@phosphor-icons/react'
import { useStaggerReveal } from '../hooks/useScrollReveal'

const STEPS = [
  {
    icon: MagnifyingGlass,
    title: 'Pilih Kendaraan',
    body: 'Jelajahi armada, bandingkan harga dan spesifikasi sesuai kebutuhan.',
  },
  {
    icon: CalendarCheck,
    title: 'Isi Form Booking',
    body: 'Tentukan tanggal, lokasi jemput, dan lengkapi data diri Anda.',
  },
  {
    icon: CreditCard,
    title: 'Konfirmasi & Bayar',
    body: 'Verifikasi pesanan dan lakukan pembayaran secara aman.',
  },
  {
    icon: Car,
    title: 'Mobil Diantar',
    body: 'Kendaraan diantar ke lokasi Anda, siap digunakan.',
  },
]

export default function HowItWorks() {
  const staggerRef = useStaggerReveal()

  return (
    <section className="bg-brand-dark py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-xl mb-16 lg:mb-20">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">
            Cara sewa di JelajahCar
          </h2>
          <p className="text-base lg:text-lg text-brand-200/70 leading-relaxed">
            Empat langkah mudah dari pilih mobil sampai kendaraan tiba di depan Anda.
          </p>
        </div>

        {/* Stepper Grid */}
        <div ref={staggerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            const isLast = i === STEPS.length - 1

            return (
              <div
                key={step.title}
                data-reveal
                data-reveal-delay={String(i * 80)}
                className="relative flex flex-col"
              >
                {/* Connector line - hidden on mobile, visible on lg */}
                {!isLast && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] right-0 h-px bg-gradient-to-r from-brand-teal/40 to-brand-teal/0 z-0" />
                )}

                {/* Card content */}
                <div className="relative z-10 p-6 lg:p-8 flex flex-col items-center text-center group">
                  {/* Number + Icon stack */}
                  <div className="relative mb-6">
                    {/* Outer glow ring */}
                    <div className="w-16 h-16 rounded-2xl bg-brand-teal/[0.08] border border-brand-teal/15 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:bg-brand-teal/[0.14] group-hover:border-brand-teal/25">
                      <Icon className="w-7 h-7 text-brand-teal" weight="duotone" />
                    </div>
                    {/* Step number badge */}
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-brand-teal text-white text-[10px] font-extrabold flex items-center justify-center shadow-lg shadow-brand-teal/30">
                      {i + 1}
                    </span>
                  </div>

                  {/* Text */}
                  <h3 className="text-lg font-extrabold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-brand-200/60 leading-relaxed max-w-[28ch]">{step.body}</p>
                </div>

                {/* Mobile separator - visible only on small screens, hidden on lg */}
                {!isLast && (
                  <div className="lg:hidden w-px h-8 bg-gradient-to-b from-brand-teal/30 to-transparent mx-auto" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
