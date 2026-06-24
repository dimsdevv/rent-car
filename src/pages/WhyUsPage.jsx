import { Wrench, CreditCard, Headset, Lightning, Car, CalendarBlank, CheckCircle, ArrowRight } from '@phosphor-icons/react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import Testimonials from '../components/Testimonials'

const STATS = [
  { value: '150+', label: 'Unit Armada' },
  { value: '25', label: 'Kota Tersedia' },
  { value: '4.8', label: 'Rating Pelanggan' },
  { value: '10.000+', label: 'Pelanggan Puas' },
]

const FEATURES = [
  {
    icon: Wrench,
    title: 'Armada Terawat',
    description: 'Setiap kendaraan melewati inspeksi 47 titik sebelum diserahkan ke pelanggan. Servis rutin terjadwal setiap 5.000 km, ban baru, AC dingin, interior bersih tanpa noda. Kami tidak mentolerir kompromi pada kondisi kendaraan.',
    details: ['Inspeksi 47 titik', 'Servis rutin terjadwal', 'Ban & rem selalu prima', 'AC dingin & interior bersih'],
    accent: 'dark',
  },
  {
    icon: CreditCard,
    title: 'Harga Transparan',
    description: 'Tidak ada biaya tersembunyi. Harga yang tertera di website sudah termasuk asuransi dasar all-risk dan pajak. Opsi asuransi tambahan akan diinformasikan jelas sebelum Anda memutuskan.',
    details: ['Asuransi dasar termasuk', 'Pajak sudah tercantum', 'Tanpa biaya admin tambahan', 'Rincian jelas di awal'],
    accent: 'light',
  },
  {
    icon: Headset,
    title: 'Support 24/7',
    description: 'Tim bantuan siap membantu kapanpun. Mogok di jalan jam 2 pagi, butuh pergantian unit di hari libur, atau sekadar bertanya rute terbaik -- kami selalu ada untuk Anda.',
    details: ['Response time < 5 menit', 'Mekanik standby 24 jam', 'Mobil pengganti tersedia', 'Via WhatsApp & telepon'],
    accent: 'light',
  },
  {
    icon: Lightning,
    title: 'Proses Cepat',
    description: 'Booking online dalam 2 menit lewat form di website. Konfirmasi otomatis via WhatsApp langsung masuk. Saat hari pemakaian, ambil mobil tanpa antri -- semua sudah siap.',
    details: ['Booking 2 menit', 'Konfirmasi otomatis', 'Tanpa antri', 'Antar-jemput tersedia'],
    accent: 'gold',
  },
]

const STEPS = [
  {
    icon: Car,
    title: 'Pilih Mobil',
    description: 'Jelajahi armada kami dan pilih kendaraan yang sesuai kebutuhan perjalanan Anda.',
  },
  {
    icon: CalendarBlank,
    title: 'Booking Online',
    description: 'Isi form booking dengan tanggal dan lokasi. Konfirmasi masuk via WhatsApp.',
  },
  {
    icon: CheckCircle,
    title: 'Jalan Nyaman',
    description: 'Mobil diantar ke lokasi Anda. Tinggal jalan, semua urusan kami yang handle.',
  },
]

