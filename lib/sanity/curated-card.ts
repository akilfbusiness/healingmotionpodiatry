import type { CuratedCard } from '@/lib/sanity/data'

// Builds the real, indexable URL a curated card should link to, based on the
// referenced document's type + slug. Shared by every curated-card section
// (Conditions, Services, Suburbs Served, and any future ones) so link
// resolution logic lives in exactly one place.
export function resolveCardHref(card: CuratedCard): string | null {
  if (!card.refSlug) return null

  switch (card.refType) {
    case 'service':
      return `/services/${card.refSlug}`
    case 'serviceArea':
      return `/areas/${card.refSlug}`
    case 'blogPost':
      return `/blog/${card.refSlug}`
    case 'page':
      return `/${card.refSlug}`
    default:
      return null
  }
}

// Falls back to the linked document's own title when the editor hasn't
// typed a custom card title.
export function resolveCardTitle(card: CuratedCard): string {
  return (
    card.displayTitle || card.refTitle || card.refSuburb || card.refPostTitle || 'Learn more'
  )
}
