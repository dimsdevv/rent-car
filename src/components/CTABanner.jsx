import { Phone, ArrowRight } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

export default function CTABanner() {
  return (
    <section className="px-6 lg:px-8 py-24 lg:py-32">
      <div className="max-w-7xl mx-auto">
        <div className="relative bg-brand-dark rounded-2xl overflow-hidden px-8 py-16 lg:px-16 lg:py-20">
          {/* Background accents */}
          <div
            className="absolute top-0 right-0 w-[50%] h-full opacity-15"
            style={{ background: 'radial-gradient(ellipse at 80% 30%, #2A9D8F 0%, transparent 60%)' }}
          />
          <div
            className="absolute bottom-0 left-1/4 w-[30%] h-[60%] opacity-10"
            style={{ background: 'radial-gradient(ellipse at center, #E9C46A 0%, transparent 60%)' }}
          />

          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-lg text-center lg:text-left">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">
                Siap memulai perjalanan?
              </h2>
              <p className="text-brand-200/80 text-lg leading-relaxed">
                Hubungi kami sekarang atau booking langsung melalui form di atas. Tim kami siap membantu merencanakan perjalanan terbaik Anda.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/#booking"
                className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-brand-gold text-brand-dark font-bold rounded-[var(--radius-button)] transition-all duration-200 ease-[var(--ease-out)] hover:bg-brand-gold/90 hover:shadow-lg hover:shadow-brand-gold/20"
              >
                Booking Online
                <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5" weight="bold" />
              </Link>
              <a
                href="tel:+6281234567890"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white/[0.08] border border-white/[0.15] text-white font-semibold rounded-[var(--radius-button)] transition-all duration-200 ease-[var(--ease-out)] hover:bg-white/[0.12]"
              >
                <Phone className="w-5 h-5" weight="fill" />
                0812-3456-7890
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
