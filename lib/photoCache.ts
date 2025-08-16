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
	private cache: Map<string, PhotoCacheEntry>

	private constructor() {
		this.cache = new Map()
	}

	static getInstance(): PhotoCache {
		if (!PhotoCache.instance) {
			PhotoCache.instance = new PhotoCache()
		}
		return PhotoCache.instance
	}

	// Check if a photo is cached
	hasCachedPhoto(venueName: string, venueAddress: string): boolean {
		const key = this.getCacheKey(venueName, venueAddress)
		return this.cache.has(key)
	}

	// Get a cached photo
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
			)}&maxWidth=300&maxHeight=200`, // ALWAYS use 300x200 for consistency
			last_updated: new Date().toISOString(),
		}
		this.cache.set(key, entry)
	}

	// Get cache key
	private getCacheKey(venueName: string, venueAddress: string): string {
		return `${venueName}|${venueAddress}`
	}

	// Clear cache
	clearCache(): void {
		this.cache.clear()
	}

	// Get cache size
	getCacheSize(): number {
		return this.cache.size
	}

	// Export cache for CSV update
	exportCache(): PhotoCacheEntry[] {
		return Array.from(this.cache.values())
	}
}
