# GooseChase — Product Requirements Document (PRD)

## Overview
GooseChase is a modern web application for exploring Chicago venues, built with Next.js (using the App Router), Supabase, and hosted on Vercel. The application will present curated venue data on a map and in filterable lists, with a focus on clean UI/UX, scalability, and maintainability. Future features will include AI-driven recommendations and user-submitted ratings. Supabase table names will be prefixed with `gc_`.

The initial release is publicly accessible (no authentication), but the codebase and architecture will follow best practices to enable seamless integration of Supabase Auth and additional features in later phases.

---

## Goals
1. Provide a visually clean, simple, and intuitive interface for exploring Chicago venues.
2. Enable users to browse venues via map or filterable list view.
3. Prepare the codebase for future features such as LLM-powered recommendations and user ratings.
4. Use Google Maps API for live imagery and possibly location-based queries.

---

## Tech Stack
- **Frontend:** Next.js (React, using App Router)
- **Backend:** Supabase (PostgreSQL + Supabase API)
- **Hosting:** Vercel
- **Map Integration:** Google Maps JavaScript API
- **Imagery:** Google Places API (live imagery, with optional caching)
- **AI Integration:** Gemini API (via environment variables) for future LLM chat

---

## Database Migrations & Schema Management

To maintain a robust and version-controlled database schema, GooseChase uses **Supabase CLI** migrations. This ensures consistent schema changes across local, staging, and production environments.

### Directory Layout
- `/supabase/` — Root directory for Supabase config and migrations.
- `/supabase/migrations/*.sql` — Migration SQL files, created sequentially.
- `/supabase/seed.sql` — Optional seed data for small lookup tables.
- `/supabase/types.ts` — Generated TypeScript types for database schema.

### Initialization Commands
1. Install Supabase CLI as a dev dependency:
   ```
   npm i -D supabase
   ```
2. Initialize Supabase in the project:
   ```
   npx supabase init
   ```
3. Link to your Supabase project (replace `<REF>` with your project ref):
   ```
   npx supabase link --project-ref <REF>
   ```
4. Store your Supabase access token securely as an environment variable (`SUPABASE_ACCESS_TOKEN`) and never commit it.

### Creating Migrations
- Create a new migration for the initial schema:
  ```
  npx supabase migration new init_gc_schema
  ```
- Paste SQL from the PRD for creating tables `gc_venues`, `gc_venue_platforms`, `gc_venue_links`, extensions (`postgis`, `pg_trgm`), indexes, and RLS policies.
- Always create migrations forward-only, never edit old migration files.
- Add RLS policies and grants in the same migration that creates the table.

### Applying Migrations Locally
- Start the local Supabase stack:
  ```
  npx supabase start
  ```
- To reset and apply migrations:
  ```
  npx supabase db reset
  ```
- Or push migrations without reset:
  ```
  npx supabase db push
  ```

### Applying Migrations to Remote
- To create a migration from the current remote state:
  ```
  npx supabase db remote commit
  ```
- To apply locally-created migrations to the linked remote project:
  ```
  npx supabase db push --linked
  ```

### Seeding Data
- For large CSV imports, keep them in a separate Node.js script to import data programmatically.
- Use `/supabase/seed.sql` for small lookup or static data.
- Avoid embedding large CSV data directly in migrations.

### Type Generation
- Generate TypeScript types from your remote project:
  ```
  npx supabase gen types typescript --project-id <REF> --schema public > supabase/types.ts
  ```
- Or generate locally:
  ```
  npx supabase gen types typescript --local > supabase/types.ts
  ```

### Versioning and Branching
- Create one migration per PR or feature.
- Never edit existing migration files after they are committed.
- Include RLS policies and grants in the same migration file as the table creation.

### CI/CD Integration
- Use a GitHub Action step to run `supabase db push` against the staging environment before Vercel deployment.
- After approval, run `supabase db push` against production.
- Use a machine token with `SUPABASE_ACCESS_TOKEN` secret for authentication.
- Never run migrations from client-side or UI code.

### Rollbacks
- Supabase CLI does not auto-generate down migrations.
- Adopt a forward-only migration strategy with corrective migrations for changes.
- For catastrophic rollbacks, restore from Supabase backups.

---

## Data Model

