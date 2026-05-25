# Smriti - Frontend

Smriti is a lightweight AI knowledge workspace that captures links, organizes them
automatically, and gives you a clean place to search, scan, and revisit what matters.

This frontend is a modern SaaS UI built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Backend API running (default: port 5000)

### Installation

```bash
# Install dependencies
npm install

# Create .env.local from example
copy .env.local.example .env.local

# Edit .env.local if needed (Windows: use an editor)
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Run development server
npm run dev

# Or build for production
npm run build
npm start
```

The app will start on http://localhost:3000 by default.

## 📋 Summary

This repo contains the frontend for Smriti using the Next.js App Router, Redux Toolkit for state, Tailwind CSS for styling, and API helpers in `services/api.ts`.

See the `app` folder for pages and components.

## ✨ Features (detected)

The frontend implements the following features (extracted from the codebase):

- Authentication
	- Phone / Telegram OTP flow with optional name step (`components/PhoneAuth.tsx`, `services/api.ts`).
	- Legacy email/password register & login endpoints supported in `services/api.ts`.

- Content capture & processing
	- Add content modal supports Link, Text, Image and PDF uploads (`components/AddLinkModal.tsx`).
	- AI enrichment: automatic summary, tag extraction, category classification, and metadata/thumbnail fetching.
	- PWA/share flow and server redirect endpoint (`app/api/share/route.ts`, `app/share/share-page-client.tsx`).

- Library management
	- Add, list, delete links and toggle read/unread (`store/slices/linksSlice.ts`, `components/LinkCard.tsx`).
	- Search and category filters (header search, category dropdown in `components/Header.tsx`).
	- Dashboard with stats and category distribution (`app/dashboard/page.tsx`).

- UX & UI
	- Responsive design, skeleton loaders, toast notifications and polished components (Header, Sidebar, LinkGrid, LinkCard).
	- Dark/light themes via `next-themes` and Tailwind styling.

- Client/server integration
	- Axios client with automatic token injection and endpoints for auth, links and stats (`services/api.ts`).

## About (highlights)

Smriti highlights (from the app About page):

- AI-powered capture: Turns shared links into summaries, tags, and useful categories automatically.
- Knowledge vault: Stores content in one clean dashboard so it is easy to search and revisit later.
- Private by design: Built to keep your saved knowledge organized, personal, and secure.


## 📁 Project Structure (overview)

```
frontend/
├── app/            # Next.js App Router (pages + routes)
├── components/     # React components (Header, Sidebar, LinkCard, etc.)
├── store/          # Redux store and slices
├── services/       # API helpers (services/api.ts)
├── public/         # static assets
├── styles/         # global styles (globals.css)
└── package.json
```

## 🔧 Environment Variables

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 📝 Notes

- Uses Next.js 14 App Router and TypeScript
- Redux Toolkit for state management
- Tailwind CSS for styling
- Axios for API calls

## 🚀 Deployment

Build and start locally:

```bash
npm run build
npm start
```

Deploy to Vercel or your preferred host and set `NEXT_PUBLIC_API_URL` in production.

---

