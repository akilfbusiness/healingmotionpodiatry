import type { QueryParams } from 'next-sanity'
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from './env'

// useCdn is disabled so requests go through Next.js's own Data Cache
// (via the `next` fetch options below) instead of Sanity's CDN cache.
// This lets us control freshness with a single, predictable mechanism:
// a 24h fallback revalidation plus instant on-demand revalidation from
// the Sanity publish webhook (see app/api/revalidate/route.ts).
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
})

// Tag every query with 'sanity' so a single revalidateTag('sanity') call
// (triggered by the webhook on publish) invalidates all cached content at
// once. The 24h revalidate is a safety-net fallback in case a webhook call
// is ever missed — it does NOT mean the site rebuilds every 24h regardless;
// pages are only regenerated when requested after that window has passed.
export function sanityFetch<T>(query: string, params: QueryParams = {}): Promise<T> {
  return client.fetch<T>(query, params, {
    next: { revalidate: 86400, tags: ['sanity'] },
  })
}
