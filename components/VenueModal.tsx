"use client"

import { Venue } from "@/types/venue"
import { getRatingColor, getRatingBgColor } from "@/lib/utils"
import VenueHeroPhoto from "./VenueHeroPhoto"
import PhotoAttribution from "./PhotoAttribution"

interface VenueModalProps {
	venue: Venue | null
	isOpen: boolean
	onClose: () => void
}

export default function VenueModal({
	venue,
	isOpen,
	onClose,
}: VenueModalProps) {
	if (!isOpen || !venue) return null

	const handleBackdropClick = (e: React.MouseEvent) => {
		// Only close if clicking the backdrop, not the modal content
		if (e.target === e.currentTarget) {
			onClose()
		}
	}

	const parseKeywords = (keywords: string) => {
		try {
			const parsed = JSON.parse(keywords)
			if (Array.isArray(parsed)) {
				return parsed.map((k) => k.trim()).filter((k) => k)
			}
		} catch {
			// If not JSON, split by comma and clean
			return keywords
				.split(",")
				.map((k) => k.trim().replace(/[{}"]/g, ""))
				.filter((k) => k)
		}
		return []
	}

	const keywords = parseKeywords(venue.keywords_tags)

	const renderRating = (rating: number | null, source: string) => {
		if (!rating) return null

		return (
			<div
				className={`flex items-center gap-2 px-3 py-2 rounded-lg ${getRatingBgColor(
					rating
				)}`}
			>
				<span className={`font-semibold ${getRatingColor(rating)}`}>
					⭐ {rating}
				</span>
				<span className="text-sm text-gray-600">({source})</span>
			</div>
		)
	}

	return (
		<div
			className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
			onClick={handleBackdropClick}
		>
			<div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="flex justify-between items-start p-6 border-b border-gray-200">
					<div className="flex-1">
						<h2 className="text-2xl font-bold text-gray-900 mb-2">
							{venue.name}
						</h2>
						<div className="flex items-center gap-3 mb-2">
							<span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
								{venue.venue_type}
							</span>
							<span className="text-gray-500">•</span>
							<span className="text-gray-600">{venue.neighborhood}</span>
						</div>
						<p className="text-gray-700">{venue.address}</p>
					</div>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 text-2xl font-bold ml-4"
					>
						×
					</button>
				</div>

				{/* Hero Photo */}
				<div className="p-6 pb-4">
					<VenueHeroPhoto
						venueName={venue.name}
						venueType={venue.venue_type}
						neighborhood={venue.neighborhood}
						cachedPhotoRef={venue.gmaps_primary_photo_ref}
					/>
					<PhotoAttribution
						html={
							venue.gmaps_photo_attribution || "Photo from Google Places API"
						}
					/>
				</div>

				{/* Content */}
				<div className="p-6 space-y-6">
					{/* Ratings Section */}
					{(venue.google_maps_rating ||
						venue.yelp_rating ||
						venue.tripadvisor_rating) && (
						<div>
							<h3 className="text-lg font-semibold text-gray-900 mb-3">
								Ratings
							</h3>
							<div className="flex flex-wrap gap-3">
								{renderRating(venue.google_maps_rating, "Google Maps")}
								{renderRating(venue.yelp_rating, "Yelp")}
								{renderRating(venue.tripadvisor_rating, "TripAdvisor")}
							</div>
						</div>
					)}

					{/* Description Section */}
					{(venue.blog_description || venue.general_description) && (
						<div>
							<h3 className="text-lg font-semibold text-gray-900 mb-3">
								Description
							</h3>
							<div className="space-y-3">
								{venue.blog_description && (
									<div>
										<h4 className="font-medium text-gray-800 mb-2">
											Blog Description
										</h4>
										<p className="text-gray-700 leading-relaxed">
											{venue.blog_description}
										</p>
									</div>
								)}
								{venue.general_description && (
									<div>
										<h4 className="font-medium text-gray-800 mb-2">
											General Description
										</h4>
										<p className="text-gray-700 leading-relaxed">
											{venue.general_description}
										</p>
									</div>
								)}
							</div>
						</div>
					)}

					{/* Keywords Section */}
					{keywords.length > 0 && (
						<div>
							<h3 className="text-lg font-semibold text-gray-900 mb-3">
								Keywords & Tags
							</h3>
							<div className="flex flex-wrap gap-2">
								{keywords.map((keyword, index) => (
									<span
										key={index}
										className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
									>
										{keyword}
									</span>
								))}
							</div>
						</div>
					)}

					{/* Links Section */}
					{(venue.google_maps_url ||
						venue.yelp_url ||
						venue.tripadvisor_url) && (
						<div>
							<h3 className="text-lg font-semibold text-gray-900 mb-3">
								Links
							</h3>
							<div className="flex flex-wrap gap-3">
								{venue.google_maps_url && (
									<a
										href={venue.google_maps_url}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
									>
										📍 Google Maps
									</a>
								)}
								{venue.yelp_url && (
									<a
										href={venue.yelp_url}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
									>
										⭐ Yelp
									</a>
								)}
								{venue.tripadvisor_url && (
									<a
										href={venue.tripadvisor_url}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
									>
										🌍 TripAdvisor
									</a>
								)}
							</div>
						</div>
					)}

					{/* Additional Info */}
					<div className="text-sm text-gray-500 pt-4 border-t border-gray-200">
						<p>Last updated: {venue.processed_at}</p>
					</div>
				</div>
			</div>
		</div>
	)
}
