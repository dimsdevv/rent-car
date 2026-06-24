import Hero from '../components/Hero'
import TrustStrip from '../components/TrustStrip'
import PromoDeals from '../components/PromoDeals'
import BookingForm from '../components/BookingForm'
import WhyUs from '../components/WhyUs'
import HowItWorks from '../components/HowItWorks'
import FleetShowcase from '../components/FleetShowcase'
import CoverageMap from '../components/CoverageMap'
import StatsCounter from '../components/StatsCounter'
import Testimonials from '../components/Testimonials'
import FAQ from '../components/FAQ'
import CTABanner from '../components/CTABanner'

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <PromoDeals />
      <BookingForm />
      <WhyUs />
      <HowItWorks />
      <FleetShowcase />
      <CoverageMap />
      <StatsCounter />
      <Testimonials />
      <FAQ />
      <CTABanner />
    </>
  )
}
