'use client'

import { Venue } from '@/types/venue'

interface VenueCardProps {
	venue: Venue
	onClick: (venue: Venue) => void
}

export default function VenueCard({ venue, onClick }: VenueCardProps) {
	const parseKeywords = (keywords: string) => {
		try {
			const parsed = JSON.parse(keywords)
			return Array.isArray(parsed) ? parsed.slice(0, 3) : []
		} catch {
			return []
		}
	}

	const keywords = parseKeywords(venue.keywords_tags)
	const rating = venue.google_maps_rating || venue.yelp_rating || venue.tripadvisor_rating

	return (
		<div
			onClick={() => onClick(venue)}
			className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-4 border border-gray-200"
		>
			<div className="flex justify-between items-start mb-2">
				<h3 className="font-semibold text-gray-900 text-lg leading-tight">
					{venue.name}
				</h3>
				{rating && (
					<div className="flex items-center bg-yellow-100 px-2 py-1 rounded-full">
						<span className="text-yellow-600 text-sm font-medium">⭐ {rating}</span>
					</div>
				)}
			</div>

			<p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
				{venue.venue_type}
			</p>

			<p className="text-gray-700 text-sm mb-2">{venue.address}</p>
			<p className="text-gray-600 text-sm mb-3">{venue.neighborhood}</p>

			{venue.general_description && (
				<p className="text-gray-700 text-sm mb-3 line-clamp-2">
					{venue.general_description}
				</p>
			)}

			{keywords.length > 0 && (
				<div className="flex flex-wrap gap-1 mb-3">
					{keywords.map((keyword: string, index: number) => (
						<span
							key={index}
							className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
						>
							{keyword}
						</span>
					))}
				</div>
			)}

			<div className="flex justify-between items-center text-xs text-gray-500">
				<span>Click for details</span>
				{venue.google_maps_rating && (
					<span>Google: {venue.google_maps_rating}</span>
				)}
			</div>
		</div>
	)
}
