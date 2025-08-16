import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
	const url = new URL(req.url)
	const ref = url.searchParams.get("ref")
	const w = url.searchParams.get("w") || "640"
	const h = url.searchParams.get("h") // optional

	if (!ref) {
		return new NextResponse("Missing ref", { status: 400 })
	}

	// Handle demo photo references for demonstration
	if (ref.startsWith("demo_photo_")) {
		return handleDemoPhoto(ref, w, h || undefined)
	}

	// Build Places Photos API URL for real photo references
	const qp = new URLSearchParams({
		key: process.env.GOOGLE_MAPS_API_KEY!,
		photoreference: ref,
		maxwidth: w,
	})
	if (h) qp.set("maxheight", h)

	const gUrl = `https://maps.googleapis.com/maps/api/place/photo?${qp.toString()}`

	try {
		const res = await fetch(gUrl, {
			// Google responds with a 302 to the actual image; follow it
			redirect: "follow",
			cache: "no-store",
		})

		if (!res.ok) {
			return new NextResponse("Photo fetch failed", { status: 502 })
		}

		// Set strong caching on OUR edge (Vercel), not on the client only
		const headers = new Headers(res.headers)
		headers.set(
			"Cache-Control",
			"public, s-maxage=86400, max-age=3600, stale-while-revalidate=86400"
		)

		// Stream bytes back to client
		const buf = Buffer.from(await res.arrayBuffer())
		return new NextResponse(buf, {
			status: 200,
			headers,
		})
	} catch (error) {
		console.error("Photo fetch error:", error)
		return new NextResponse("Photo fetch failed", { status: 502 })
	}
}

// Handle demo photos for demonstration purposes
function handleDemoPhoto(
	ref: string,
	width: string,
	height?: string
): NextResponse {
	const venueInfo = getVenueInfo(ref)

	// Create a venue-specific SVG image
	const svg = `
		<svg width="${width}" height="${
		height || width
	}" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" style="stop-color:${venueInfo.color1};stop-opacity:1" />
					<stop offset="100%" style="stop-color:${venueInfo.color2};stop-opacity:1" />
				</linearGradient>
			</defs>
			<rect width="100%" height="100%" fill="url(#grad1)"/>
			<circle cx="50%" cy="35%" r="18%" fill="white" opacity="0.9"/>
			<text x="50%" y="42%" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="${
				venueInfo.color1
			}">${venueInfo.icon}</text>
			<text x="50%" y="65%" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="white" font-weight="bold">${
				venueInfo.name
			}</text>
			<text x="50%" y="78%" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="white" opacity="0.8">${
				venueInfo.type
			}</text>
			<text x="50%" y="90%" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" fill="white" opacity="0.6">DEMO PHOTO</text>
		</svg>
	`

	const headers = new Headers()
	headers.set("Content-Type", "image/svg+xml")
	headers.set("Cache-Control", "public, max-age=3600")

	return new NextResponse(svg, {
		status: 200,
		headers,
	})
}

// Get venue-specific information for demo photos
function getVenueInfo(ref: string) {
	const venueMap: { [key: string]: any } = {
		demo_photo_yolk: {
			name: "YOLK",
			type: "Breakfast & Brunch",
			icon: "🍳",
			color1: "#FF6B35",
			color2: "#F7931E",
		},
		demo_photo_pequod: {
			name: "PEQUOD'S",
			type: "Deep Dish Pizza",
			icon: "🍕",
			color1: "#8B4513",
			color2: "#CD853F",
		},
		demo_photo_bavette: {
			name: "BAVETTE'S",
			type: "Steakhouse",
			icon: "🥩",
			color1: "#8B0000",
			color2: "#DC143C",
		},
		demo_photo_portillo: {
			name: "PORTILLO'S",
			type: "Italian Beef",
			icon: "🌭",
			color1: "#FF4500",
			color2: "#FF6347",
		},
		demo_photo_bigstar: {
			name: "BIG STAR",
			type: "Tacos & Tequila",
			icon: "🌮",
			color1: "#FFD700",
			color2: "#FFA500",
		},
		demo_photo_generic: {
			name: "VENUE",
			type: "Restaurant",
			icon: "🍽️",
			color1: "#4F46E5",
			color2: "#10B981",
		},
	}

	return venueMap[ref] || venueMap["demo_photo_generic"]
}
