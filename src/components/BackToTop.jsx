import { useState, useEffect } from 'react'
import { ArrowUp } from '@phosphor-icons/react'

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
    <button
      onClick={scrollToTop}
      aria-label="Kembali ke atas"
      className={`fixed bottom-6 left-6 z-sticky w-11 h-11 bg-brand-dark/90 backdrop-blur-sm border border-white/10 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ease-[var(--ease-out)] hover:bg-brand-dark hover:scale-[1.08] ${
        show
          ? 'translate-y-0 opacity-100'
          : 'translate-y-4 opacity-0 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-5 h-5" weight="bold" />
    </button>
  )
}
