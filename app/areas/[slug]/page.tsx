import { permanentRedirect } from 'next/navigation'

// Legacy path. The canonical suburb page now lives at /podiatrist-[suburb]
// (see app/podiatrist-[suburb]/page.tsx). This route is kept only so any
// old /areas/[slug] link (external backlinks, cached search results,
// bookmarks) still resolves — content-level `redirect` documents in Sanity
// cover the same old URLs via proxy.ts, so most requests never reach here;
// this is the code-level fallback for any suburb slug that doesn't have a
// matching redirect document yet. Safe to delete once analytics confirm no
// more traffic is landing on /areas/*.
export default async function LegacyServiceAreaRedirect({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  permanentRedirect(`/podiatrist-${slug}`)
}
