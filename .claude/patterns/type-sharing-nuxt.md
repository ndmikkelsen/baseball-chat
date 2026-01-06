# Pattern: Type Sharing in Nuxt

> How to share TypeScript types between server and client code in Nuxt

**Last Updated**: 2026-01-05

---

## Problem

In a Nuxt application, you often need the same TypeScript types in both:
- **Server code** (API routes, server utils)
- **Client code** (pages, components)

Duplicating types leads to:
- ❌ Maintenance burden (update in two places)
- ❌ Type drift (server and client types diverge)
- ❌ Bugs (mismatched types cause runtime errors)

---

## Solution: Single Source of Truth

Define types in `server/utils/` and import them in client code using the `~/server/utils/` alias.

---

## Implementation

### 1. Define Types in Server Utils

**File:** `server/utils/player.ts`

```typescript
// Define the type once
export interface Player {
  id: string
  name: string
  position: string
  games: number
  atBats: number
  runs: number
  hits: number
  doubles: number
  triples: number
  homeRuns: number
  rbi: number
  walks: number
  strikeouts: number
  stolenBases: number
  caughtStealing: number
  avg: number
  obp: number
  slg: number
  ops: number
  description?: string | null
}

// Export utility functions that use the type
export function mapUpstreamPlayer(data: any): Player {
  return {
    id: String(data.id),
    name: data.name,
    position: data.position,
    // ... mapping logic
  }
}
```

### 2. Use in Server Code

**File:** `server/api/players.get.ts`

```typescript
import type { Player } from '~/server/utils/player'

export default defineEventHandler(async (): Promise<Player[]> => {
  const players = await fetchPlayers()
  return players
})
```

**File:** `server/services/players.ts`

```typescript
import type { Player } from '~/server/utils/player'

export async function getPlayer(id: string): Promise<Player | null> {
  // Implementation
}

export async function updatePlayer(id: string, data: Partial<Player>): Promise<Player> {
  // Implementation
}
```

### 3. Import in Client Code

**File:** `app/pages/index.vue`

```vue
<script setup lang="ts">
// Import the same type from server utils
import type { Player } from '~/server/utils/player'

// Use it for type-safe data fetching
const { data: players } = await useFetch<Player[]>('/api/players')

// TypeScript knows the shape of player
function viewPlayer(player: Player) {
  navigateTo(`/players/${player.id}`)
}
</script>

<template>
  <div v-for="player in players" :key="player.id">
    <h2>{{ player.name }}</h2>
    <p>{{ player.position }}</p>
  </div>
</template>
```

**File:** `app/pages/players/[id].vue`

```vue
<script setup lang="ts">
import type { Player } from '~/server/utils/player'

const route = useRoute()
const id = route.params.id as string

// Type-safe API call
const { data: player } = await useFetch<Player>(`/api/players/${id}`)
</script>

<template>
  <div v-if="player">
    <h1>{{ player.name }}</h1>
    <p>Games: {{ player.games }}</p>
    <p>Hits: {{ player.hits }}</p>
  </div>
</template>
```

---

## Why This Works

### Nuxt Auto-Imports

Nuxt automatically makes `server/utils/` available to both server and client code via the `~/server/utils/` alias.

**Import paths:**
```typescript
// Both work the same way
import type { Player } from '~/server/utils/player'
import type { Player } from '@/server/utils/player'
```

### Type-Only Imports

Using `import type` ensures:
- ✅ Types are stripped at build time (no runtime overhead)
- ✅ No server code is bundled in client
- ✅ Full TypeScript type checking

---

## Benefits

### ✅ Single Source of Truth
- Define types once in `server/utils/`
- Use everywhere (server and client)
- No duplication

### ✅ Type Safety
- API responses match expected types
- Catch errors at compile time
- IntelliSense in both server and client

### ✅ Maintainability
- Update type in one place
- Changes propagate everywhere
- Refactoring is safe

### ✅ No Runtime Overhead
- `import type` is stripped at build time
- No server code in client bundle
- Zero performance impact

---

## Common Patterns

### 1. API Response Types

```typescript
// server/utils/api-types.ts
export interface ApiResponse<T> {
  data: T
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

// Use in server
export default defineEventHandler(async (): Promise<ApiResponse<Player[]>> => {
  return { data: players }
})

// Use in client
const { data } = await useFetch<ApiResponse<Player[]>>('/api/players')
```

