import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { PageBuilder } from '@/components/page-builder'
import { RichTextContent } from '@/components/portable-text'
import { getAreasHub, getServiceAreas, getSiteSettings } from '@/lib/sanity/data'
import { urlForImage } from '@/lib/sanity/image'
import { buildMetadata } from '@/lib/sanity/metadata'

export async function generateMetadata(): Promise<Metadata> {
  const [settings, hub] = await Promise.all([getSiteSettings(), getAreasHub()])
  return buildMetadata({
    seo: hub?.seo,
    settings,
    fallbackTitle: `Areas We Serve | ${settings.name}`,
    fallbackDescription: `Podiatry care for patients across ${settings.name}'s local service area.`,
    path: '/areas',
  })
}

export default async function AreasPage() {
  const [hub, areas] = await Promise.all([getAreasHub(), getServiceAreas()])

  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <Breadcrumbs items={[{ label: 'Areas we serve' }]} />

      <div className="mt-6 max-w-2xl">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground text-balance sm:text-5xl">
          {hub?.heading ?? 'Areas we serve'}
        </h1>
        {hub?.intro && (
          <div className="[&>p:first-child]:mt-4">
            <RichTextContent value={hub.intro} />
          </div>
        )}
      </div>

      {areas.length === 0 ? (
        <p className="mt-10 text-sm text-muted-foreground">No service areas are listed yet.</p>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => {
            const imageUrl = urlForImage(area.heroImage)?.width(500).height(350).fit('crop').url()
            return (
              <Link
                key={area.slug}
                href={`/podiatrist-${area.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary"
              >
                <div className="relative aspect-[10/7] w-full overflow-hidden bg-secondary">
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={area.suburb}
                      fill
                      sizes="(min-width: 1024px) 380px, 100vw"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1.5 p-5">
                  <div className="flex items-center gap-1.5 text-primary">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    <p className="font-heading text-base font-semibold text-foreground">{area.suburb}</p>
                  </div>
                  {area.summary && (
                    <p className="text-sm leading-relaxed text-muted-foreground">{area.summary}</p>
                  )}
                  {area.distanceFromClinic && (
                    <p className="mt-auto pt-2 text-xs text-muted-foreground">
                      {area.distanceFromClinic} from our clinic
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}

      <div className="mt-14">
        <PageBuilder blocks={hub?.additionalSections} />
      </div>
    </main>
  )
}
