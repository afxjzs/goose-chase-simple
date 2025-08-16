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
				<span className="text-base text-text-muted font-sans">({source})</span>
			</div>
		)
	}

	return (
		<div
			className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
			onClick={handleBackdropClick}
		>
			<div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="flex justify-between items-start p-6 border-b border-gray-200">
					<div className="flex-1">
						<h2 className="font-cardo text-3xl font-bold text-text-primary mb-3">
							{venue.name}
						</h2>
						<div className="flex items-center gap-3 mb-3">
							<span className="px-3 py-1 bg-primary text-white rounded-full text-base font-medium font-sans">
								{venue.venue_type}
							</span>
							<span className="text-text-muted">•</span>
							<span className="text-text-secondary font-sans text-base">
								{venue.neighborhood}
							</span>
						</div>
						<p className="text-text-secondary font-sans text-base">
							{venue.address}
						</p>
					</div>
					<button
						onClick={onClose}
						className="text-text-muted hover:text-text-primary text-3xl font-bold ml-4 transition-colors"
					>
						×
					</button>
				</div>

				{/* Content Layout - Side by Side */}
				<div className="flex flex-col lg:flex-row">
					{/* Left Side - Photo and Basic Info */}
					<div className="lg:w-1/3 p-6 border-r border-gray-200">
						{/* Hero Photo */}
						<div className="mb-6">
							<VenueHeroPhoto
								venueName={venue.name}
								venueType={venue.venue_type}
								neighborhood={venue.neighborhood}
								cachedPhotoRef={venue.gmaps_primary_photo_ref}
							/>
						</div>

						{/* Photo Attribution */}
						{venue.gmaps_photo_attribution && (
							<div className="mb-6">
								<PhotoAttribution html={venue.gmaps_photo_attribution} />
							</div>
						)}

						{/* Ratings */}
						<div className="mb-6">
							<h3 className="font-cardo text-xl font-bold text-text-primary mb-3">
								Ratings
							</h3>
							<div className="space-y-2">
								{renderRating(venue.yelp_rating, "Yelp")}
								{renderRating(venue.google_maps_rating, "Google Maps")}
								{renderRating(venue.tripadvisor_rating, "TripAdvisor")}
							</div>
						</div>

						{/* Links */}
						<div className="space-y-2">
							{venue.google_maps_url && (
								<a
									href={venue.google_maps_url}
									target="_blank"
									rel="noopener noreferrer"
									className="block w-full px-4 py-3 bg-primary text-white text-center rounded-lg hover:bg-primary-dark transition-colors font-sans text-base"
								>
									📍 View on Google Maps
								</a>
							)}
							{venue.yelp_url && (
								<a
									href={venue.yelp_url}
									target="_blank"
									rel="noopener noreferrer"
									className="block w-full px-4 py-3 bg-accent-celadon text-text-primary text-center rounded-lg hover:bg-accent-celadon/80 transition-colors font-sans text-base"
								>
									🍽️ View on Yelp
								</a>
							)}
							{venue.tripadvisor_url && (
								<a
									href={venue.tripadvisor_url}
									target="_blank"
									rel="noopener noreferrer"
									className="block w-full px-4 py-3 bg-accent-tiffany text-white text-center rounded-lg hover:bg-accent-tiffany/80 transition-colors font-sans text-base"
								>
									🌍 View on TripAdvisor
								</a>
							)}
						</div>
					</div>

					{/* Right Side - Descriptions and Details */}
					<div className="lg:w-2/3 p-6">
						{/* Blog Description */}
						{venue.blog_description && (
							<div className="mb-6">
								<h3 className="font-cardo text-xl font-bold text-text-primary mb-3">
									About This Venue
								</h3>
								<p className="text-text-secondary font-sans text-base leading-relaxed">
									{venue.blog_description}
								</p>
							</div>
						)}

						{/* General Description */}
						{venue.general_description && (
							<div className="mb-6">
								<h3 className="font-cardo text-xl font-bold text-text-primary mb-3">
									Description
								</h3>
								<p className="text-text-secondary font-sans text-base leading-relaxed">
									{venue.general_description}
								</p>
							</div>
						)}

						{/* Keywords & Tags */}
						{keywords.length > 0 && (
							<div className="mb-6">
								<h3 className="font-cardo text-xl font-bold text-text-primary mb-3">
									Keywords & Tags
								</h3>
								<div className="flex flex-wrap gap-2">
									{keywords.map((keyword, index) => (
										<span
											key={index}
											className="px-3 py-2 bg-accent-nonphoto text-text-primary rounded-lg font-sans text-base"
										>
											{keyword}
										</span>
									))}
								</div>
							</div>
						)}

						{/* Additional Info */}
						<div className="space-y-3">
							<h3 className="font-cardo text-xl font-bold text-text-primary mb-3">
								Additional Information
							</h3>

							{venue.yelp_reviews_count && (
								<div className="flex justify-between items-center py-2 border-b border-gray-100">
									<span className="font-sans text-text-secondary text-base">
										Yelp Reviews
									</span>
									<span className="font-sans font-medium text-text-primary text-base">
										{venue.yelp_reviews_count.toLocaleString()}
									</span>
								</div>
							)}

							{venue.google_maps_reviews_count && (
								<div className="flex justify-between items-center py-2 border-b border-gray-100">
									<span className="font-sans text-text-secondary text-base">
										Google Reviews
									</span>
									<span className="font-sans font-medium text-text-primary text-base">
										{venue.google_maps_reviews_count.toLocaleString()}
									</span>
								</div>
							)}

							{venue.tripadvisor_reviews_count && (
								<div className="flex justify-between items-center py-2 border-b border-gray-100">
									<span className="font-sans text-text-secondary text-base">
										TripAdvisor Reviews
									</span>
									<span className="font-sans font-medium text-text-primary text-base">
										{venue.tripadvisor_reviews_count.toLocaleString()}
									</span>
								</div>
							)}

							{venue.processed_at && (
								<div className="flex justify-between items-center py-2">
									<span className="font-sans text-text-secondary text-base">
										Last Updated
									</span>
									<span className="font-sans font-medium text-text-primary text-base">
										{new Date(venue.processed_at).toLocaleDateString()}
									</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
