"use client"

import Image from "next/image"
import { useState, useEffect, useMemo, useCallback } from "react"
import { PhotoCache } from "@/lib/photoCache"

interface VenuePhotoThumbnailProps {
	venueName: string
	venueType: string
	neighborhood?: string
	className?: string
	size?: "sm" | "md" | "lg"
}

export default function VenuePhotoThumbnail({
	venueName,
	venueType,
	neighborhood,
	className = "",
	size = "lg",
}: VenuePhotoThumbnailProps) {
	const [photoUrl, setPhotoUrl] = useState<string | null>(null)
	const [imageLoading, setImageLoading] = useState(true)
	const [photoError, setPhotoError] = useState(false)

	const sizeConfig = {
		sm: { width: 120, height: 80, className: "aspect-[3/2]" },
		md: { width: 250, height: 167, className: "aspect-[3/2]" },
		lg: { width: 300, height: 200, className: "aspect-[3/2]" },
	}

	const config = sizeConfig[size]

	// Memoize the cache key to prevent unnecessary re-renders
	const cacheKey = useMemo(
		() => `${venueName}|${neighborhood || ""}`,
		[venueName, neighborhood]
	)

	// Memoize the fetch function to prevent recreation on every render
	const fetchPhoto = useCallback(async () => {
		// Check photo cache first
		const photoCache = PhotoCache.getInstance()
		if (photoCache.hasCachedPhoto(venueName, neighborhood || "")) {
			const cached = photoCache.getCachedPhoto(venueName, neighborhood || "")
			if (cached) {
				// Adjust the cached URL to match our size requirements
				const adjustedUrl = cached.photo_url.replace(
					/maxWidth=\d+&maxHeight=\d+/,
					`maxWidth=${config.width}&maxHeight=${config.height}`
				)
				setPhotoUrl(adjustedUrl)
				return
			}
		}

		// No cache - fetch from Google Places API
		try {
			// Search for the venue using Google Places API
			const searchQuery = `${venueName} ${neighborhood || ""} Chicago`
			const searchResponse = await fetch(
				`/api/google-places-search?query=${encodeURIComponent(searchQuery)}`
			)

			if (searchResponse.ok) {
				const searchData = await searchResponse.json()
				if (searchData.results && searchData.results.length > 0) {
					const place = searchData.results[0]

					// Get photos for this place
					const photosResponse = await fetch(
						`/api/google-places-photos?placeId=${place.place_id}`
					)
					if (photosResponse.ok) {
						const photosData = await photosResponse.json()
						if (photosData.photos && photosData.photos.length > 0) {
							const photoRef = photosData.photos[0].photo_reference

							// Cache this photo for future use
							photoCache.cachePhoto(
								venueName,
								neighborhood || "",
								place.place_id,
								photoRef
							)

							// Use our server-side photo endpoint
							const photoUrl = `/api/google-places-photo?photoRef=${encodeURIComponent(
								photoRef
							)}&maxWidth=${config.width}&maxHeight=${config.height}`
							setPhotoUrl(photoUrl)
							return
						}
					}
				}
			}

			// If we get here, no photo was found
			setPhotoError(true)
		} catch (error) {
			console.warn(`Could not get photo for ${venueName}:`, error)
			setPhotoError(true)
		}
	}, [venueName, neighborhood, config.width, config.height])

	useEffect(() => {
		fetchPhoto()
	}, [fetchPhoto])

	// Show loading state
	if (imageLoading && !photoUrl) {
		return (
			<div
				className={`relative overflow-hidden rounded-lg bg-gray-200 flex items-center justify-center ${config.className} ${className}`}
			>
				<div className="text-gray-400 text-center">
					<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-1"></div>
					<div className="text-xs">Loading...</div>
				</div>
			</div>
		)
	}

	// Show error state
	if (photoError || !photoUrl) {
		return (
			<div
				className={`relative overflow-hidden rounded-lg bg-gray-200 flex items-center justify-center ${config.className} ${className}`}
			>
				<div className="text-gray-400 text-center">
					<div className="text-2xl mb-1">📷</div>
					<div className="text-xs">No photo</div>
				</div>
			</div>
		)
	}

	// Show the real photo
	return (
		<div
			className={`relative overflow-hidden rounded-lg ${config.className} ${className}`}
		>
			<Image
				src={photoUrl}
				alt={`${venueName} - ${venueType}`}
				fill
				sizes={`(max-width: 768px) ${config.width}px, ${config.width}px`}
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
