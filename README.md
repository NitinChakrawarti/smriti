# LinkVault AI - Frontend

Modern SaaS UI for LinkVault AI built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Backend API running on port 5000

### Installation

```bash
# Install dependencies
npm install

# Create .env.local file
cp .env.local.example .env.local

# Edit .env.local if needed
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Run development server
npm run dev

# Or build for production
npm run build
npm start
```

The app will start on `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles
│   └── providers.tsx      # Redux provider
├── components/            # React components
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── LinkCard.tsx
│   ├── LinkGrid.tsx
│   ├── AddLinkModal.tsx
│   ├── Toast.tsx
│   ├── EmptyState.tsx
│   └── LoadingSkeleton.tsx
├── store/                 # Redux store
│   ├── index.ts
│   ├── hooks.ts
│   └── slices/
│       ├── linksSlice.ts
│       └── uiSlice.ts
├── services/              # API services
│   └── api.ts
├── types/                 # TypeScript types
│   └── index.ts
└── package.json
```

## 🎨 Design System

### Colors
- **Background**: `#0a0a0a` - Deep black
- **Card**: `#141414` - Dark gray
- **Primary**: `#3b82f6` - Blue
- **Secondary**: `#6366f1` - Indigo
- **Accent**: `#8b5cf6` - Purple

### Components
- Glassmorphism cards with backdrop blur
- Smooth hover animations
- Skeleton loaders
- Toast notifications
- Modal dialogs

## 🔌 Features

- ✅ Modern SaaS UI with dark mode
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Redux Toolkit for state management
- ✅ Real-time filtering and sorting
- ✅ Toast notifications
- ✅ Loading states and skeletons
- ✅ Empty states
- ✅ Glassmorphism design
- ✅ Smooth animations

## 🎯 Key Components

### LinkCard
Displays individual link with:
- Thumbnail image
- Title and summary
- Tags
- Category badge
- Read/unread toggle
- Delete action
- External link

### Sidebar
Filters panel with:
- Statistics
- Read status filter
- Category filters
- Clear filters button

### Header
Top navigation with:
- Menu toggle
- Logo
- Search bar
- Add link button

### AddLinkModal
Modal for adding new links:
- URL input
- Loading state
- AI processing indicator

## 📱 Responsive Design

- **Mobile**: Single column, collapsible sidebar
- **Tablet**: 2 columns
- **Desktop**: 3 columns, persistent sidebar

## 🎨 Customization

### Colors
Edit `tailwind.config.ts` to customize colors:

```typescript
colors: {
  primary: '#3b82f6',
  secondary: '#6366f1',
  // ...
}
```

### Layout
Adjust grid columns in `LinkGrid.tsx`:

```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
```

## 🔧 Environment Variables

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 📝 Notes

- Uses Next.js 14 App Router
- TypeScript for type safety
- Redux Toolkit for state management
- Tailwind CSS for styling
- Lucide React for icons
- Axios for API calls

## 🚀 Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

For deployment to Vercel:
```bash
vercel deploy
```

Make sure to set environment variables in your deployment platform.
