export default function TrustStrip() {
  return (
    <section className="bg-brand-dark py-5 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-white/70">
          <div className="flex items-center gap-2">
            <span className="text-brand-gold font-bold text-lg">150+</span>
            <span>Unit armada</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/15" />
          <div className="flex items-center gap-2">
            <span className="text-brand-gold font-bold text-lg">25</span>
            <span>Kota tersedia</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/15" />
          <div className="flex items-center gap-2">
            <span className="text-brand-gold font-bold text-lg">4.8</span>
            <span>Rating pelanggan</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/15" />
          <div className="flex items-center gap-2">
            <span className="text-brand-gold font-bold text-lg">10.000+</span>
            <span>Pelanggan puas</span>
          </div>
        </div>
      </div>
    </section>
  )
}
