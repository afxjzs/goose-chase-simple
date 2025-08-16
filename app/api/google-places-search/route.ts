import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
	const url = new URL(req.url)
	const query = url.searchParams.get("query")

	if (!query) {
		return new NextResponse("Missing query parameter", { status: 400 })
	}

	const apiKey = process.env.GOOGLE_MAPS_API_KEY
	if (!apiKey) {
		return new NextResponse("Google Maps API key not configured", {
			status: 500,
		})
	}

	try {
		// Search for the place using Google Places API
		const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
			query
		)}&key=${apiKey}`

		const response = await fetch(searchUrl)
		const data = await response.json()

		if (data.status !== "OK") {
			console.error("Google Places API error:", data)
			return new NextResponse(`Google Places API error: ${data.status}`, {
				status: 500,
			})
		}

		return NextResponse.json(data)
	} catch (error) {
		console.error("Error searching places:", error)
		return new NextResponse("Failed to search places", { status: 500 })
	}
}
