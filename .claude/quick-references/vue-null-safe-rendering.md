# Vue Null-Safe Rendering

> Patterns for safely rendering optional values in Vue templates

**Last Updated**: 2026-01-07

## Overview

Vue templates don't benefit from TypeScript's compile-time null checking. Runtime errors from null/undefined values are common and can crash your UI. This guide shows patterns for safely rendering optional values.

## The Problem

```vue
<template>
  <!-- ❌ CRASHES if player.avg is null/undefined -->
  <td>{{ player.avg.toFixed(3) }}</td>
  
  <!-- ❌ CRASHES if player.name is null/undefined -->
  <td>{{ player.name.toUpperCase() }}</td>
  
  <!-- ❌ CRASHES if player.stats is null/undefined -->
  <td>{{ player.stats.length }}</td>
</template>
```

**Why TypeScript doesn't catch this:**
- Template expressions are strings, not TypeScript code
- Type checking happens at compile time, these fail at runtime
- Vue's template compiler doesn't have full type information

## The Solution: Optional Chaining + Nullish Coalescing

### Pattern 1: Numeric Methods (`.toFixed()`, `.toPrecision()`)

```vue
<template>
  <!-- ✅ Safe: Returns 'N/A' if avg is null/undefined -->
  <td>{{ player.avg?.toFixed(3) ?? 'N/A' }}</td>
  
  <!-- ✅ Safe: Returns '0.000' if avg is null/undefined -->
  <td>{{ (player.avg ?? 0).toFixed(3) }}</td>
  
  <!-- ✅ Safe: Returns empty string if ops is null/undefined -->
  <td>{{ player.ops?.toFixed(3) ?? '' }}</td>
</template>
```

**Real example from baseball-chat:**

```vue
<!-- Before (crashes on null) -->
<td class="px-4 py-3 text-sm">{{ player.avg.toFixed(3) }}</td>

<!-- After (null-safe) -->
<td class="px-4 py-3 text-sm">{{ player.avg?.toFixed(3) ?? 'N/A' }}</td>
```

### Pattern 2: String Methods (`.toUpperCase()`, `.toLowerCase()`, `.trim()`)

```vue
<template>
  <!-- ✅ Safe: Returns empty string if name is null/undefined -->
  <td>{{ player.name?.toUpperCase() ?? '' }}</td>
  
  <!-- ✅ Safe: Returns 'Unknown' if position is null/undefined -->
  <td>{{ player.position?.trim() ?? 'Unknown' }}</td>
  
  <!-- ✅ Safe: Returns first 10 chars or empty string -->
  <td>{{ player.description?.substring(0, 10) ?? '' }}</td>
</template>
```

### Pattern 3: Array/Object Properties (`.length`, `.size`)

```vue
<template>
  <!-- ✅ Safe: Returns 0 if stats is null/undefined -->
  <td>{{ player.stats?.length ?? 0 }}</td>
  
  <!-- ✅ Safe: Returns empty string if no items -->
  <td>{{ player.items?.length ?? 'None' }}</td>
  
  <!-- ✅ Safe: Checks if array exists and has items -->
  <td v-if="player.achievements?.length">
    {{ player.achievements.length }} achievements
  </td>
</template>
```

### Pattern 4: Nested Properties

```vue
<template>
  <!-- ✅ Safe: Multiple levels of optional chaining -->
  <td>{{ player.team?.city?.name ?? 'Unknown' }}</td>
  
  <!-- ✅ Safe: Nested method calls -->
  <td>{{ player.profile?.bio?.substring(0, 50) ?? 'No bio' }}</td>
  
  <!-- ✅ Safe: Array access -->
  <td>{{ player.stats?.[0]?.value ?? 0 }}</td>
</template>
```

## When to Use `??` vs `||`

### Use `??` (Nullish Coalescing) - Recommended

Only treats `null` and `undefined` as "missing":

```vue
<template>
  <!-- ✅ Shows 0 if value is 0 -->
  <td>{{ player.games ?? 'N/A' }}</td>
  
  <!-- ✅ Shows empty string if value is '' -->
  <td>{{ player.notes ?? 'No notes' }}</td>
</template>
```

### Use `||` (Logical OR) - Be Careful

Treats `null`, `undefined`, `0`, `''`, `false`, `NaN` as "missing":

```vue
<template>
  <!-- ❌ Shows 'N/A' even if games is 0 -->
  <td>{{ player.games || 'N/A' }}</td>
  
  <!-- ❌ Shows 'No notes' even if notes is '' -->
  <td>{{ player.notes || 'No notes' }}</td>
</template>
```

**Rule of thumb**: Use `??` unless you specifically want to treat `0`, `''`, or `false` as "missing".

## Common Patterns by Data Type

### Numbers (Stats, Counts, IDs)

```vue
<template>
  <!-- Display with formatting -->
  <td>{{ player.avg?.toFixed(3) ?? 'N/A' }}</td>
  
  <!-- Display as-is with fallback -->
  <td>{{ player.games ?? 0 }}</td>
  
  <!-- Conditional rendering -->
  <td v-if="player.homeRuns != null">{{ player.homeRuns }}</td>
  <td v-else>-</td>
</template>
```

### Strings (Names, Descriptions)

```vue
<template>
  <!-- Display with fallback -->
  <td>{{ player.name ?? 'Unknown' }}</td>
  
  <!-- Transform safely -->
  <td>{{ player.position?.toUpperCase() ?? 'N/A' }}</td>
  
  <!-- Truncate safely -->
  <td>{{ player.description?.substring(0, 100) ?? 'No description' }}</td>
</template>
```

