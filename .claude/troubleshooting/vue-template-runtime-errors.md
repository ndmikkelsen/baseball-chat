# Vue Template Runtime Errors

> Common runtime errors in Vue templates and how to fix them

**Last Updated**: 2026-01-07

## Overview

Vue templates don't benefit from TypeScript's compile-time checking. Many errors only appear at runtime when your app is running. This guide covers the most common runtime errors and how to prevent them.

## The Core Problem

**TypeScript checks your `<script>` code but not your `<template>` code.**

```vue
<script setup lang="ts">
// ✅ TypeScript catches this at compile time
const player: Player = { name: 'John' }
const avg = player.avg.toFixed(3) // Error: Property 'avg' does not exist
</script>

<template>
  <!-- ❌ TypeScript doesn't catch this - fails at runtime -->
  <td>{{ player.avg.toFixed(3) }}</td>
</template>
```

## Common Runtime Errors

### Error 1: Cannot read property 'X' of null/undefined

**Error message:**
```
Uncaught TypeError: Cannot read property 'toFixed' of null
Uncaught TypeError: Cannot read property 'toFixed' of undefined
```

**Cause:**
```vue
<template>
  <!-- Crashes if player.avg is null or undefined -->
  <td>{{ player.avg.toFixed(3) }}</td>
</template>
```

**Solution:**
```vue
<template>
  <!-- ✅ Use optional chaining + nullish coalescing -->
  <td>{{ player.avg?.toFixed(3) ?? 'N/A' }}</td>
</template>
```

**Real example from baseball-chat:**

This bug was caught during code review:

```vue
<!-- ❌ Before: Crashed when API returned null avg -->
<td class="px-4 py-3 text-sm">{{ player.avg.toFixed(3) }}</td>

<!-- ✅ After: Handles null gracefully -->
<td class="px-4 py-3 text-sm">{{ player.avg?.toFixed(3) ?? 'N/A' }}</td>
```

### Error 2: X is not a function

**Error message:**
```
Uncaught TypeError: player.name.toUpperCase is not a function
```

**Cause:**
```vue
<template>
  <!-- Crashes if player.name is null, undefined, or not a string -->
  <td>{{ player.name.toUpperCase() }}</td>
</template>
```

**Solution:**
```vue
<template>
  <!-- ✅ Safe: Handles null/undefined -->
  <td>{{ player.name?.toUpperCase() ?? 'Unknown' }}</td>
  
  <!-- ✅ Alternative: Type guard in computed -->
  <td>{{ displayName }}</td>
</template>

<script setup lang="ts">
const displayName = computed(() => {
  if (typeof props.player.name !== 'string') return 'Unknown'
  return props.player.name.toUpperCase()
})
</script>
```

### Error 3: Cannot read property 'length' of null/undefined

**Error message:**
```
Uncaught TypeError: Cannot read property 'length' of null
```

**Cause:**
```vue
<template>
  <!-- Crashes if player.stats is null or undefined -->
  <td>{{ player.stats.length }}</td>
</template>
```

**Solution:**
```vue
<template>
  <!-- ✅ Safe: Returns 0 if stats is null/undefined -->
  <td>{{ player.stats?.length ?? 0 }}</td>
  
  <!-- ✅ Alternative: Conditional rendering -->
  <td v-if="player.stats">{{ player.stats.length }}</td>
  <td v-else>0</td>
</template>
```

### Error 4: Cannot access property before initialization

**Error message:**
```
Uncaught ReferenceError: Cannot access 'sortedPlayers' before initialization
```

**Cause:**
```vue
<script setup lang="ts">
// ❌ Using computed before it's defined
const filtered = computed(() => sortedPlayers.value.filter(...))
const sortedPlayers = computed(() => players.value.sort(...))
</script>
```

**Solution:**
```vue
<script setup lang="ts">
// ✅ Define in correct order
const sortedPlayers = computed(() => players.value.sort(...))
const filtered = computed(() => sortedPlayers.value.filter(...))
</script>
```

### Error 5: Maximum call stack size exceeded

**Error message:**
```
Uncaught RangeError: Maximum call stack size exceeded
```

**Cause:**
```vue
<script setup lang="ts">
// ❌ Infinite loop: computed depends on itself
const sorted = computed(() => {
  return sorted.value.sort(...) // Reads itself!
})
</script>
```

