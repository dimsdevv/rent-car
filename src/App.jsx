import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TrustStrip from './components/TrustStrip'
import BookingForm from './components/BookingForm'
import WhyUs from './components/WhyUs'
import FleetShowcase from './components/FleetShowcase'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import CTABanner from './components/CTABanner'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import BackToTop from './components/BackToTop'

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <BookingForm />
        <WhyUs />
        <FleetShowcase />
        <Testimonials />
        <FAQ />
        <CTABanner />
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  )
}

export default App
