# Nuxt Shared Types Pattern

**Category:** Architecture Pattern  
**Last Updated:** 2026-01-06  
**Status:** ✅ Recommended

## Overview

A pattern for organizing shared TypeScript types in a Nuxt 4 project to enable type-safe communication between server and client code while avoiding duplication and import errors.

## Problem

In Nuxt 4 projects with both server and client code:

1. **Type Duplication** - Same types defined in multiple places
2. **Import Errors** - Client code can't import from `server/` directory using `~` alias
3. **Maintenance Burden** - Updating types requires changes in multiple files
4. **Type Drift** - Server and client types can become inconsistent

### Common Error

```typescript
// app/pages/index.vue
import type { Player } from "~/server/utils/player"
//                          ^^^^^^^^^^^^^^^^^^^^^^
// Error: Cannot find module '~/server/utils/player' or its corresponding type declarations
```

**Why this fails:**
- The `~` alias points to the `app/` directory
- Server code lives at project root in `server/`
- The `~` alias cannot reach outside `app/`

## Solution

Create a centralized `types/` directory at the project root that both server and client code can import from.

### Directory Structure

```
project-root/
├── app/                    # Client code (~ alias points here)
│   ├── pages/
│   ├── components/
│   └── layouts/
├── server/                 # Server code (at project root)
│   ├── api/
│   ├── services/
│   └── utils/
├── types/                  # Shared types (at project root) ✅
│   ├── player.ts          # Domain types
│   ├── schemas.ts         # Zod validation schemas
│   ├── api.ts             # API response types
│   └── index.ts           # Barrel exports
└── tsconfig.json
```

### Type Organization

Organize types by concern into focused files:

#### **1. Domain Types** (`types/player.ts`)

Core business domain types and related enums/unions.

```typescript
export type Player = {
  id: string
  name: string
  team: string
  position: string
  hits: number
  homeRuns: number
  battingAverage: number
  description: string | null
}

export type SortKey = "hits" | "homeRuns" | "battingAverage"
export type SortDirection = "asc" | "desc"
```

#### **2. Validation Schemas** (`types/schemas.ts`)

Zod schemas for runtime validation (server-side).

```typescript
import { z } from "zod"

export const RawPlayerSchema = z.object({
  player_id: z.string(),
  name_display_first_last: z.string(),
  team_name: z.string(),
  position_txt: z.string(),
  h: z.number(),
  hr: z.number(),
  avg: z.number(),
})

export const UpdatePlayerSchema = z.object({
  name: z.string().optional(),
  team: z.string().optional(),
  position: z.string().optional(),
  hits: z.number().optional(),
  homeRuns: z.number().optional(),
  battingAverage: z.number().optional(),
})

export type UpdatePlayerInput = z.infer<typeof UpdatePlayerSchema>
```

#### **3. API Types** (`types/api.ts`)

API request/response types.

```typescript
export type DescriptionResponse = {
  description: string
}

export type ErrorResponse = {
  error: string
  statusCode: number
}
```

#### **4. Barrel Exports** (`types/index.ts`)

Convenience re-exports for common imports.

```typescript
export type { Player, SortKey, SortDirection } from "./player"
export type { DescriptionResponse, ErrorResponse } from "./api"
export type { UpdatePlayerInput } from "./schemas"
export { RawPlayerSchema, UpdatePlayerSchema } from "./schemas"
```

## Import Patterns

### Server Code (Relative Imports)

Server code should use **relative imports** since it's at the project root:

```typescript
// server/services/players.ts
import type { Player } from "../../types/player"
import { RawPlayerSchema } from "../../types/schemas"

// server/api/players/[id].patch.ts
import { UpdatePlayerSchema } from "../../../types/schemas"
```

### Client Code (Project Root Alias)

Client code should use the **`~~` alias** to import from project root:

```typescript
// app/pages/index.vue
import type { Player, SortKey, SortDirection } from "~~/types/player"

// app/pages/players/[id]/edit.vue
import type { Player } from "~~/types/player"
```

### Path Alias Reference

| Alias | Points To | Use For |
|-------|-----------|---------|
| `~` or `@` | `app/` directory | Imports within app/ |
| `~~` or `@@` | Project root | Imports from types/, server/, etc. |

**Critical:** Use `~~` (double tilde) for project root, not `~` (single tilde).

## Implementation Steps

### 1. Create Types Directory

```bash
mkdir types
touch types/player.ts types/schemas.ts types/api.ts types/index.ts
```

### 2. Extract Domain Types

