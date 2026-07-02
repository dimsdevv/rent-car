import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CloudRain, Sun, ArrowRight, ShieldCheck, Thermometer, Wind } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

const weatherStates = [
  {
    type: 'rain',
    title: 'Hujan di lokasi Anda?',
    desc: 'Tetap aman dan nyaman dengan SUV tangguh kami. Cocok untuk melewati genangan air dan jalan licin dengan penggerak yang stabil.',
    carType: 'SUV Tangguh',
    carName: 'Toyota Fortuner',
    icon: <CloudRain weight="duotone" className="text-brand-teal text-5xl" />,
    bgClass: 'bg-gradient-to-br from-brand-50/80 to-surface/80',
    borderColor: 'border-brand-200/50',
    accentColor: 'text-brand-600',
    buttonClass: 'bg-brand-teal hover:bg-brand-500 text-white shadow-brand-teal/25',
    carImg: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800' // Darker car, SUV-ish feel
  },
  {
    type: 'sun',
    title: 'Cuaca Cerah Hari Ini!',
    desc: 'Waktu yang pas untuk jalan-jalan bersama keluarga atau kolega. Nikmati kenyamanan ekstra dengan kabin luas dan AC yang dingin.',
    carType: 'Premium MPV',
    carName: 'Toyota Alphard',
    icon: <Sun weight="duotone" className="text-brand-gold text-5xl" />,
    bgClass: 'bg-gradient-to-br from-[#E9C46A]/10 to-surface/80',
    borderColor: 'border-[#E9C46A]/30',
    accentColor: 'text-[#B99532]',
    buttonClass: 'bg-brand-gold hover:bg-[#D4A017] text-ink font-bold shadow-[#E9C46A]/25',
    carImg: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=800' // Fancy MPV
  }
]

export default function WeatherRecommender() {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    // Simulasi deteksi cuaca (secara acak untuk keperluan demo/portfolio)
    const isRainy = Math.random() > 0.5
    setWeather(isRainy ? weatherStates[0] : weatherStates[1])
  }, [])

  if (!weather) return null

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-brand-teal/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`relative overflow-hidden rounded-3xl backdrop-blur-xl border ${weather.borderColor} ${weather.bgClass} p-8 md:p-12 shadow-sm`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            {/* Text Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center justify-center p-3.5 bg-white/60 shadow-sm rounded-2xl backdrop-blur-md">
                {weather.icon}
              </div>
              
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >

                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-ink mb-5 leading-tight">
                    {weather.title}
                  </h3>
                </motion.div>
                
                <p className="text-ink-muted text-lg md:text-xl leading-relaxed">
                  {weather.desc}
                </p>
              </div>

              <ul className="space-y-4">
                <li className="flex items-center gap-4 text-ink-muted">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/60 flex items-center justify-center shadow-sm">
                    <ShieldCheck weight="fill" className={`${weather.accentColor} text-lg`} />
                  </div>
                  <span className="font-medium text-lg">Rekomendasi: <span className="font-bold text-ink">{weather.carType}</span></span>
                </li>
                <li className="flex items-center gap-4 text-ink-muted">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/60 flex items-center justify-center shadow-sm">
                    {weather.type === 'sun' ? (
                      <Thermometer weight="fill" className={`${weather.accentColor} text-lg`} />
                    ) : (
                      <Wind weight="fill" className={`${weather.accentColor} text-lg`} />
                    )}
                  </div>
                  <span className="font-medium text-lg">{weather.type === 'sun' ? 'AC Sangat Dingin & Nyaman' : 'Aman & Stabil di Genangan'}</span>
                </li>
              </ul>

              <div className="pt-4">
                <Link to="/armada">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className={`inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold shadow-lg transition-all ${weather.buttonClass}`}
                  >
                    Sewa {weather.carName}
                    <ArrowRight weight="bold" className="text-lg" />
                  </motion.button>
                </Link>
              </div>
            </div>

            {/* Image / Graphic Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotate: -1 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-square lg:aspect-auto lg:h-full min-h-[400px] rounded-2xl overflow-hidden shadow-2xl group"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-secondary-900/60 to-transparent z-10"></div>
              <motion.img 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                src={weather.carImg} 
                alt={weather.carName}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div className="absolute bottom-8 left-8 z-20">
                <div className="bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-xl font-bold text-ink shadow-xl inline-flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${weather.type === 'sun' ? 'bg-brand-gold' : 'bg-brand-teal'}`}></div>
                  {weather.carName}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
