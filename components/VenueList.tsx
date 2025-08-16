"use client"

import { useMemo, useState, useRef, useEffect } from "react"
import { Venue } from "@/types/venue"
import VenueCard from "./VenueCard"

interface VenueListProps {
	venues: Venue[]
	onVenueClick: (venue: Venue) => void
}

export default function VenueList({ venues, onVenueClick }: VenueListProps) {
	const [searchTerm, setSearchTerm] = useState("")
	const [selectedType, setSelectedType] = useState("")
	const [selectedNeighborhood, setSelectedNeighborhood] = useState("")
	const [keywordFilter, setKeywordFilter] = useState("")
	const [showKeywordSuggestions, setShowKeywordSuggestions] = useState(false)
	const [keywordSuggestions, setKeywordSuggestions] = useState<string[]>([])
	const keywordInputRef = useRef<HTMLInputElement>(null)
	const suggestionsRef = useRef<HTMLDivElement>(null)

	// Get unique venue types (handle slash-separated types)
	const venueTypes = useMemo(() => {
		const types = new Set<string>()
		venues.forEach((venue) => {
			// Split by slash and add each part
			const typeParts = venue.venue_type.split("/").map((t) => t.trim())
			typeParts.forEach((part) => {
				if (part) types.add(part)
			})
		})
		return Array.from(types).sort()
	}, [venues])

	// Get unique neighborhoods
	const neighborhoods = useMemo(() => {
		const hoods = new Set<string>()
		venues.forEach((venue) => {
			if (venue.neighborhood) hoods.add(venue.neighborhood)
		})
		return Array.from(hoods).sort()
	}, [venues])

	// Parse and clean keywords for filtering
	const getCleanKeywords = (keywords: string) => {
		if (!keywords) return []

		try {
			const parsed = JSON.parse(keywords)
			if (Array.isArray(parsed)) {
				return parsed.map((k) => k.trim().toLowerCase()).filter((k) => k)
			}
		} catch {
			// If not JSON, split by comma and clean
			return keywords
				.split(",")
				.map((k) => k.trim().replace(/[{}"]/g, "").toLowerCase())
				.filter((k) => k)
		}

		return []
	}

	// Get all unique keywords for autocomplete
	const allKeywords = useMemo(() => {
		const keywords = new Set<string>()
		venues.forEach((venue) => {
			if (venue.keywords_tags) {
				const cleanKeywords = getCleanKeywords(venue.keywords_tags)
				cleanKeywords.forEach((keyword) => keywords.add(keyword))
			}
		})
		return Array.from(keywords).sort()
	}, [venues])

	// Handle keyword input changes and show suggestions
	const handleKeywordInputChange = (value: string) => {
		setKeywordFilter(value)

		if (value.trim()) {
			const filtered = allKeywords.filter((keyword) =>
				keyword.toLowerCase().includes(value.toLowerCase())
			)
			setKeywordSuggestions(filtered)
			setShowKeywordSuggestions(filtered.length > 0)
		} else {
			setShowKeywordSuggestions(false)
			setKeywordSuggestions([])
		}
	}

	// Handle keyword suggestion selection
	const handleKeywordSuggestionClick = (suggestion: string) => {
		setKeywordFilter(suggestion)
		setShowKeywordSuggestions(false)
		keywordInputRef.current?.focus()
	}

	// Close suggestions when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				suggestionsRef.current &&
				!suggestionsRef.current.contains(event.target as Node) &&
				keywordInputRef.current &&
				!keywordInputRef.current.contains(event.target as Node)
			) {
				setShowKeywordSuggestions(false)
			}
		}

		document.addEventListener("mousedown", handleClickOutside)
		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [])

	// Filter venues based on all criteria
	const filteredVenues = useMemo(() => {
		return venues.filter((venue) => {
			// Search term filter
			if (
				searchTerm &&
				!venue.name.toLowerCase().includes(searchTerm.toLowerCase())
			) {
				return false
			}

			// Type filter (handle slash-separated types)
			if (selectedType) {
				const typeParts = venue.venue_type.split("/").map((t) => t.trim())
				if (!typeParts.some((part) => part === selectedType)) {
					return false
				}
			}

			// Neighborhood filter
			if (selectedNeighborhood && venue.neighborhood !== selectedNeighborhood) {
				return false
			}

			// Keyword filter
			if (keywordFilter && venue.keywords_tags) {
				const cleanKeywords = getCleanKeywords(venue.keywords_tags)
				if (
					!cleanKeywords.some((keyword) =>
						keyword.includes(keywordFilter.toLowerCase())
					)
				) {
					return false
				}
			}

			return true
		})
	}, [venues, searchTerm, selectedType, selectedNeighborhood, keywordFilter])

	const clearFilters = () => {
		setSearchTerm("")
		setSelectedType("")
		setSelectedNeighborhood("")
		setKeywordFilter("")
		setShowKeywordSuggestions(false)
		setKeywordSuggestions([])
	}

	return (
		<div className="space-y-4">
			{/* Search and Filters */}
			<div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
					{/* Search */}
					<input
						type="text"
						placeholder="Search venues..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>

					{/* Type Filter */}
					<select
						value={selectedType}
						onChange={(e) => setSelectedType(e.target.value)}
						className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					>
						<option value="">All Types</option>
						{venueTypes.map((type) => (
							<option key={type} value={type}>
								{type}
							</option>
						))}
					</select>

					{/* Neighborhood Filter */}
					<select
						value={selectedNeighborhood}
						onChange={(e) => setSelectedNeighborhood(e.target.value)}
						className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					>
						<option value="">All Neighborhoods</option>
						{neighborhoods.map((hood) => (
							<option key={hood} value={hood}>
								{hood}
							</option>
						))}
					</select>

					{/* Keyword Filter with Autocomplete */}
					<div className="relative">
						<input
							ref={keywordInputRef}
							type="text"
							placeholder="Filter by keywords..."
							value={keywordFilter}
							onChange={(e) => handleKeywordInputChange(e.target.value)}
							onFocus={() => {
								if (keywordFilter.trim()) {
									const filtered = allKeywords.filter((keyword) =>
										keyword.toLowerCase().includes(keywordFilter.toLowerCase())
									)
									setKeywordSuggestions(filtered)
									setShowKeywordSuggestions(filtered.length > 0)
								}
							}}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>

						{/* Autocomplete Suggestions */}
						{showKeywordSuggestions && (
							<div
								ref={suggestionsRef}
								className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto"
							>
								{keywordSuggestions.map((suggestion, index) => (
									<div
										key={index}
										onClick={() => handleKeywordSuggestionClick(suggestion)}
										className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
									>
										{suggestion}
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				{/* Results and Clear */}
				<div className="flex justify-between items-center">
					<div className="text-sm text-gray-600">
						Showing {filteredVenues.length} of {venues.length} venues
					</div>
					{(searchTerm ||
						selectedType ||
						selectedNeighborhood ||
						keywordFilter) && (
						<button
							onClick={clearFilters}
							className="text-sm text-blue-600 hover:text-blue-800 underline"
						>
							Clear all filters
						</button>
					)}
				</div>
			</div>

			{/* Venues Grid */}
			{filteredVenues.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredVenues.map((venue) => (
						<VenueCard
							key={venue.name}
							venue={venue}
							onClick={() => onVenueClick(venue)}
						/>
					))}
				</div>
			) : (
				<div className="text-center py-8 text-gray-500">
					<p>No venues match your current filters.</p>
					<button
						onClick={clearFilters}
						className="text-blue-600 hover:text-blue-800 underline mt-2"
					>
						Clear filters
					</button>
				</div>
			)}
		</div>
	)
}
