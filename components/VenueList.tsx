"use client"

import { useState, useMemo } from "react"
import { Venue } from "@/types/venue"
import VenueCard from "./VenueCard"

interface VenueListProps {
	venues: Venue[]
	onVenueClick: (venue: Venue) => void
}

export default function VenueList({ venues, onVenueClick }: VenueListProps) {
	const [searchTerm, setSearchTerm] = useState("")
	const [venueTypeFilter, setVenueTypeFilter] = useState("")
	const [neighborhoodFilter, setNeighborhoodFilter] = useState("")

	const venueTypes = useMemo(() => {
		const types = Array.from(new Set(venues.map((venue) => venue.venue_type)))
		return types.sort()
	}, [venues])

	const neighborhoods = useMemo(() => {
		const hoods = Array.from(new Set(venues.map((venue) => venue.neighborhood)))
		return hoods.sort()
	}, [venues])

	const filteredVenues = useMemo(() => {
		return venues.filter((venue) => {
			const matchesSearch =
				venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				venue.general_description
					.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				venue.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())

			const matchesType =
				!venueTypeFilter || venue.venue_type === venueTypeFilter
			const matchesNeighborhood =
				!neighborhoodFilter || venue.neighborhood === neighborhoodFilter

			return matchesSearch && matchesType && matchesNeighborhood
		})
	}, [venues, searchTerm, venueTypeFilter, neighborhoodFilter])

	return (
		<div className="space-y-6">
			{/* Filters */}
			<div className="bg-white p-4 rounded-lg shadow-md space-y-4">
				<h3 className="text-lg font-semibold text-gray-900">Filters</h3>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Search
						</label>
						<input
							type="text"
							placeholder="Search venues..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Venue Type
						</label>
						<select
							value={venueTypeFilter}
							onChange={(e) => setVenueTypeFilter(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="">All Types</option>
							{venueTypes.map((type) => (
								<option key={type} value={type}>
									{type}
								</option>
							))}
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Neighborhood
						</label>
						<select
							value={neighborhoodFilter}
							onChange={(e) => setNeighborhoodFilter(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="">All Neighborhoods</option>
							{neighborhoods.map((hood) => (
								<option key={hood} value={hood}>
									{hood}
								</option>
							))}
						</select>
					</div>
				</div>

				<div className="flex justify-between items-center">
					<span className="text-sm text-gray-600">
						Showing {filteredVenues.length} of {venues.length} venues
					</span>
					<button
						onClick={() => {
							setSearchTerm("")
							setVenueTypeFilter("")
							setNeighborhoodFilter("")
						}}
						className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 underline"
					>
						Clear filters
					</button>
				</div>
			</div>

			{/* Venue Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{filteredVenues.map((venue, index) => (
					<VenueCard
						key={`${venue.name}-${index}`}
						venue={venue}
						onClick={onVenueClick}
					/>
				))}
			</div>

			{filteredVenues.length === 0 && (
				<div className="text-center py-8">
					<p className="text-gray-500 text-lg">No venues match your filters</p>
					<p className="text-gray-400 text-sm">
						Try adjusting your search criteria
					</p>
				</div>
			)}
		</div>
	)
}
