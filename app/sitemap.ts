import type { MetadataRoute } from 'next'
import { getAllSlugs, getBlogPosts, getSiteSettings } from '@/lib/sanity/data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, slugs, posts] = await Promise.all([
    getSiteSettings(),
    getAllSlugs(),
    getBlogPosts(),
  ])
  const now = new Date()
  const postDateBySlug = new Map(posts.map((p) => [p.slug, new Date(p.updatedDate ?? p.publishedDate ?? now)]))

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: settings.siteUrl, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${settings.siteUrl}/conditions`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${settings.siteUrl}/treatments`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    // Legacy taxonomy, kept live until the `service` documents are fully
    // retired in favor of `condition`/`treatment`.
    { url: `${settings.siteUrl}/services`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${settings.siteUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${settings.siteUrl}/areas`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${settings.siteUrl}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
  ]

  const categoryRoutes: MetadataRoute.Sitemap = slugs.categories.map((slug) => ({
    url: `${settings.siteUrl}/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const conditionRoutes: MetadataRoute.Sitemap = slugs.conditions.map((slug) => ({
    url: `${settings.siteUrl}/conditions/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const treatmentRoutes: MetadataRoute.Sitemap = slugs.treatments.map((slug) => ({
    url: `${settings.siteUrl}/treatments/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const serviceRoutes: MetadataRoute.Sitemap = slugs.services.map((slug) => ({
    url: `${settings.siteUrl}/services/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const postRoutes: MetadataRoute.Sitemap = slugs.posts.map((slug) => ({
    url: `${settings.siteUrl}/blog/${slug}`,
    lastModified: postDateBySlug.get(slug) ?? now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const areaRoutes: MetadataRoute.Sitemap = slugs.areas.map((slug) => ({
    url: `${settings.siteUrl}/podiatrist-${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const pageRoutes: MetadataRoute.Sitemap = slugs.pages.map((slug) => ({
    url: `${settings.siteUrl}/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.5,
  }))

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...conditionRoutes,
    ...treatmentRoutes,
    ...serviceRoutes,
    ...postRoutes,
    ...areaRoutes,
    ...pageRoutes,
  ]
}
