import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, MapPin } from 'lucide-react'
import { AnswerCardGrid } from '@/components/answer-card-grid'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { PageBuilder } from '@/components/page-builder'
import { Button } from '@/components/ui/button'
import { getAllSlugs, getServiceAreaBySlug, getSiteSettings } from '@/lib/sanity/data'
import { urlForImage } from '@/lib/sanity/image'
import { buildMetadata } from '@/lib/sanity/metadata'

// Canonical suburb ("Service Area") page — replaces /areas/[slug]. The old
// path still works via app/areas/[slug]/page.tsx, which now just redirects
// here (belt-and-suspenders alongside the CMS-managed `redirect` documents
// that proxy.ts applies for the same old URLs).
export async function generateStaticParams() {
  const { areas } = await getAllSlugs()
  return areas.map((slug) => ({ suburb: slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ suburb: string }>
}): Promise<Metadata> {
  const { suburb: slug } = await params
  const [settings, area] = await Promise.all([getSiteSettings(), getServiceAreaBySlug(slug)])
  if (!area) return {}

  return buildMetadata({
    seo: area.seo,
    settings,
    fallbackTitle: `Podiatrist in ${area.suburb} | ${settings.name}`,
    fallbackDescription: area.summary || `Podiatry care for patients in ${area.suburb}.`,
    path: `/podiatrist-${slug}`,
  })
}

export default async function SuburbPage({
  params,
}: {
  params: Promise<{ suburb: string }>
}) {
  const { suburb: slug } = await params
  const [settings, area] = await Promise.all([getSiteSettings(), getServiceAreaBySlug(slug)])
  if (!area) notFound()

  const heroImageUrl = urlForImage(area.heroImage)?.width(1400).height(700).fit('crop').url()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: settings.name,
    url: `${settings.siteUrl}/podiatrist-${slug}`,
    telephone: settings.phoneIntl,
    areaServed: {
      '@type': 'City',
      name: area.suburb,
      ...(area.postcode && { postalCode: area.postcode }),
    },
  }

  return (
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
            <h2 className="font-heading text-lg font-semibold text-foreground">Getting to us from {area.suburb}</h2>
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
  )
}
