import type { Faq } from '@/lib/sanity/data'

// FAQ list for detail pages (Condition, Treatment, Category) that carry
// their own hand-picked FAQ list, distinct from the site-wide FaqSection
// used on the home page. Deliberately NOT a collapsible accordion — every
// answer renders expanded in the DOM so both users and AI answer engines
// can read it without a click. No heading/section chrome — the calling page
// supplies its own <h2>.
export function PageFaqList({ faqs }: { faqs?: Faq[] }) {
  if (!faqs || faqs.length === 0) return null

  return (
    <dl className="flex flex-col gap-6">
      {faqs.map((faq) => (
        <div key={faq.question}>
          <dt className="font-heading text-base font-semibold text-foreground">{faq.question}</dt>
          <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.answer}</dd>
        </div>
      ))}
    </dl>
  )
}
