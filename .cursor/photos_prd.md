Here’s the plan we baked into the PRD for showing venue photos without storing images:

Approach: Google Places Photos via a server proxy
	•	Do not store binaries. Instead, fetch on demand from the Google Places Photos API using each venue’s place_id and a photo_reference.
	•	Never expose your server key. Route all photo requests through a server-side Next.js Route Handler that calls Google, streams the bytes back, and sets strong cache headers.
	•	Comply with attribution. Google requires you to display photo attribution. We’ll surface photographer/attribution text provided by the Places API.

Minimal schema additions

Add a few columns to gc_venues so we can resolve photos fast without extra round trips:
	•	gmaps_place_id text
	•	gmaps_primary_photo_ref text
	•	gmaps_photo_attribution text  (short HTML string provided by Google; render safely)

Your enrichment script can already fetch place_id. Update it to also grab the first photo from Place Details:
	•	result.photos[0].photo_reference
	•	result.photos[0].html_attributions[0] (store as gmaps_photo_attribution)

Server photo proxy (Next.js App Router)

Route: GET /api/photo?ref=<photo_reference>&w=640&h=480

// src/app/api/photo/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const ref = url.searchParams.get('ref')
  const w = url.searchParams.get('w') || '640'
  const h = url.searchParams.get('h') // optional

  if (!ref) return new NextResponse('Missing ref', { status: 400 })

  // Build Places Photos API URL
  const qp = new URLSearchParams({
    key: process.env.GOOGLE_MAPS_API_KEY!,
    photoreference: ref,
    maxwidth: w,
  })
  if (h) qp.set('maxheight', h)

  const gUrl = `https://maps.googleapis.com/maps/api/place/photo?${qp.toString()}`
  const res = await fetch(gUrl, {
    // Google responds with a 302 to the actual image; follow it
    redirect: 'follow',
    cache: 'no-store',
  })

  if (!res.ok) {
    return new NextResponse('Photo fetch failed', { status: 502 })
  }

  // Set strong caching on OUR edge (Vercel), not on the client only
  const headers = new Headers(res.headers)
  headers.set('Cache-Control', 'public, s-maxage=86400, max-age=3600, stale-while-revalidate=86400')

  // Stream bytes back to client
  const buf = Buffer.from(await res.arrayBuffer())
  return new NextResponse(buf, {
    status: 200,
    headers,
  })
}

Using it in the UI

Use next/image for optimization and lazy loading, but point src to your proxy route. That way:
	•	You get responsive sizes, lazy loading, and automatic format selection.
	•	Your server key never leaves the server.

import Image from 'next/image'

export function VenueHeroPhoto({ photoRef, name }: { photoRef?: string; name: string }) {
  if (!photoRef) return null
  const src = `/api/photo?ref=${encodeURIComponent(photoRef)}&w=1200`
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
      <Image
        src={src}
        alt={name}
        fill
        sizes="(max-width: 768px) 100vw, 1200px"
        priority={false}
      />
    </div>
  )
}

Attribution snippet on the details page

Render the HTML attribution safely near the image:

export function PhotoAttribution({ html }: { html?: string }) {
  if (!html) return null
  // html is from Google; sanitize or render in a small caption region
  return <div className="mt-2 text-xs text-muted-foreground" dangerouslySetInnerHTML={{ __html: html }} />
}

How we populate place_id and photo_reference
	•	Your enrichment script uses Places Text Search to find the venue and then Place Details to fetch:
	•	result.url → official Google Maps URL
	•	result.rating, user_ratings_total
	•	result.place_id → save to gc_venues.gmaps_place_id
	•	result.photos[0].photo_reference and result.photos[0].html_attributions[0] → save to gc_venues.gmaps_primary_photo_ref and gmaps_photo_attribution
	•	We only need one photo_reference for the hero image. If you want a gallery, store a small array in a related table gc_venue_photos with photo_ref, width, height, attribution.

Cost, rate limits, and performance
	•	Google Photos API requests are billed per call, but returning a cached image via your proxy reduces repeated calls. We set:
	•	Cache-Control: public, s-maxage=86400, max-age=3600, stale-while-revalidate=86400
	•	Vercel will cache the image at the edge. Users near-by will get it from cache.
	•	If you anticipate heavy traffic on a subset of venues, you can later add a simple thumbnail warmer or switch to Supabase Storage caching for those few hot images while still keeping originals server-less.

Why not hotlink Yelp or others?
	•	Yelp and TripAdvisor typically disallow scraping or hotlinking their media. Google Places explicitly supports Photos API for this use case with proper attribution. Stick to Places Photos for legality and consistency.

Summary decision
	•	No local storage required for v1.
	•	Server proxy to Places Photos keeps your key private and enables edge caching for speed and cost control.
	•	Attribution is displayed to satisfy Google’s terms.
	•	Schema holds place_id, photo_reference, and attribution so every request is one hop with no extra lookups.

If you want, I can add a small migration snippet for the three new columns and patch the enrichment script to capture photo_reference and attribution.