import Hero from '../components/Hero'
import TrustStrip from '../components/TrustStrip'
import BookingForm from '../components/BookingForm'
import WhyUs from '../components/WhyUs'
import FleetShowcase from '../components/FleetShowcase'
import Testimonials from '../components/Testimonials'
import FAQ from '../components/FAQ'
import CTABanner from '../components/CTABanner'

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <BookingForm />
      <WhyUs />
      <FleetShowcase />
      <Testimonials />
      <FAQ />
      <CTABanner />
    </>
  )
}