**Solution:**
```vue
<script setup lang="ts">
// ✅ Depend on source data, not computed
const sorted = computed(() => {
  return players.value.sort(...) // Reads source
})
</script>
```

### Error 6: Hydration mismatch

**Error message:**
```
[Vue warn]: Hydration node mismatch
```

**Cause:**
```vue
<template>
  <!-- ❌ Different output on server vs client -->
  <div>{{ new Date().toISOString() }}</div>
  <div>{{ Math.random() }}</div>
</template>
```

**Solution:**
```vue
<script setup lang="ts">
// ✅ Use onMounted for client-only code
const timestamp = ref('')

onMounted(() => {
  timestamp.value = new Date().toISOString()
})
</script>

<template>
  <div>{{ timestamp }}</div>
</template>
```

## Debugging Template Errors

### Step 1: Find the Error Location

Vue error messages show the component but not the exact line:

```
Uncaught TypeError: Cannot read property 'toFixed' of null
    at Proxy.render (index.vue:45)
```

**Strategy:**
1. Open the component file
2. Search for the method name (e.g., `toFixed`)
3. Check all instances in the template

### Step 2: Identify the Null Value

Add temporary logging:

```vue
<script setup lang="ts">
// Add this temporarily
watchEffect(() => {
  console.log('Player data:', props.player)
  console.log('Avg value:', props.player.avg)
  console.log('Avg type:', typeof props.player.avg)
})
</script>
```

### Step 3: Add Null Safety

Once you find the null value, add appropriate guards:

```vue
<template>
  <!-- Before -->
  <td>{{ player.avg.toFixed(3) }}</td>
  
  <!-- After -->
  <td>{{ player.avg?.toFixed(3) ?? 'N/A' }}</td>
</template>
```

## Prevention Strategies

### Strategy 1: Use Optional Chaining Everywhere

Make it a habit:

```vue
<template>
  <!-- Always use ?. for method calls -->
  <td>{{ player.avg?.toFixed(3) ?? 'N/A' }}</td>
  <td>{{ player.name?.toUpperCase() ?? 'Unknown' }}</td>
  <td>{{ player.stats?.length ?? 0 }}</td>
</template>
```

### Strategy 2: Validate API Responses

Use Zod or similar to validate data:

```typescript
import { z } from 'zod'

const PlayerSchema = z.object({
  id: z.number(),
  name: z.string(),
  avg: z.number().nullable(),
  ops: z.number().nullable(),
  games: z.number(),
})

// In your API route
export default defineEventHandler(async (event) => {
  const data = await db.player.findMany()
  
  // Validate before returning
  return data.map(player => PlayerSchema.parse(player))
})
```

### Strategy 3: Use Type Guards in Computed

Move complex logic to computed properties:

```vue
<script setup lang="ts">
const formattedAvg = computed(() => {
  // Type guard
  if (typeof props.player.avg !== 'number') return 'N/A'
  if (!Number.isFinite(props.player.avg)) return 'N/A'
  
  return props.player.avg.toFixed(3)
})
</script>

<template>
  <!-- Simple, safe template -->
  <td>{{ formattedAvg }}</td>
</template>
```

### Strategy 4: Provide Default Values

Use default values in props:

```vue
<script setup lang="ts">
interface Props {
  player: Player
  showStats?: boolean  // Optional with default
}

const props = withDefaults(defineProps<Props>(), {
  showStats: true  // Default value
})
</script>
```

### Strategy 5: Test with Null Data

Always test with null/undefined values:

```typescript
// Create test data with null values
const testPlayers: Player[] = [
  {
    id: 1,
    name: null,       // ← Test null
    avg: undefined,   // ← Test undefined
    ops: NaN,         // ← Test NaN
    games: 0,         // ← Test zero
  },
]
```

## Common Patterns

### Pattern 1: Numeric Display with Fallback

```vue
<template>
  <!-- For stats that might be null -->
  <td>{{ player.avg?.toFixed(3) ?? 'N/A' }}</td>
  <td>{{ player.ops?.toFixed(3) ?? 'N/A' }}</td>
  
  <!-- For counts that should default to 0 -->
  <td>{{ player.games ?? 0 }}</td>
  <td>{{ player.hits ?? 0 }}</td>
</template>
```