### 2. Form Data Types

```typescript
// server/utils/player.ts
export interface Player {
  id: string
  name: string
  // ... all fields
}

export type PlayerFormData = Omit<Player, 'id'>

// Use in edit form
const form = ref<PlayerFormData>({
  name: '',
  position: '',
  // ...
})
```

### 3. Validation Schemas

```typescript
// server/utils/validation.ts
import { z } from 'zod'

export const playerSchema = z.object({
  name: z.string().min(1),
  position: z.string().min(1),
  games: z.number().int().min(0),
  // ...
})

export type PlayerInput = z.infer<typeof playerSchema>

// Use in API route
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const validated = playerSchema.parse(body)
  // ...
})

// Use in client form
import type { PlayerInput } from '~/server/utils/validation'
const form = ref<PlayerInput>({ ... })
```

---

## Anti-Patterns

### ❌ Don't Duplicate Types

```typescript
// ❌ BAD: Duplicate type definition
// server/utils/player.ts
export interface Player {
  id: string
  name: string
  // ...
}

// app/types/player.ts
export interface Player {  // ❌ Duplicate!
  id: string
  name: string
  // ...
}
```

### ❌ Don't Import Runtime Code in Client

```typescript
// ❌ BAD: Importing server runtime code
import { getPlayer } from '~/server/services/players'  // ❌ Server function!

// ✅ GOOD: Import only types
import type { Player } from '~/server/utils/player'
```

### ❌ Don't Use `any` Instead of Shared Types

```typescript
// ❌ BAD: Losing type safety
const { data: players } = await useFetch<any>('/api/players')  // ❌ No type checking

// ✅ GOOD: Use shared type
import type { Player } from '~/server/utils/player'
const { data: players } = await useFetch<Player[]>('/api/players')
```

---

## File Organization

### Recommended Structure

```
server/
├── utils/
│   ├── player.ts           # Player type + utilities
│   ├── api-types.ts        # Generic API types
│   ├── validation.ts       # Zod schemas + inferred types
│   └── prisma.ts           # Prisma client
├── services/
│   └── players.ts          # Business logic (uses types from utils)
└── api/
    └── players.get.ts      # API routes (uses types from utils)

app/
├── pages/
│   └── index.vue           # Imports types from ~/server/utils/
└── components/
    └── PlayerCard.vue      # Imports types from ~/server/utils/
```

### Type Organization Guidelines

**Put in `server/utils/` when:**
- ✅ Type is used in both server and client
- ✅ Type represents data model
- ✅ Type is used in API responses

**Put in `app/types/` when:**
- ✅ Type is client-only (UI state, component props)
- ✅ Type is not related to API/data

---

## TypeScript Configuration

Ensure your `tsconfig.json` includes:

```json
{
  "extends": "./.nuxt/tsconfig.json",
  "compilerOptions": {
    "paths": {
      "~/*": ["./*"],
      "@/*": ["./*"]
    }
  }
}
```

This enables the `~/server/utils/` alias to work correctly.

---

## Testing

### Type-Check Imports

```bash
# Run TypeScript type checking
pnpm typecheck

# Should pass without errors
```

### Verify Type Safety

```typescript
// This should show TypeScript errors
import type { Player } from '~/server/utils/player'

const player: Player = {
  id: '1',
  name: 'Barry Bonds',
  // Missing required fields → TypeScript error ✅
}
```

---

## Related Patterns

- [Nuxt Dynamic Routes](../quick-references/nuxt-dynamic-routes.md) - File-based routing
- [API Route Patterns](../patterns/api-routes.md) - Server-side API routes
- [Zod Validation](../patterns/zod-validation.md) - Runtime type validation

---

## Resources

- [Nuxt Auto-Imports](https://nuxt.com/docs/guide/concepts/auto-imports)
- [TypeScript Type-Only Imports](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export)
- [Nuxt Server Utils](https://nuxt.com/docs/guide/directory-structure/server#server-utilities)

---

## Lessons Learned

1. **Single source of truth** - Define types once in `server/utils/`
2. **Type-only imports** - Use `import type` to avoid bundling server code
3. **Nuxt auto-imports** - Trust the framework's import system
4. **Avoid duplication** - Never copy-paste type definitions
5. **Type safety everywhere** - Use shared types in all API calls

---

**Tags:** #nuxt #typescript #type-safety #server-utils #api-types
