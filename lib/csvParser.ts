import Papa from "papaparse"
import { Venue } from "@/types/venue"
import { PhotoCache } from "./photoCache"

export async function loadVenuesFromCSV(): Promise<Venue[]> {
	try {
		console.log("Fetching CSV file from /chicago_venues_full_output.csv...")
		const response = await fetch("/chicago_venues_full_output.csv")

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const csvText = await response.text()
		if (!csvText || csvText.length === 0) {
			throw new Error("CSV text is empty")
		}

		console.log("Parsing CSV...")
		const parsedVenues = await parseVenuesCSV(csvText)
		console.log(`Parsed ${parsedVenues.length} venues`)

		return parsedVenues
	} catch (error) {
		console.error("Error loading venues from CSV:", error)
		throw error
	}
}

export async function parseVenuesCSV(csvText: string): Promise<Venue[]> {
	return new Promise((resolve, reject) => {
		Papa.parse(csvText, {
			header: true,
			skipEmptyLines: true,
			complete: (results) => {
				try {
					console.log("CSV parsing results:", results.data.slice(0, 3))

					const photoCache = PhotoCache.getInstance()

					const venues = results.data.map((row: any, index: number) => {
						console.log(`Processing row ${index}:`, row.name)

						// Find coordinates by looking for the pattern "lat,lng" in any field
						let coordinates = ""
						for (const [key, value] of Object.entries(row)) {
							if (
								typeof value === "string" &&
								value.includes(",") &&
								value.match(/^-?\d+\.\d+,-?\d+\.\d+/)
							) {
								coordinates = value
								console.log(`Found coordinates for ${row.name}: ${coordinates}`)
								break
							}
						}

						// Check if we have cached photo data
						let placeId = undefined
						let photoRef = undefined
						let photoAttribution = undefined

						if (row.gmaps_place_id && row.gmaps_primary_photo_ref) {
							// Use cached photo data from CSV
							placeId = row.gmaps_place_id
							photoRef = row.gmaps_primary_photo_ref
							photoAttribution =
								row.gmaps_photo_attribution || "Photo from Google Places API"

							// Add to cache for quick access
							photoCache.cachePhoto(row.name, row.address, placeId, photoRef)

							console.log(`Using cached photo for ${row.name}`)
						} else {
							// No cached data - will be fetched on-demand by photo components
							console.log(
								`No cached photo for ${row.name} - will fetch on-demand`
							)
						}

						const venue: Venue = {
							name: row.name || "",
							venue_type: row.venue_type || "",
							address: row.address || "",
							neighborhood: row.neighborhood || "",
							google_maps_url: row.google_maps_url || "",
							coordinates: coordinates,
							blog_description: row.blog_description || "",
							general_description: row.general_description || "",
							keywords_tags: row.keywords_tags || "",
							yelp_rating: row.yelp_rating ? parseFloat(row.yelp_rating) : null,
							google_maps_rating: row.google_maps_rating
								? parseFloat(row.google_maps_rating)
								: null,
							tripadvisor_rating: row.tripadvisor_rating
								? parseFloat(row.tripadvisor_rating)
								: null,
							yelp_url: row.yelp_url || "",
							tripadvisor_url: row.tripadvisor_url || "",
							yelp_reviews_count: row.yelp_reviews_count
								? parseInt(row.yelp_reviews_count)
								: null,
							google_maps_reviews_count: row.google_maps_reviews_count
								? parseInt(row.google_maps_reviews_count)
								: null,
							tripadvisor_reviews_count: row.tripadvisor_reviews_count
								? parseInt(row.tripadvisor_reviews_count)
								: null,
							processed_at: row.processed_at || "",
							// Photo fields from cache or undefined for on-demand fetching
							gmaps_place_id: placeId,
							gmaps_primary_photo_ref: photoRef,
							gmaps_photo_attribution: photoAttribution,
						}

						console.log(
							`Created venue: ${venue.name} with coords: ${
								venue.coordinates
							} and photo: ${photoRef ? "CACHED" : "ON-DEMAND"}`
						)
						return venue
					})

					// Filter out venues with invalid coordinates
					const validVenues = venues.filter((venue) => {
						if (!venue.coordinates) {
							console.warn(`Venue ${venue.name} has no coordinates`)
							return false
						}

						const [lat, lng] = venue.coordinates.split(",")
						const latNum = parseFloat(lat)
						const lngNum = parseFloat(lng)

						if (isNaN(latNum) || isNaN(lngNum)) {
							console.warn(
								`Venue ${venue.name} has invalid coordinates: ${venue.coordinates}`
							)
							return false
						}

						return true
					})

					console.log(
						`Found ${validVenues.length} venues with valid coordinates`
					)
					resolve(validVenues)
				} catch (error: any) {
					console.error("Error parsing CSV:", error)
					reject(error)
				}
			},
			error: (error: any) => {
				console.error("CSV parsing error:", error)
				reject(error)
			},
		})
	})
}
