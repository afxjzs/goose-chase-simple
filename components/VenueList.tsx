"use client"

import { useMemo, useState, useRef, useEffect } from "react"
import { Venue } from "@/types/venue"
import VenueCard from "./VenueCard"

interface VenueListProps {
	venues: Venue[]
	onVenueClick: (venue: Venue) => void
	onFilterChange?: (filteredVenues: Venue[]) => void
	isCompact?: boolean
}

export default function VenueList({
	venues,
	onVenueClick,
	onFilterChange,
	isCompact = false,
}: VenueListProps) {
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
				keywordInputRef.current &&
				!keywordInputRef.current.contains(event.target as Node) &&
				suggestionsRef.current &&
				!suggestionsRef.current.contains(event.target as Node)
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
				!venue.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
				!venue.address.toLowerCase().includes(searchTerm.toLowerCase())
			) {
				return false
			}

			// Type filter (handle slash-separated types)
			if (selectedType) {
				const venueTypes = venue.venue_type.split("/").map((t) => t.trim())
				if (!venueTypes.some((type) => type === selectedType)) {
					return false
				}
			}

			// Neighborhood filter
			if (selectedNeighborhood && venue.neighborhood !== selectedNeighborhood) {
				return false
			}

			// Keyword filter
			if (keywordFilter) {
				const venueKeywords = getCleanKeywords(venue.keywords_tags)
				if (
					!venueKeywords.some((keyword) =>
						keyword.includes(keywordFilter.toLowerCase())
					)
				) {
					return false
				}
			}

			return true
		})
	}, [venues, searchTerm, selectedType, selectedNeighborhood, keywordFilter])

	// Update parent component with filtered venues
	useEffect(() => {
		if (onFilterChange) {
			onFilterChange(filteredVenues)
		}
	}, [filteredVenues, onFilterChange])

	// Clear all filters
	const clearAllFilters = () => {
		setSearchTerm("")
		setSelectedType("")
		setSelectedNeighborhood("")
		setKeywordFilter("")
		setShowKeywordSuggestions(false)
		setKeywordSuggestions([])
	}

	return (
		<div className="space-y-6">
			{/* Filters */}
			<div
				className={`bg-white rounded-lg shadow-lg ${isCompact ? "p-3" : "p-6"}`}
			>
				<h3
					className={`font-cardo font-bold text-text-primary mb-4 ${
						isCompact ? "text-lg" : "text-xl"
					}`}
				>
					Filter Venues
				</h3>

				<div
					className={`grid gap-4 ${
						isCompact
							? "grid-cols-1"
							: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
					}`}
				>
					{/* Search */}
					<div>
						<label className="block font-sans text-sm font-medium text-text-secondary mb-2">
							Search
						</label>
						<input
							type="text"
							placeholder="Venue name or address..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-sans text-base"
						/>
					</div>

					{/* Type Filter */}
					<div>
						<label className="block font-sans text-sm font-medium text-text-secondary mb-2">
							Type
						</label>
						<select
							value={selectedType}
							onChange={(e) => setSelectedType(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-sans text-base"
						>
							<option value="">All Types</option>
							{venueTypes.map((type) => (
								<option key={type} value={type}>
									{type}
								</option>
							))}
						</select>
					</div>

					{/* Neighborhood Filter */}
					<div>
						<label className="block font-sans text-sm font-medium text-text-secondary mb-2">
							Neighborhood
						</label>
						<select
							value={selectedNeighborhood}
							onChange={(e) => setSelectedNeighborhood(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-sans text-base"
						>
							<option value="">All Neighborhoods</option>
							{neighborhoods.map((hood) => (
								<option key={hood} value={hood}>
									{hood}
								</option>
							))}
						</select>
					</div>

					{/* Keyword Filter with Autocomplete */}
					<div className="relative">
						<label className="block font-sans text-sm font-medium text-text-secondary mb-2">
							Keywords/Tags
						</label>
						<div className="relative">
							<input
								ref={keywordInputRef}
								type="text"
								placeholder="Filter by keywords..."
								value={keywordFilter}
								onChange={(e) => handleKeywordInputChange(e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-sans text-base"
							/>
							{showKeywordSuggestions && (
								<div
									ref={suggestionsRef}
									className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto"
								>
									{keywordSuggestions.map((suggestion) => (
										<button
											key={suggestion}
											onClick={() => handleKeywordSuggestionClick(suggestion)}
											className="w-full text-left px-3 py-2 hover:bg-accent-celadon hover:text-white font-sans text-sm"
										>
											{suggestion}
										</button>
									))}
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Results Count and Clear Button */}
				<div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
					<p className="font-sans text-sm text-text-muted">
						Showing {filteredVenues.length} of {venues.length} venues
					</p>
					{(searchTerm ||
						selectedType ||
						selectedNeighborhood ||
						keywordFilter) && (
						<button
							onClick={clearAllFilters}
							className="px-4 py-2 bg-accent-tiffany text-white rounded-lg hover:bg-accent-tiffany/80 transition-colors font-sans text-sm"
						>
							Clear All
						</button>
					)}
				</div>
			</div>

			{/* Venue Grid - Responsive with proper sizing */}
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
				{filteredVenues.map((venue) => (
					<VenueCard
						key={venue.name}
						venue={venue}
						onClick={() => onVenueClick(venue)}
						isCompact={isCompact}
					/>
				))}
			</div>

			{/* No Results */}
			{filteredVenues.length === 0 && (
				<div className="text-center py-12">
					<p className="font-sans text-lg text-text-muted">
						No venues match your current filters.
					</p>
					<button
						onClick={clearAllFilters}
						className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-sans"
					>
						Clear All Filters
					</button>
				</div>
			)}
		</div>
	)
}
