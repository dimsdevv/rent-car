import Hero from '../components/Hero'
import TrustStrip from '../components/TrustStrip'
import BookingForm from '../components/BookingForm'
import WhyUs from '../components/WhyUs'
import HowItWorks from '../components/HowItWorks'
import FleetShowcase from '../components/FleetShowcase'
import CoverageMap from '../components/CoverageMap'
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
      <HowItWorks />
      <FleetShowcase />
      <CoverageMap />
      <Testimonials />
      <FAQ />
      <CTABanner />
    </>
  )
}
