import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { List, X, SignIn, SignOut, Clock } from '@phosphor-icons/react'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { label: 'Beranda', to: '/' },
  { label: 'Armada', to: '/armada' },
  { label: 'Keunggulan', to: '/keunggulan' },
  { label: 'Kontak', to: '/kontak' },
]

export default function Navbar({ onOpenAuth, onOpenHistory }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { pathname } = useLocation()
  const { user, loading, logout } = useAuth()
  const dropdownRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [dropdownOpen])

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  const handleLogout = async () => {
    setDropdownOpen(false)
    await logout()
  }

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
        <Link to="/" className="flex items-center gap-2.5">
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
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.to
            return (
              <Link
                key={link.label}
                to={link.to}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? scrolled ? 'text-brand-teal font-bold' : 'text-white font-bold'
                    : scrolled
                    ? 'text-ink-muted hover:text-brand-teal'
                    : 'text-white/75 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            )
          })}

          {/* Auth area */}
          {!loading && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 ${
                  scrolled
                    ? 'hover:bg-brand-50'
                    : 'hover:bg-white/10'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-brand-teal flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
                <span className={`text-sm font-semibold ${scrolled ? 'text-ink' : 'text-white'}`}>
                  {user.name.split(' ')[0]}
                </span>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-surface-raised rounded-[var(--radius-card)] shadow-[var(--shadow-card-hover)] border border-brand-100 py-2 animate-[dropdownIn_150ms_var(--ease-out)] origin-top-right">
                  <div className="px-4 py-2 border-b border-brand-100">
                    <p className="font-bold text-sm text-ink truncate">{user.name}</p>
                    <p className="text-xs text-ink-subtle truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => { setDropdownOpen(false); onOpenHistory?.() }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-brand-50 transition-colors"
                  >
                    <Clock className="w-4 h-4 text-ink-subtle" weight="bold" />
                    Riwayat Booking
                  </button>
                  <div className="border-t border-brand-100 my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <SignOut className="w-4 h-4" weight="bold" />
                    Keluar
                  </button>
                </div>
              )}
            </div>
          ) : !loading ? (
            <button
              onClick={onOpenAuth}
              className={`flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-[var(--radius-button)] transition-all duration-200 ease-[var(--ease-out)] ${
                scrolled
                  ? 'border border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white'
                  : 'bg-white/10 text-white border border-white/20 hover:bg-white/15'
              }`}
            >
              <SignIn className="w-4 h-4" weight="bold" />
              Masuk
            </button>
          ) : null}

          <Link
            to="/#booking"
            className={`text-sm font-bold px-5 py-2.5 rounded-[var(--radius-button)] transition-all duration-200 ease-[var(--ease-out)] ${
              scrolled
                ? 'bg-brand-gold text-brand-dark hover:bg-brand-gold/90'
                : 'bg-white/10 text-white border border-white/20 hover:bg-white/15'
            }`}
          >
            Booking
          </Link>
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
            {navLinks.map((link) => {
              const isActive = pathname === link.to
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block text-base font-medium transition-colors ${
                    isActive ? 'text-brand-teal font-bold' : 'text-ink hover:text-brand-teal'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}

            {/* Mobile auth */}
            {!loading && user ? (
              <>
                <div className="flex items-center gap-3 py-3 border-t border-brand-100">
                  <div className="w-10 h-10 rounded-full bg-brand-teal flex items-center justify-center text-white text-sm font-bold">
                    {initials}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-ink">{user.name}</p>
                    <p className="text-xs text-ink-subtle">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setMobileOpen(false); onOpenHistory?.() }}
                  className="flex items-center gap-2 text-base font-medium text-ink hover:text-brand-teal transition-colors w-full"
                >
                  <Clock className="w-5 h-5" weight="bold" />
                  Riwayat Booking
                </button>
                <button
                  onClick={() => { setMobileOpen(false); handleLogout() }}
                  className="flex items-center gap-2 text-base font-medium text-red-600 hover:text-red-700 transition-colors w-full"
                >
                  <SignOut className="w-5 h-5" weight="bold" />
                  Keluar
                </button>
              </>
            ) : !loading ? (
              <button
                onClick={() => { setMobileOpen(false); onOpenAuth?.() }}
                className="flex items-center gap-2 text-base font-medium text-brand-teal hover:text-brand-teal/80 transition-colors w-full"
              >
                <SignIn className="w-5 h-5" weight="bold" />
                Masuk
              </button>
            ) : null}

            <Link
              to="/#booking"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center px-5 py-3 bg-brand-gold text-brand-dark font-bold rounded-[var(--radius-button)] mt-4"
            >
              Booking Sekarang
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
