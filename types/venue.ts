export interface Venue {
	name: string
	venue_type: string
	address: string
	neighborhood: string
	google_maps_url: string
	coordinates: string
	blog_description: string
	general_description: string
	keywords_tags: string
	yelp_rating: number | null
	google_maps_rating: number | null
	tripadvisor_rating: number | null
	yelp_url: string
	tripadvisor_url: string
	yelp_reviews_count: number | null
	google_maps_reviews_count: number | null
	tripadvisor_reviews_count: number | null
	processed_at: string
}

export interface VenueModalProps {
	venue: Venue | null
	isOpen: boolean
	onClose: () => void
}
