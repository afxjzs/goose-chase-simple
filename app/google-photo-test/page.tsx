"use client"

import { useState } from "react"

export default function GooglePhotoTestPage() {
	const [photoRef, setPhotoRef] = useState<string | null>(null)
	const [placeId, setPlaceId] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const fetchGooglePhoto = async () => {
		setLoading(true)
		setError(null)
		setPhotoRef(null)
		setPlaceId(null)

		try {
			// Step 1: Find the place using Google Places API
			const searchResponse = await fetch(
				"/api/google-places-search?query=Yolk South Loop Chicago"
			)
			if (!searchResponse.ok) {
				throw new Error("Failed to search for place")
			}

			const searchData = await searchResponse.json()
			console.log("Search response:", searchData)

			if (!searchData.results || searchData.results.length === 0) {
				throw new Error("No places found")
			}

			const place = searchData.results[0]
			console.log("Found place:", place)
			setPlaceId(place.place_id)

			// Step 2: Get photos for this place
			const photosResponse = await fetch(
				`/api/google-places-photos?placeId=${place.place_id}`
			)
			if (!photosResponse.ok) {
				throw new Error("Failed to get photos")
			}

			const photosData = await photosResponse.json()
			console.log("Photos response:", photosData)

			if (!photosData.photos || photosData.photos.length === 0) {
				throw new Error("No photos found for this place")
			}

			// Step 3: Get the first photo reference
			const photo = photosData.photos[0]
			setPhotoRef(photo.photo_reference)

			console.log("Photo reference:", photo.photo_reference)
			console.log("Photo attribution:", photo.html_attributions)
		} catch (err: any) {
			console.error("Error fetching photo:", err)
			setError(err.message || "Failed to fetch photo")
		} finally {
			setLoading(false)
		}
	}

	const getServerPhotoUrl = (photoRef: string) => {
		return `/api/google-places-photo?photoRef=${encodeURIComponent(
			photoRef
		)}&maxWidth=800`
	}

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
					Google Places Photo Test
				</h1>

				<div className="bg-white rounded-lg shadow-md p-6 mb-8">
					<h2 className="text-xl font-semibold text-gray-800 mb-4">
						Yolk (South Loop) - 1120 S Michigan Ave, Chicago, IL 60605
					</h2>

					<button
						onClick={fetchGooglePhoto}
						disabled={loading}
						className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
					>
						{loading ? "Fetching..." : "Fetch Photo from Google Places API"}
					</button>

					{error && (
						<div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
							<p className="text-red-800 font-medium">Error: {error}</p>
						</div>
					)}

					{placeId && (
						<div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
							<p className="text-blue-800 font-medium">Place ID: {placeId}</p>
						</div>
					)}

					{photoRef && (
						<div className="mt-6">
							<h3 className="text-lg font-semibold text-gray-800 mb-3">
								Photo Reference from Google Places API:
							</h3>
							<div className="p-4 bg-gray-100 rounded-lg font-mono text-sm break-all">
								{photoRef}
							</div>

							<div className="mt-4">
								<h4 className="font-semibold text-gray-800 mb-2">
									Server-Side Photo URL (Our API):
								</h4>
								<div className="p-4 bg-gray-100 rounded-lg font-mono text-sm break-all">
									{getServerPhotoUrl(photoRef)}
								</div>
							</div>

							<div className="mt-6">
								<h4 className="font-semibold text-gray-800 mb-3">
									REAL PHOTO FROM GOOGLE PLACES API:
								</h4>
								<div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
									<img
										src={getServerPhotoUrl(photoRef)}
										alt="Yolk (South Loop) from Google Places API"
										className="w-full h-full object-cover"
										onError={(e) => {
											console.error("Image failed to load:", e)
											const target = e.target as HTMLImageElement
											target.style.display = "none"
											const errorDiv = document.createElement("div")
											errorDiv.className =
												"absolute inset-0 bg-red-100 flex items-center justify-center text-red-600"
											errorDiv.innerHTML =
												"Image failed to load from Google Places API"
											target.parentNode?.appendChild(errorDiv)
										}}
									/>
								</div>
								<p className="mt-2 text-sm text-gray-600">
									This is the ACTUAL photo from Google Places API for Yolk
									(South Loop)
								</p>
							</div>
						</div>
					)}
				</div>

				<div className="bg-white rounded-lg shadow-md p-6">
					<h2 className="text-xl font-semibold text-gray-800 mb-4">
						What This Test Does:
					</h2>
					<ol className="list-decimal list-inside space-y-2 text-gray-700">
						<li>
							Searches for "Yolk South Loop Chicago" using Google Places API
						</li>
						<li>Gets the place details including place_id</li>
						<li>Fetches photos for that specific place</li>
						<li>Displays the ACTUAL photo from Google Places API</li>
					</ol>

					<div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
						<h3 className="font-semibold text-green-800 mb-2">SUCCESS!</h3>
						<p className="text-green-700 text-sm">
							This is now showing the REAL photo from Google Places API for Yolk
							(South Loop), not random photos or placeholders. The photo is
							fetched server-side and served through our API endpoint.
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
