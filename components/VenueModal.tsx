'use client'

import { Venue } from '@/types/venue'
import { getRatingColor, getRatingBgColor } from '@/lib/utils'

interface VenueModalProps {
	venue: Venue | null
	isOpen: boolean
	onClose: () => void
}

export default function VenueModal({ venue, isOpen, onClose }: VenueModalProps) {
	if (!isOpen || !venue) return null

	const parseKeywords = (keywords: string) => {
		try {
			const parsed = JSON.parse(keywords)
			return Array.isArray(parsed) ? parsed : []
		} catch {
			return keywords.split(',').map(k => k.trim())
		}
	}

	const keywords = parseKeywords(venue.keywords_tags)

	const renderRating = (rating: number | null, source: string) => {
		if (!rating) return null
		
		return (
			<div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${getRatingBgColor(rating)}`}>
				<span className={`font-semibold ${getRatingColor(rating)}`}>⭐ {rating}</span>
				<span className="text-sm text-gray-600">({source})</span>
			</div>
		)
	}

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="flex justify-between items-start p-6 border-b border-gray-200">
					<div className="flex-1">
						<h2 className="text-2xl font-bold text-gray-900 mb-2">{venue.name}</h2>
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

				{/* Content */}
				<div className="p-6 space-y-6">
					{/* Ratings Section */}
					{(venue.google_maps_rating || venue.yelp_rating || venue.tripadvisor_rating) && (
						<div>
							<h3 className="text-lg font-semibold text-gray-900 mb-3">Ratings</h3>
							<div className="flex flex-wrap gap-3">
								{renderRating(venue.google_maps_rating, 'Google Maps')}
								{renderRating(venue.yelp_rating, 'Yelp')}
								{renderRating(venue.tripadvisor_rating, 'TripAdvisor')}
							</div>
						</div>
					)}

					{/* Description */}
					{venue.general_description && (
						<div>
							<h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
							<p className="text-gray-700 leading-relaxed">{venue.general_description}</p>
						</div>
					)}

					{venue.blog_description && venue.blog_description !== venue.general_description && (
						<div>
							<h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Info</h3>
							<p className="text-gray-700 leading-relaxed">{venue.blog_description}</p>
						</div>
					)}

					{/* Keywords/Tags */}
					{keywords.length > 0 && (
						<div>
							<h3 className="text-lg font-semibold text-gray-900 mb-3">Keywords & Tags</h3>
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

					{/* Links */}
					<div>
						<h3 className="text-lg font-semibold text-gray-900 mb-3">Links</h3>
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
				</div>

				{/* Footer */}
				<div className="p-6 border-t border-gray-200 flex justify-end">
					<button
						onClick={onClose}
						className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	)
}
