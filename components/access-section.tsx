import { RichTextContent } from '@/components/portable-text'
import { getHomePage } from '@/lib/sanity/data'

// Replaces the removed TestimonialsSection (AHPRA National Law s133 forbids
// health services from advertising with testimonials/reviews). Surfaces
// what to expect at a first appointment and how fees/funding work
// (Medicare EPC, NDIS, HICAPS, private health) directly on the home page.
export async function AccessSection() {
  const homePage = await getHomePage()
  const firstAppointmentBody = homePage?.firstAppointmentBody
  const feesBody = homePage?.feesBody

  if (!firstAppointmentBody?.length && !feesBody?.length) return null

  return (
    <section className="border-t border-border bg-secondary/40 py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-2">
        {firstAppointmentBody && firstAppointmentBody.length > 0 && (
          <div>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground text-balance sm:text-3xl">
              What to expect at your first appointment
            </h2>
            <div className="mt-4">
              <RichTextContent value={firstAppointmentBody} />
            </div>
          </div>
        )}
        {feesBody && feesBody.length > 0 && (
          <div>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground text-balance sm:text-3xl">
              Fees & funding
            </h2>
            <div className="mt-4">
              <RichTextContent value={feesBody} />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
