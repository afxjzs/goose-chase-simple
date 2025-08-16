"use client"

import { useState, useEffect } from "react"

export default function SimpleTestPage() {
	const [status, setStatus] = useState("Loading...")
	const [data, setData] = useState<any>(null)

	useEffect(() => {
		testCSV()
	}, [])

	const testCSV = async () => {
		try {
			setStatus("Fetching CSV...")

			const response = await fetch("/chicago_venues_full_output.csv")
			setStatus(`Response status: ${response.status}`)

			if (!response.ok) {
				setStatus(`Error: ${response.status}`)
				return
			}

			setStatus("Reading CSV text...")
			const text = await response.text()
			setStatus(`CSV loaded: ${text.length} characters`)

			setStatus("Parsing with Papa Parse...")
			const Papa = (await import("papaparse")).default

			Papa.parse(text, {
				header: true,
				skipEmptyLines: true,
				complete: (results: any) => {
					setStatus(`Parsed ${results.data.length} rows`)
					setData(results.data.slice(0, 3))
				},
				error: (error: any) => {
					setStatus(`Parse error: ${error.message}`)
				},
			})
		} catch (error: any) {
			setStatus(`Error: ${error.message}`)
		}
	}

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold text-gray-900 mb-8">
					Simple CSV Test
				</h1>

				<div className="bg-white rounded-lg shadow-md p-6 mb-6">
					<h2 className="text-xl font-semibold text-gray-800 mb-4">Status</h2>
					<p className="text-lg">{status}</p>
					<button
						onClick={testCSV}
						className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
					>
						Retry Test
					</button>
				</div>

				{data && (
					<div className="bg-white rounded-lg shadow-md p-6">
						<h2 className="text-xl font-semibold text-gray-800 mb-4">
							First 3 Rows
						</h2>
						<pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
							{JSON.stringify(data, null, 2)}
						</pre>
					</div>
				)}
			</div>
		</div>
	)
}
