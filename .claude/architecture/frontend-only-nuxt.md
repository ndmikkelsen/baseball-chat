# Architecture: Frontend-Only Nuxt Structure

> How we simplified from a monorepo to a single Nuxt app with server routes

**Last Updated**: 2026-01-05

---

## Decision

Use a **single Nuxt application** with built-in server routes instead of a separate backend service in a monorepo.

---

## Context

### Initial Approach (Monorepo)
```
baseball-chat/
├── apps/
│   ├── web/          # Nuxt frontend
│   └── api/          # Fastify backend
├── packages/
│   └── shared/       # Shared types
└── pnpm-workspace.yaml
```

**Problems:**
- ❌ Complex workspace configuration
- ❌ Duplicate type definitions
- ❌ Two dev servers to manage
- ❌ More complex deployment
- ❌ Overkill for simple CRUD app

### Final Approach (Single Nuxt App)
```
baseball-chat/
├── app/              # Frontend (pages, components)
├── server/           # Backend (API routes, services)
├── prisma/           # Database schema
└── package.json      # Single package
```

**Benefits:**
- ✅ Simpler project structure
- ✅ Single dev server
- ✅ Shared types via `~/server/utils/`
- ✅ Easier deployment (single build)
- ✅ Better DX (one codebase)

---

## Architecture

### Directory Structure

```
baseball-chat/
├── app/                        # Client-side code
│   ├── pages/                  # File-based routing
│   │   ├── index.vue          # Homepage (player list)
│   │   └── players/
│   │       ├── [id].vue       # Player detail
│   │       └── [id]/
│   │           └── edit.vue   # Edit player
│   ├── components/             # Vue components (auto-imported)
│   ├── composables/            # Composables (auto-imported)
│   └── app.vue                 # Root component
│
├── server/                     # Server-side code
│   ├── api/                    # API routes (auto-registered)
│   │   ├── players.get.ts     # GET /api/players
│   │   └── players/
│   │       ├── [id].get.ts    # GET /api/players/:id
│   │       ├── [id].patch.ts  # PATCH /api/players/:id
│   │       └── [id]/
│   │           └── description.post.ts  # POST /api/players/:id/description
│   ├── services/               # Business logic
│   │   └── players.ts         # Player service
│   └── utils/                  # Shared utilities & types
│       ├── player.ts          # Player type definition
│       └── prisma.ts          # Prisma client
│
├── prisma/                     # Database
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Migration history
│
├── public/                     # Static files
├── assets/                     # Build-time assets
│   └── css/
│       └── main.css           # Tailwind CSS
│
├── .claude/                    # Knowledge garden
├── nuxt.config.ts             # Nuxt configuration
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
├── docker-compose.yml         # PostgreSQL container
└── package.json               # Dependencies
```

---

## How It Works

### 1. Client-Side Rendering (CSR)

**Pages** (`app/pages/`) use Vue components with Nuxt features:

```vue
<!-- app/pages/index.vue -->
<script setup lang="ts">
import type { Player } from '~/server/utils/player'

// Fetch data from server API route
const { data: players } = await useFetch<Player[]>('/api/players')
</script>

<template>
  <div v-for="player in players" :key="player.id">
    {{ player.name }}
  </div>
</template>
```

### 2. Server-Side API Routes

**API routes** (`server/api/`) handle HTTP requests:

```typescript
// server/api/players.get.ts
import type { Player } from '~/server/utils/player'
import { getPlayers } from '~/server/services/players'

export default defineEventHandler(async (): Promise<Player[]> => {
  return await getPlayers()
})
```

**Route mapping:**
- `server/api/players.get.ts` → `GET /api/players`
- `server/api/players/[id].get.ts` → `GET /api/players/:id`
- `server/api/players/[id].patch.ts` → `PATCH /api/players/:id`

### 3. Business Logic Layer

**Services** (`server/services/`) contain business logic:

```typescript
// server/services/players.ts
import type { Player } from '~/server/utils/player'
import { prisma } from '~/server/utils/prisma'

export async function getPlayers(): Promise<Player[]> {
  // Fetch from upstream API
  const upstream = await fetchUpstreamPlayers()
  
  // Fetch local edits from database
  const edits = await prisma.player.findMany()
  
  // Merge upstream + local edits
  return mergePlayerData(upstream, edits)
}

export async function updatePlayer(id: string, data: Partial<Player>): Promise<Player> {
  // Save to database
  const updated = await prisma.player.upsert({
    where: { id },
    update: data,
    create: { id, ...data }
  })
  
  return updated
}
```

### 4. Shared Types

**Types** (`server/utils/`) are shared between server and client:

```typescript
// server/utils/player.ts
export interface Player {
  id: string
  name: string
  position: string
  // ... all fields
}

// Used in server
import type { Player } from '~/server/utils/player'

// Used in client
import type { Player } from '~/server/utils/player'
```