### Table: `gc_venues`
Stores the core information for each venue.
- `id` (UUID, primary key)
- `name` (string)
- `venue_type` (string)
- `address` (string)
- `neighborhood` (string)
- `google_maps_url` (string)
- `coordinates` (string, lat/lng format)
- `blog_description` (text)
- `general_description` (text)
- `keywords_tags` (text[] array)
- `yelp_rating` (float)
- `google_maps_rating` (float)
- `tripadvisor_rating` (float)
- `yelp_url` (string)
- `tripadvisor_url` (string)
- `yelp_reviews_count` (integer)
- `google_maps_reviews_count` (integer)
- `tripadvisor_reviews_count` (integer)
- `processed_at` (timestamp)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Table: `gc_venue_platforms`
A normalized table to store ratings from various platforms, allowing for future expansion.
- `id` (UUID, primary key)
- `venue_id` (UUID, foreign key to `gc_venues.id`)
- `platform_name` (string, e.g., "Yelp", "Google Maps")
- `platform_rating` (float)
- `platform_url` (string)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Table: `gc_venue_links`
Stores various external links related to a venue, such as their official website or social media pages.
- `id` (UUID, primary key)
- `venue_id` (UUID, foreign key to `gc_venues.id`)
- `link_type` (string, e.g., "Official Website", "Instagram")
- `url` (string)
- `created_at` (timestamp)
- `updated_at` (timestamp)

---

## Data Ingestion
The initial data will be sourced from `chicago_venues_full_output.csv`. A script should be created to parse this CSV and populate the `gc_venues` table. The CSV columns map directly to the table columns of the same name. A `UUID` will need to be generated for the `id` field during import.

---

## Features & Requirements

### Initial Version

