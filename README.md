# RadioWorld 🌍📻

A full-stack web application to stream **30,000+ live radio stations** from every country on Earth. Built with Next.js 14, PostgreSQL, NextAuth.js, and the Radio Browser API.

> **Live demo:** Deploy instructions below — set up in ~5 minutes

---

## Features

### Core
- 🎙️ Stream live radio from 30,000+ stations across 190+ countries
- 🗺️ Interactive world map — click any country to browse its stations
- 🌏 Continent filters — Asia, Europe, Americas, Africa, Oceania
- 🔍 Search & filter by name, language, state, genre, or country
- ❤️ Favorites — saved to database per user account
- 🕐 Listening history — last 20 stations, per user

### Player
- ▶️ Persistent bottom player bar — plays across all page navigation
- 🌙 Sleep timer — auto-stops after 15 / 30 / 60 / 90 minutes
- ⌨️ Keyboard shortcuts — `Space` play/pause · `M` mute · `↑↓` volume
- 📡 HLS + MP3 stream support (hls.js for Chrome/Firefox, native for Safari)
- 🔗 Share button — copies station URL to clipboard in one click

### Full Stack
- 🔐 Authentication — GitHub & Google OAuth via NextAuth.js
- 🗄️ PostgreSQL database with Prisma ORM
- 📊 Global play count tracking + leaderboard
- 👤 User profile — favorites, history, top stations in one place
- 📱 PWA — installable on mobile via Chrome

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State management | Zustand |
| Authentication | NextAuth.js v4 |
| Database | PostgreSQL (SQLite for local) |
| ORM | Prisma |
| Map | react-simple-maps + world-atlas TopoJSON |
| Audio | HTML5 Audio + hls.js |
| Data source | Radio Browser API |
| Deployment | Vercel |

---

## Project Structure

```
radioworld/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/    # NextAuth handler
│   │   ├── stations/              # Radio Browser API proxy + fallback
│   │   ├── favorites/             # CRUD favorites (auth required)
│   │   ├── history/               # Play history per user
│   │   └── stats/                 # Global play count tracking
│   ├── auth/signin/               # Custom OAuth sign-in page
│   ├── map/                       # Interactive world map page
│   ├── stations/
│   │   └── [id]/                  # Station detail page
│   ├── favorites/                 # Favorites + recently played
│   └── profile/                   # User dashboard
├── components/
│   ├── player/
│   │   ├── PlayerBar.tsx          # Persistent bottom player
│   │   └── SleepTimer.tsx         # Sleep timer dropdown
│   ├── stations/
│   │   ├── StationCard.tsx        # Station grid card
│   │   └── StationFilters.tsx     # Filter pills
│   ├── map/
│   │   └── WorldMap.tsx           # react-simple-maps world map
│   └── layout/
│       ├── Header.tsx             # Nav + auth state
│       └── Providers.tsx          # SessionProvider wrapper
├── lib/
│   ├── api.ts                     # Radio Browser API calls
│   ├── auth.ts                    # NextAuth configuration
│   ├── prisma.ts                  # Prisma client singleton
│   ├── store.ts                   # Zustand player + favorites store
│   └── types.ts                   # TypeScript interfaces
├── hooks/
│   └── useKeyboardShortcuts.ts    # Keyboard shortcut handler
├── data/
│   └── stations.json              # Static fallback stations
└── prisma/
    └── schema.prisma              # Database schema
```

---

## Database Schema

```prisma
model User {
  id        String        @id @default(cuid())
  name      String?
  email     String?       @unique
  image     String?
  favorites Favorite[]
  history   PlayHistory[]
}

model Favorite {
  userId      String
  stationId   String
  stationName String
  stationData String       // Full station JSON
  @@unique([userId, stationId])
}

model PlayHistory {
  userId      String
  stationId   String
  stationName String
  countryCode String
  playedAt    DateTime @default(now())
}

model StationStats {
  stationId   String   @id
  stationName String
  countryCode String
  playCount   Int      @default(0)
}
```

---

## API Routes

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/stations` | Fetch stations (all or by country/query) | No |
| GET | `/api/favorites` | Get user's saved favorites | Yes |
| POST | `/api/favorites` | Add a station to favorites | Yes |
| DELETE | `/api/favorites` | Remove a station from favorites | Yes |
| GET | `/api/history` | Get user's listening history | Yes |
| POST | `/api/history` | Record a station play | Yes |
| GET | `/api/stats` | Global play count leaderboard | No |
| POST | `/api/stats` | Increment a station's play count | No |

---

## Local Setup

### 1. Clone and install

```bash
git clone https://github.com/Riiyansh/radioworld.git
cd radioworld
npm install
```

### 2. Environment variables

Create `.env.local`:

```env
# Database — SQLite for local dev
DATABASE_URL="file:./prisma/dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="any-random-string-here"

# GitHub OAuth — github.com/settings/developers
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Google OAuth — console.cloud.google.com
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 3. Push database schema

```bash
npx prisma db push
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment (Vercel + Supabase)

### 1. Create a PostgreSQL database

Sign up at [supabase.com](https://supabase.com) (free tier) and copy the connection string:

```env
DATABASE_URL="postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres"
```

### 2. Set up OAuth apps

**GitHub:** Settings → Developer settings → OAuth Apps → New
- Callback URL: `https://your-app.vercel.app/api/auth/callback/github`

**Google:** console.cloud.google.com → Credentials → OAuth 2.0
- Redirect URI: `https://your-app.vercel.app/api/auth/callback/google`

### 3. Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

Add all env vars in Vercel Dashboard → Settings → Environment Variables.

### 4. Push schema to production

```bash
DATABASE_URL="your-supabase-url" npx prisma db push
```

---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `Space` | Play / Pause |
| `M` | Toggle mute |
| `↑` | Volume +5% |
| `↓` | Volume -5% |

---

## Data Source

Stations are fetched from the [Radio Browser API](https://www.radio-browser.info/) — a free, community-maintained database of 30,000+ stations. No API key required. Requests are proxied through a Next.js API route with multi-server fallback (`de1`, `nl1`, `at1`).

A static fallback of 31 curated stations is served when the API is unreachable (e.g. restricted networks).

---

## License

MIT
