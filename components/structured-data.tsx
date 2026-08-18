import {
  getFaqs,
  getFullAddress,
  getHomePage,
  getServices,
  getSiteSettings,
  getTreatments,
} from '@/lib/sanity/data'

// Server-rendered JSON-LD. Kept as a dedicated component so it's easy to
// extend (e.g. BreadcrumbList) as more pages are added. Data is sourced
// live from Sanity so structured data always matches the visible content.
export async function StructuredData() {
  const [settings, homePage, services, treatments, faqs] = await Promise.all([
    getSiteSettings(),
    getHomePage(),
    getServices(),
    getTreatments(),
    getFaqs(),
  ])

  const practitioner = homePage?.practitionerSection?.practitioner

  const dayMap: Record<string, string> = {
    Monday: 'Monday',
    Tuesday: 'Tuesday',
    Wednesday: 'Wednesday',
    Thursday: 'Thursday',
    Friday: 'Friday',
    Saturday: 'Saturday',
    Sunday: 'Sunday',
  }

  const medicalBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    '@id': `${settings.siteUrl}/#business`,
    name: settings.name,
    image: `${settings.siteUrl}/images/clinic-interior.png`,
    url: settings.siteUrl,
    telephone: settings.phoneIntl,
    email: settings.email,
    priceRange: '$$',
    medicalSpecialty: 'Podiatric',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address.street,
      addressLocality: settings.address.suburb,
      addressRegion: settings.address.state,
      postalCode: settings.address.postcode,
      addressCountry: settings.address.country,
    },
    openingHoursSpecification: settings.hours
      .filter((h) => !h.closed)
      .map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: dayMap[h.day],
        opens: h.open,
        closes: h.close,
      })),
    ...(practitioner && {
      employee: {
        '@type': 'Physician',
        name: practitioner.name,
        jobTitle: practitioner.title,
        medicalSpecialty: 'Podiatric',
        worksFor: { '@id': `${settings.siteUrl}/#business` },
        ...(practitioner.ahpraNumber && {
          identifier: {
            '@type': 'PropertyValue',
            propertyID: 'AHPRA',
            value: practitioner.ahpraNumber,
          },
        }),
      },
    }),
    makesOffer: [
      ...treatments.map((treatment) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'MedicalTherapy',
          name: treatment.title,
          description: treatment.answerCapsule,
        },
      })),
      // Legacy `service` documents kept during Core 30 migration.
      ...services.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'MedicalProcedure',
          name: service.name,
          description: service.summary,
        },
      })),
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}

// Exported for reuse/debugging if needed elsewhere.
export async function getBusinessAddressText() {
  const settings = await getSiteSettings()
  return getFullAddress(settings.address)
}
