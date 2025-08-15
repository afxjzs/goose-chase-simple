import Papa from "papaparse"
import { Venue } from "@/types/venue"

export async function parseVenuesCSV(csvText: string): Promise<Venue[]> {
	return new Promise((resolve, reject) => {
		Papa.parse(csvText, {
			header: true,
			skipEmptyLines: true,
			complete: (results) => {
				try {
					console.log("CSV parsing results:", results.data.slice(0, 3))

					const venues = results.data.map((row: any) => {
						// Find coordinates by looking for the pattern "lat,lng" in any field
						let coordinates = ""
						for (const [key, value] of Object.entries(row)) {
							if (
								typeof value === "string" &&
								value.includes(",") &&
								value.match(/^-?\d+\.\d+,-?\d+\.\d+/)
							) {
								coordinates = value
								break
							}
						}

						return {
							name: row.name || "",
							venue_type: row.venue_type || "",
							address: row.address || "",
							neighborhood: row.neighborhood || "",
							google_maps_url: row.google_maps_url || "",
							coordinates: coordinates,
							blog_description: row.blog_description || "",
							general_description: row.general_description || "",
							keywords_tags: row.keywords_tags || "[]",
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
						}
					})

					// Filter out venues with invalid coordinates
					const validVenues = venues.filter((venue) => {
						if (!venue.coordinates) {
							console.log(`No coordinates for ${venue.name}`)
							return false
						}
						const cleanCoords = venue.coordinates.replace(/"/g, "").trim()
						const [lat, lng] = cleanCoords
							.split(",")
							.map((coord) => parseFloat(coord.trim()))
						const isValid = !isNaN(lat) && !isNaN(lng)
						if (!isValid) {
							console.log(
								`Invalid coordinates for ${venue.name}: ${venue.coordinates}`
							)
						}
						return isValid
					})

					console.log(
						`Parsed ${venues.length} total venues, ${validVenues.length} with valid coordinates`
					)
					resolve(validVenues)
				} catch (error) {
					reject(error)
				}
			},
			error: (error: any) => {
				reject(error)
			},
		})
	})
}
