import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { AnswerCard } from '@/lib/sanity/data'
import { urlForImage } from '@/lib/sanity/image'

// Shared card used everywhere a Condition/Treatment "answer card" is listed:
// the Conditions/Treatments hub pages, category pages, and the home page's
// per-category sections. `basePath` picks the right URL prefix
// ('/conditions' or '/treatments') without this component needing to know
// which document type it's rendering.
export function AnswerCardGrid({
  items,
  basePath,
}: {
  items: AnswerCard[]
  basePath: '/conditions' | '/treatments'
}) {
  if (items.length === 0) return null

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => {
        const imageUrl = urlForImage(item.heroImage)?.width(160).height(160).fit('crop').url()
        return (
          <Link
            key={item.slug}
            href={`${basePath}/${item.slug}`}
            className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary"
          >
            {imageUrl ? (
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-secondary">
                <Image src={imageUrl} alt="" fill sizes="56px" className="object-cover" />
              </div>
            ) : null}
            <div className="flex-1">
              <p className="font-heading text-sm font-semibold text-foreground">{item.title}</p>
              {item.answerCapsule && (
                <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {item.answerCapsule}
                </p>
              )}
            </div>
            <ArrowRight
              className="mt-1 h-4 w-4 shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            />
          </Link>
        )
      })}
    </div>
  )
}
