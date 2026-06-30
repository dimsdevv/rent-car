import { useState, useEffect } from 'react'
import { ArrowUp } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

export default function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 1200)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          onClick={scrollToTop}
          aria-label="Kembali ke atas"
          className="fixed bottom-6 left-6 z-sticky w-11 h-11 bg-brand-dark/90 backdrop-blur-sm border border-white/10 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-brand-dark hover:scale-[1.08] transition-colors"
        >
          <ArrowUp className="w-5 h-5" weight="bold" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