See [Type Sharing in Nuxt](../patterns/type-sharing-nuxt.md) for details.

---

## Data Flow

### Read Flow (GET)

```
1. User visits /players/barry-bonds
   ↓
2. Page component (app/pages/players/[id].vue)
   → useFetch('/api/players/barry-bonds')
   ↓
3. API route (server/api/players/[id].get.ts)
   → getPlayer('barry-bonds')
   ↓
4. Service (server/services/players.ts)
   → Fetch from upstream API
   → Fetch local edits from Prisma
   → Merge data
   ↓
5. Return Player object
   ↓
6. Render in page component
```

### Write Flow (PATCH)

```
1. User edits player and clicks "Save"
   ↓
2. Edit page (app/pages/players/[id]/edit.vue)
   → $fetch('/api/players/barry-bonds', { method: 'PATCH', body: form })
   ↓
3. API route (server/api/players/[id].patch.ts)
   → Validate with Zod schema
   → updatePlayer('barry-bonds', data)
   ↓
4. Service (server/services/players.ts)
   → prisma.player.upsert({ ... })
   ↓
5. Return updated Player object
   ↓
6. Redirect to detail page
```

---

## Development Workflow

### Single Dev Server

```bash
# Start everything with one command
pnpm dev

# Runs on http://localhost:3000
# - Frontend pages
# - API routes
# - Hot module replacement (HMR)
```

### Database Management

```bash
# Start PostgreSQL
docker compose up -d

# Run migrations
pnpm prisma migrate dev

# Open Prisma Studio
pnpm prisma studio
```

### Type Checking

```bash
# Check TypeScript types
pnpm typecheck

# Checks both client and server code
```

---

## Deployment

### Single Build Command

```bash
# Build for production
pnpm build

# Generates:
# - .output/public/     # Static assets
# - .output/server/     # Server bundle
```

### Deploy to Vercel/Netlify

```bash
# Vercel (automatic)
vercel deploy

# Netlify (automatic)
netlify deploy --prod
```

**Environment variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `NUXT_OPENAI_API_KEY` - OpenAI API key

---

## When to Use This Architecture

### ✅ Use Single Nuxt App When:
- Simple CRUD application
- < 10 API endpoints
- Single team working on project
- Want fast development
- Need simple deployment
- Types are shared between frontend/backend

### ❌ Use Monorepo When:
- Multiple frontend apps (web, mobile, admin)
- Large backend with many services
- Separate teams for frontend/backend
- Need to deploy services independently
- Complex microservices architecture
- Shared packages across multiple apps

---

## Trade-offs

### ✅ Advantages
- **Simpler structure** - One codebase, one package.json
- **Faster development** - Single dev server, instant HMR
- **Type safety** - Shared types via `~/server/utils/`
- **Easier deployment** - Single build command
- **Better DX** - Less context switching

### ⚠️ Disadvantages
- **Less separation** - Frontend and backend in same repo
- **Scaling limits** - Not ideal for large teams
- **Deployment coupling** - Can't deploy frontend/backend separately
- **Resource sharing** - Server routes share same Node process

---

## Migration Path

If you need to scale later:

### 1. Extract Backend to Separate Service

```
baseball-chat/
├── apps/
│   ├── web/          # Nuxt frontend (keep pages, components)
│   └── api/          # Fastify backend (move server/ here)
└── packages/
    └── types/        # Shared types
```

### 2. Keep API Routes as Proxy

```typescript
// apps/web/server/api/players.get.ts
export default defineEventHandler(async () => {
  // Proxy to separate backend
  return await $fetch('https://api.baseball-chat.com/players')
})
```

### 3. Gradually Migrate

- ✅ Start with single Nuxt app
- ✅ Extract backend when needed
- ✅ Keep types in shared package
- ✅ Use API routes as proxy layer

---

## Related Patterns

- [Type Sharing in Nuxt](../patterns/type-sharing-nuxt.md) - Share types between server/client
- [Nuxt Dynamic Routes](../quick-references/nuxt-dynamic-routes.md) - File-based routing
- [API Route Patterns](../patterns/api-routes.md) - Server-side API routes

---

## Resources

- [Nuxt Server Directory](https://nuxt.com/docs/guide/directory-structure/server)
- [Nuxt API Routes](https://nuxt.com/docs/guide/directory-structure/server#api-routes)
- [Nitro Server Engine](https://nitro.unjs.io/)

---

## Lessons Learned

1. **Start simple** - Don't over-engineer early
2. **Monorepo isn't always better** - Single app is often enough
3. **Nuxt server routes are powerful** - Built-in backend is underrated
4. **Type sharing is easy** - `~/server/utils/` works great
5. **Scale when needed** - Can always extract backend later

---

**Tags:** #architecture #nuxt #monorepo #server-routes #deployment
