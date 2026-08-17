import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { AnswerCardGrid } from '@/components/answer-card-grid'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { PageBuilder } from '@/components/page-builder'
import { PageFaqList } from '@/components/page-faq-list'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { getAllSlugs, getCategoryBySlug, getPageBySlug, getSiteSettings } from '@/lib/sanity/data'
import { urlForImage } from '@/lib/sanity/image'
import { buildMetadata } from '@/lib/sanity/metadata'

// Catch-all for two document types that both live at the site root:
// `category` (top of the Core 30 hierarchy, e.g. /foot-heel-pain) and the
// flexible `page` document (About, Privacy Policy, Careers, etc). Category
// is tried first, then falls through to page — the two slug sets are
// curated in the Studio and expected not to collide. Next.js resolves the
// static /conditions, /treatments, /services, /blog, /areas, and /contact
// segments before ever reaching this dynamic route.
export async function generateStaticParams() {
  const { categories, pages } = await getAllSlugs()
  return [...categories, ...pages].map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const settings = await getSiteSettings()

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
