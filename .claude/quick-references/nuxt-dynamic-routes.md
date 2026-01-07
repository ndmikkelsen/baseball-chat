# Quick Reference: Nuxt Dynamic Routes

> How file-based routing with `[id]` parameters works in Nuxt

**Last Updated**: 2026-01-05

---

## Overview

Nuxt uses **file-based routing** where the file structure in `pages/` automatically creates routes. Square brackets `[id]` create **dynamic route parameters** that match any value.

---

## File Structure → Routes

```
app/pages/
├── index.vue                    → /
├── about.vue                    → /about
├── players/
│   ├── index.vue               → /players
│   ├── [id].vue                → /players/:id
│   └── [id]/
│       ├── edit.vue            → /players/:id/edit
│       └── stats.vue           → /players/:id/stats
```

---

## Dynamic Route Parameters

### Basic Dynamic Route

**File:** `pages/players/[id].vue`  
**Matches:** `/players/1`, `/players/barry-bonds`, `/players/anything`

```vue
<script setup lang="ts">
// Access the route parameter
const route = useRoute()
const id = route.params.id as string  // "barry-bonds" from /players/barry-bonds

// Use it to fetch data
const { data: player } = await useFetch(`/api/players/${id}`)
</script>

<template>
  <div>
    <h1>{{ player?.name }}</h1>
    <p>Player ID: {{ id }}</p>
  </div>
</template>
```

### Nested Dynamic Route

**File:** `pages/players/[id]/edit.vue`  
**Matches:** `/players/1/edit`, `/players/barry-bonds/edit`

```vue
<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const id = route.params.id as string

// Fetch player data
const { data: player } = await useFetch(`/api/players/${id}`)

// Navigate back to detail page
function goBack() {
  router.push(`/players/${id}`)
}
</script>

<template>
  <div>
    <h1>Edit {{ player?.name }}</h1>
    <button @click="goBack">Back to Player</button>
  </div>
</template>
```

---

## Navigation Between Routes

### Programmatic Navigation

```vue
<script setup lang="ts">
// Navigate to dynamic route
function viewPlayer(playerId: string) {
  navigateTo(`/players/${playerId}`)
}

// Navigate to nested route
function editPlayer(playerId: string) {
  navigateTo(`/players/${playerId}/edit`)
}

// Navigate back
function goBack() {
  router.back()
}
</script>
```

### Declarative Navigation

```vue
<template>
  <!-- NuxtLink with dynamic route -->
  <NuxtLink :to="`/players/${player.id}`">
    View Player
  </NuxtLink>

  <!-- NuxtLink with nested route -->
  <NuxtLink :to="`/players/${player.id}/edit`">
    Edit Player
  </NuxtLink>
</template>
```

---

## Complete User Flow Example

### Baseball Chat App Flow

```
1. Homepage (index.vue)
   URL: /
   ↓ User clicks player row
   
2. Player Detail ([id].vue)
   URL: /players/0
   route.params.id = "0"
   ↓ User clicks "Edit" button
   
3. Edit Player ([id]/edit.vue)
   URL: /players/0/edit
   route.params.id = "0"
   ↓ User saves changes
   
4. Back to Player Detail ([id].vue)
   URL: /players/0
   Shows updated data
```

### Implementation

**1. Homepage - Click to Navigate**
```vue
<!-- pages/index.vue -->
<template>
  <table>
    <tr
      v-for="player in players"
      :key="player.id"
      class="cursor-pointer"
      @click="navigateTo(`/players/${player.id}`)"
    >
      <td>{{ player.name }}</td>
    </tr>
  </table>
</template>
```

**2. Player Detail - Show Data**
```vue
<!-- pages/players/[id].vue -->
<script setup lang="ts">
const route = useRoute()
const id = route.params.id as string
const { data: player } = await useFetch(`/api/players/${id}`)
</script>

<template>
  <div>
    <h1>{{ player?.name }}</h1>
    <button @click="navigateTo(`/players/${id}/edit`)">
      Edit
    </button>
  </div>
</template>
```

**3. Edit Player - Save and Redirect**
```vue
<!-- pages/players/[id]/edit.vue -->
<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const id = route.params.id as string

const { data: player } = await useFetch(`/api/players/${id}`)
const form = ref({ ...player.value })

async function save() {
  await $fetch(`/api/players/${id}`, {
    method: 'PATCH',
    body: form.value
  })
  router.push(`/players/${id}`)  // Redirect back
}
</script>

<template>
  <form @submit.prevent="save">
    <input v-model="form.name" />
    <button type="submit">Save</button>
  </form>
</template>
```

---

## Multiple Parameters

You can have multiple dynamic parameters:

**File:** `pages/teams/[teamId]/players/[playerId].vue`  
**Route:** `/teams/:teamId/players/:playerId`  
**Example:** `/teams/yankees/players/jeter`

```vue
<script setup lang="ts">
const route = useRoute()
const teamId = route.params.teamId as string      // "yankees"
const playerId = route.params.playerId as string  // "jeter"

const { data: player } = await useFetch(
  `/api/teams/${teamId}/players/${playerId}`
)
</script>
```

---

## Catch-All Routes

Use `[...slug]` to match any number of segments:

