# Photo Integration Documentation

## Overview

This application now includes comprehensive photo functionality for venues using Google Places Photos API. Photos are securely served through a server-side proxy to protect API keys while providing optimal performance and caching.

## Features

### 🖼️ Photo Components

- **VenueHeroPhoto**: Large hero images for venue detail views
- **VenuePhotoThumbnail**: Smaller thumbnails for cards and map popups
- **PhotoAttribution**: Safe display of Google's photo attribution

### 🔒 Security Features

- **Server-Side Proxy**: API keys never exposed to client
- **Secure Photo Serving**: All photo requests routed through `/api/photo`
- **Proper Attribution**: Google Places attribution requirements met

### ⚡ Performance Features

- **Edge Caching**: Vercel edge caching for fast photo delivery
- **Lazy Loading**: Progressive image loading with skeleton screens
- **Responsive Images**: Optimized sizes for different devices
- **Error Handling**: Graceful fallbacks for missing or failed photos

## API Endpoints

### `/api/photo`

Serves Google Places photos securely with caching.

**Query Parameters:**
- `ref` (required): Google Places photo reference
- `w` (optional): Maximum width (default: 640)
- `h` (optional): Maximum height

**Example:**
```
GET /api/photo?ref=AZose0nX...&w=800&h=600
```

**Response:**
- Image bytes with proper cache headers
- HTTP 400 for missing reference
- HTTP 502 for photo fetch failures

## Component Usage

### VenueHeroPhoto

```tsx
import VenueHeroPhoto from '@/components/VenueHeroPhoto'

<VenueHeroPhoto
	photoRef={venue.gmaps_primary_photo_ref}
	name={venue.name}
	className="mb-4"
/>
```

### VenuePhotoThumbnail

```tsx
import VenuePhotoThumbnail from '@/components/VenuePhotoThumbnail'

<VenuePhotoThumbnail
	photoRef={venue.gmaps_primary_photo_ref}
	name={venue.name}
	size="md" // 'sm' | 'md' | 'lg'
/>
```

### PhotoAttribution

```tsx
import PhotoAttribution from '@/components/PhotoAttribution'

<PhotoAttribution html={venue.gmaps_photo_attribution} />
```

## Data Structure

### Venue Interface Updates

```typescript
export interface Venue {
	// ... existing fields ...
	
	// Photo-related fields
	gmaps_place_id?: string
	gmaps_primary_photo_ref?: string
	gmaps_photo_attribution?: string
}
```

### CSV Structure

The enriched CSV should include these additional columns:

```csv
name,venue_type,...,gmaps_place_id,gmaps_primary_photo_ref,gmaps_photo_attribution
"Yolk (South Loop)",restaurant,...,"ChIJN1t_tDeuD4gR9ZUBSO4a4_E","AZose0nX...","© 2024 Google"
```

## Data Enrichment

### Enrichment Script

Use the provided `scripts/enrich-venues.js` script to add photo data:

```bash
node scripts/enrich-venues.js
```

**Note**: This is a demonstration script. In production, implement:
- Real Google Places API calls
- Rate limiting and quota management
- Error handling and retries
- Database storage

### Google Places API Integration

1. **Places Text Search**: Find venues by name and address
2. **Place Details**: Get photos and attribution
3. **Photo References**: Store for later retrieval

## Caching Strategy

### Cache Headers

Photos are cached with these headers:
```
Cache-Control: public, s-maxage=86400, max-age=3600, stale-while-revalidate=86400
```

- **s-maxage=86400**: Vercel edge cache for 24 hours
- **max-age=3600**: Browser cache for 1 hour
- **stale-while-revalidate=86400**: Serve stale content while revalidating

### Performance Benefits

- **Edge Caching**: Photos served from Vercel's global network
- **Reduced API Calls**: Cached photos don't hit Google's API
- **Faster Loading**: Subsequent requests served from cache

## Error Handling

### Photo Loading States

- **Loading**: Skeleton screens with loading indicators
- **Error**: Fallback placeholders with camera icons
- **Missing**: Graceful degradation to text-only display

### Fallback Strategy

1. Try to load photo from Google Places
2. Show loading skeleton while fetching
3. Display photo if successful
4. Show fallback placeholder if failed
5. Maintain functionality without photos

## Security Considerations

### API Key Protection

- **Never exposed client-side**: All requests go through server proxy
- **Server-side validation**: API key validation on server
- **Rate limiting**: Implement if needed for production

### Attribution Compliance

- **Google Requirements**: Display photo attribution as required
- **Safe HTML**: Use `dangerouslySetInnerHTML` with trusted content
- **Fallback Text**: Provide attribution even if HTML fails

## Future Enhancements

### Planned Features

- **Photo Galleries**: Multiple photos per venue
- **User Uploads**: Allow venue owners to add photos
- **Photo Moderation**: Admin approval for user uploads
- **Advanced Caching**: Redis or Supabase storage for hot photos

### Performance Improvements

- **WebP Support**: Modern image formats
- **Progressive Loading**: Low-res to high-res progression
- **Intersection Observer**: Lazy loading optimization
- **Service Worker**: Offline photo caching

## Troubleshooting

### Common Issues

1. **Photos Not Loading**
   - Check API key configuration
   - Verify photo references in data
   - Check browser console for errors

2. **Slow Photo Loading**
   - Verify cache headers are set
   - Check Vercel edge caching
   - Optimize image sizes

3. **Attribution Not Showing**
   - Verify attribution data in CSV
   - Check PhotoAttribution component
   - Ensure HTML is properly escaped

### Debug Mode

Enable debug logging in photo components:

```tsx
// Add to components for debugging
console.log('Photo ref:', photoRef)
console.log('Photo attribution:', attribution)
```

## Support

For issues with photo integration:
1. Check the browser console for errors
2. Verify API key configuration
3. Test photo endpoint directly
4. Check CSV data structure
5. Review component props and state
