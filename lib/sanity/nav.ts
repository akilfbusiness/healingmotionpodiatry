// Resolves a navItem (see lib/sanity/queries.ts navItemProjection) into a
// concrete href. Internal references are resolved by document type; external
// links and "no link" dropdown labels are passed through as-is.

export type ResolvedNavItem = {
  label: string
  linkType?: 'internal' | 'external' | 'none'
  externalUrl?: string
  openInNewTab?: boolean
  internalType?: string
  internalSlug?: string | null
  children?: ResolvedNavItem[]
}

export function resolveInternalHref(type?: string, slug?: string | null): string {
  switch (type) {
    case 'category':
      return slug ? `/${slug}` : '/'
    case 'condition':
      return slug ? `/conditions/${slug}` : '/conditions'
    case 'treatment':
      return slug ? `/treatments/${slug}` : '/treatments'
    // Legacy taxonomy, kept resolvable until `service` documents are retired
    // in favor of `condition`/`treatment`.
    case 'service':
      return slug ? `/services/${slug}` : '/services'
    case 'serviceArea':
      return slug ? `/podiatrist-${slug}` : '/areas'
    case 'areasHub':
      return '/areas'
    case 'blogPost':
      return slug ? `/blog/${slug}` : '/blog'
    case 'blogCategory':
      return slug ? `/blog?category=${slug}` : '/blog'
    case 'page':
      return slug ? `/${slug}` : '/'
    case 'faq':
      return '/#faq'
    default:
      return '/'
  }
}

export function resolveNavItemHref(item: ResolvedNavItem): string {
  if (item.linkType === 'external' && item.externalUrl) return item.externalUrl
  if (item.linkType === 'internal') return resolveInternalHref(item.internalType, item.internalSlug)
  return '#'
}
