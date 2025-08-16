import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
	const url = new URL(req.url)
	const placeId = url.searchParams.get("placeId")

	if (!placeId) {
		return new NextResponse("Missing placeId parameter", { status: 400 })
	}

	const apiKey = process.env.GOOGLE_MAPS_API_KEY
	if (!apiKey) {
		return new NextResponse("Google Maps API key not configured", {
			status: 500,
		})
	}

	try {
		// Get place details including photos using Google Places API
		const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${apiKey}`

		const response = await fetch(detailsUrl)
		const data = await response.json()

		if (data.status !== "OK") {
			console.error("Google Places API error:", data)
			return new NextResponse(`Google Places API error: ${data.status}`, {
				status: 500,
			})
		}

		return NextResponse.json(data.result)
	} catch (error) {
		console.error("Error getting place photos:", error)
		return new NextResponse("Failed to get place photos", { status: 500 })
	}
}
