import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Compass, Buildings, UsersThree, Crown, MapTrifold, Star, Trophy, Sparkle } from '@phosphor-icons/react'

const getPersona = (category) => {
  const cat = (category || '').toLowerCase()
  if (cat.includes('suv')) return { title: 'The Explorer', desc: 'Penjelajah tangguh penakluk segala medan.', icon: Compass, color: 'text-brand-teal', bg: 'bg-brand-teal/20' }
  if (cat.includes('sedan')) return { title: 'City Cruiser', desc: 'Meluncur elegan membelah jalanan kota.', icon: Buildings, color: 'text-blue-400', bg: 'bg-blue-400/20' }
  if (cat.includes('mpv') || cat.includes('minivan')) return { title: 'Family Hero', desc: 'Membawa kebahagiaan untuk orang tersayang.', icon: UsersThree, color: 'text-amber-400', bg: 'bg-amber-400/20' }
  if (cat.includes('premium') || cat.includes('luxury')) return { title: 'The Executive', desc: 'Berkendara dengan gaya dan kenyamanan premium.', icon: Crown, color: 'text-brand-gold', bg: 'bg-brand-gold/20' }
  return { title: 'Road Tripper', desc: 'Pecinta kebebasan dan angin jalanan.', icon: MapTrifold, color: 'text-brand-teal', bg: 'bg-brand-teal/20' }
}

export default function TripRecapModal({ open, onClose, booking }) {
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

  if (!booking) return null

  const pickup = new Date(booking.pickup_date)
  const ret = new Date(booking.return_date)
  const days = Math.max(1, Math.ceil((ret - pickup) / (1000 * 60 * 60 * 24)))
  
  const persona = getPersona(booking.category_name)
  const PersonaIcon = persona.icon

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0" onClick={onClose}>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-0 bg-brand-dark/80 backdrop-blur-xl"
          />

          {/* Modal */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-sm sm:max-w-md bg-brand-dark overflow-hidden rounded-[2.5rem] shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Glows */}
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-brand-teal/30 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-brand-gold/20 rounded-full blur-[80px] pointer-events-none" />

            {/* Header */}
            <div className="absolute top-6 right-6 z-10">
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white hover:scale-[0.97] active:scale-95 transition-all duration-200"
              >
                <X className="w-5 h-5" weight="bold" />
              </button>
            </div>

            <div className="relative p-8 pt-12 flex flex-col items-center text-center">
              <motion.div variants={itemVariants} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-extrabold tracking-[0.2em] text-white uppercase mb-8">
                <Sparkle className="w-3.5 h-3.5 text-brand-gold" weight="fill" />
                Trip Recap
              </motion.div>

              <motion.div variants={itemVariants} className="relative w-32 h-32 mb-8 group">
                <div className={`absolute inset-0 rounded-3xl rotate-6 ${persona.bg} opacity-50 group-hover:rotate-12 transition-transform duration-500`} />
                <div className={`absolute inset-0 rounded-3xl -rotate-3 ${persona.bg} flex items-center justify-center border border-white/10 shadow-inner overflow-hidden backdrop-blur-md transition-transform duration-500 group-hover:rotate-0`}>
                  <PersonaIcon className={`w-16 h-16 ${persona.color} drop-shadow-lg`} weight="duotone" />
                </div>
              </motion.div>

              <motion.h3 variants={itemVariants} className="text-3xl font-extrabold text-white mb-2">
                {persona.title}
              </motion.h3>
              
              <motion.p variants={itemVariants} className="text-white/70 text-sm mb-10 max-w-[240px] leading-relaxed">
                {persona.desc}
              </motion.p>

              {/* Stats */}
              <motion.div variants={itemVariants} className="w-full grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2">
                    <Trophy className="w-5 h-5 text-brand-gold" weight="duotone" />
                  </div>
                  <span className="text-2xl font-bold text-white mb-0.5">{days} Hari</span>
                  <span className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">Mengaspal</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2">
                    <Star className="w-5 h-5 text-brand-teal" weight="duotone" />
                  </div>
                  <span className="text-2xl font-bold text-white mb-0.5">1 Trip</span>
                  <span className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">Diselesaikan</span>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="w-full">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-teal/20 to-brand-gold/10 border border-white/10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex-shrink-0 flex items-center justify-center">
                    <img src={booking.car_image || 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80'} alt="Car" className="w-full h-full object-cover rounded-xl opacity-80 mix-blend-luminosity" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-white font-bold truncate">{booking.car_name || 'Mobil Rental'}</p>
                    <p className="text-white/50 text-xs mt-0.5">Partner setia perjalananmu</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
