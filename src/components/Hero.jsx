import { ArrowRight } from '@phosphor-icons/react'

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-end overflow-hidden">
      {/* Full-bleed hero image */}
      <div className="absolute inset-0">
        <img
          src="/img/unsplash/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80"
          alt="Mobil premium di jalan raya"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for text legibility - lighter to let image show */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/40 to-brand-dark/20" />
        {/* Side gradient for left-aligned text */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/60 via-transparent to-transparent" />
      </div>

      {/* Fallback gradient if image fails */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(135deg, #1e3843 0%, #264653 40%, #1a3040 70%, #0e1c23 100%)',
        }}
      />

      {/* Content - bottom-aligned for modern hero composition */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pb-12 lg:pb-20 pt-24">
        <div className="max-w-2xl">
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-[clamp(2.75rem,5vw,4rem)] font-extrabold text-white leading-[1.08] tracking-tight mb-5">
            Sewa mobil mudah, perjalanan{' '}
            <span className="text-brand-gold">nyaman</span>
          </h1>

          {/* Subtext (max 20 words) */}
          <p className="text-base lg:text-lg text-white/80 max-w-[42ch] mb-8 leading-relaxed">
            Armada terawat, harga transparan, konfirmasi instan. Dari city car sampai SUV premium.
          </p>

          {/* CTAs (1 primary + 1 secondary) */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="#booking"
              className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-gold text-brand-dark font-bold text-base rounded-[var(--radius-button)] transition-all duration-200 ease-[var(--ease-out)] hover:bg-brand-gold/90 hover:shadow-lg hover:shadow-brand-gold/20"
            >
              Booking Sekarang
              <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5" weight="bold" />
            </a>
            <a
              href="#why"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 border border-white/20 text-white font-semibold text-base rounded-[var(--radius-button)] backdrop-blur-sm transition-all duration-200 ease-[var(--ease-out)] hover:bg-white/15 hover:border-white/30"
            >
              Kenapa JelajahCar?
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
