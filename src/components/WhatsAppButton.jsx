import { useState, useEffect } from 'react'
import { WhatsappLogo } from '@phosphor-icons/react'

export default function WhatsAppButton() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <a
      href="https://wa.me/6281234567890?text=Halo%20JelajahCar%2C%20saya%20ingin%20bertanya%20tentang%20rental%20mobil."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat via WhatsApp"
      className={`fixed bottom-6 right-6 z-sticky flex items-center gap-2.5 px-4 py-3 bg-[#25D366] text-white font-bold text-sm rounded-full shadow-lg shadow-[#25D366]/25 transition-all duration-300 ease-[var(--ease-out)] hover:shadow-xl hover:shadow-[#25D366]/30 hover:scale-[1.03] ${
        show
          ? 'translate-y-0 opacity-100'
          : 'translate-y-4 opacity-0 pointer-events-none'
      }`}
    >
      <WhatsappLogo className="w-5 h-5" weight="fill" />
      <span className="hidden sm:inline">Chat WhatsApp</span>
    </a>
  )
}
