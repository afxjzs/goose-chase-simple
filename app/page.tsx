"use client"

import { useState, useEffect } from "react"
import GoogleMapsMap from "@/components/GoogleMapsMap"
import VenueList from "@/components/VenueList"
import VenueModal from "@/components/VenueModal"
import { Venue } from "@/types/venue"
import { parseVenuesCSV } from "@/lib/csvParser"

export default function Home() {
	const [venues, setVenues] = useState<Venue[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)

	// Set the page title dynamically
	useEffect(() => {
		document.title = "Goose Chase | Chicago Venues"
	}, [])

	useEffect(() => {
		console.log("Home component mounted, starting to load venues...")
		loadVenues()
	}, [])

	const loadVenues = async () => {
		try {
			console.log("Starting to load venues...")
			setLoading(true)

			console.log("Fetching CSV file from /chicago_venues_full_output.csv...")
			const response = await fetch("/chicago_venues_full_output.csv")
			console.log("CSV response status:", response.status)
			console.log("CSV response headers:", response.headers)

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			console.log("Reading CSV text...")
			const csvText = await response.text()
			console.log("CSV text length:", csvText.length)
			console.log("CSV preview:", csvText.substring(0, 200))

			if (!csvText || csvText.length === 0) {
				throw new Error("CSV text is empty")
			}

			console.log("Parsing CSV...")
			const parsedVenues = await parseVenuesCSV(csvText)
			console.log("Parsed venues:", parsedVenues.length)
			console.log("First venue:", parsedVenues[0])

			console.log("Setting venues state...")
			setVenues(parsedVenues)
			console.log("Venues state set successfully")
		} catch (err) {
			console.error("Error loading venues:", err)
			setError(
				`Failed to load venue data: ${
					err instanceof Error ? err.message : "Unknown error"
				}`
			)
		} finally {
			console.log("Setting loading to false...")
			setLoading(false)
		}
	}

	const handleVenueClick = (venue: Venue) => {
		setSelectedVenue(venue)
		setIsModalOpen(true)
	}

	const closeModal = () => {
		setIsModalOpen(false)
		setSelectedVenue(null)
	}

	console.log(
		"Rendering Home component - loading:",
		loading,
		"error:",
		error,
		"venues count:",
		venues.length
	)

	if (loading) {
		console.log("Showing loading state...")
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading Chicago venues...</p>
					<p className="text-sm text-gray-500 mt-2">
						Check console for debug info
					</p>
					<button
						onClick={loadVenues}
						className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
					>
						Retry Loading
					</button>
				</div>
			</div>
		)
	}

	if (error) {
		console.log("Showing error state...")
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<p className="text-red-600 text-lg mb-4">{error}</p>
					<button
						onClick={loadVenues}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
					>
						Try Again
					</button>
				</div>
			</div>
		)
	}

	console.log("Showing main content with venues...")
	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow-sm border-b">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<h1 className="text-3xl font-bold text-gray-900">Goose Chase</h1>
					<p className="text-gray-600 mt-2">
						Chicago has a million places to eat and drink. These are the best
						ones.
					</p>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Map Section */}
				<section className="mb-12">
					<GoogleMapsMap venues={venues} onVenueClick={handleVenueClick} />
				</section>

				{/* Venue List Section */}
				<section>
					<VenueList venues={venues} onVenueClick={handleVenueClick} />
					<p className="text-gray-600 mt-2">
						Explore {venues.length} Chicago venues from{" "}
						<a
							href="https://twitter.com/dantethedon"
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-600 hover:underline"
						>
							@DanteTheDon
						</a>
						{"'s "}
						<a
							href="https://www.barstoolsports.com/blog/3548304/chicago-is-an-elite-bachelor-party-destination-in-america-and-here-is-your-definitive-guide"
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-600 hover:underline"
						>
							Barstool Sports article on Chicago bachelor party destinations
						</a>
						. Built by{" "}
						<a
							href="https://twitter.com/glowingrec"
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-600 hover:underline"
						>
							@glowingrec
						</a>
					</p>
				</section>
			</main>

			{/* Modal */}
			<VenueModal
				venue={selectedVenue}
				isOpen={isModalOpen}
				onClose={closeModal}
			/>
		</div>
	)
}
