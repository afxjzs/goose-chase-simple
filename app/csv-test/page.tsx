"use client"

import { useState } from "react"
import { parseVenuesCSV } from "@/lib/csvParser"

export default function CSVTestPage() {
	const [loading, setLoading] = useState(false)
	const [result, setResult] = useState<string>("")
	const [error, setError] = useState<string>("")

	const testCSVParsing = async () => {
		setLoading(true)
		setResult("")
		setError("")

		try {
			console.log("Starting CSV test...")
			
			// Fetch CSV file
			const response = await fetch("/chicago_venues_full_output.csv")
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const csvText = await response.text()
			console.log("CSV text length:", csvText.length)
			console.log("CSV preview:", csvText.substring(0, 200))

			// Parse CSV
			const venues = await parseVenuesCSV(csvText)
			console.log("Parsed venues:", venues.length)
			console.log("First venue:", venues[0])

			setResult(`Successfully parsed ${venues.length} venues. First venue: ${venues[0]?.name}`)
		} catch (err: any) {
			console.error("CSV test error:", err)
			setError(err.message || "Unknown error")
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">CSV Parsing Test</h1>
				
				<div className="bg-white rounded-lg shadow-md p-6 mb-8">
					<button
						onClick={testCSVParsing}
						disabled={loading}
						className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
					>
						{loading ? "Testing..." : "Test CSV Parsing"}
					</button>

					{error && (
						<div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
							<p className="text-red-800 font-medium">Error: {error}</p>
						</div>
					)}

					{result && (
						<div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
							<p className="text-green-800 font-medium">{result}</p>
						</div>
					)}
				</div>

				<div className="bg-white rounded-lg shadow-md p-6">
					<h2 className="text-xl font-semibold text-gray-800 mb-4">What This Test Does:</h2>
					<ol className="list-decimal list-inside space-y-2 text-gray-700">
						<li>Fetches the CSV file from the server</li>
						<li>Attempts to parse it using our CSV parser</li>
						<li>Shows the results or any errors</li>
					</ol>
					<p className="mt-4 text-sm text-gray-600">
						Check the browser console for detailed logging.
					</p>
				</div>
			</div>
		</div>
	)
}