export default function WhyUsPage() {
  const statsRef = useScrollReveal()
  const featuresRef = useScrollReveal()
  const processRef = useScrollReveal()

  return (
    <>
      {/* Compact header */}
      <section className="bg-brand-dark pt-28 pb-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl lg:text-5xl font-extrabold text-white mb-3">
            Kenapa JelajahCar?
          </h1>
          <p className="text-brand-200/80 text-lg max-w-xl leading-relaxed">
            Kami bukan sekadar rental mobil. Kami mitra perjalanan yang memastikan setiap kilometer Anda bernilai.
          </p>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-white border-b border-brand-100 px-6 lg:px-8 py-12">
        <div ref={statsRef} className="reveal max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl lg:text-4xl font-extrabold text-brand-teal mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-ink-muted font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expanded features */}
      <section className="py-24 lg:py-32 px-6 lg:px-8">
        <div ref={featuresRef} className="reveal max-w-7xl mx-auto">
          <div className="space-y-6 lg:space-y-8">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon
              const isEven = i % 2 === 1
              return (
                <div
                  key={feature.title}
                  className={`rounded-[var(--radius-card)] overflow-hidden ${
                    feature.accent === 'dark'
                      ? 'bg-brand-dark text-white'
                      : feature.accent === 'gold'
                      ? 'bg-brand-teal/[0.04] border border-brand-teal/15'
                      : 'bg-surface-raised border border-brand-100'
                  }`}
                >
                  <div className={`flex flex-col ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
                    {/* Content side */}
                    <div className="flex-1 p-8 lg:p-12">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                        feature.accent === 'dark'
                          ? 'bg-brand-teal/20'
                          : feature.accent === 'gold'
                          ? 'bg-brand-gold/15'
                          : 'bg-brand-teal/8'
                      }`}>
                        <Icon
                          className={`w-7 h-7 ${
                            feature.accent === 'dark' ? 'text-brand-teal' : 'text-brand-teal'
                          }`}
                          weight="fill"
                        />
                      </div>
                      <h3 className={`text-2xl lg:text-3xl font-extrabold mb-4 ${
                        feature.accent === 'dark' ? 'text-white' : 'text-ink'
                      }`}>
                        {feature.title}
                      </h3>
                      <p className={`leading-relaxed mb-6 max-w-[56ch] ${
                        feature.accent === 'dark' ? 'text-brand-200/80' : 'text-ink-muted'
                      }`}>
                        {feature.description}
                      </p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {feature.details.map((detail) => (
                          <li key={detail} className={`flex items-center gap-2 text-sm ${
                            feature.accent === 'dark' ? 'text-brand-200/70' : 'text-ink-muted'
                          }`}>
                            <CheckCircle className="w-4 h-4 text-brand-teal shrink-0" weight="fill" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Visual accent side */}
                    <div className="lg:w-64 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className="w-48 h-48 rounded-full opacity-10"
                          style={{
                            background: feature.accent === 'dark'
                              ? 'radial-gradient(circle, #2A9D8F 0%, transparent 70%)'
                              : feature.accent === 'gold'
                              ? 'radial-gradient(circle, #E9C46A 0%, transparent 70%)'
                              : 'radial-gradient(circle, #2A9D8F 0%, transparent 70%)',
                          }}
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon
                          className={`w-24 h-24 ${
                            feature.accent === 'dark' ? 'text-white/[0.04]' : 'text-brand-teal/[0.06]'
                          }`}
                          weight="duotone"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Process section */}
      <section className="bg-brand-dark py-24 lg:py-32 px-6 lg:px-8">
        <div ref={processRef} className="reveal max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">
              3 Langkah Mudah
            </h2>
            <p className="text-brand-200/80 text-lg max-w-md mx-auto leading-relaxed">
              Dari pilih mobil sampai jalan nyaman, semua proses dirancang simpel.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-4 relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden lg:block absolute top-16 left-[16.67%] right-[16.67%] h-px bg-white/10" />

            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={step.title} className="text-center relative">
                  {/* Number circle */}
                  <div className="w-32 h-32 mx-auto mb-8 relative">
                    <div className="absolute inset-0 rounded-full bg-white/[0.04] border border-white/[0.08]" />
                    <div className="absolute inset-4 rounded-full bg-brand-teal/15 flex items-center justify-center">
                      <Icon className="w-10 h-10 text-brand-teal" weight="duotone" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-brand-gold flex items-center justify-center text-brand-dark text-sm font-extrabold">
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-extrabold text-white mb-2">{step.title}</h3>
                  <p className="text-brand-200/70 leading-relaxed max-w-[32ch] mx-auto">
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />
    </>
  )
}
