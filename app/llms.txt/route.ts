import {
  getBlogPosts,
  getConditions,
  getFaqs,
  getFullAddress,
  getHomePage,
  getServiceAreas,
  getServices,
  getSiteSettings,
  getTreatments,
} from '@/lib/sanity/data'

// llms.txt is an emerging, unofficial convention for giving AI crawlers a
// clean plain-text summary of the site. It supplements (never replaces)
// proper JSON-LD structured data and semantic HTML.
export async function GET() {
  const [settings, homePage, conditions, treatments, services, faqs, areas, posts] = await Promise.all([
    getSiteSettings(),
    getHomePage(),
    getConditions(),
    getTreatments(),
    getServices(),
    getFaqs(),
    getServiceAreas(),
    getBlogPosts(),
  ])
  const fullAddress = getFullAddress(settings.address)
  const practitioner = homePage?.practitionerSection?.practitioner

  const lines = [
    `# ${settings.name}`,
    '',
    `> Podiatry clinic in ${settings.address.suburb}, ${settings.address.state}, ${settings.address.countryName}.`,
    '',
    '## Business details',
    `- Name: ${settings.name}`,
    `- Address: ${fullAddress}`,
    `- Phone: ${settings.phoneDisplay}`,
    `- Email: ${settings.email}`,
    `- Hours: ${settings.hoursDisplay}`,
    ...(practitioner ? [`- Practitioner: ${practitioner.name}, ${practitioner.title ?? ''}`.trim()] : []),
    '',
    '## Conditions we treat',
    ...conditions.map(
      (c) => `- [${c.title}](${settings.siteUrl}/conditions/${c.slug}): ${c.answerCapsule ?? ''}`,
    ),
    '',
    '## Treatments we offer',
    ...treatments.map(
      (t) => `- [${t.title}](${settings.siteUrl}/treatments/${t.slug}): ${t.answerCapsule ?? ''}`,
    ),
    '',
    '## Services (legacy)',
    ...services.map((s) => `- [${s.name}](${settings.siteUrl}/services/${s.slug}): ${s.summary ?? ''}`),
    '',
    '## Areas served',
    ...areas.map((a) => `- [${a.suburb}](${settings.siteUrl}/podiatrist-${a.slug}): ${a.summary ?? ''}`),
    '',
    '## Frequently asked questions',
    ...faqs.map((f) => `- Q: ${f.question}\n  A: ${f.answer}`),
    '',
    '## Recent blog posts',
    ...posts.slice(0, 10).map((p) => `- [${p.title}](${settings.siteUrl}/blog/${p.slug}): ${p.excerpt ?? ''}`),
    '',
    '## Pages',
    `- [Home](${settings.siteUrl}/): Overview of the clinic, conditions treated, treatments offered, and booking options.`,
    `- [Conditions](${settings.siteUrl}/conditions): Full list of conditions treated, grouped by category.`,
    `- [Treatments](${settings.siteUrl}/treatments): Full list of treatments offered, grouped by category.`,
    `- [Blog](${settings.siteUrl}/blog): Foot health articles and treatment guides.`,
    `- [Areas we serve](${settings.siteUrl}/areas): Suburbs and regions the clinic serves.`,
    `- [Contact](${settings.siteUrl}/contact): Address, opening hours, phone number, and contact form.`,
  ]

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
