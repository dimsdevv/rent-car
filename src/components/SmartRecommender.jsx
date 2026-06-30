import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, MapPin, Sparkle, ArrowRight, Car, CheckCircle } from '@phosphor-icons/react'
import BookingModal from './BookingModal'
import { useScrollReveal } from '../hooks/useScrollReveal'

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

export default function SmartRecommender() {
  const [step, setStep] = useState(1)
  const [passengers, setPassengers] = useState(null)
  const [tripType, setTripType] = useState(null)
  const [recommendedCar, setRecommendedCar] = useState(null)
  const [bookingCar, setBookingCar] = useState(null)
  const sectionRef = useScrollReveal()

  const findRecommendation = (selectedTrip) => {
    let matches = [...FALLBACK_CARS]
    
    if (passengers === '1-4') {
        matches = matches.filter(c => c.seats <= 5)
        if (matches.length === 0) matches = [...FALLBACK_CARS]
    } else if (passengers === '5-7') {
        matches = matches.filter(c => c.seats >= 7)
    }
    
    if (selectedTrip === 'city') {
        matches = matches.sort((a,b) => a.price_per_day - b.price_per_day)
    } else if (selectedTrip === 'adventure') {
        const suv = matches.find(c => c.category_name.includes('SUV'))
        if (suv) matches = [suv]
    } else if (selectedTrip === 'business') {
        const premium = matches.find(c => c.category_name.includes('Premium'))
        if (premium) matches = [premium]
    }

    setRecommendedCar(matches[0] || FALLBACK_CARS[0])
    setStep(3)
  }

  const reset = () => {
    setStep(1)
    setPassengers(null)
    setTripType(null)
    setRecommendedCar(null)
  }

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
  }

  return (
    <>
      <section ref={sectionRef} className="py-16 px-6 lg:px-8 reveal">
        <div className="max-w-4xl mx-auto">
          <div className="bg-ink text-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
            
            {/* Left/Top Content: Context */}
            <div className="p-8 md:p-12 md:w-1/3 bg-ink flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-brand-teal text-xs font-bold uppercase tracking-wider mb-6">
                    <Sparkle weight="fill" className="w-4 h-4" />
                    Smart Match
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold mb-4 leading-tight">
                    Temukan Mobil Ideal Anda.
                  </h2>
                  <p className="text-white/60 text-sm leading-relaxed mb-8">
                    Tidak yakin mobil apa yang cocok? Jawab 2 pertanyaan singkat dan biarkan sistem kami mencarikan armada terbaik.
                  </p>
                </div>
                
                {/* Progress Indicators */}
                <div className="flex gap-2 relative z-10">
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i} 
                      className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                        step >= i ? 'bg-brand-teal' : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
            </div>

            {/* Right/Bottom Content: Wizard Steps */}
            <div className="p-8 md:p-12 md:w-2/3 bg-surface text-ink relative min-h-[350px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div 
                    key="step1"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="w-full max-w-sm"
                  >
                    <h3 className="text-xl font-bold mb-6 text-center">Berapa orang yang akan pergi?</h3>
                    <div className="space-y-4">
                      <button 
                        onClick={() => {
                          setPassengers('1-4')
                          setStep(2)
                        }}
                        className="w-full p-4 rounded-xl border border-brand-100 bg-white hover:border-brand-teal hover:shadow-[0_8px_30px_oklch(0.2_0.02_200/0.08)] transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-teal group-hover:scale-110 transition-transform">
                            <Users weight="duotone" className="w-5 h-5" />
                          </div>
                          <span className="font-bold text-ink">1 - 4 Orang</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-ink-muted group-hover:text-brand-teal group-hover:translate-x-1 transition-all" weight="bold" />
                      </button>
                      
                      <button 
                        onClick={() => {
                          setPassengers('5-7')
                          setStep(2)
                        }}
                        className="w-full p-4 rounded-xl border border-brand-100 bg-white hover:border-brand-teal hover:shadow-[0_8px_30px_oklch(0.2_0.02_200/0.08)] transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-teal group-hover:scale-110 transition-transform">
                            <Users weight="duotone" className="w-5 h-5" />
                          </div>
                          <span className="font-bold text-ink">5 - 7+ Orang</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-ink-muted group-hover:text-brand-teal group-hover:translate-x-1 transition-all" weight="bold" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    key="step2"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="w-full max-w-sm"
                  >
                    <h3 className="text-xl font-bold mb-6 text-center">Apa tujuan perjalanan Anda?</h3>
                    <div className="space-y-4">
                      {[
                        { id: 'city', label: 'Dalam Kota / Santai', icon: MapPin },
                        { id: 'adventure', label: 'Luar Kota / Petualangan', icon: Car },
                        { id: 'business', label: 'Bisnis / VIP', icon: CheckCircle },
                      ].map((item) => (
                         <button 
                          key={item.id}
                          onClick={() => {
                            setTripType(item.id)
                            findRecommendation(item.id)
                          }}
                          className="w-full p-4 rounded-xl border border-brand-100 bg-white hover:border-brand-teal hover:shadow-[0_8px_30px_oklch(0.2_0.02_200/0.08)] transition-all flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-teal group-hover:scale-110 transition-transform">
                              <item.icon weight="duotone" className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-ink">{item.label}</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-ink-muted group-hover:text-brand-teal group-hover:translate-x-1 transition-all" weight="bold" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 3 && recommendedCar && (
                  <motion.div 
                    key="step3"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="w-full"
                  >
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center gap-1.5 text-brand-teal text-sm font-bold mb-2">
                        <CheckCircle weight="fill" className="w-4 h-4" /> Perfect Match
                      </div>
                      <h3 className="text-2xl font-extrabold text-ink">{recommendedCar.name}</h3>
                    </div>
                    
                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-6 bg-brand-100">
                      <img 
                        src={recommendedCar.image_url} 
                        alt={recommendedCar.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 flex gap-1">
                        <span className="text-[10px] font-bold text-white bg-ink/80 backdrop-blur-sm px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                          {recommendedCar.category_name}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] text-ink-subtle uppercase tracking-wide block mb-0.5">Tarif Spesial</span>
                        <div className="text-xl font-extrabold text-ink">{recommendedCar.price_formatted}<span className="text-sm font-normal text-ink-subtle">/hr</span></div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={reset}
                          className="px-4 py-2.5 text-sm font-bold text-ink-muted hover:text-ink transition-colors"
                        >
                          Ulangi
                        </button>
                        <button 
                          onClick={() => setBookingCar(recommendedCar)}
                          className="px-6 py-2.5 bg-brand-teal text-white text-sm font-bold rounded-lg hover:bg-brand-teal/90 transition-all hover:shadow-[0_8px_20px_oklch(0.6_0.15_200/0.2)]"
                        >
                          Booking Sekarang
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
          </div>
        </div>
      </section>

      {/* Booking Modal Integration */}
      <BookingModal
        open={!!bookingCar}
        onClose={() => setBookingCar(null)}
        car={bookingCar}
      />
    </>
  )
}
