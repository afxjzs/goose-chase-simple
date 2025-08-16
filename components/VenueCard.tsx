"use client"

import { Venue } from "@/types/venue"
import { getRatingColor, getRatingBgColor } from "@/lib/utils"
import VenuePhotoThumbnail from "./VenuePhotoThumbnail"

interface VenueCardProps {
	venue: Venue
	onClick: () => void
	isCompact?: boolean
}

export default function VenueCard({
	venue,
	onClick,
	isCompact = false,
}: VenueCardProps) {
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
				className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs ${getRatingBgColor(
					rating
				)}`}
			>
				<span className={`font-semibold ${getRatingColor(rating)}`}>
					⭐ {rating}
				</span>
				<span className="text-text-muted">({source})</span>
			</div>
		)
	}

	return (
		<div
			onClick={onClick}
			className={`bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 max-w-sm mx-auto w-full ${
				isCompact ? "hover:-translate-y-0.5" : "hover:-translate-y-1"
			}`}
		>
			{/* Photo */}
			<div className="w-full">
				<VenuePhotoThumbnail
					venueName={venue.name}
					venueType={venue.venue_type}
					neighborhood={venue.neighborhood}
					size={isCompact ? "md" : "lg"}
					className="w-full"
					cachedPhotoRef={venue.gmaps_primary_photo_ref}
				/>
			</div>

			{/* Content */}
			<div className={`${isCompact ? "p-3" : "p-4"}`}>
				{/* Header */}
				<div className={`mb-3 ${isCompact ? "mb-2" : "mb-3"}`}>
					<h3
						className={`font-cardo font-bold text-text-primary line-clamp-2 ${
							isCompact ? "text-lg" : "text-xl"
						} mb-2`}
					>
						{venue.name}
					</h3>
					<div className="flex items-center gap-2 mb-2">
						<span
							className={`px-2 py-1 bg-primary text-white rounded-full font-medium font-sans ${
								isCompact ? "text-xs" : "text-xs"
							}`}
						>
							{venue.venue_type}
						</span>
						{venue.neighborhood && (
							<>
								<span className="text-text-muted">•</span>
								<span
									className={`text-text-secondary font-sans ${
										isCompact ? "text-xs" : "text-sm"
									}`}
								>
									{venue.neighborhood}
								</span>
							</>
						)}
					</div>
					<p
						className={`text-text-muted font-sans line-clamp-1 ${
							isCompact ? "text-xs" : "text-sm"
						}`}
					>
						{venue.address}
					</p>
				</div>

				{/* Ratings */}
				<div
					className={`flex flex-wrap gap-2 mb-3 ${isCompact ? "mb-2" : "mb-3"}`}
				>
					{renderRating(venue.yelp_rating, "Yelp")}
					{renderRating(venue.google_maps_rating, "Google")}
					{renderRating(venue.tripadvisor_rating, "TripAdvisor")}
				</div>

				{/* Keywords - Only show in non-compact mode */}
				{!isCompact && keywords.length > 0 && (
					<div className="mb-3">
						<div className="flex flex-wrap gap-1">
							{keywords.slice(0, 4).map((keyword, index) => (
								<span
									key={index}
									className="px-2 py-1 bg-accent-nonphoto text-text-primary rounded-md text-xs font-sans"
								>
									{keyword}
								</span>
							))}
							{keywords.length > 4 && (
								<span className="px-2 py-1 bg-accent-tiffany text-white rounded-md text-xs font-sans">
									+{keywords.length - 4} more
								</span>
							)}
						</div>
					</div>
				)}

				{/* Description - Only show in non-compact mode */}
				{!isCompact && venue.blog_description && (
					<p className="text-sm text-text-secondary font-sans line-clamp-2">
						{venue.blog_description}
					</p>
				)}
			</div>
		</div>
	)
}
