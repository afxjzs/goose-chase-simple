import { Venue } from "@/types/venue"

export interface CachedPhotoData {
	place_id: string
	photo_reference: string
	photo_url: string
	last_updated: string
}

export interface PhotoCacheEntry {
	venue_name: string
	venue_address: string
	place_id: string
	photo_reference: string
	photo_url: string
	last_updated: string
}

export class PhotoCache {
	private static instance: PhotoCache
	private cache: Map<string, PhotoCacheEntry> = new Map()

	private constructor() {}

	static getInstance(): PhotoCache {
		if (!PhotoCache.instance) {
			PhotoCache.instance = new PhotoCache()
		}
		return PhotoCache.instance
	}

	// Generate a cache key from venue name and address
	private getCacheKey(venueName: string, venueAddress: string): string {
		return `${venueName.toLowerCase().trim()}|${venueAddress
			.toLowerCase()
			.trim()}`
	}

	// Check if we have a cached photo for this venue
	hasCachedPhoto(venueName: string, venueAddress: string): boolean {
		const key = this.getCacheKey(venueName, venueAddress)
		return this.cache.has(key)
	}

	// Get cached photo data
	getCachedPhoto(
		venueName: string,
		venueAddress: string
	): PhotoCacheEntry | null {
		const key = this.getCacheKey(venueName, venueAddress)
		return this.cache.get(key) || null
	}

	// Cache a photo reference
	cachePhoto(
		venueName: string,
		venueAddress: string,
		placeId: string,
		photoRef: string
	): void {
		const key = this.getCacheKey(venueName, venueAddress)
		const entry: PhotoCacheEntry = {
			venue_name: venueName,
			venue_address: venueAddress,
			place_id: placeId,
			photo_reference: photoRef,
			photo_url: `/api/google-places-photo?photoRef=${encodeURIComponent(
				photoRef
			)}&maxWidth=1200`,
			last_updated: new Date().toISOString(),
		}
		this.cache.set(key, entry)
	}

	// Load cache from CSV data
	loadFromVenues(venues: Venue[]): void {
		venues.forEach((venue) => {
			if (venue.gmaps_place_id && venue.gmaps_primary_photo_ref) {
				this.cachePhoto(
					venue.name,
					venue.address,
					venue.gmaps_place_id,
					venue.gmaps_primary_photo_ref
				)
			}
		})
	}

	// Get all cached entries for CSV export
	getAllCachedEntries(): PhotoCacheEntry[] {
		return Array.from(this.cache.values())
	}

	// Clear cache
	clear(): void {
		this.cache.clear()
	}

	// Get cache statistics
	getStats(): { total: number; recent: number } {
		const now = new Date()
		const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

		let recent = 0
		this.cache.forEach((entry) => {
			if (new Date(entry.last_updated) > oneDayAgo) {
				recent++
			}
		})

		return {
			total: this.cache.size,
			recent,
		}
	}
}
