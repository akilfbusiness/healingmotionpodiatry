import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, MapPin } from 'lucide-react'
import { AnswerCardGrid } from '@/components/answer-card-grid'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { PageBuilder } from '@/components/page-builder'
import { PageFaqList } from '@/components/page-faq-list'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import {
  getAllSlugs,
  getCategoryBySlug,
  getPageBySlug,
  getServiceAreaBySlug,
  getSiteSettings,
} from '@/lib/sanity/data'
import { urlForImage } from '@/lib/sanity/image'
import { buildMetadata } from '@/lib/sanity/metadata'

// Catch-all for three document types that all live at the site root:
// `category` (top of the Core 30 hierarchy, e.g. /foot-heel-pain), the
// flexible `page` document (About, Privacy Policy, Careers, etc), and
// suburb ("Service Area") pages at /podiatrist-{suburb}. Next.js dynamic
// route folders must be entirely bracketed (`[slug]`) — a mixed literal +
// bracket folder name like `podiatrist-[suburb]` is NOT a valid dynamic
// segment, so the "podiatrist-" prefix is matched here in code instead of
// as its own route folder. Category and page slugs are curated in the
// Studio and expected not to collide, and neither may start with
// "podiatrist-". Next.js resolves the static /conditions, /treatments,
// /services, /blog, /areas, and /contact segments before ever reaching
// this dynamic route.
const SUBURB_PREFIX = 'podiatrist-'

export async function generateStaticParams() {
  const { categories, pages, areas } = await getAllSlugs()
  return [
    ...categories.map((slug) => ({ slug })),
    ...pages.map((slug) => ({ slug })),
    ...areas.map((slug) => ({ slug: `${SUBURB_PREFIX}${slug}` })),
  ]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const settings = await getSiteSettings()

  if (slug.startsWith(SUBURB_PREFIX)) {
    const suburbSlug = slug.slice(SUBURB_PREFIX.length)
    const area = await getServiceAreaBySlug(suburbSlug)
    if (!area) return {}

    return buildMetadata({
      seo: area.seo,
      settings,
      fallbackTitle: `Podiatrist in ${area.suburb} | ${settings.name}`,
      fallbackDescription: area.summary || `Podiatry care for patients in ${area.suburb}.`,
      path: `/${slug}`,
    })
  }

  const category = await getCategoryBySlug(slug)
  if (category) {
    return buildMetadata({
      seo: category.seo,
      settings,
      fallbackTitle: `${category.title} | ${settings.name}`,
      fallbackDescription: category.intro,
      path: `/${slug}`,
    })
  }

  const page = await getPageBySlug(slug)
  if (!page) return {}

  return buildMetadata({
    seo: page.seo,
    settings,
    fallbackTitle: `${page.title} | ${settings.name}`,
    path: `/${slug}`,
  })
}

export default async function CategoryOrGenericPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  if (slug.startsWith(SUBURB_PREFIX)) {
    const suburbSlug = slug.slice(SUBURB_PREFIX.length)
    const area = await getServiceAreaBySlug(suburbSlug)
    if (!area) notFound()
    return <SuburbPageContent area={area} slug={suburbSlug} />
  }

  const category = await getCategoryBySlug(slug)
  if (category) return <CategoryPageContent category={category} />

  const page = await getPageBySlug(slug)
  if (!page) notFound()

  const heroImageUrl = urlForImage(page.heroImage)?.width(1400).height(700).fit('crop').url()

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
        <Breadcrumbs items={[{ label: page.seo?.h1 || page.title }]} />

        <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-foreground text-balance sm:text-5xl">
          {page.seo?.h1 || page.title}
        </h1>

        {heroImageUrl && (
          <div className="relative mt-8 aspect-[2/1] w-full overflow-hidden rounded-2xl">
            <Image
              src={heroImageUrl}
              alt={page.title}
              fill
              priority
              sizes="(min-width: 1024px) 850px, 100vw"
              className="object-cover"
            />
          </div>
        )}

        {page.answerCapsule && (
          <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <p className="font-heading text-sm font-semibold uppercase tracking-wide text-primary">
              In short
            </p>
            <p className="mt-2 text-base leading-relaxed text-foreground text-pretty">
              {page.answerCapsule}
            </p>
          </div>
        )}

        <div className="mt-8">
          <PageBuilder blocks={page.body} />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

