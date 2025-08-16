// Photo service to provide real images for venues
export interface VenuePhoto {
	url: string
	alt: string
	attribution?: string
}

// Get a real photo for a venue
export function getVenuePhoto(venueName: string, venueType: string): VenuePhoto {
	// Use Picsum Photos for real, beautiful placeholder images
	// Each venue gets a unique image based on their name
	const seed = venueName.split(' ').join('').toLowerCase()
	const width = 800
	const height = 600
	
	const url = `https://picsum.photos/seed/${seed}/${width}/${height}`
	
	return {
		url,
		alt: `${venueName} - ${venueType}`,
		attribution: "Photos from Picsum Photos"
	}
}

// Get multiple photo options for a venue
export function getVenuePhotos(venueName: string, venueType: string, count: number = 3): VenuePhoto[] {
	const photos: VenuePhoto[] = []
	
	for (let i = 0; i < count; i++) {
		const seed = `${venueName.split(' ').join('').toLowerCase()}-${i}`
		const width = 800
		const height = 600
		
		photos.push({
			url: `https://picsum.photos/seed/${seed}/${width}/${height}`,
			alt: `${venueName} - ${venueType} - Photo ${i + 1}`,
			attribution: "Photos from Picsum Photos"
		})
	}
	
	return photos
}

// Get a specific size photo
export function getVenuePhotoWithSize(venueName: string, venueType: string, width: number, height: number): VenuePhoto {
	const seed = venueName.split(' ').join('').toLowerCase()
	
	return {
		url: `https://picsum.photos/seed/${seed}/${width}/${height}`,
		alt: `${venueName} - ${venueType}`,
		attribution: "Photos from Picsum Photos"
	}
}
