"use client"

import { useState } from "react"
import VenueHeroPhoto from "@/components/VenueHeroPhoto"
import VenuePhotoThumbnail from "@/components/VenuePhotoThumbnail"
import PhotoAttribution from "@/components/PhotoAttribution"

export default function TestPhotosPage() {
	const [demoMode, setDemoMode] = useState(true)

	const sampleVenues = [
		{
			name: "Yolk (South Loop)",
			photoRef: demoMode ? "demo_photo_1" : "AZose0nXmockPhotoRef123",
			attribution: "© 2024 Google - Sample Photo Attribution",
		},
		{
			name: "Pequod's Pizza",
			photoRef: demoMode ? "demo_photo_2" : "AZose0nXmockPhotoRef456",
			attribution: "© 2024 Google - Sample Photo Attribution",
		},
		{
			name: "Bavette's Bar & Boeuf",
			photoRef: demoMode ? "demo_photo_3" : "AZose0nXmockPhotoRef789",
			attribution: "© 2024 Google - Sample Photo Attribution",
		},
	]

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-6xl mx-auto">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900">
						Photo Components Test
					</h1>
					<div className="flex items-center gap-4">
						<label className="flex items-center gap-2">
							<input
								type="checkbox"
								checked={demoMode}
								onChange={(e) => setDemoMode(e.target.checked)}
								className="rounded"
							/>
							<span className="text-sm font-medium">
								Demo Mode (Working Photos)
							</span>
						</label>
					</div>
				</div>

				{demoMode && (
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
						<div className="flex items-start gap-3">
							<div className="text-blue-600 text-xl">💡</div>
							<div>
								<h3 className="font-semibold text-blue-800 mb-1">
									Demo Mode Active
								</h3>
								<p className="text-blue-700 text-sm">
									This mode simulates working photo components. In production,
									you would use real Google Places photo references. Toggle off
									to see the fallback states with mock references.
								</p>
							</div>
						</div>
					</div>
				)}

				<div className="space-y-12">
					{/* Hero Photo Section */}
					<section>
						<h2 className="text-2xl font-semibold text-gray-800 mb-6">
							Hero Photos
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{sampleVenues.map((venue, index) => (
								<div key={index} className="bg-white rounded-lg shadow-md p-4">
									<h3 className="font-semibold text-lg mb-3">{venue.name}</h3>
									<VenueHeroPhoto photoRef={venue.photoRef} name={venue.name} />
									<PhotoAttribution html={venue.attribution} />
								</div>
							))}
						</div>
					</section>

					{/* Thumbnail Section */}
					<section>
						<h2 className="text-2xl font-semibold text-gray-800 mb-6">
							Photo Thumbnails
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{sampleVenues.map((venue, index) => (
								<div key={index} className="bg-white rounded-lg shadow-md p-4">
									<h3 className="font-semibold text-lg mb-3">{venue.name}</h3>
									<div className="space-y-4">
										<div>
											<h4 className="text-sm font-medium text-gray-600 mb-2">
												Small
											</h4>
											<VenuePhotoThumbnail
												photoRef={venue.photoRef}
												name={venue.name}
												size="sm"
											/>
										</div>
										<div>
											<h4 className="text-sm font-medium text-gray-600 mb-2">
												Medium
											</h4>
											<VenuePhotoThumbnail
												photoRef={venue.photoRef}
												name={venue.name}
												size="md"
											/>
										</div>
										<div>
											<h4 className="text-sm font-medium text-gray-600 mb-2">
												Large
											</h4>
											<VenuePhotoThumbnail
												photoRef={venue.photoRef}
												name={venue.name}
												size="lg"
											/>
										</div>
									</div>
								</div>
							))}
						</div>
					</section>

					{/* No Photo Section */}
					<section>
						<h2 className="text-2xl font-semibold text-gray-800 mb-6">
							No Photo Fallbacks
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							<div className="bg-white rounded-lg shadow-md p-4">
								<h3 className="font-semibold text-lg mb-3">
									Venue Without Photo
								</h3>
								<VenueHeroPhoto
									photoRef={undefined}
									name="Venue Without Photo"
								/>
							</div>
							<div className="bg-white rounded-lg shadow-md p-4">
								<h3 className="font-semibold text-lg mb-3">Small Thumbnail</h3>
								<VenuePhotoThumbnail
									photoRef={undefined}
									name="Venue Without Photo"
									size="sm"
								/>
							</div>
						</div>
					</section>

					{/* API Test Section */}
					<section>
						<h2 className="text-2xl font-semibold text-gray-800 mb-6">
							Photo API Test
						</h2>
						<div className="bg-white rounded-lg shadow-md p-6">
							<p className="text-gray-600 mb-4">
								Test the photo API endpoint with different parameters:
							</p>
							<div className="space-y-2 text-sm">
								<div>
									<strong>Valid request:</strong>{" "}
									<code className="bg-gray-100 px-2 py-1 rounded">
										/api/photo?ref=AZose0nXmockPhotoRef123&w=200&h=150
									</code>
								</div>
								<div>
									<strong>Missing ref:</strong>{" "}
									<code className="bg-gray-100 px-2 py-1 rounded">
										/api/photo?w=200&h=150
									</code>
								</div>
								<div>
									<strong>Invalid ref:</strong>{" "}
									<code className="bg-gray-100 px-2 py-1 rounded">
										/api/photo?ref=invalid&w=200&h=150
									</code>
								</div>
							</div>
							<div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
								<p className="text-yellow-800 text-sm">
									<strong>Note:</strong> The mock photo references will fail
									because they're not real Google Places photo references. In
									production, you would use actual photo references from the
									Google Places API.
								</p>
							</div>
						</div>
					</section>
				</div>
			</div>
		</div>
	)
}
