# Nuxt Path Aliases Quick Reference

**Category:** Quick Reference  
**Last Updated:** 2026-01-06  
**Applies To:** Nuxt 4

## Overview

Quick reference for understanding and using Nuxt's path aliases (`~`, `~~`, `@`, `@@`) to import files from different locations in your project.

## Path Aliases Table

| Alias | Points To | Use For | Example |
|-------|-----------|---------|---------|
| `~` | `app/` directory | Imports within app code | `~/components/Header.vue` |
| `@` | `app/` directory | Same as `~` (alternative) | `@/components/Header.vue` |
| `~~` | Project root | Imports from root (types, server, etc.) | `~~/types/player.ts` |
| `@@` | Project root | Same as `~~` (alternative) | `@@/types/player.ts` |

## Directory Structure

```
project-root/                    ← ~~ and @@ point here
├── app/                         ← ~ and @ point here
│   ├── components/
│   ├── composables/
│   ├── layouts/
│   ├── pages/
│   └── utils/
├── server/                      ← Use ~~ to import from app/
│   ├── api/
│   ├── services/
│   └── utils/
├── types/                       ← Use ~~ to import from app/
│   ├── player.ts
│   └── schemas.ts
├── public/
└── nuxt.config.ts
```

## When to Use Each Alias

### Use `~` or `@` (App Directory)

**For imports within the `app/` directory:**

```typescript
// app/pages/index.vue
import Header from "~/components/Header.vue"
import { useAuth } from "~/composables/useAuth"
import { formatDate } from "~/utils/date"
```

**These are equivalent:**
```typescript
import Header from "~/components/Header.vue"
import Header from "@/components/Header.vue"
```

### Use `~~` or `@@` (Project Root)

**For imports from project root (types, server, config):**

```typescript
// app/pages/index.vue
import type { Player } from "~~/types/player"
import type { ApiResponse } from "~~/types/api"
```

**These are equivalent:**
```typescript
import type { Player } from "~~/types/player"
import type { Player } from "@@/types/player"
```

### Use Relative Imports

**For server-side code at project root:**

```typescript
// server/services/players.ts
import type { Player } from "../../types/player"
import { transformPlayer } from "../utils/player"
```

**Why relative?** Server code is already at project root, so relative imports are clearer and shorter than `~~/`.

## Common Patterns

### Client Code Importing Types

```typescript
// app/pages/players/[id].vue
import type { Player } from "~~/types/player"
import type { DescriptionResponse } from "~~/types/api"

const { data: player } = await useFetch<Player>(`/api/players/${id}`)
```

### Client Code Importing Components

```typescript
// app/pages/index.vue
import PlayerCard from "~/components/PlayerCard.vue"
import { usePlayerSort } from "~/composables/usePlayerSort"
```

### Server Code Importing Types

```typescript
// server/api/players/index.get.ts
import type { Player } from "../../../types/player"
import { getPlayers } from "../../services/players"
```

### Server Code Importing Utilities

```typescript
// server/api/players/[id]/description.post.ts
import { generateDescription } from "../../../services/openai"
import type { DescriptionResponse } from "../../../../types/api"
```

## Common Errors and Solutions

### Error: Cannot find module '~/types/...'

```typescript
// ❌ Wrong - tries to find app/types/player
import type { Player } from "~/types/player"
```

**Error Message:**
```
Cannot find module '~/types/player' or its corresponding type declarations. [2307]
```

**Solution:**
```typescript
// ✅ Correct - finds types/player at project root
import type { Player } from "~~/types/player"
```

**Why:** The `~` alias points to `app/`, but `types/` is at the project root. Use `~~` to access project root.

### Error: Cannot find module '~/server/...'

```typescript
// ❌ Wrong - tries to find app/server/utils
import { transformPlayer } from "~/server/utils/player"
```

**Solution:**
```typescript
// ✅ Correct - finds server/utils at project root
import { transformPlayer } from "~~/server/utils/player"
```

**Why:** The `server/` directory is at project root, not inside `app/`.

### LSP Not Resolving Aliases

If your LSP (TypeScript language server) doesn't resolve `~~` imports:

1. **Restart LSP** after running dev server (generates `.nuxt/tsconfig.json`)
2. **Run `pnpm nuxt prepare`** to generate type definitions
3. **Check `.nuxt/tsconfig.json`** for path mappings:

```json
{
  "compilerOptions": {
    "paths": {
      "~/*": ["../app/*"],
      "~~/*": ["../*"],
      "@/*": ["../app/*"],
      "@@/*": ["../*"]
    }
  }
}
```

See: [Neovim LSP + Nuxt + Vue Troubleshooting](../troubleshooting/neovim-lsp-nuxt-vue.md)

