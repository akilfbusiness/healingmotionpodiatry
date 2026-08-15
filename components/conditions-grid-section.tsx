import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CuratedCardIcon } from '@/components/curated-card-icon'
import { getHomePage } from '@/lib/sanity/data'
import { resolveCardHref, resolveCardTitle } from '@/lib/sanity/curated-card'
import { urlForImage } from '@/lib/sanity/image'

// Fully manual — every card here is hand-added and hand-written in the
// Studio (Home Page > Conditions We Treat). Nothing is auto-populated from
// the Service collection, so this section only ever shows exactly what's
// been curated for this placement.
export async function ConditionsGridSection() {
  const homePage = await getHomePage()
  const section = homePage?.conditionsGrid
  const cards = section?.cards

  if (!cards?.length) return null

  return (
    <section id="conditions" className="scroll-mt-16 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl">
            {section?.heading ?? 'Conditions we treat'}
          </h2>
          {section?.subheading && (
            <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
              {section.subheading}
            </p>
          )}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => {
            const href = resolveCardHref(card)
            const imageUrl = urlForImage(card.image)?.width(600).height(400).fit('crop').url()
            return (
              <Card key={`${card.refSlug}-${index}`} className="overflow-hidden border-border/70">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={card.image?.alt || resolveCardTitle(card)}
                    width={600}
                    height={400}
                    className="h-40 w-full object-cover"
                  />
                ) : null}
                <CardHeader>
                  {!imageUrl && (
                    <CuratedCardIcon
                      name={card.icon}
                      className="mb-2 h-6 w-6 text-primary"
                      aria-hidden="true"
                    />
                  )}
                  <CardTitle className="font-heading text-lg">{resolveCardTitle(card)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {card.displayBlurb}
                  </p>
                  {href && (
                    <Link
                      href={href}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      {card.linkLabel || 'Learn more'}
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
