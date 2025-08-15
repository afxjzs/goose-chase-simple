'use client'

import { VenueModalProps } from '@/types/venue'

export default function VenueModal({ venue, isOpen, onClose }: VenueModalProps) {
	if (!isOpen || !venue) return null

	const parseKeywords = (keywords: string) => {
		try {
			const parsed = JSON.parse(keywords)
			return Array.isArray(parsed) ? parsed : []
		} catch {
			return []
		}
	}

	const keywords = parseKeywords(venue.keywords_tags)

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
				<div className="p-6">
					<div className="flex justify-between items-start mb-4">
						<h2 className="text-2xl font-bold text-gray-900">{venue.name}</h2>
						<button
							onClick={onClose}
							className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
						>
							×
						</button>
					</div>

					<div className="space-y-4">
						<div>
							<p className="text-sm text-gray-500 uppercase tracking-wide">
								{venue.venue_type}
							</p>
							<p className="text-gray-700">{venue.address}</p>
							<p className="text-gray-600">{venue.neighborhood}</p>
						</div>

						{venue.general_description && (
							<div>
								<h3 className="font-semibold text-gray-900 mb-2">Description</h3>
								<p className="text-gray-700">{venue.general_description}</p>
							</div>
						)}

						{venue.blog_description && (
							<div>
								<h3 className="font-semibold text-gray-900 mb-2">Blog Description</h3>
								<p className="text-gray-700">{venue.blog_description}</p>
							</div>
						)}

						{keywords.length > 0 && (
							<div>
								<h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
								<div className="flex flex-wrap gap-2">
									{keywords.map((keyword: string, index: number) => (
										<span
											key={index}
											className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
										>
											{keyword}
										</span>
									))}
								</div>
							</div>
						)}

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{venue.yelp_rating && (
								<div className="text-center p-3 bg-gray-50 rounded-lg">
									<p className="text-sm text-gray-600">Yelp</p>
									<p className="text-2xl font-bold text-yellow-500">
										{venue.yelp_rating}
									</p>
									{venue.yelp_reviews_count && (
										<p className="text-xs text-gray-500">
											{venue.yelp_reviews_count} reviews
										</p>
									)}
								</div>
							)}

							{venue.google_maps_rating && (
								<div className="text-center p-3 bg-gray-50 rounded-lg">
									<p className="text-sm text-gray-600">Google</p>
									<p className="text-2xl font-bold text-blue-500">
										{venue.google_maps_rating}
									</p>
									{venue.google_maps_reviews_count && (
										<p className="text-xs text-gray-500">
											{venue.google_maps_reviews_count} reviews
										</p>
									)}
								</div>
							)}

							{venue.tripadvisor_rating && (
								<div className="text-center p-3 bg-gray-50 rounded-lg">
									<p className="text-sm text-gray-600">TripAdvisor</p>
									<p className="text-2xl font-bold text-green-500">
										{venue.tripadvisor_rating}
									</p>
									{venue.tripadvisor_reviews_count && (
										<p className="text-xs text-gray-500">
											{venue.tripadvisor_reviews_count} reviews
										</p>
									)}
								</div>
							)}
						</div>

						<div className="flex gap-2 pt-4">
							{venue.google_maps_url && (
								<a
									href={venue.google_maps_url}
									target="_blank"
									rel="noopener noreferrer"
									className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
								>
									View on Google Maps
								</a>
							)}
							{venue.yelp_url && (
								<a
									href={venue.yelp_url}
									target="_blank"
									rel="noopener noreferrer"
									className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
								>
									View on Yelp
								</a>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
