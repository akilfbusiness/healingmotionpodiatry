import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { AnswerCardGrid } from '@/components/answer-card-grid'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { PageBuilder } from '@/components/page-builder'
import { PageFaqList } from '@/components/page-faq-list'
import { Button } from '@/components/ui/button'
import { getAllSlugs, getConditionBySlug, getSiteSettings } from '@/lib/sanity/data'
import { urlForImage } from '@/lib/sanity/image'
import { buildMetadata } from '@/lib/sanity/metadata'

export async function generateStaticParams() {
  const { conditions } = await getAllSlugs()
  return conditions.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const [settings, condition] = await Promise.all([getSiteSettings(), getConditionBySlug(slug)])
  if (!condition) return {}

  return buildMetadata({
    seo: condition.seo,
    settings,
    fallbackTitle: `${condition.title} | ${settings.name}`,
    fallbackDescription: condition.answerCapsule,
    path: `/conditions/${slug}`,
  })
}

export default async function ConditionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [settings, condition] = await Promise.all([getSiteSettings(), getConditionBySlug(slug)])
  if (!condition) notFound()

  const heroImageUrl = urlForImage(condition.heroImage)?.width(1400).height(700).fit('crop').url()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalCondition',
    name: condition.title,
    description: condition.answerCapsule,
    url: `${settings.siteUrl}/conditions/${slug}`,
    ...(condition.relatedTreatments &&
      condition.relatedTreatments.length > 0 && {
        possibleTreatment: condition.relatedTreatments.map((treatment) => ({
          '@type': 'MedicalTherapy',
          name: treatment.title,
        })),
      }),
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Breadcrumbs
        items={[
          { label: 'Conditions', href: '/conditions' },
          ...(condition.category
            ? [{ label: condition.category.title, href: `/conditions#${condition.category.slug}` }]
            : []),
          { label: condition.title },
        ]}
      />

      <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-foreground text-balance sm:text-5xl">
        {condition.h1 || condition.title}
      </h1>

      {heroImageUrl && (
        <div className="relative mt-8 aspect-[2/1] w-full overflow-hidden rounded-2xl">
          <Image
            src={heroImageUrl}
            alt={condition.title}
            fill
            priority
            sizes="(min-width: 1024px) 850px, 100vw"
            className="object-cover"
          />
        </div>
      )}

      {condition.answerCapsule && (
        <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6">
          <p className="font-heading text-sm font-semibold uppercase tracking-wide text-primary">
            In short
          </p>
          <p className="mt-2 text-base leading-relaxed text-foreground text-pretty">
            {condition.answerCapsule}
          </p>
        </div>
      )}

      <div className="mt-8">
        <PageBuilder blocks={condition.body} />
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-secondary/40 p-6 text-center sm:p-8">
        <p className="font-heading text-lg font-semibold text-foreground">
          Ready to book an appointment?
        </p>
        <Button size="lg" className="mt-4" render={<Link href="/contact" />} nativeButton={false}>
          Book an appointment
        </Button>
      </div>

      {condition.relatedTreatments && condition.relatedTreatments.length > 0 && (
        <div className="mt-14 border-t border-border pt-10">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Treatments for {condition.title}
          </h2>
          <div className="mt-5">
            <AnswerCardGrid items={condition.relatedTreatments} basePath="/treatments" />
          </div>
        </div>
      )}

      {condition.relatedConditions && condition.relatedConditions.length > 0 && (
        <div className="mt-14 border-t border-border pt-10">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Related conditions
          </h2>
          <ul className="mt-5 flex flex-col gap-3">
            {condition.relatedConditions.map((related) => (
              <li key={related.slug}>
                <Link
                  href={`/conditions/${related.slug}`}
                  className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:border-primary"
                >
                  <span className="font-heading text-sm font-semibold text-foreground">
                    {related.title}
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {condition.faqs && condition.faqs.length > 0 && (
        <div className="mt-14 border-t border-border pt-10">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Frequently asked questions
          </h2>
          <div className="mt-5">
            <PageFaqList faqs={condition.faqs} />
          </div>
        </div>
      )}
    </main>
  )
}