1.  **Map View**
    -   Display all venues as markers using Google Maps API.
    -   Use distinct icons for each venue type.
    -   Marker popups show a summary and a "More Info" link.
    -   **Iconography:** Use [Material Design Icons](https://pictogrammers.com/library/mdi/). Example mapping:
        -   `restaurant`: `mdi-food`
        -   `bar`: `mdi-glass-cocktail`
        -   `cafe`: `mdi-coffee`
        -   `park`: `mdi-pine-tree`

2.  **Browse View**
    -   Filterable list of venues in responsive card format.
    -   Filters: search bar, tags, and venue type.
    -   Card click navigates to venue detail.

3.  **Venue Detail Page**
    -   Full venue information, including ratings from Yelp, Google Maps, and Tripadvisor.
    -   Display live images from Google Places API, with caching for performance.

#### UI/UX Specifications
- **Inspiration:** The general layout and card-based UI should draw inspiration from [Nomad List](https://nomadlist.com/).
- **Color Palette:**
    -   Primary: `#4F46E5` (Indigo)
    -   Secondary: `#10B981` (Emerald)
    -   Neutral: Grays from TailwindCSS (`slate`).
- **Typography:** Use the "Inter" font family.
- **Responsive Design:** All views adapt to mobile, tablet, and desktop; use TailwindCSS for consistency.
- **Accessibility:** Use semantic HTML, ARIA roles, keyboard navigation, and color contrast standards.
- **Performance Optimization:** Use dynamic imports, React Suspense, and minimize bundle size. Optimize images and leverage Next.js built-in Image component.

#### Architectural Best Practices
- **Next.js App Router:** Use the App Router (`/app` directory) for routing, layouts, and server components, following modern Next.js conventions.
- **Component Structure:** Organize UI into reusable, atomic components (e.g., `VenueCard`, `MapMarker`, `VenueDetail`), grouping by feature or domain.
- **API Layer Separation:** Create a dedicated API layer (e.g., `/lib/api` or `/services`) for all data fetching and mutations, abstracting Supabase and external API calls from UI components.
- **API Layer Definition:** The API layer should expose clear contracts for data fetching. For example:
    ```typescript
    // /lib/api/venues.ts
    import { Venue } from '@/lib/types';

    export async function getVenues(filters: {
      search?: string;
      type?: string;
      tags?: string[];
    }): Promise<Venue[]>;

    export async function getVenueById(id: string): Promise<Venue | null>;
    ```
- **State Management:** Use React context for global app state (e.g., filters, user location), and local component state where appropriate. For more complex state, consider Zustand or Jotai. Avoid prop drilling.
- **Environment Variable Handling:** Store all secrets and config (e.g., API keys) in `.env.local` and reference via `process.env`. Never commit secrets. Use Vercel's environment variable management for deployments.

#### Data & API Best Practices
- **Database Indexing:** Add indexes in Supabase for common query fields (e.g., `venue_type`, `neighborhood`, `keywords_tags`) to optimize filtering and search performance.
- **API Response Caching:** Cache Supabase and external API responses at the API layer (using SWR, React Query, or Next.js cache utilities) to reduce load and improve perceived speed.
- **Image Optimization:** Use Next.js `<Image />` for all images. Leverage image CDN, lazy loading, and automatic resizing. Cache image URLs from Google Places in Supabase for frequently accessed venues.

#### Deployment & Environment Configuration
- **Workflow:** Use GitHub Actions (or Vercel's built-in Git integration) for CI/CD. All main branch pushes trigger a Vercel deployment.
- **Environment Separation:** Maintain separate environment configs for development, staging, and production. Never share secrets between environments.
- **Rollback:** Enable Vercel preview deployments and rollbacks for safe releases.
- **Monitoring:** Integrate Vercel Analytics and Sentry (or similar) for error and performance monitoring.

---

### Future Improvements
- **LLM Chat Assistant:** Integrate Gemini API for venue recommendations and enable geolocation-based suggestions.
- **User Accounts & Ratings:** Add Supabase Auth (OAuth: Google, Apple, GitHub) and allow users to leave comments and ratings.

---

## Pages / Routes (App Router)
- `/` — Landing page, toggles between map and browse views.
- `/venue/[id]` — Venue detail page.
- `/chat` (future) — LLM chat recommendations.
- `/login` (future) — User authentication.

---

## API & Integrations
- **Google Maps JavaScript API**
- **Google Places API**
- **Supabase API**
- **Gemini API** (future)

---

## Imagery Handling
- Fetch images on the fly from Google Places API.
- Cache/store image URLs in Supabase for frequently accessed venues to reduce API calls and cost.
- Always use Next.js Image component with CDN, lazy loading, and proper sizing.

---

## Development Steps
### Phase 1 — MVP
1. Install and initialize Supabase CLI.
2. Create `init_gc_schema` migration from the PRD SQL.
3. Run `supabase db push` locally and verify schema.
4. Generate TypeScript types for the database.
5. Link your Supabase project and run `supabase db push` to staging and production environments as appropriate.
6. Configure Supabase API key and Google API keys in `.env.local`.
7. Create a script to import CSV data into Supabase.
8. Implement API layer for Supabase and Google API calls.
9. Build UI components and pages, following atomic/component-driven structure.
10. Implement map and browse views with filtering and responsive design.
11. Implement venue detail page with ratings and images.
12. Add database indexes for query fields.
13. Optimize images and cache API responses.

### Phase 2 — LLM Chat
1. Integrate Gemini API in the API layer.
2. Add geolocation-based queries.

### Phase 3 — User Auth & Ratings
1. Enable Supabase Auth with OAuth providers.
2. Add rating/comment forms and associate with user accounts.

---

## Notes
- v1 is read-only and open access.
- Follow Supabase's Next.js App Router tutorial (https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs) for best practices—even if skipping auth initially—to prepare for future enhancements.
- All code should be modular, well-documented, and tested. Use TypeScript for type safety.

---

### Migration SQL (starter)

```sql
-- Extensions
create extension if not exists postgis;
create extension if not exists pg_trgm;

-- Table: gc_venues
create table gc_venues (
  id uuid primary key,
  name text not null,
  venue_type text not null,
  address text,
  neighborhood text,
  google_maps_url text,
  coordinates geography(point, 4326),
  blog_description text,
  general_description text,
  keywords_tags text[],
  yelp_rating float,
  google_maps_rating float,
  tripadvisor_rating float,
  yelp_url text,
  tripadvisor_url text,
  yelp_reviews_count integer,
  google_maps_reviews_count integer,
  tripadvisor_reviews_count integer,
  processed_at timestamp,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Table: gc_venue_platforms
create table gc_venue_platforms (
  id uuid primary key,
  venue_id uuid references gc_venues(id) on delete cascade,
  platform_name text not null,
  platform_rating float,
  platform_url text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Table: gc_venue_links
create table gc_venue_links (
  id uuid primary key,
  venue_id uuid references gc_venues(id) on delete cascade,
  link_type text not null,
  url text not null,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Indexes for performance
create index idx_gc_venues_venue_type on gc_venues (venue_type);
create index idx_gc_venues_neighborhood on gc_venues (neighborhood);
create index idx_gc_venues_keywords_tags on gc_venues using gin (keywords_tags gin_trgm_ops);

-- RLS Policies (example for read-only v1)
alter table gc_venues enable row level security;
create policy "Allow select for all" on gc_venues for select using (true);

alter table gc_venue_platforms enable row level security;
create policy "Allow select for all" on gc_venue_platforms for select using (true);

alter table gc_venue_links enable row level security;
create policy "Allow select for all" on gc_venue_links for select using (true);
```