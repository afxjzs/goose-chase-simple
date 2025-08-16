import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
	const url = new URL(req.url)
	const photoRef = url.searchParams.get("photoRef")
	const maxWidth = url.searchParams.get("maxWidth") || "800"

	if (!photoRef) {
		return new NextResponse("Missing photoRef parameter", { status: 400 })
	}

	const apiKey = process.env.GOOGLE_MAPS_API_KEY
	if (!apiKey) {
		return new NextResponse("Google Maps API key not configured", {
			status: 500,
		})
	}

	try {
		// Fetch the photo using Google Places Photo API
		const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoRef}&key=${apiKey}`

		const response = await fetch(photoUrl, {
			redirect: "follow",
		})

		if (!response.ok) {
			console.error("Photo fetch failed:", response.status, response.statusText)

			// Try to get error details
			const errorText = await response.text()
			console.error("Error response body:", errorText)

			return new NextResponse(
				`Failed to fetch photo: ${response.status} ${response.statusText}`,
				{ status: 500 }
			)
		}

		// Get the photo data
		const photoBuffer = await response.arrayBuffer()

		// Set appropriate headers for the image
		const headers = new Headers()

		// Determine content type from response headers or default to jpeg
		const contentType = response.headers.get("content-type") || "image/jpeg"
		headers.set("Content-Type", contentType)

		// Set cache headers
		headers.set("Cache-Control", "public, max-age=3600")

		// Copy any other relevant headers from Google's response
		if (response.headers.get("content-length")) {
			headers.set("Content-Length", response.headers.get("content-length")!)
		}

		return new NextResponse(photoBuffer, {
			status: 200,
			headers,
		})
	} catch (error) {
		console.error("Error fetching photo:", error)
		return new NextResponse(`Failed to fetch photo: ${error}`, { status: 500 })
	}
}
