"use client"

import VenueHeroPhoto from "@/components/VenueHeroPhoto"

export default function SimplePhotoPage() {
	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
					Simple Photo Test
				</h1>
				
				<div className="bg-white rounded-lg shadow-md p-6">
					<h2 className="text-xl font-semibold text-gray-800 mb-4">Yolk (South Loop)</h2>
					<p className="text-gray-600 mb-4">Breakfast & Brunch</p>
					
					<VenueHeroPhoto
						photoRef="https://picsum.photos/seed/yolk/800/600"
						name="Yolk (South Loop)"
					/>
					
					<div className="mt-4 text-sm text-gray-500">
						Photo from Picsum Photos
					</div>
				</div>
			</div>
		</div>
	)
}
