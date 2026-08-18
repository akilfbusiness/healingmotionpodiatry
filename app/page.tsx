import { AboutSection } from '@/components/about-section'
import { AccessSection } from '@/components/access-section'
import { CategorySections } from '@/components/category-sections'
import { ContactSection } from '@/components/contact-section'
import { FaqSection } from '@/components/faq-section'
import { HeroSection } from '@/components/hero-section'
import { PractitionerSection } from '@/components/practitioner-section'
import { QuickLinksSection } from '@/components/quick-links-section'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { StructuredData } from '@/components/structured-data'

// Core 30 homepage: everything below the quick-links strip is derived at
// query time from category/condition/treatment documents (CategorySections)
// rather than manually curated — see homePageCategorySectionsQuery. No
// testimonials (AHPRA National Law s133 forbids advertising health services
// with testimonials/reviews); AccessSection replaces that slot with
// first-appointment and fees/funding info instead.
export default function Page() {
  return (
    <>
      <StructuredData />
      <SiteHeader />
      <main>
        <HeroSection />
        <QuickLinksSection />
        <CategorySections />
        <AboutSection />
        <PractitionerSection />
        <AccessSection />
        <FaqSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  )
}
