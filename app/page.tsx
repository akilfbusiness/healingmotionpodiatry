import { AboutSection } from '@/components/about-section'
import { ConditionsGridSection } from '@/components/conditions-grid-section'
import { ContactSection } from '@/components/contact-section'
import { FaqSection } from '@/components/faq-section'
import { HeroSection } from '@/components/hero-section'
import { PractitionerSection } from '@/components/practitioner-section'
import { ServicesGridSection } from '@/components/services-grid-section'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { StructuredData } from '@/components/structured-data'
import { SuburbsServedSection } from '@/components/suburbs-served-section'
import { TestimonialsSection } from '@/components/testimonials-section'

export default function Page() {
  return (
    <>
      <StructuredData />
      <SiteHeader />
      <main>
        <HeroSection />
        <ServicesGridSection />
        <ConditionsGridSection />
        <SuburbsServedSection />
        <AboutSection />
        <PractitionerSection />
        <TestimonialsSection />
        <FaqSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  )
}
