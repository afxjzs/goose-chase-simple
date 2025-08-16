import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import Papa from "papaparse"

export async function POST(req: NextRequest) {
	try {
		const { photoData } = await req.json()

		if (!photoData || !Array.isArray(photoData)) {
			return new NextResponse("Invalid photo data", { status: 400 })
		}

		// Read the current CSV file
		const csvPath = path.join(
			process.cwd(),
			"public",
			"chicago_venues_full_output.csv"
		)
		const csvContent = await fs.readFile(csvPath, "utf-8")

		// Parse the CSV
		const parsed = Papa.parse(csvContent, { header: true })
		const venues = parsed.data as any[]

		// Update venues with photo data
		venues.forEach((venue) => {
			const photoEntry = photoData.find(
				(entry: any) =>
					entry.venue_name === venue.name &&
					entry.venue_address === venue.address
			)

			if (photoEntry) {
				venue.gmaps_place_id = photoEntry.place_id
				venue.gmaps_primary_photo_ref = photoEntry.photo_reference
				venue.gmaps_photo_attribution = "Photo from Google Places API"
			}
		})

		// Convert back to CSV
		const updatedCsv = Papa.unparse(venues)

		// Write the updated CSV back to file
		await fs.writeFile(csvPath, updatedCsv, "utf-8")

		return NextResponse.json({
			success: true,
			message: `Updated ${photoData.length} venues with photo data`,
			updatedCount: photoData.length,
		})
	} catch (error) {
		console.error("Error updating CSV with photos:", error)
		return new NextResponse(`Failed to update CSV: ${error}`, { status: 500 })
	}
}

export async function GET() {
	try {
		// Read the current CSV file to show current photo data
		const csvPath = path.join(
			process.cwd(),
			"public",
			"chicago_venues_full_output.csv"
		)
		const csvContent = await fs.readFile(csvPath, "utf-8")

		// Parse the CSV
		const parsed = Papa.parse(csvContent, { header: true })
		const venues = parsed.data as any[]

		// Count venues with photo data
		const withPhotos = venues.filter(
			(venue) => venue.gmaps_primary_photo_ref
		).length
		const total = venues.length

		return NextResponse.json({
			total,
			withPhotos,
			withoutPhotos: total - withPhotos,
			photoCoverage: Math.round((withPhotos / total) * 100),
		})
	} catch (error) {
		console.error("Error reading CSV photo data:", error)
		return new NextResponse(`Failed to read CSV: ${error}`, { status: 500 })
	}
}