### Pattern 2: String Display with Fallback

```vue
<template>
  <!-- For names/labels -->
  <td>{{ player.name ?? 'Unknown' }}</td>
  <td>{{ player.position ?? 'N/A' }}</td>
  
  <!-- For transformed strings -->
  <td>{{ player.team?.toUpperCase() ?? 'FREE AGENT' }}</td>
</template>
```

### Pattern 3: Conditional Rendering

```vue
<template>
  <!-- Show different content based on null -->
  <td v-if="player.avg != null">{{ player.avg.toFixed(3) }}</td>
  <td v-else class="text-gray-400">-</td>
  
  <!-- Show section only if data exists -->
  <div v-if="player.stats?.length">
    <h3>Statistics</h3>
    <ul>
      <li v-for="stat in player.stats" :key="stat.id">
        {{ stat.name }}: {{ stat.value }}
      </li>
    </ul>
  </div>
</template>
```

### Pattern 4: Complex Logic in Computed

```vue
<script setup lang="ts">
const displayValue = computed(() => {
  const value = props.player.avg
  
  // Handle all edge cases
  if (value == null) return 'N/A'
  if (!Number.isFinite(value)) return 'Invalid'
  if (value === 0) return '.000'
  if (value < 0) return 'Error'
  
  return value.toFixed(3)
})
</script>

<template>
  <td>{{ displayValue }}</td>
</template>
```

## Testing Checklist

Before deploying, test with:

- ✅ Null values
- ✅ Undefined values
- ✅ Empty strings
- ✅ Zero values
- ✅ Empty arrays
- ✅ NaN values
- ✅ Infinity values
- ✅ Very large numbers
- ✅ Very small numbers
- ✅ Special characters in strings

## Quick Reference

| Error | Cause | Solution |
|-------|-------|----------|
| Cannot read property 'X' of null | `obj.prop` when obj is null | `obj?.prop ?? fallback` |
| X is not a function | Calling method on null/wrong type | `obj?.method() ?? fallback` |
| Cannot read property 'length' | Array is null/undefined | `arr?.length ?? 0` |
| Maximum call stack | Computed depends on itself | Depend on source data |
| Hydration mismatch | Different server/client output | Use `onMounted` for client code |

## Related

- [Vue Null-Safe Rendering](../quick-references/vue-null-safe-rendering.md) - Patterns for safe rendering
- [Sortable Table Columns](../patterns/sortable-table-columns.md) - Real-world example
- [Vue Error Handling](https://vuejs.org/guide/best-practices/production-deployment.html#tracking-runtime-errors) - Official Vue docs

## Real-World Example

From our baseball-chat player table, here's the before/after:

**Before (multiple runtime errors):**

```vue
<template>
  <tbody>
    <tr v-for="player in players" :key="player.id">
      <td>{{ player.name }}</td>
      <td>{{ player.position.toUpperCase() }}</td>
      <td>{{ player.games }}</td>
      <td>{{ player.avg.toFixed(3) }}</td>  <!-- ❌ Crashes -->
      <td>{{ player.ops.toFixed(3) }}</td>  <!-- ❌ Crashes -->
    </tr>
  </tbody>
</template>
```

**After (null-safe):**

```vue
<template>
  <tbody>
    <tr v-for="player in players" :key="player.id">
      <td>{{ player.name ?? 'Unknown' }}</td>
      <td>{{ player.position?.toUpperCase() ?? 'N/A' }}</td>
      <td>{{ player.games ?? 0 }}</td>
      <td>{{ player.avg?.toFixed(3) ?? 'N/A' }}</td>  <!-- ✅ Safe -->
      <td>{{ player.ops?.toFixed(3) ?? 'N/A' }}</td>  <!-- ✅ Safe -->
    </tr>
  </tbody>
</template>
```

**Result:**
- No runtime crashes
- Better user experience (shows 'N/A' instead of crashing)
- Easier to debug (clear fallback values)
- More maintainable code

## Key Takeaway

**Always assume values might be null/undefined in templates.** Use optional chaining (`?.`) and nullish coalescing (`??`) everywhere. Your future self will thank you.
