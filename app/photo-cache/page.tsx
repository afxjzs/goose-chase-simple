"use client"

import { useState, useEffect } from "react"
import { PhotoCache } from "@/lib/photoCache"

export default function PhotoCachePage() {
	const [cacheStats, setCacheStats] = useState<{
		total: number
		recent: number
	} | null>(null)
	const [csvStats, setCsvStats] = useState<any>(null)
	const [updating, setUpdating] = useState(false)
	const [updateResult, setUpdateResult] = useState<string>("")

	useEffect(() => {
		loadStats()
	}, [])

	const loadStats = async () => {
		// Get cache stats
		const photoCache = PhotoCache.getInstance()
		const cacheSize = photoCache.getCacheSize()
		setCacheStats({ total: cacheSize, recent: 0 }) // We don't track recent anymore

		// Get CSV stats
		try {
			const response = await fetch("/api/update-csv-photos")
			if (response.ok) {
				const data = await response.json()
				setCsvStats(data)
			}
		} catch (error) {
			console.error("Error loading CSV stats:", error)
		}
	}

	const updateCSVWithPhotos = async () => {
		setUpdating(true)
		setUpdateResult("")

		try {
			const photoCache = PhotoCache.getInstance()
			const cachedEntries = photoCache.exportCache()

			if (cachedEntries.length === 0) {
				setUpdateResult("No cached photos to update CSV with")
				return
			}

			const response = await fetch("/api/update-csv-photos", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ photoData: cachedEntries }),
			})

			if (response.ok) {
				const result = await response.json()
				setUpdateResult(`✅ ${result.message}`)
				// Reload stats
				loadStats()
			} else {
				const error = await response.text()
				setUpdateResult(`❌ Error: ${error}`)
			}
		} catch (error) {
			setUpdateResult(`❌ Error: ${error}`)
		} finally {
			setUpdating(false)
		}
	}

	const clearCache = () => {
		const photoCache = PhotoCache.getInstance()
		photoCache.clearCache()
		setCacheStats({ total: 0, recent: 0 })
		setUpdateResult("Cache cleared")
	}

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-6xl mx-auto">
				<h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
					Photo Cache Management
				</h1>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
					{/* Cache Statistics */}
					<div className="bg-white rounded-lg shadow-md p-6">
						<h2 className="text-xl font-semibold text-gray-800 mb-4">
							Photo Cache Status
						</h2>
						{cacheStats && (
							<div className="space-y-3">
								<div className="flex justify-between">
									<span className="text-gray-600">Total Cached Photos:</span>
									<span className="font-semibold text-blue-600">
										{cacheStats.total}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">Recently Added (24h):</span>
									<span className="font-semibold text-green-600">
										{cacheStats.recent}
									</span>
								</div>
							</div>
						)}
						<div className="mt-4 flex gap-2">
							<button
								onClick={loadStats}
								className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
							>
								Refresh Stats
							</button>
							<button
								onClick={clearCache}
								className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
							>
								Clear Cache
							</button>
						</div>
					</div>

					{/* CSV Status */}
					<div className="bg-white rounded-lg shadow-md p-6">
						<h2 className="text-xl font-semibold text-gray-800 mb-4">
							CSV Photo Coverage
						</h2>
						{csvStats && (
							<div className="space-y-3">
								<div className="flex justify-between">
									<span className="text-gray-600">Total Venues:</span>
									<span className="font-semibold">{csvStats.total}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">With Photos:</span>
									<span className="font-semibold text-green-600">
										{csvStats.withPhotos}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">Without Photos:</span>
									<span className="font-semibold text-red-600">
										{csvStats.withoutPhotos}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">Coverage:</span>
									<span className="font-semibold text-blue-600">
										{csvStats.photoCoverage}%
									</span>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Actions */}
				<div className="bg-white rounded-lg shadow-md p-6 mb-8">
					<h2 className="text-xl font-semibold text-gray-800 mb-4">Actions</h2>
					<div className="space-y-4">
						<div>
							<button
								onClick={updateCSVWithPhotos}
								disabled={updating || !cacheStats?.total}
								className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
							>
								{updating
									? "Updating..."
									: `Update CSV with ${cacheStats?.total || 0} Cached Photos`}
							</button>
							<p className="text-sm text-gray-600 mt-2">
								This will update the CSV file with all currently cached photo
								references, making future loads much faster.
							</p>
						</div>

						{updateResult && (
							<div
								className={`p-4 rounded-lg ${
									updateResult.startsWith("✅")
										? "bg-green-50 border border-green-200 text-green-800"
										: "bg-red-50 border border-red-200 text-red-800"
								}`}
							>
								{updateResult}
							</div>
						)}
					</div>
				</div>

				{/* How It Works */}
				<div className="bg-white rounded-lg shadow-md p-6">
					<h2 className="text-xl font-semibold text-gray-800 mb-4">
						How Photo Caching Works
					</h2>
					<div className="space-y-4 text-gray-700">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="text-center">
								<div className="text-3xl mb-2">🔍</div>
								<h3 className="font-semibold mb-2">1. First Load</h3>
								<p className="text-sm">
									Photos are fetched from Google Places API and cached in memory
								</p>
							</div>
							<div className="text-center">
								<div className="text-3xl mb-2">💾</div>
								<h3 className="font-semibold mb-2">2. Cache CSV</h3>
								<p className="text-sm">
									Click "Update CSV" to save photo references to the CSV file
								</p>
							</div>
							<div className="text-center">
								<div className="text-3xl mb-2">⚡</div>
								<h3 className="font-semibold mb-2">3. Fast Loads</h3>
								<p className="text-sm">
									Future loads use cached photos instantly - no API calls
									needed!
								</p>
							</div>
						</div>

						<div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
							<h3 className="font-semibold text-blue-800 mb-2">Benefits:</h3>
							<ul className="text-blue-700 text-sm space-y-1">
								<li>
									• <strong>Instant photo loading</strong> after first cache
								</li>
								<li>
									• <strong>No API rate limit issues</strong> on subsequent
									loads
								</li>
								<li>
									• <strong>Faster app performance</strong> for users
								</li>
								<li>
									• <strong>Reduced Google Places API costs</strong>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
