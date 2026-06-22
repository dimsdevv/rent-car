import { MapPin, Phone, EnvelopeSimple } from '@phosphor-icons/react'

const links = [
  { label: 'Beranda', href: '#' },
  { label: 'Armada', href: '#fleet' },
  { label: 'Tentang Kami', href: '#about' },
  { label: 'Kontak', href: '#contact' },
]

export default function Footer() {
  return (
    <footer className="bg-brand-900 text-brand-200/70 px-6 lg:px-8 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          {/* Brand column */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-lg bg-brand-teal flex items-center justify-center">
                <span className="text-white font-extrabold text-sm">JC</span>
              </div>
              <span className="text-white font-extrabold text-lg tracking-tight">JelajahCar</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs mb-6">
              Rental mobil terpercaya untuk perjalanan nyaman dan aman di seluruh Indonesia. Berdiri sejak 2018.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-brand-teal shrink-0" weight="fill" />
                <span>Jl. Sudirman No. 123, Jakarta Pusat</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-brand-teal shrink-0" weight="fill" />
                <span>0812-3456-7890</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <EnvelopeSimple className="w-4 h-4 text-brand-teal shrink-0" weight="fill" />
                <span>info@jelajahcar.id</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3 md:col-start-7">
            <h4 className="text-white font-bold text-sm mb-4">Navigasi</h4>
            <nav className="space-y-3">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-sm hover:text-brand-teal transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Layanan */}
          <div className="md:col-span-3">
            <h4 className="text-white font-bold text-sm mb-4">Layanan</h4>
            <nav className="space-y-3">
              <a href="#" className="block text-sm hover:text-brand-teal transition-colors duration-200">Rental Harian</a>
              <a href="#" className="block text-sm hover:text-brand-teal transition-colors duration-200">Rental Mingguan</a>
              <a href="#" className="block text-sm hover:text-brand-teal transition-colors duration-200">Rental Bulanan</a>
              <a href="#" className="block text-sm hover:text-brand-teal transition-colors duration-200">Antar-Jemput Bandara</a>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-brand-300/50">
            &copy; {new Date().getFullYear()} JelajahCar. Seluruh hak dilindungi.
          </p>
          <div className="flex items-center gap-6 text-xs text-brand-300/50">
            <a href="#" className="hover:text-brand-200 transition-colors duration-200">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-brand-200 transition-colors duration-200">Kebijakan Privasi</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
