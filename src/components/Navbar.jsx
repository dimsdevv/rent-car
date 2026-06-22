import { useState, useEffect } from 'react'
import { List, X } from '@phosphor-icons/react'

const navLinks = [
  { label: 'Beranda', href: '#' },
  { label: 'Armada', href: '#fleet' },
  { label: 'Keunggulan', href: '#why' },
  { label: 'Kontak', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-sticky transition-all duration-300 ease-[var(--ease-out)] ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-brand-100/50'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-16 lg:h-[72px] flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300 ${
            scrolled ? 'bg-brand-teal' : 'bg-white/15 border border-white/20'
          }`}>
            <span className="text-white font-extrabold text-xs">JC</span>
          </div>
          <span className={`font-extrabold text-lg tracking-tight transition-colors duration-300 ${
            scrolled ? 'text-brand-dark' : 'text-white'
          }`}>
            JelajahCar
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-sm font-medium transition-colors duration-200 ${
                scrolled
                  ? 'text-ink-muted hover:text-brand-teal'
                  : 'text-white/75 hover:text-white'
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#booking"
            className={`text-sm font-bold px-5 py-2.5 rounded-[var(--radius-button)] transition-all duration-200 ease-[var(--ease-out)] ${
              scrolled
                ? 'bg-brand-gold text-brand-dark hover:bg-brand-gold/90'
                : 'bg-white/10 text-white border border-white/20 hover:bg-white/15'
            }`}
          >
            Booking
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`md:hidden p-2 rounded-lg transition-colors ${
            scrolled ? 'text-ink' : 'text-white'
          }`}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" weight="bold" /> : <List className="w-6 h-6" weight="bold" />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-brand-100 shadow-lg">
          <div className="px-6 py-6 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-base font-medium text-ink hover:text-brand-teal transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#booking"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center px-5 py-3 bg-brand-gold text-brand-dark font-bold rounded-[var(--radius-button)] mt-4"
            >
              Booking Sekarang
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