Move type definitions from implementation files to `types/`:

```typescript
// Before: server/utils/player.ts
export type Player = { /* ... */ }
export const transformPlayer = (raw: RawPlayer): Player => { /* ... */ }

// After: types/player.ts
export type Player = { /* ... */ }

// After: server/utils/player.ts
import type { Player } from "../../types/player"
export const transformPlayer = (raw: RawPlayer): Player => { /* ... */ }
```

### 3. Extract Validation Schemas

Move Zod schemas to `types/schemas.ts`:

```typescript
// Before: server/api/players/[id].patch.ts
const UpdatePlayerSchema = z.object({ /* ... */ })

// After: types/schemas.ts
export const UpdatePlayerSchema = z.object({ /* ... */ })

// After: server/api/players/[id].patch.ts
import { UpdatePlayerSchema } from "../../../types/schemas"
```

### 4. Update Client Imports

Replace server imports with types imports:

```typescript
// Before: app/pages/index.vue
import type { Player } from "~/server/utils/player"  // ❌ Error

// After: app/pages/index.vue
import type { Player } from "~~/types/player"  // ✅ Works
```

### 5. Add Generic Type Annotations

Improve type safety with generic annotations:

```typescript
// Before
const { data: player } = await useFetch(`/api/players/${id}`)

// After
import type { Player } from "~~/types/player"
const { data: player } = await useFetch<Player>(`/api/players/${id}`)
```

### 6. Verify TypeScript

```bash
npx tsc --noEmit
```

Should pass with no errors.

## Benefits

✅ **Single Source of Truth** - Types defined once, used everywhere  
✅ **Type Safety** - Server and client guaranteed to use same types  
✅ **Better Maintainability** - Update types in one place  
✅ **Cleaner Architecture** - Separation of types from implementation  
✅ **No Import Errors** - Proper use of `~~` alias avoids path issues  
✅ **Better IntelliSense** - Generic type annotations improve autocomplete  

## Trade-offs

### Pros
- Clear separation of concerns
- Easy to find and update types
- Prevents type drift between server/client
- Works seamlessly with Nuxt's auto-imports

### Cons
- Adds one more directory to navigate
- Requires discipline to keep types in sync with implementation
- Relative imports in server code can be verbose

## When to Use

✅ **Use this pattern when:**
- You have types shared between server and client
- You're getting import errors from `~/server/...`
- You want to prevent type duplication
- You need runtime validation with Zod schemas
- You're building a type-safe API

❌ **Don't use this pattern when:**
- Types are only used in one place (keep them local)
- You're building a simple static site with no API
- Your project doesn't have server-side code

## Common Pitfalls

### 1. Using `~` Instead of `~~`

```typescript
// ❌ Wrong - tries to find app/types/player
import type { Player } from "~/types/player"

// ✅ Correct - finds types/player at project root
import type { Player } from "~~/types/player"
```

### 2. Forgetting Generic Type Annotations

```typescript
// ⚠️ Works but loses type safety
const { data: player } = await useFetch(`/api/players/${id}`)
// player is typed as 'any'

// ✅ Better - full type safety
const { data: player } = await useFetch<Player>(`/api/players/${id}`)
// player is typed as 'Ref<Player | null>'
```

### 3. Mixing Implementation with Types

```typescript
// ❌ Don't put implementation in types/
export const transformPlayer = (raw: RawPlayer): Player => { /* ... */ }

// ✅ Keep types/ pure - only types and schemas
export type Player = { /* ... */ }
```

## Real-World Example

From the baseball-chat project:

**Before:**
```typescript
// server/utils/player.ts
export type Player = { id: string, name: string, /* ... */ }

// app/pages/index.vue
import type { Player } from "~/server/utils/player"  // ❌ Error
```

**After:**
```typescript
// types/player.ts
export type Player = { id: string, name: string, /* ... */ }

// server/utils/player.ts
import type { Player } from "../../types/player"  // ✅ Works

// app/pages/index.vue
import type { Player } from "~~/types/player"  // ✅ Works
```

## Related

- [Nuxt Path Aliases Quick Reference](../quick-references/nuxt-path-aliases.md) - Understanding `~` vs `~~`
- [Nuxt 4 Documentation](https://nuxt.com/docs/guide/directory-structure/types) - Official types directory docs

## See Also

- Zod for runtime validation: https://zod.dev/
- TypeScript utility types: https://www.typescriptlang.org/docs/handbook/utility-types.html
- Nuxt auto-imports: https://nuxt.com/docs/guide/concepts/auto-imports
