import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

// Called by Sanity's webhook every time content is published in /studio.
// Verifies the request really came from Sanity (via a shared secret) and
// then invalidates every cached fetch tagged 'sanity' (see lib/sanity/client.ts),
// so the next request to any page fetches fresh data instead of waiting for
// the 24h fallback revalidation window.
export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    )

    if (!isValidSignature) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 })
    }

    if (!body?._type) {
      return NextResponse.json({ message: 'Bad request' }, { status: 400 })
    }

    revalidateTag('sanity', 'max')

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      type: body._type,
    })
  } catch (err) {
    console.error('[v0] Error revalidating:', err)
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
  }
}
