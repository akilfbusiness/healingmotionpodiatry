import type { Metadata } from 'next'
import { AnswerCardGrid } from '@/components/answer-card-grid'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { getTreatmentsHubList, getTreatmentsHubPage, getSiteSettings } from '@/lib/sanity/data'
import { buildMetadata } from '@/lib/sanity/metadata'

export async function generateMetadata(): Promise<Metadata> {
  const [settings, hub] = await Promise.all([getSiteSettings(), getTreatmentsHubPage()])
  return buildMetadata({
    seo: hub?.seo,
    settings,
    fallbackTitle: hub?.title || `Treatments | ${settings.name}`,
    fallbackDescription: 'Browse podiatry treatments and services we offer.',
    path: '/treatments',
  })
}

export default async function TreatmentsPage() {
  const [hub, groups] = await Promise.all([getTreatmentsHubPage(), getTreatmentsHubList()])

  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <Breadcrumbs items={[{ label: 'Treatments' }]} />

      <div className="mt-6 max-w-2xl">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground text-balance sm:text-5xl">
          {hub?.h1 || hub?.title || 'Treatments'}
        </h1>
        {hub?.intro && (
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">{hub.intro}</p>
        )}
      </div>

      {groups.length === 0 ? (
        <p className="mt-10 text-sm text-muted-foreground">No treatments are listed yet.</p>
      ) : (
        <div className="mt-12 flex flex-col gap-12">
          {groups.map((group) => (
            <section key={group.slug}>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
                {group.title}
              </h2>
              <div className="mt-5">
                <AnswerCardGrid items={group.items} basePath="/treatments" />
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  )
}
