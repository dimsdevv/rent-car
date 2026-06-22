import { Wrench, CreditCard, Headset, Lightning } from '@phosphor-icons/react'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function WhyUs() {
  const sectionRef = useScrollReveal()

  return (
    <section id="why" className="py-24 lg:py-32 px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section header */}
      <div ref={sectionRef} className="reveal max-w-xl mb-16 lg:mb-20">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-ink mb-4">
          Kenapa memilih JelajahCar?
        </h2>
        <p className="text-lg text-ink-muted leading-relaxed">
          Kami bukan sekadar rental mobil. Kami mitra perjalanan yang memastikan setiap kilometer Anda bernilai.
        </p>
      </div>

      {/* Asymmetric grid: 7/5 + 5/7 alternating */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Feature 1: wide, dark */}
        <div className="lg:col-span-7 p-8 lg:p-10 bg-brand-dark rounded-[var(--radius-card)] text-white relative overflow-hidden">
          <div
            className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #2A9D8F 0%, transparent 70%)' }}
          />
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-brand-teal/20 flex items-center justify-center mb-6">
              <Wrench className="w-6 h-6 text-brand-teal" weight="fill" />
            </div>
            <h3 className="text-xl lg:text-2xl font-extrabold mb-3">Armada Terawat</h3>
            <p className="text-brand-200/80 leading-relaxed max-w-[48ch]">
              Setiap kendaraan melewati inspeksi 47 titik sebelum diserahkan. Servis rutin terjadwal, ban baru, AC dingin. Tanpa kompromi.
            </p>
          </div>
        </div>

        {/* Feature 2: narrow, light */}
        <div className="lg:col-span-5 p-8 lg:p-10 bg-surface-raised border border-brand-100 rounded-[var(--radius-card)]">
          <div className="w-12 h-12 rounded-xl bg-brand-teal/8 flex items-center justify-center mb-6">
            <CreditCard className="w-6 h-6 text-brand-teal" weight="fill" />
          </div>
          <h3 className="text-xl font-extrabold text-ink mb-3">Harga Transparan</h3>
          <p className="text-ink-muted leading-relaxed">
            Tidak ada biaya tersembunyi. Harga yang tertera sudah termasuk asuransi dasar dan pajak.
          </p>
        </div>

        {/* Feature 3: narrow, light */}
        <div className="lg:col-span-5 p-8 lg:p-10 bg-surface-raised border border-brand-100 rounded-[var(--radius-card)]">
          <div className="w-12 h-12 rounded-xl bg-brand-teal/8 flex items-center justify-center mb-6">
            <Headset className="w-6 h-6 text-brand-teal" weight="fill" />
          </div>
          <h3 className="text-xl font-extrabold text-ink mb-3">Support 24/7</h3>
          <p className="text-ink-muted leading-relaxed">
            Tim bantuan siap membantu kapanpun. Mogok di jalan, butuh pergantian unit, atau sekadar bertanya arah.
          </p>
        </div>

        {/* Feature 4: wide, subtle accent */}
        <div className="lg:col-span-7 p-8 lg:p-10 bg-brand-teal/[0.04] border border-brand-teal/15 rounded-[var(--radius-card)] relative overflow-hidden">
          <div
            className="absolute -left-8 -top-8 w-32 h-32 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #E9C46A 0%, transparent 70%)' }}
          />
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-brand-gold/15 flex items-center justify-center mb-6">
              <Lightning className="w-6 h-6 text-brand-dark" weight="fill" />
            </div>
            <h3 className="text-xl lg:text-2xl font-extrabold text-ink mb-3">Proses Cepat</h3>
            <p className="text-ink-muted leading-relaxed max-w-[48ch]">
              Booking online dalam 2 menit. Konfirmasi otomatis via WhatsApp. Ambil mobil tanpa antri.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
