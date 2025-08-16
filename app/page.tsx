"use client"

import { useState, useEffect } from "react"
import GoogleMapsMap from "@/components/GoogleMapsMap"
import VenueList from "@/components/VenueList"
import VenueModal from "@/components/VenueModal"
import { Venue } from "@/types/venue"
import { loadVenuesFromCSV } from "@/lib/csvParser"

export default function Home() {
	const [venues, setVenues] = useState<Venue[]>([])
	const [filteredVenues, setFilteredVenues] = useState<Venue[]>([])
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
			const loadedVenues = await loadVenuesFromCSV()
			console.log(`Loaded ${loadedVenues.length} venues`)
			setVenues(loadedVenues)
			setFilteredVenues(loadedVenues)
		} catch (error) {
			console.error("Error loading venues:", error)
		}
	}

	const handleVenueSelect = (venue: Venue) => {
		setSelectedVenue(venue)
		setIsModalOpen(true)
	}

	const handleCloseModal = () => {
		setIsModalOpen(false)
		setSelectedVenue(null)
	}

	return (
		<div className="min-h-screen bg-bg-primary">
			{/* Header */}
			<header className="bg-primary text-white shadow-lg">
				<div className="container mx-auto px-4 py-6">
					<h1 className="font-cardo text-4xl font-bold text-center">
						Goose Chase
					</h1>
					<p className="font-sans text-lg text-center mt-2 opacity-90">
						Discover Chicago's Finest Venues
					</p>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-8">
				{/* Map Section */}
				<section className="mb-12">
					<h2 className="font-cardo text-2xl font-bold text-text-primary mb-6">
						Interactive Map
					</h2>
					<div className="bg-white rounded-lg shadow-lg overflow-hidden">
						<GoogleMapsMap
							venues={filteredVenues}
							onVenueClick={handleVenueSelect}
						/>
					</div>
				</section>

				{/* Venue List Section */}
				<section>
					<h2 className="font-cardo text-2xl font-bold text-text-primary mb-6">
						Venue Directory
					</h2>
					<VenueList venues={venues} onVenueClick={handleVenueSelect} />
				</section>
			</main>

			{/* Modal */}
			{isModalOpen && selectedVenue && (
				<VenueModal
					venue={selectedVenue}
					isOpen={isModalOpen}
					onClose={handleCloseModal}
				/>
			)}
		</div>
	)
}
