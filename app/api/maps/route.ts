import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url)
	const action = searchParams.get('action')
	
	if (action === 'load-api') {
		// Return the API key for client-side use, but only if it's a valid request
		const apiKey = process.env.GOOGLE_MAPS_API_KEY
		
		if (!apiKey) {
			return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
		}
		
		return NextResponse.json({ 
			apiKey,
			scriptUrl: `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
		})
	}
	
	return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
