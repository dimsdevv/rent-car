import { Star } from '@phosphor-icons/react'
import { useCountUp } from '../hooks/useCountUp'

function StatItem({ target, suffix, label, decimals = 0, duration }) {
  const { ref, displayValue } = useCountUp(target, { decimals, duration })

  return (
    <div ref={ref} className="flex flex-col items-center text-center py-8 lg:py-0">
      <p className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-2">
        {displayValue}
        <span className="text-brand-gold ml-1">
          {suffix === '★' ? (
            <Star className="inline-block w-7 h-7 lg:w-8 lg:h-8 -mt-1 ml-0.5" weight="fill" />
          ) : (
            suffix
          )}
        </span>
      </p>
      <p className="text-sm text-brand-200/60 font-medium tracking-wide">{label}</p>
    </div>
  )
}

const STATS = [
  { target: 2847, suffix: '+', label: 'Booking selesai', duration: 2000 },
  { target: 150,  suffix: '+', label: 'Unit armada',     duration: 1600 },
  { target: 4.8,  suffix: '★', label: 'Rating pelanggan', decimals: 1, duration: 1400 },
  { target: 25,   suffix: '+', label: 'Kota layanan',    duration: 1200 },
]

export default function StatsCounter() {
  return (
    <section className="bg-brand-dark py-24 lg:py-28 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0">
          {STATS.map((stat, i) => {
            const isLast = i === STATS.length - 1

            return (
              <div key={stat.label} className="relative">
                <StatItem
                  target={stat.target}
                  suffix={stat.suffix}
                  label={stat.label}
                  decimals={stat.decimals}
                  duration={stat.duration}
                />
                {/* Vertical divider between items - hidden on mobile between row 1 col 2 and row 2 col 1 */}
                {!isLast && (
                  <div className={`
                    absolute top-1/2 -translate-y-1/2 right-0 w-px h-12
                    bg-gradient-to-b from-transparent via-brand-200/15 to-transparent
                    ${i === 1 ? 'hidden lg:block' : 'block'}
                  `} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
