import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, MapPin } from '@phosphor-icons/react'

const activities = [
  { name: 'Dimas', location: 'Jakarta', car: 'Alphard', time: 'baru saja' },
  { name: 'Budi', location: 'Surabaya', car: 'Innova Zenix', time: '2 menit lalu' },
  { name: 'Siti', location: 'Bandung', car: 'Fortuner', time: 'baru saja' },
  { name: 'Andi', location: 'Bali', car: 'Avanza', time: '5 menit lalu' },
  { name: 'Rina', location: 'Yogyakarta', car: 'Pajero', time: 'baru saja' },
  { name: 'Kevin', location: 'Semarang', car: 'Camry', time: '1 menit lalu' },
  { name: 'Sarah', location: 'Medan', car: 'Hiace', time: 'baru saja' }
]

export default function LiveActivityToast() {
  const [currentActivity, setCurrentActivity] = useState(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const triggerRandomActivity = () => {
      // Menunggu 8 sampai 15 detik sebelum menampilkan notifikasi
      const randomDelay = Math.floor(Math.random() * (15000 - 8000 + 1) + 8000)
      
      setTimeout(() => {
        const randomItem = activities[Math.floor(Math.random() * activities.length)]
        setCurrentActivity(randomItem)
        setIsVisible(true)

        // Menampilkan notifikasi selama 5 detik
        setTimeout(() => {
          setIsVisible(false)
          triggerRandomActivity() // Loop
        }, 5000)
      }, randomDelay)
    }

    // Pemicu pertama setelah 5 detik web dibuka
    const initialTimer = setTimeout(() => {
      triggerRandomActivity()
    }, 5000)

    return () => clearTimeout(initialTimer)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && currentActivity && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9, rotateX: 15 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 30,
            mass: 0.8,
          }}
          // fixed z-50 bottom-6 left-6, menggunakan pointer-events-none agar tidak menghalangi klik
          // pada elemen di belakangnya, kecuali jika toast ini sendiri mau di-klik
          className="fixed bottom-6 left-6 z-50 max-w-sm pointer-events-none hidden sm:block"
        >
          <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl p-4 flex items-start gap-4">
            <div className="bg-brand-teal/10 p-2 rounded-full flex-shrink-0 mt-0.5">
              <CheckCircle weight="fill" className="text-brand-teal text-xl" />
            </div>
            <div>
              <p className="text-sm text-ink font-medium leading-relaxed">
                <span className="font-bold">{currentActivity.name}</span> baru saja memesan <span className="text-brand-teal font-bold">{currentActivity.car}</span>
              </p>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-ink-subtle font-medium">
                <MapPin weight="bold" />
                <span>{currentActivity.location}</span>
                <span className="w-1 h-1 rounded-full bg-brand-200 mx-1"></span>
                <span>{currentActivity.time}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
