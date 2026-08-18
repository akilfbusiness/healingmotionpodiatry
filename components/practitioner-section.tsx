import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { getHomePage } from '@/lib/sanity/data'
import { urlForImage } from '@/lib/sanity/image'

// Wired to the `practitioner` document (previously unused by the frontend)
// rather than `teamMember`. Also feeds the JSON-LD Person schema in
// structured-data.tsx — ahpraNumber/specialInterests/languagesSpoken are
// real E-E-A-T signal for a health service, not just display copy.
export async function PractitionerSection() {
  const homePage = await getHomePage()
  const section = homePage?.practitionerSection
  const practitioner = section?.practitioner
  if (!practitioner) return null

  const photoUrl = urlForImage(practitioner.photo)?.width(560).height(560).fit('crop').url()

  return (
    <section id="practitioner" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="grid gap-10 rounded-2xl border border-border bg-card p-6 sm:p-10 lg:grid-cols-[280px_1fr] lg:items-center lg:gap-12">
        <div className="relative mx-auto aspect-square w-48 overflow-hidden rounded-2xl sm:w-56 lg:mx-0 lg:w-full">
          <Image
            src={photoUrl ?? '/images/practitioner-husein.webp'}
            alt={`${practitioner.name}, podiatrist at Healing Motion Podiatry`}
            fill
            sizes="(min-width: 1024px) 280px, 224px"
            className="object-cover"
          />
        </div>

        <div>
          <Badge variant="secondary" className="mb-3">
            {section.heading ?? 'Meet your podiatrist'}
          </Badge>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {practitioner.name}
          </h2>
          {(practitioner.credentials || practitioner.title) && (
            <p className="mt-1 text-sm font-medium text-primary">
              {practitioner.credentials || practitioner.title}
            </p>
          )}
          {practitioner.bio && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty">
              {practitioner.bio}
            </p>
          )}
          {practitioner.specialInterests && practitioner.specialInterests.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {practitioner.specialInterests.map((interest) => (
                <Badge key={interest} variant="outline">
                  {interest}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