**File:** `pages/docs/[...slug].vue`  
**Matches:** `/docs/a`, `/docs/a/b`, `/docs/a/b/c`

```vue
<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string[]  // ["a", "b", "c"]
const path = slug.join('/')                 // "a/b/c"
</script>
```

---

## Optional Parameters

Use double brackets `[[id]]` for optional parameters:

**File:** `pages/search/[[query]].vue`  
**Matches:** `/search` AND `/search/baseball`

```vue
<script setup lang="ts">
const route = useRoute()
const query = route.params.query as string | undefined
</script>
```

---

## Type Safety

### Define Route Params Type

```typescript
// types/routes.ts
export interface PlayerRouteParams {
  id: string
}

// pages/players/[id].vue
<script setup lang="ts">
import type { PlayerRouteParams } from '~/types/routes'

const route = useRoute<PlayerRouteParams>()
const id = route.params.id  // TypeScript knows this is a string
</script>
```

---

## Common Patterns

### 1. Fetch Data Based on Route Param

```vue
<script setup lang="ts">
const route = useRoute()
const id = route.params.id as string

// Automatically refetches when id changes
const { data, pending, error } = await useFetch(`/api/players/${id}`)
</script>
```

### 2. Validate Route Param

```vue
<script setup lang="ts">
const route = useRoute()
const id = route.params.id as string

// Validate ID format
if (!/^\d+$/.test(id)) {
  throw createError({
    statusCode: 400,
    message: 'Invalid player ID'
  })
}
</script>
```

### 3. Handle Missing Data

```vue
<script setup lang="ts">
const route = useRoute()
const id = route.params.id as string

const { data: player, error } = await useFetch(`/api/players/${id}`)

// Show 404 if player not found
if (error.value?.statusCode === 404) {
  throw createError({
    statusCode: 404,
    message: 'Player not found'
  })
}
</script>
```

---

## Routing Priority and Conflicts

### ⚠️ Common Mistake: Nested Route Not Loading

**Problem:** You have both `[id].vue` and `[id]/edit.vue`, but navigating to `/players/123/edit` shows a blank page with no errors.

**Why It Fails:**

```
❌ WRONG - Causes routing conflict:
app/pages/players/
├── [id].vue          ← Catches ALL /players/:id/* routes
└── [id]/
    └── edit.vue      ← Never reached!

✅ CORRECT - Proper nested routing:
app/pages/players/
└── [id]/
    ├── index.vue     ← Handles /players/:id
    └── edit.vue      ← Handles /players/:id/edit
```

**Explanation:**

Nuxt's routing priority means `[id].vue` matches **any path** starting with `/players/:id`, including `/players/:id/edit`. The nested `[id]/edit.vue` route is never reached because the parent route catches it first.

**Symptoms:**

- ✅ Detail page works: `/players/123` loads correctly
- ❌ Edit page fails: `/players/123/edit` shows blank page
- ❌ No API requests in Network tab
- ❌ No errors in browser console
- ❌ No errors in dev server terminal
- ✅ URL bar shows correct path

**Solution:**

Move `pages/players/[id].vue` → `pages/players/[id]/index.vue`

```bash
# Fix the routing conflict
mkdir -p app/pages/players/[id]
mv app/pages/players/[id].vue app/pages/players/[id]/index.vue

# Clear Nuxt cache and restart
rm -rf .nuxt
pnpm dev
```

**After the fix:**

- ✅ `/players/123` → Loads `[id]/index.vue`
- ✅ `/players/123/edit` → Loads `[id]/edit.vue`
- ✅ Both routes work independently

**Prevention:**

Always use the nested folder structure when you have child routes:

```
✅ Use this pattern:
pages/
└── [id]/
    ├── index.vue    ← Parent route
    ├── edit.vue     ← Child route
    └── stats.vue    ← Child route

❌ Don't use this:
pages/
├── [id].vue         ← Will conflict with children
└── [id]/
    └── edit.vue     ← Won't work
```

---

## Debugging Tips

### 1. Log Route Params

```vue
<script setup lang="ts">
const route = useRoute()
console.log('Route params:', route.params)
console.log('Full path:', route.fullPath)
console.log('Query params:', route.query)
</script>
```

### 2. Watch Route Changes

```vue
<script setup lang="ts">
const route = useRoute()

watch(() => route.params.id, (newId, oldId) => {
  console.log(`ID changed from ${oldId} to ${newId}`)
})
</script>
```

### 3. Check File Structure

```bash
# List all page files
fd . app/pages --type f

# Verify route structure
pnpm dev  # Check console for registered routes
```

---

## Related Patterns

- [Type Sharing in Nuxt](../patterns/type-sharing-nuxt.md) - Share types between server/client
- [API Route Patterns](../patterns/api-routes.md) - Server-side API routes
- [Navigation Patterns](../patterns/navigation.md) - Client-side navigation

---

## Resources

- [Nuxt Routing Docs](https://nuxt.com/docs/getting-started/routing)
- [Vue Router Docs](https://router.vuejs.org/)
- [File-Based Routing Guide](https://nuxt.com/docs/guide/directory-structure/pages)

---

**Tags:** #nuxt #routing #dynamic-routes #file-based-routing #navigation