### Booleans (Flags, Status)

```vue
<template>
  <!-- Display as text -->
  <td>{{ player.isActive ?? false ? 'Active' : 'Inactive' }}</td>
  
  <!-- Conditional class -->
  <td :class="player.isActive ?? false ? 'text-green-500' : 'text-gray-500'">
    {{ player.status }}
  </td>
</template>
```

### Dates (Timestamps, Created/Updated)

```vue
<template>
  <!-- Format safely -->
  <td>{{ player.createdAt?.toLocaleDateString() ?? 'Unknown' }}</td>
  
  <!-- Use with date library -->
  <td>{{ player.updatedAt ? formatDate(player.updatedAt) : 'Never' }}</td>
</template>
```

## Computed Properties for Complex Logic

When template expressions get complex, move to computed:

```vue
<script setup lang="ts">
import type { Player } from '~~/types/player'

const props = defineProps<{ player: Player }>()

// ✅ Better: Complex logic in computed
const formattedAvg = computed(() => {
  if (props.player.avg == null) return 'N/A'
  if (props.player.avg === 0) return '.000'
  return props.player.avg.toFixed(3)
})

const displayName = computed(() => {
  const name = props.player.name?.trim()
  if (!name) return 'Unknown Player'
  return name.length > 20 ? name.substring(0, 20) + '...' : name
})
</script>

<template>
  <td>{{ formattedAvg }}</td>
  <td>{{ displayName }}</td>
</template>
```

## Testing for Null Safety

### Manual Testing Checklist

1. ✅ Test with null values from API
2. ✅ Test with undefined values
3. ✅ Test with empty strings
4. ✅ Test with zero values
5. ✅ Test with empty arrays

### Mock Data for Testing

```typescript
// Create test data with null values
const testPlayers: Player[] = [
  {
    id: 1,
    name: 'John Doe',
    avg: null,        // ← Test null
    ops: undefined,   // ← Test undefined
    games: 0,         // ← Test zero
    position: '',     // ← Test empty string
  },
  {
    id: 2,
    name: null,       // ← Test null name
    avg: 0.333,
    ops: 0.950,
    games: 162,
    position: 'SS',
  },
]
```

## Common Mistakes

### ❌ Mistake 1: Forgetting Optional Chaining

```vue
<!-- ❌ Crashes if avg is null -->
<td>{{ player.avg.toFixed(3) }}</td>

<!-- ✅ Safe -->
<td>{{ player.avg?.toFixed(3) ?? 'N/A' }}</td>
```

### ❌ Mistake 2: Using `||` Instead of `??`

```vue
<!-- ❌ Shows 'N/A' when games is 0 -->
<td>{{ player.games || 'N/A' }}</td>

<!-- ✅ Shows 0 when games is 0 -->
<td>{{ player.games ?? 'N/A' }}</td>
```

### ❌ Mistake 3: Not Handling Empty Strings

```vue
<!-- ❌ Shows empty cell if position is '' -->
<td>{{ player.position ?? 'Unknown' }}</td>

<!-- ✅ Shows 'Unknown' if position is '' or null -->
<td>{{ player.position?.trim() || 'Unknown' }}</td>
```

### ❌ Mistake 4: Complex Logic in Templates

```vue
<!-- ❌ Hard to read and maintain -->
<td>
  {{ player.avg != null && player.avg > 0 
     ? player.avg.toFixed(3) 
     : player.avg === 0 
       ? '.000' 
       : 'N/A' 
  }}
</td>

<!-- ✅ Use computed property instead -->
<td>{{ formattedAvg }}</td>
```

## Quick Reference

| Scenario | Pattern | Example |
|----------|---------|---------|
| Numeric method | `value?.method() ?? fallback` | `player.avg?.toFixed(3) ?? 'N/A'` |
| String method | `value?.method() ?? fallback` | `player.name?.toUpperCase() ?? ''` |
| Array length | `array?.length ?? fallback` | `player.stats?.length ?? 0` |
| Nested property | `obj?.prop?.subprop ?? fallback` | `player.team?.city?.name ?? 'Unknown'` |
| Zero is valid | `value ?? fallback` | `player.games ?? 0` |
| Empty string invalid | `value?.trim() \|\| fallback` | `player.position?.trim() \|\| 'Unknown'` |

## Related

- [Vue Template Runtime Errors](../troubleshooting/vue-template-runtime-errors.md) - Debugging template errors
- [Sortable Table Columns](../patterns/sortable-table-columns.md) - Real-world example using these patterns
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) - Official TypeScript narrowing guide

## Real-World Example

From our baseball-chat player table:

```vue
<script setup lang="ts">
import type { Player } from '~~/types/player'

const { data: players } = await useFetch<Player[]>('/api/players')
</script>

<template>
  <tbody>
    <tr v-for="player in players" :key="player.id">
      <!-- String with fallback -->
      <td>{{ player.name ?? 'Unknown' }}</td>
      
      <!-- String with transform -->
      <td>{{ player.position?.toUpperCase() ?? 'N/A' }}</td>
      
      <!-- Number as-is -->
      <td>{{ player.games ?? 0 }}</td>
      
      <!-- Number with formatting -->
      <td>{{ player.avg?.toFixed(3) ?? 'N/A' }}</td>
      
      <!-- Number with formatting -->
      <td>{{ player.ops?.toFixed(3) ?? 'N/A' }}</td>
    </tr>
  </tbody>
</template>
```

This pattern prevents runtime crashes and provides a better user experience when data is missing.
