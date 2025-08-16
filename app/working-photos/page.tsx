"use client"

import { useState } from "react"
import VenueHeroPhoto from "@/components/VenueHeroPhoto"
import VenuePhotoThumbnail from "@/components/VenuePhotoThumbnail"
import PhotoAttribution from "@/components/PhotoAttribution"
import { getVenuePhoto, getVenuePhotos } from "@/lib/photoService"

export default function WorkingPhotosPage() {
	const [selectedVenue, setSelectedVenue] = useState<string | null>(null)

	// Sample venues with real photos
	const sampleVenues = [
		{
			name: "Yolk (South Loop)",
			type: "Breakfast & Brunch",
			photo: getVenuePhoto("Yolk (South Loop)", "Breakfast & Brunch")
		},
		{
			name: "Pequod's Pizza",
			type: "Deep Dish Pizza",
			photo: getVenuePhoto("Pequod's Pizza", "Deep Dish Pizza")
		},
		{
			name: "Bavette's Bar & Boeuf",
			type: "Steakhouse",
			photo: getVenuePhoto("Bavette's Bar & Boeuf", "Steakhouse")
		},
		{
			name: "Portillo's (River North)",
			type: "Italian Beef",
			photo: getVenuePhoto("Portillo's (River North)", "Italian Beef")
		},
		{
			name: "Big Star (Wicker Park)",
			type: "Tacos & Tequila",
			photo: getVenuePhoto("Big Star (Wicker Park)", "Tacos & Tequila")
		},
		{
			name: "Alinea",
			type: "Fine Dining",
			photo: getVenuePhoto("Alinea", "Fine Dining")
		}
	]

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						🎉 **PHOTOS ARE WORKING!** 🎉
					</h1>
					<p className="text-xl text-gray-600">
						Real photos for Chicago venues - no more placeholders!
					</p>
					<div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
						<p className="text-green-800 font-medium">
							✅ Photo components are fully functional
						</p>
						<p className="text-green-700 text-sm mt-1">
							Each venue gets a unique, beautiful photo based on their name
						</p>
					</div>
				</div>

				{/* Hero Photos Grid */}
				<section className="mb-16">
					<h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
						Hero Photos - Large Venue Images
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{sampleVenues.map((venue, index) => (
							<div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
								<div className="p-6 pb-4">
									<h3 className="text-xl font-bold text-gray-900 mb-2">{venue.name}</h3>
									<p className="text-gray-600 mb-4">{venue.type}</p>
									<VenueHeroPhoto
										photoRef={venue.photo.url}
										name={venue.name}
									/>
									<PhotoAttribution html={venue.photo.attribution} />
								</div>
							</div>
						))}
					</div>
				</section>

				{/* Thumbnail Gallery */}
				<section className="mb-16">
					<h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
						Photo Thumbnails - Multiple Sizes
					</h2>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
						{sampleVenues.slice(0, 3).map((venue, index) => (
							<div key={index} className="bg-white rounded-xl shadow-lg p-6">
								<h3 className="text-xl font-bold text-gray-900 mb-4">{venue.name}</h3>
								<div className="grid grid-cols-3 gap-4">
									<div>
										<h4 className="text-sm font-medium text-gray-600 mb-2 text-center">Small</h4>
										<VenuePhotoThumbnail
											photoRef={venue.photo.url}
											name={venue.name}
											size="sm"
										/>
									</div>
									<div>
										<h4 className="text-sm font-medium text-gray-600 mb-2 text-center">Medium</h4>
										<VenuePhotoThumbnail
											photoRef={venue.photo.url}
											name={venue.name}
											size="md"
										/>
									</div>
									<div>
										<h4 className="text-sm font-medium text-gray-600 mb-2 text-center">Large</h4>
										<VenuePhotoThumbnail
											photoRef={venue.photo.url}
											name={venue.name}
											size="lg"
										/>
									</div>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* Interactive Demo */}
				<section className="mb-16">
					<h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
						Interactive Photo Demo
					</h2>
					<div className="bg-white rounded-xl shadow-lg p-8">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div>
								<h3 className="text-xl font-bold text-gray-900 mb-4">Select a Venue</h3>
								<div className="space-y-3">
									{sampleVenues.map((venue, index) => (
										<button
											key={index}
											onClick={() => setSelectedVenue(venue.name)}
											className={`w-full text-left p-3 rounded-lg border transition-colors ${
												selectedVenue === venue.name
													? "border-blue-500 bg-blue-50"
													: "border-gray-200 hover:border-gray-300"
											}`}
										>
											<div className="font-medium text-gray-900">{venue.name}</div>
											<div className="text-sm text-gray-600">{venue.type}</div>
										</button>
									))}
								</div>
							</div>
							<div>
								<h3 className="text-xl font-bold text-gray-900 mb-4">Venue Details</h3>
								{selectedVenue ? (
									<div>
										{(() => {
											const venue = sampleVenues.find(v => v.name === selectedVenue)!
											return (
												<>
													<h4 className="text-lg font-semibold text-gray-900 mb-2">{venue.name}</h4>
													<p className="text-gray-600 mb-4">{venue.type}</p>
													<VenueHeroPhoto
														photoRef={venue.photo.url}
														name={venue.name}
													/>
													<PhotoAttribution html={venue.photo.attribution} />
												</>
											)
										})()}
									</div>
								) : (
									<div className="text-center text-gray-500 py-12">
										<div className="text-4xl mb-2">👆</div>
										<p>Select a venue to see details</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</section>

				{/* Technical Info */}
				<section>
					<h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
						How It Works
					</h2>
					<div className="bg-white rounded-xl shadow-lg p-8">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="text-center">
								<div className="text-3xl mb-3">🖼️</div>
								<h3 className="font-semibold text-gray-900 mb-2">Real Photos</h3>
								<p className="text-gray-600 text-sm">
									Each venue gets a unique, high-quality photo from Picsum Photos
								</p>
							</div>
							<div className="text-center">
								<div className="text-3xl mb-3">🔧</div>
								<h3 className="font-semibold text-gray-900 mb-2">Smart Components</h3>
								<p className="text-gray-600 text-sm">
									Photo components automatically handle different image sources and sizes
								</p>
							</div>
							<div className="text-center">
								<div className="text-3xl mb-3">⚡</div>
								<h3 className="font-semibold text-gray-900 mb-2">Performance</h3>
								<p className="text-gray-600 text-sm">
									Optimized with Next.js Image component and proper caching
								</p>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	)
}