## Decision Tree

```
Need to import a file?
│
├─ Is it in app/components, app/pages, app/composables, etc?
│  └─ Use ~ or @
│     Example: ~/components/Header.vue
│
├─ Is it in types/ at project root?
│  └─ Use ~~ or @@
│     Example: ~~/types/player.ts
│
├─ Is it in server/ at project root?
│  ├─ Importing from app/?
│  │  └─ Use ~~ or @@
│  │     Example: ~~/server/utils/player.ts
│  │
│  └─ Importing from server/?
│     └─ Use relative imports
│        Example: ../../types/player.ts
│
└─ Is it a node_module?
   └─ Use package name
      Example: import { z } from "zod"
```

## Best Practices

### ✅ Do

- Use `~` for imports within `app/` directory
- Use `~~` for imports from project root (types, server)
- Use relative imports within `server/` directory
- Be consistent with your choice of `~` vs `@` (pick one)
- Use `~~` when importing types from `app/` code

### ❌ Don't

- Mix `~` and `~~` incorrectly (causes import errors)
- Use `~` to import from `server/` or `types/`
- Use `~~` for imports within `app/` (unnecessary)
- Mix `~` and `@` in the same file (inconsistent)

## Examples by File Location

### From `app/pages/index.vue`

```typescript
// ✅ Correct imports
import Header from "~/components/Header.vue"           // app/components
import type { Player } from "~~/types/player"          // types/ at root
import { useAuth } from "~/composables/useAuth"        // app/composables
```

### From `app/pages/players/[id]/edit.vue`

```typescript
// ✅ Correct imports
import type { Player } from "~~/types/player"          // types/ at root
import PlayerForm from "~/components/PlayerForm.vue"   // app/components
```

### From `server/api/players/index.get.ts`

```typescript
// ✅ Correct imports
import type { Player } from "../../../types/player"    // Relative to types/
import { getPlayers } from "../../services/players"    // Relative to server/services
```

### From `server/services/players.ts`

```typescript
// ✅ Correct imports
import type { Player } from "../../types/player"       // Relative to types/
import { RawPlayerSchema } from "../../types/schemas"  // Relative to types/
import { transformPlayer } from "../utils/player"      // Relative to server/utils
```

## TypeScript Configuration

Nuxt automatically generates path mappings in `.nuxt/tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~/*": ["../app/*"],
      "~~/*": ["../*"],
      "@/*": ["../app/*"],
      "@@/*": ["../*"],
      "#app": ["../node_modules/nuxt/dist/app"],
      "#imports": ["../.nuxt/imports.d.ts"]
    }
  }
}
```

**Note:** This file is auto-generated. Don't edit it manually.

## Troubleshooting

### Imports work at runtime but LSP shows errors

**Cause:** LSP hasn't picked up the generated `.nuxt/tsconfig.json`

**Solution:**
1. Run `pnpm nuxt prepare` to generate type definitions
2. Restart your LSP/editor
3. Verify `.nuxt/tsconfig.json` exists and has path mappings

### Imports work in some files but not others

**Cause:** Mixing `~` and `~~` incorrectly

**Solution:**
- Use `~` only for `app/` directory imports
- Use `~~` for project root imports (types, server)
- Check the error message to see what path it's trying to resolve

### Auto-imports not working (useFetch, ref, computed, etc.)

**Cause:** LSP hasn't loaded Nuxt's auto-import definitions

**Solution:**
1. Ensure dev server is running (generates `.nuxt/imports.d.ts`)
2. Restart LSP after dev server starts
3. Check `.nuxt/imports.d.ts` exists

## Related

- [Nuxt Shared Types Pattern](../patterns/nuxt-shared-types.md) - Organizing shared types
- [Nuxt 4 Documentation - Aliases](https://nuxt.com/docs/guide/directory-structure/app#aliases) - Official docs

## Quick Reference Card

```
┌─────────────────────────────────────────────────────┐
│ Nuxt Path Aliases Cheat Sheet                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ~  or @   → app/        (client code)             │
│  ~~ or @@  → root/       (types, server, config)   │
│                                                     │
│  Examples:                                          │
│  ✅ ~/components/Header.vue                         │
│  ✅ ~~/types/player.ts                              │
│  ✅ @/composables/useAuth.ts                        │
│  ✅ @@/server/utils/player.ts                       │
│                                                     │
│  Common Mistakes:                                   │
│  ❌ ~/types/player.ts        (use ~~)              │
│  ❌ ~/server/utils/player.ts (use ~~)              │
│                                                     │
└─────────────────────────────────────────────────────┘
```
