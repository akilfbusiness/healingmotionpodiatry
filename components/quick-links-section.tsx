import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getHomePage } from '@/lib/sanity/data'

// A short hand-picked strip of standout Conditions near the top of the home
// page (homePage.quickLinks, max 8) — supplementary to the auto-derived
// CategorySections further down, not a replacement for them.
export async function QuickLinksSection() {
  const homePage = await getHomePage()
  const quickLinks = homePage?.quickLinks

  if (!quickLinks || quickLinks.length === 0) return null

  return (
    <section className="border-b border-border bg-secondary/40 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Common concerns:</span>
          {quickLinks.map((item) => (
            <Link
              key={item.slug}
              href={`/conditions/${item.slug}`}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {item.title}
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
