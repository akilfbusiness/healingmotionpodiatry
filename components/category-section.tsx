import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { AnswerCard, HomePageCategorySection } from '@/lib/sanity/data'
import { urlForImage } from '@/lib/sanity/image'

// Renders one category's home page section: the hand-featured items (up to
// 3, from category.featuredOnHome) as larger image cards, followed by every
// other published condition/treatment in that category as a compact link
// list. Fully derived at query time (see homePageCategorySectionsQuery) —
// nothing here is manually curated, so a newly published condition or
// treatment appears automatically without anyone touching the home page.
export function CategorySection({ category }: { category: HomePageCategorySection }) {
  const remaining = [...category.remainingConditions, ...category.remainingTreatments]

  if (category.featured.length === 0 && remaining.length === 0) return null

  return (
    <section
      id={category.slug}
      className="scroll-mt-16 border-t border-border py-16 first:border-t-0 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl">
            {category.title}
          </h2>
          <Link
            href={`/${category.slug}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {category.featured.length > 0 && (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {category.featured.map((item) => (
              <FeaturedCard key={item.slug} item={item} />
            ))}
          </div>
        )}

        {remaining.length > 0 && (
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {remaining.map((item) => {
              const isTreatment = category.remainingTreatments.some((t) => t.slug === item.slug)
              return (
                <li key={item.slug}>
                  <Link
                    href={`/${isTreatment ? 'treatments' : 'conditions'}/${item.slug}`}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
                  >
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                    {item.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}

function FeaturedCard({ item }: { item: AnswerCard & { type: 'condition' | 'treatment' } }) {
  const imageUrl = urlForImage(item.heroImage)?.width(600).height(400).fit('crop').url()
  const basePath = item.type === 'treatment' ? '/treatments' : '/conditions'
  const blurb = item.homepageBlurb || item.answerCapsule

  return (
    <Link
      href={`${basePath}/${item.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary"
    >
      {imageUrl && (
        <div className="relative aspect-[3/2] w-full overflow-hidden bg-secondary">
          <Image
            src={imageUrl}
            alt={item.title}
            fill
            sizes="(min-width: 1024px) 380px, 100vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <p className="font-heading text-base font-semibold text-foreground">{item.title}</p>
        {blurb && <p className="text-sm leading-relaxed text-muted-foreground">{blurb}</p>}
        <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium text-primary">
          Learn more
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
