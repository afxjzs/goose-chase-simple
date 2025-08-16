"use client"

import { useState, useEffect } from "react"
import { parseVenuesCSV } from "@/lib/csvParser"
import { Venue } from "@/types/venue"

export default function TestCSVPage() {
	const [venues, setVenues] = useState<Venue[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [csvText, setCsvText] = useState<string>("")

	useEffect(() => {
		loadVenues()
	}, [])

	const loadVenues = async () => {
		try {
			console.log("Starting to load venues...")
			setLoading(true)

			console.log("Fetching CSV file...")
			const response = await fetch("/chicago_venues_full_output.csv")
			console.log("CSV response status:", response.status)

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			console.log("Reading CSV text...")
			const csvText = await response.text()
			console.log("CSV text length:", csvText.length)
			console.log("CSV preview:", csvText.substring(0, 200))

			setCsvText(csvText.substring(0, 500) + "...")

			if (!csvText || csvText.length === 0) {
				throw new Error("CSV text is empty")
			}

			console.log("Parsing CSV...")
			const parsedVenues = await parseVenuesCSV(csvText)
			console.log("Parsed venues:", parsedVenues.length)
			console.log("First venue:", parsedVenues[0])

			setVenues(parsedVenues)
		} catch (err) {
			console.error("Error loading venues:", err)
			setError(
				`Failed to load venue data: ${
					err instanceof Error ? err.message : "Unknown error"
				}`
			)
		} finally {
			setLoading(false)
		}
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading CSV data...</p>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="text-red-600 text-6xl mb-4">❌</div>
					<h1 className="text-2xl font-bold text-red-800 mb-4">
						Error Loading CSV
					</h1>
					<p className="text-red-600 mb-4">{error}</p>
					<button
						onClick={loadVenues}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
					>
						Retry Loading
					</button>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-6xl mx-auto">
				<h1 className="text-3xl font-bold text-gray-900 mb-8">
					CSV Parser Test
				</h1>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* CSV Preview */}
					<div className="bg-white rounded-lg shadow-md p-6">
						<h2 className="text-xl font-semibold text-gray-800 mb-4">
							CSV Preview
						</h2>
						<div className="bg-gray-100 p-4 rounded font-mono text-sm overflow-auto max-h-96">
							<pre>{csvText}</pre>
						</div>
					</div>

					{/* Parsed Venues */}
					<div className="bg-white rounded-lg shadow-md p-6">
						<h2 className="text-xl font-semibold text-gray-800 mb-4">
							Parsed Venues ({venues.length})
						</h2>
						<div className="space-y-4 max-h-96 overflow-auto">
							{venues.slice(0, 10).map((venue, index) => (
								<div key={index} className="border border-gray-200 rounded p-3">
									<h3 className="font-semibold text-gray-900">{venue.name}</h3>
									<p className="text-sm text-gray-600">{venue.venue_type}</p>
									<p className="text-sm text-gray-500">{venue.neighborhood}</p>
									{venue.gmaps_primary_photo_ref && (
										<p className="text-sm text-green-600">
											📷 Photo: {venue.gmaps_primary_photo_ref}
										</p>
									)}
									{venue.coordinates && (
										<p className="text-sm text-blue-600">
											📍 Coords: {venue.coordinates}
										</p>
									)}
								</div>
							))}
							{venues.length > 10 && (
								<p className="text-gray-500 text-center">
									... and {venues.length - 10} more venues
								</p>
							)}
						</div>
					</div>
				</div>

				{/* Debug Info */}
				<div className="mt-8 bg-white rounded-lg shadow-md p-6">
					<h2 className="text-xl font-semibold text-gray-800 mb-4">
						Debug Information
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
						<div>
							<strong>Total Venues:</strong> {venues.length}
						</div>
						<div>
							<strong>Venues with Photos:</strong>{" "}
							{venues.filter((v) => v.gmaps_primary_photo_ref).length}
						</div>
						<div>
							<strong>Venues with Coordinates:</strong>{" "}
							{venues.filter((v) => v.coordinates).length}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
