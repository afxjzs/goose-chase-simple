"use client"
import Image from "next/image"
import { useState, useEffect } from "react"
import { PhotoCache } from "@/lib/photoCache"

interface VenueHeroPhotoProps {
	venueName: string
	venueType: string
	neighborhood?: string
	className?: string
	// Allow passing cached photo data directly
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

	useEffect(() => {
		const fetchPhoto = async () => {
			// If we have cached photo data, use it immediately
			if (cachedPhotoRef) {
				const photoUrl = `/api/google-places-photo?photoRef=${encodeURIComponent(
					cachedPhotoRef
				)}&maxWidth=1200`
				setPhotoUrl(photoUrl)
				return
			}

			// Check photo cache first
			const photoCache = PhotoCache.getInstance()
			if (photoCache.hasCachedPhoto(venueName, neighborhood || "")) {
				const cached = photoCache.getCachedPhoto(venueName, neighborhood || "")
				if (cached) {
					setPhotoUrl(cached.photo_url)
					return
				}
			}

			// No cache - fetch from Google Places API
			try {
				console.log(`Fetching photo for ${venueName}...`)

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
								)}&maxWidth=1200`
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
		}

		fetchPhoto()
	}, [venueName, venueType, neighborhood, cachedPhotoRef])

	// Show loading state
	if (imageLoading && !photoUrl) {
		return (
			<div
				className={`relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-200 flex items-center justify-center ${className}`}
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
				className={`relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-200 flex items-center justify-center ${className}`}
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
			className={`relative aspect-[16/9] w-full overflow-hidden rounded-2xl ${className}`}
		>
			<Image
				src={photoUrl}
				alt={`${venueName} - ${venueType}`}
				fill
				sizes="(max-width: 768px) 100vw, 1200px"
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
