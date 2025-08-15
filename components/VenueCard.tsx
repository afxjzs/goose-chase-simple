"use client"

import { Venue } from "@/types/venue"
import { getRatingColor, getRatingBgColor } from "@/lib/utils"

interface VenueCardProps {
	venue: Venue
	onClick: () => void
}

export default function VenueCard({ venue, onClick }: VenueCardProps) {
	// Get the highest available rating
	const getHighestRating = () => {
		const ratings = [
			{ value: venue.google_maps_rating, source: "Google" },
			{ value: venue.yelp_rating, source: "Yelp" },
			{ value: venue.tripadvisor_rating, source: "TripAdvisor" },
		].filter((r) => r.value !== null && r.value !== undefined)

		if (ratings.length === 0) return null

		return ratings.reduce((highest, current) =>
			current.value! > highest.value! ? current : highest
		)
	}

	// Parse and clean keywords
	const getCleanKeywords = () => {
		if (!venue.keywords_tags) return []

		try {
			// Try to parse as JSON first
			const parsed = JSON.parse(venue.keywords_tags)
			if (Array.isArray(parsed)) {
				return parsed.map((k) => k.trim()).filter((k) => k)
			}
		} catch {
			// If not JSON, split by comma and clean
			return venue.keywords_tags
				.split(",")
				.map((k) => k.trim().replace(/[{}"]/g, ""))
				.filter((k) => k)
		}

		return []
	}

	const highestRating = getHighestRating()
	const cleanKeywords = getCleanKeywords()

	return (
		<div
			onClick={onClick}
			className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200 border border-gray-100"
		>
			<div className="flex justify-between items-start mb-2">
				<h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
					{venue.name}
				</h3>
				{highestRating && (
					<div
						className={`flex items-center px-2 py-1 rounded-full text-sm font-medium ${getRatingBgColor(
							highestRating.value!
						)} ${getRatingColor(highestRating.value!)}`}
					>
						⭐ {highestRating.value}
					</div>
				)}
			</div>

			<div className="mb-3">
				<div className="flex items-center gap-2 mb-1">
					<span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
						{venue.venue_type}
					</span>
					<span className="text-sm text-gray-500">•</span>
					<span className="text-sm text-gray-600">{venue.neighborhood}</span>
				</div>
				<p className="text-sm text-gray-700 line-clamp-2">
					{venue.general_description || venue.blog_description}
				</p>
			</div>

			{cleanKeywords.length > 0 && (
				<div className="flex flex-wrap gap-1 mb-3">
					{cleanKeywords.slice(0, 3).map((tag, index) => (
						<span
							key={index}
							className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
						>
							{tag}
						</span>
					))}
					{cleanKeywords.length > 3 && (
						<span className="text-xs text-gray-400 px-2 py-1">
							+{cleanKeywords.length - 3} more
						</span>
					)}
				</div>
			)}

			<div className="text-sm text-gray-500">{venue.address}</div>
		</div>
	)
}
