# Chicago Venues Map

A Next.js application that displays Chicago venues on an interactive map interface with a filterable list view.

## Features

- Interactive venue map with clickable markers
- Filterable venue list with search, venue type, and neighborhood filters
- Detailed venue information in modal popups
- Responsive design with Tailwind CSS
- TypeScript for type safety
- **Secure**: No API keys exposed to client-side

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   Or use the start script:
   ```bash
   ./start.sh
   ```

## Usage

- **Map View**: Click on venue markers to view venue details
- **List View**: Browse all venues below the map with filtering options
- **Search**: Use the search bar to find venues by name, description, or neighborhood
- **Filters**: Filter by venue type or neighborhood
- **Details**: Click any venue card or map marker to open detailed information

## Data Source

The app loads venue data from `public/chicago_venues_full_output.csv`, which contains information about restaurants, bars, clubs, and other venues across Chicago.

## Security Features

- **No client-side API keys**: All sensitive operations are handled server-side
- **Server-side proxy**: API routes protect your credentials
- **Environment variables**: Secure configuration management

## Deployment

This app is configured for Vercel deployment. The CSV file will be served as a static asset from the public folder.

## Architecture

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Data**: CSV parsing with PapaParse
- **Map**: Custom interactive map component (no external map API required)
- **Security**: Server-side API routes for any future external API integrations
