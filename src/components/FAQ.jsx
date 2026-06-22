import { useState } from 'react'
import { CaretDown } from '@phosphor-icons/react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const faqs = [
  {
    q: 'Bagaimana cara booking mobil di JelajahCar?',
    a: 'Isi form booking di halaman ini dengan data lengkap, lalu klik "Cari & Booking". Tim kami akan menghubungi Anda via WhatsApp dalam 1x24 jam untuk konfirmasi detail dan pembayaran.',
  },
  {
    q: 'Apakah harga sudah termasuk asuransi?',
    a: 'Ya, semua harga yang tertera sudah termasuk asuransi dasar (all-risk), pajak, dan biaya admin. Tidak ada biaya tersembunyi. Asuransi tambahan tersedia sebagai opsi.',
  },
  {
    q: 'Bisakah antar-jemput mobil ke lokasi saya?',
    a: 'Bisa. Layanan antar-jemput tersedia gratis untuk area dalam kota (radius 15 km). Untuk luar area, dikenakan biaya tambahan yang akan diinformasikan saat konfirmasi.',
  },
  {
    q: 'Apa yang terjadi jika mobil mogok di jalan?',
    a: 'Hubungi tim support 24/7 kami. Kami akan mengirim mekanik atau mobil pengganti dalam waktu 1-2 jam tergantung lokasi. Semua biaya ditanggung JelajahCar.',
  },
  {
    q: 'Berapa lama proses konfirmasi booking?',
    a: 'Konfirmasi awal otomatis via WhatsApp dalam 5 menit setelah booking. Konfirmasi final (termasuk detail mobil dan supir) maksimal 1x24 jam sebelum hari pemakaian.',
  },
  {
    q: 'Apakah bisa booking tanpa supir (lepas kunci)?',
    a: 'Bisa, dengan syarat menyerahkan fotokopi KTP dan SIM A yang masih berlaku. Deposit keamanan Rp 1.000.000 akan dikembalikan saat mobil dikembalikan dalam kondisi baik.',
  },
]

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-brand-100 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 lg:py-6 text-left gap-4 group"
        aria-expanded={isOpen}
      >
        <span className="text-base lg:text-lg font-bold text-ink group-hover:text-brand-teal transition-colors duration-200">
          {item.q}
        </span>
        <CaretDown
          className={`w-5 h-5 text-ink-subtle shrink-0 transition-transform duration-300 ease-[var(--ease-out)] ${
            isOpen ? 'rotate-180' : ''
          }`}
          weight="bold"
        />
      </button>
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[var(--ease-out)] ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-5 lg:pb-6 text-ink-muted leading-relaxed max-w-[65ch]">
            {item.a}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)
  const sectionRef = useScrollReveal()

  return (
    <section id="faq" className="py-24 lg:py-32 px-6 lg:px-8 bg-brand-50">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div ref={sectionRef} className="reveal text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-ink mb-4">
            Pertanyaan yang sering ditanyakan
          </h2>
          <p className="text-lg text-ink-muted leading-relaxed">
            Belum menemukan jawaban? Hubungi kami via WhatsApp di bawah.
          </p>
        </div>

        {/* FAQ list */}
        <div className="bg-surface-raised rounded-[var(--radius-card)] border border-brand-100 px-6 lg:px-8 divide-y-0">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              item={faq}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
