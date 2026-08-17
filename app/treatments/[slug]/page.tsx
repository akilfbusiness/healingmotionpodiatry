import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AnswerCardGrid } from '@/components/answer-card-grid'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { PageBuilder } from '@/components/page-builder'
import { PageFaqList } from '@/components/page-faq-list'
import { Button } from '@/components/ui/button'
import { getAllSlugs, getSiteSettings, getTreatmentBySlug } from '@/lib/sanity/data'
import { urlForImage } from '@/lib/sanity/image'
import { buildMetadata } from '@/lib/sanity/metadata'

export async function generateStaticParams() {
  const { treatments } = await getAllSlugs()
  return treatments.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const [settings, treatment] = await Promise.all([getSiteSettings(), getTreatmentBySlug(slug)])
  if (!treatment) return {}

  return buildMetadata({
    seo: treatment.seo,
    settings,
    fallbackTitle: `${treatment.title} | ${settings.name}`,
    fallbackDescription: treatment.answerCapsule,
    path: `/treatments/${slug}`,
  })
}

export default async function TreatmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [settings, treatment] = await Promise.all([getSiteSettings(), getTreatmentBySlug(slug)])
  if (!treatment) notFound()

  const heroImageUrl = urlForImage(treatment.heroImage)?.width(1400).height(700).fit('crop').url()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalTherapy',
    name: treatment.title,
    description: treatment.answerCapsule,
    url: `${settings.siteUrl}/treatments/${slug}`,
    ...(treatment.relatedConditions &&
      treatment.relatedConditions.length > 0 && {
        possibleTreatment: {
          '@type': 'MedicalTherapy',
          name: treatment.title,
        },
      }),
    performedBy: { '@type': 'MedicalBusiness', name: settings.name, url: settings.siteUrl },
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Breadcrumbs
        items={[
          { label: 'Treatments', href: '/treatments' },
          ...(treatment.category
            ? [{ label: treatment.category.title, href: `/treatments#${treatment.category.slug}` }]
            : []),
          { label: treatment.title },
        ]}
      />

      <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-foreground text-balance sm:text-5xl">
        {treatment.h1 || treatment.title}
      </h1>

      {heroImageUrl && (
        <div className="relative mt-8 aspect-[2/1] w-full overflow-hidden rounded-2xl">
          <Image
            src={heroImageUrl}
            alt={treatment.title}
            fill
            priority
            sizes="(min-width: 1024px) 850px, 100vw"
            className="object-cover"
          />
        </div>
      )}

      {treatment.answerCapsule && (
        <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6">
          <p className="font-heading text-sm font-semibold uppercase tracking-wide text-primary">
            In short
          </p>
          <p className="mt-2 text-base leading-relaxed text-foreground text-pretty">
            {treatment.answerCapsule}
          </p>
        </div>
      )}

      <div className="mt-8">
        <PageBuilder blocks={treatment.body} />
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-secondary/40 p-6 text-center sm:p-8">
        <p className="font-heading text-lg font-semibold text-foreground">
          Ready to book an appointment?
        </p>
        <Button size="lg" className="mt-4" render={<Link href="/contact" />} nativeButton={false}>
          Book an appointment
        </Button>
      </div>

      {treatment.relatedConditions && treatment.relatedConditions.length > 0 && (
        <div className="mt-14 border-t border-border pt-10">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Conditions this treats
          </h2>
          <div className="mt-5">
            <AnswerCardGrid items={treatment.relatedConditions} basePath="/conditions" />
          </div>
        </div>
      )}

      {treatment.faqs && treatment.faqs.length > 0 && (
        <div className="mt-14 border-t border-border pt-10">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Frequently asked questions
          </h2>
          <div className="mt-5">
            <PageFaqList faqs={treatment.faqs} />
          </div>
        </div>
      )}
    </main>
  )
}
