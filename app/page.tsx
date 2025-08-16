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

			{/* Main Content - Fixed Layout */}
			<main className="relative">
				{/* Desktop Layout: Cards on Left, Map on Right */}
				<div className="hidden lg:flex h-[calc(100vh-200px)]">
					{/* Left Side - Venue List (2/3 to 3/4) */}
					<div className="w-3/4 h-full overflow-y-auto bg-white">
						<div className="p-6">
							<VenueList
								venues={venues}
								onVenueClick={handleVenueSelect}
								onFilterChange={setFilteredVenues}
								isCompact={false}
							/>
						</div>
					</div>

					{/* Right Side - Map (1/3 to 1/4) - FULL HEIGHT */}
					<div className="w-1/4 h-full">
						<div className="w-full h-full">
							<GoogleMapsMap
								venues={filteredVenues}
								onVenueClick={handleVenueSelect}
							/>
						</div>
					</div>
				</div>

				{/* Mobile Layout: Full Width Map with Compact Overlay */}
				<div className="lg:hidden">
					{/* Full Width Map - Much Taller */}
					<div className="h-[60vh] w-full">
						<GoogleMapsMap
							venues={filteredVenues}
							onVenueClick={handleVenueSelect}
						/>
					</div>

					{/* Content Overlay Below Map - More Compact */}
					<div className="bg-white rounded-t-3xl -mt-2 relative z-10 min-h-[20vh]">
						<div className="p-3 pt-4">
							<VenueList
								venues={venues}
								onVenueClick={handleVenueSelect}
								onFilterChange={setFilteredVenues}
								isCompact={true}
							/>
						</div>
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 py-6">
				<div className="container mx-auto px-4">
					<div className="flex flex-col md:flex-row justify-between items-center">
						{/* Left side - Copyright, Doug, and Buy me a coffee */}
						<div className="text-center md:text-left mb-4 md:mb-0">
							<p className="font-sans text-sm text-gray-600">
								© 2025 Goose Chase | Built by{" "}
								<a
									href="https://doug.is/utm_source=goosechase"
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary hover:text-primary-dark transition-colors underline"
								>
									Doug
								</a>{" "}
								|{" "}
								<a
									href="https://buymeacoffee.com/afxjzs"
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary hover:text-primary-dark transition-colors underline"
								>
									Buy me a coffee
								</a>
							</p>
						</div>

						{/* Right side - Dante's Twitter and Barstool article */}
						<div className="text-center md:text-right">
							<p className="font-sans text-sm text-gray-600">
								Based on recommendations by{" "}
								<a
									href="https://twitter.com/dantethedon"
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary hover:text-primary-dark transition-colors underline"
								>
									@DanteTheDon
								</a>
								's{" "}
								<a
									href="https://www.barstoolsports.com/blog/3548304/chicago-is-an-elite-bachelor-party-destination-in-america-and-here-is-your-definitive-guide"
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary hover:text-primary-dark transition-colors underline"
								>
									Barstool Sports article
								</a>
							</p>
						</div>
					</div>
				</div>
			</footer>

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
