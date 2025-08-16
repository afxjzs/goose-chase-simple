"use client"

import { useEffect, useRef, useState } from "react"
import { Venue } from "@/types/venue"

interface GoogleMapsMapProps {
	venues: Venue[]
	onVenueClick: (venue: Venue) => void
}

// Google Maps types
interface GoogleMaps {
	maps: {
		Map: new (element: HTMLElement, options: any) => any
		Marker: new (options: any) => any
		InfoWindow: new (options: any) => any
		Size: new (width: number, height: number) => any
		Point: new (x: number, y: number) => any
	}
}

export default function GoogleMapsMap({
	venues,
	onVenueClick,
}: GoogleMapsMapProps) {
	const mapRef = useRef<HTMLDivElement>(null)
	const [map, setMap] = useState<any>(null)
	const [isLoaded, setIsLoaded] = useState(false)
	const [apiKey, setApiKey] = useState<string | null>(null)
	const markers = useRef<any[]>([])

	// Fetch API key from server-side proxy
	useEffect(() => {
		const fetchApiKey = async () => {
			try {
				const response = await fetch("/api/maps?action=load-api")
				const data = await response.json()

				if (data.apiKey) {
					setApiKey(data.apiKey)
				} else {
					console.error("Failed to load API key:", data.error)
				}
			} catch (error) {
				console.error("Error fetching API key:", error)
			}
		}

		fetchApiKey()
	}, [])

	// Load Google Maps script once we have the API key
	useEffect(() => {
		if (!apiKey || isLoaded) return

		const loadGoogleMaps = () => {
			// Check if Google Maps is already loaded
			if (
				typeof window !== "undefined" &&
				window.google &&
				window.google.maps
			) {
				setIsLoaded(true)
				return
			}

			const script = document.createElement("script")
			script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
			script.async = true
			script.defer = true

			script.onload = () => {
				setIsLoaded(true)
			}

			script.onerror = () => {
				console.error("Failed to load Google Maps script")
			}

			document.head.appendChild(script)
		}

		loadGoogleMaps()
	}, [apiKey, isLoaded])

	// Initialize map once script is loaded
	useEffect(() => {
		if (
			!isLoaded ||
			!mapRef.current ||
			map ||
			typeof window === "undefined" ||
			!window.google
		)
			return

		const chicagoCenter = { lat: 41.8781, lng: -87.6298 }

		const newMap = new window.google.maps.Map(mapRef.current, {
			center: chicagoCenter,
			zoom: 11,
			zoomControl: true,
			zoomControlOptions: {
				position: window.google.maps.ControlPosition.TOP_LEFT,
			},
			mapTypeControl: true,
			mapTypeControlOptions: {
				style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
				position: window.google.maps.ControlPosition.TOP_RIGHT,
			},
			streetViewControl: true,
			fullscreenControl: true,
			scaleControl: true,
			styles: [
				{
					featureType: "poi",
					elementType: "labels",
					stylers: [{ visibility: "off" }],
				},
			],
		})

		setMap(newMap)
	}, [isLoaded, map])

	// Add markers when venues or map changes
	useEffect(() => {
		if (
			!map ||
			!venues.length ||
			typeof window === "undefined" ||
			!window.google
		)
			return

		// Clear existing markers
		markers.current.forEach((marker) => marker.setMap(null))
		const newMarkers: any[] = []

		venues.forEach((venue) => {
			const coords = venue.coordinates.split(",").map(Number)
			if (coords.length !== 2 || isNaN(coords[0]) || isNaN(coords[1])) return

			const [lat, lng] = coords

			const marker = new window.google.maps.Marker({
				position: { lat, lng },
				map: map,
				title: venue.name,
				icon: {
					url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
						<svg width="30" height="30" xmlns="http://www.w3.org/2000/svg">
							<circle cx="15" cy="15" r="15" fill="white" stroke="#73AB84" stroke-width="2"/>
							<text x="15" y="20" text-anchor="middle" font-size="16">${getMarkerIcon(
								venue.venue_type
							)}</text>
						</svg>
					`)}`,
					scaledSize: new window.google.maps.Size(30, 30),
					anchor: new window.google.maps.Point(15, 15),
				},
			})

			// Add click listener
			marker.addListener("click", () => {
				onVenueClick(venue)
			})

			// Create enhanced info window content with photo
			const infoWindowContent = `
				<div class="p-3 max-w-xs">
					<div class="flex items-start gap-3">
						${
							venue.gmaps_primary_photo_ref
								? `<div class="flex-shrink-0">
										<img src="/api/photo?ref=${encodeURIComponent(
											venue.gmaps_primary_photo_ref
										)}&w=80&h=60" 
											 alt="${venue.name}" 
											 class="w-20 h-15 object-cover rounded" />
									</div>`
								: ""
						}
						<div class="flex-1 min-w-0">
							<h3 class="font-semibold text-sm text-gray-900 truncate">${venue.name}</h3>
							<p class="text-sm text-blue-600 font-medium">${venue.venue_type}</p>
							<p class="text-sm text-gray-600">${venue.neighborhood}</p>
							${
								venue.google_maps_rating
									? `<p class="text-sm text-amber-600">⭐ ${venue.google_maps_rating}</p>`
									: ""
							}
							<button class="mt-2 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors">
								View Details
							</button>
						</div>
					</div>
				</div>
			`

			// Add hover info window
			const infoWindow = new window.google.maps.InfoWindow({
				content: infoWindowContent,
			})

			marker.addListener("mouseover", () => {
				infoWindow.open(map, marker)
			})

			marker.addListener("mouseout", () => {
				infoWindow.close()
			})

			newMarkers.push(marker)
		})

		markers.current = newMarkers
	}, [venues, map, onVenueClick])

	const getMarkerIcon = (venueType: string): string => {
		const icons: { [key: string]: string } = {
			restaurant: "🍽️",
			bar: "🍺",
			coffee: "☕",
			theater: "🎭",
			museum: "🏛️",
			park: "🌳",
			shopping: "🛍️",
			hotel: "🏨",
			club: "🎵",
			gym: "💪",
		}
		return icons[venueType.toLowerCase()] || "📍"
	}

	if (!apiKey) {
		return (
			<div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
					<p className="text-gray-600">Loading map...</p>
				</div>
			</div>
		)
	}

	return (
		<div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden">
			<div ref={mapRef} className="w-full h-full" />
		</div>
	)
}
