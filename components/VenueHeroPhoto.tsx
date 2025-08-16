"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Image from "next/image"
import { PhotoCache } from "@/lib/photoCache"

interface VenueHeroPhotoProps {
	venueName: string
	venueType: string
	neighborhood?: string
	className?: string
	cachedPhotoRef?: string
}

export default function VenueHeroPhoto({
	venueName,
	venueType,
	neighborhood,
	className = "",
	cachedPhotoRef,
}: VenueHeroPhotoProps) {
	const [photoUrl, setPhotoUrl] = useState<string | null>(null)
	const [imageLoading, setImageLoading] = useState(true)
	const [photoError, setPhotoError] = useState(false)

	// Memoize the cache key to prevent unnecessary re-renders
	const cacheKey = useMemo(
		() => `${venueName}|${neighborhood || ""}`,
		[venueName, neighborhood]
	)

	// Memoize the fetch function to prevent recreation on every render
	const fetchPhoto = useCallback(async () => {
		// If we have a cached photo reference from CSV, use it directly
		if (cachedPhotoRef) {
			const photoUrl = `/api/google-places-photo?photoRef=${encodeURIComponent(
				cachedPhotoRef
			)}&maxWidth=300&maxHeight=200`
			setPhotoUrl(photoUrl)
			return
		}

		const photoCache = PhotoCache.getInstance()
		if (photoCache.hasCachedPhoto(venueName, neighborhood || "")) {
			const cached = photoCache.getCachedPhoto(venueName, neighborhood || "")
			if (cached) {
				setPhotoUrl(cached.photo_url) // Use cached URL directly
				return
			}
		}

		try {
			console.log(`Fetching photo for ${venueName}...`)
			const searchQuery = `${venueName} ${neighborhood || ""} Chicago`
			const searchResponse = await fetch(
				`/api/google-places-search?query=${encodeURIComponent(searchQuery)}`
			)

			if (searchResponse.ok) {
				const searchData = await searchResponse.json()
				if (searchData.results && searchData.results.length > 0) {
					const place = searchData.results[0]
					const photosResponse = await fetch(
						`/api/google-places-photos?placeId=${place.place_id}`
					)
					if (photosResponse.ok) {
						const photosData = await photosResponse.json()
						if (photosData.photos && photosData.photos.length > 0) {
							const photoRef = photosData.photos[0].photo_reference

							photoCache.cachePhoto(
								venueName,
								neighborhood || "",
								place.place_id,
								photoRef
							)

							const cached = photoCache.getCachedPhoto(
								venueName,
								neighborhood || ""
							)
							if (cached) {
								setPhotoUrl(cached.photo_url) // Use cached URL for perfect caching
								return
							}
						}
					}
				}
			}
			setPhotoError(true)
		} catch (error) {
			console.warn(`Could not get photo for ${venueName}:`, error)
			setPhotoError(true)
		}
	}, [venueName, neighborhood, cachedPhotoRef])

	useEffect(() => {
		fetchPhoto()
	}, [fetchPhoto])

	// Show loading state
	if (imageLoading && !photoUrl) {
		return (
			<div
				className={`relative aspect-[3/2] w-full overflow-hidden rounded-lg bg-gray-200 flex items-center justify-center ${className}`}
			>
				<div className="text-gray-400 text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
					<div className="text-sm">Loading photo...</div>
				</div>
			</div>
		)
	}

	// Show error state
	if (photoError || !photoUrl) {
		return (
			<div
				className={`relative aspect-[3/2] w-full overflow-hidden rounded-lg bg-gray-200 flex items-center justify-center ${className}`}
			>
				<div className="text-gray-400 text-center">
					<div className="text-4xl mb-2">📷</div>
					<div className="text-sm font-medium">No photo available</div>
				</div>
			</div>
		)
	}

	// Show the real photo
	return (
		<div
			className={`relative aspect-[3/2] w-full overflow-hidden rounded-lg ${className}`}
		>
			<Image
				src={photoUrl}
				alt={`${venueName} - ${venueType}`}
				fill
				sizes="(max-width: 768px) 100vw, 300px"
				priority={false}
				className="object-cover"
				onLoad={() => setImageLoading(false)}
				onError={() => {
					setImageLoading(false)
					setPhotoError(true)
				}}
			/>
		</div>
	)
}