async function CategoryPageContent({
  category,
}: {
  category: NonNullable<Awaited<ReturnType<typeof getCategoryBySlug>>>
}) {
  const heroImageUrl = urlForImage(category.heroImage)?.width(1400).height(700).fit('crop').url()

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
        <Breadcrumbs items={[{ label: category.title }]} />

        <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-foreground text-balance sm:text-5xl">
          {category.h1 || category.title}
        </h1>
        {category.intro && (
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            {category.intro}
          </p>
        )}

        {heroImageUrl && (
          <div className="relative mt-8 aspect-[2/1] w-full overflow-hidden rounded-2xl">
            <Image
              src={heroImageUrl}
              alt={category.title}
              fill
              priority
              sizes="(min-width: 1024px) 850px, 100vw"
              className="object-cover"
            />
          </div>
        )}

        <div className="mt-8">
          <PageBuilder blocks={category.body} />
        </div>

        {category.conditions.length > 0 && (
          <div className="mt-14 border-t border-border pt-10">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              Conditions
            </h2>
            <div className="mt-5">
              <AnswerCardGrid items={category.conditions} basePath="/conditions" />
            </div>
          </div>
        )}

        {category.treatments.length > 0 && (
          <div className="mt-14 border-t border-border pt-10">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              Treatments
            </h2>
            <div className="mt-5">
              <AnswerCardGrid items={category.treatments} basePath="/treatments" />
            </div>
          </div>
        )}

        {category.faqs && category.faqs.length > 0 && (
          <div className="mt-14 border-t border-border pt-10">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-5">
              <PageFaqList faqs={category.faqs} />
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  )
}

// Canonical suburb ("Service Area") page — replaces /areas/[slug]. The old
// path still works via app/areas/[slug]/page.tsx, which now just redirects
// here (belt-and-suspenders alongside the CMS-managed `redirect` documents
// that proxy.ts applies for the same old URLs).
async function SuburbPageContent({
  area,
  slug,
}: {
  area: NonNullable<Awaited<ReturnType<typeof getServiceAreaBySlug>>>
  slug: string
}) {
  const heroImageUrl = urlForImage(area.heroImage)?.width(1400).height(700).fit('crop').url()

  const settings = await getSiteSettings()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: settings.name,
    url: `${settings.siteUrl}/${SUBURB_PREFIX}${slug}`,
    telephone: settings.phoneIntl,
    areaServed: {
      '@type': 'City',
      name: area.suburb,
      ...(area.postcode && { postalCode: area.postcode }),
    },
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
        {/* eslint-disable-next-line react/no-danger */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <Breadcrumbs items={[{ label: 'Areas we serve', href: '/areas' }, { label: area.suburb }]} />

        <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-foreground text-balance sm:text-5xl">
          Podiatrist in {area.suburb}
        </h1>
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
          {area.region && <span>{area.region}</span>}
          {area.postcode && <span>{area.postcode}</span>}
          {area.distanceFromClinic && <span>{area.distanceFromClinic} from our clinic</span>}
        </div>
        {area.summary && (
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">{area.summary}</p>
        )}

        {heroImageUrl && (
          <div className="relative mt-8 aspect-[2/1] w-full overflow-hidden rounded-2xl">
            <Image
              src={heroImageUrl}
              alt={area.suburb}
              fill
              priority
              sizes="(min-width: 1024px) 850px, 100vw"
              className="object-cover"
            />
          </div>
        )}

        {area.answerCapsule && (
          <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <p className="font-heading text-sm font-semibold uppercase tracking-wide text-primary">
              In short
            </p>
            <p className="mt-2 text-base leading-relaxed text-foreground text-pretty">{area.answerCapsule}</p>
          </div>
        )}

        <div className="mt-8">
          <PageBuilder blocks={area.body} />
        </div>

        {(area.landmarks?.length || area.travelInfo) && (
          <div className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="flex items-center gap-2 text-primary">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <h2 className="font-heading text-lg font-semibold text-foreground">
                Getting to us from {area.suburb}
              </h2>
            </div>
            {area.travelInfo && (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">{area.travelInfo}</p>
            )}
            {area.landmarks && area.landmarks.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {area.landmarks.map((landmark) => (
                  <li
                    key={landmark}
                    className="rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs text-muted-foreground"
                  >
                    {landmark}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="mt-10 rounded-2xl border border-border bg-secondary/40 p-6 text-center sm:p-8">
          <p className="font-heading text-lg font-semibold text-foreground">
            Book an appointment for patients in {area.suburb}
          </p>
          <Button size="lg" className="mt-4" render={<Link href="/contact" />} nativeButton={false}>
            Book an appointment
          </Button>
        </div>

        {area.featuredConditions && area.featuredConditions.length > 0 && (
          <div className="mt-14 border-t border-border pt-10">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              Conditions we treat for {area.suburb} patients
            </h2>
            <div className="mt-5">
              <AnswerCardGrid items={area.featuredConditions} basePath="/conditions" />
            </div>
          </div>
        )}

        {area.featuredServices && area.featuredServices.length > 0 && (
          <div className="mt-14 border-t border-border pt-10">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              Services available in {area.suburb}
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {area.featuredServices.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:border-primary"
                  >
                    <span>
                      <span className="font-heading text-sm font-semibold text-foreground">
                        {service.name}
                      </span>
                      {service.summary && (
                        <span className="mt-0.5 block text-sm text-muted-foreground">{service.summary}</span>
                      )}
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
