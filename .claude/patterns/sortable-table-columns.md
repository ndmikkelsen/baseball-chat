# Sortable Table Columns in Vue/Nuxt

Pattern for implementing sortable data tables with clickable column headers and visual indicators.

**Last Updated**: 2026-01-07

## When to Use

- Displaying tabular data that users need to sort by multiple columns
- Tables with mixed data types (strings, numbers, dates)
- Need both mouse/keyboard interaction and dropdown menu options
- Want modern UX with visual feedback

## When Not to Use

- Very small datasets (< 10 rows) where sorting adds little value
- Tables with only 1-2 columns
- Read-only data that has a fixed, meaningful order
- Performance-critical tables with thousands of rows (consider server-side sorting)

## Key Decisions

From the baseball-chat player table implementation:

1. **Visual Indicators**: Arrow icons (↑↓) instead of hand cursor
   - Inactive columns show faded dual-arrows icon
   - Active column shows bright up/down arrow based on direction
   
2. **Smart Defaults**: First click behavior based on data type
   - Text columns (name, position): Sort A-Z (ascending)
   - Numeric columns (stats): Sort high-to-low (descending)
   
3. **Dual UI**: Both clickable headers AND dropdown menu
   - Headers for quick, intuitive sorting
   - Dropdown for accessibility and mobile-friendly alternative
   
4. **Null Safety**: Handle missing/undefined values gracefully
   - Numeric nulls treated as 0
   - String nulls treated as empty string

## Implementation

### 1. Type Definitions

**File**: `types/player.ts` (or your domain type file)

```typescript
export type SortKey = 
  | "name"
  | "position"
  | "games"
  | "hits"
  | "homeRuns"
  | "avg"
  | "ops"

export type SortDirection = "asc" | "desc"

export interface Player {
  id: string
  name: string
  position: string
  games: number
  hits: number
  homeRuns: number
  avg: number | null
  ops: number | null
  description: string | null
}
```

**Key points:**
- `SortKey` union type ensures type safety
- Only include sortable fields (exclude description if not shown in table)
- Handle nullable fields in your data model

---

### 2. Column Configuration (Single Source of Truth)

**File**: `app/pages/index.vue` (or your table component)

```typescript
interface Column {
  key: SortKey
  label: string
  shortLabel: string
  type: "string" | "number"
}

const columns: Column[] = [
  { key: "name", label: "Player", shortLabel: "Player", type: "string" },
  { key: "position", label: "Position", shortLabel: "Pos", type: "string" },
  { key: "games", label: "Games", shortLabel: "G", type: "number" },
  { key: "hits", label: "Hits", shortLabel: "H", type: "number" },
  { key: "homeRuns", label: "Home Runs", shortLabel: "HR", type: "number" },
  { key: "avg", label: "Batting Average", shortLabel: "AVG", type: "number" },
  { key: "ops", label: "On-Base Plus Slugging", shortLabel: "OPS", type: "number" },
]
```

**Benefits:**
- Single place to add/remove/modify columns
- Powers both table headers and dropdown menu
- Type metadata enables smart sorting defaults
- Separate labels for different contexts (table vs dropdown)

---

### 3. Sort State Management

```typescript
const sortKey = ref<SortKey>("hits")
const sortDirection = ref<SortDirection>("desc")

function handleSort(key: SortKey) {
  if (sortKey.value === key) {
    // Same column clicked - toggle direction
    sortDirection.value = sortDirection.value === "desc" ? "asc" : "desc"
  } else {
    // New column clicked - set smart default
    sortKey.value = key
    const column = columns.find(col => col.key === key)
    sortDirection.value = column?.type === "string" ? "asc" : "desc"
  }
}
```

**Behavior:**
- First click: Sort by column with smart default direction
- Second click: Toggle direction
- Uses column metadata to determine default

---

### 4. Sort Logic (Type-Safe Comparator)

```typescript
function compareValues(aVal: unknown, bVal: unknown, type: ColumnType): number {
  if (type === "string") {
    const aStr = String(aVal ?? "").toLowerCase();
    const bStr = String(bVal ?? "").toLowerCase();
    return aStr.localeCompare(bStr);
  }
  const aNum = typeof aVal === "number" ? aVal : 0;
  const bNum = typeof bVal === "number" ? bVal : 0;
  return aNum - bNum;
}

const sorted = computed(() => {
  const list = players.value ?? [];
  const col = columns.find(c => c.key === sortKey.value);
  const type = col?.type ?? "number";

  const dir = sortDirection.value === "asc" ? 1 : -1;

  return [...list].sort((a, b) => {
    const cmp = compareValues(a[sortKey.value], b[sortKey.value], type);
    return dir * cmp;
  });
})
```

**Key features:**
- Null-safe: Treats null as 0 or empty string
- Case-insensitive string sorting with `localeCompare()`
- Type-aware comparison using column metadata
- Simple and readable logic
- Immutable: Creates new array with `[...list]`

---

### 5. Visual Indicator Component

**File**: `app/components/SortIndicator.vue`

```vue
<script setup lang="ts">
import type { SortDirection } from "~~/types/player"

const props = defineProps<{
  active: boolean
  direction: SortDirection
}>()

const icon = computed(() => {
  if (!props.active) {
    return "i-heroicons-arrows-up-down"
  }
  return props.direction === "desc" 
    ? "i-heroicons-arrow-down" 
    : "i-heroicons-arrow-up"
})
</script>

<template>
  <UIcon 
    :name="icon" 
    :class="[
      'w-4 h-4 transition-opacity',
      active ? 'opacity-100' : 'opacity-30'
    ]" 
  />
</template>
```

**Visual states:**
- Inactive: Faded dual-arrows (↕)
- Active ascending: Bright up arrow (↑)
- Active descending: Bright down arrow (↓)

**Note**: Uses Nuxt UI's `UIcon` component with Heroicons. Adapt to your icon library.

---

### 6. Clickable Table Headers

**File**: `app/pages/index.vue` (template section)

```vue
<template>
  <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
    <thead class="bg-gray-50 dark:bg-gray-800">
      <tr>
        <th
          v-for="column in columns"
          :key="column.key"
          class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors select-none"
          @click="handleSort(column.key)"
        >
          <div class="flex items-center gap-1">
            <span>{{ column.shortLabel }}</span>
            <SortIndicator 
              :active="sortKey === column.key" 
              :direction="sortDirection" 
            />
          </div>
        </th>
      </tr>
    </thead>
    
    <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
      <tr v-for="player in sorted" :key="player.id">
        <td class="px-4 py-3 whitespace-nowrap">{{ player.name }}</td>
        <td class="px-4 py-3 whitespace-nowrap">{{ player.position }}</td>
        <td class="px-4 py-3 whitespace-nowrap">{{ player.games }}</td>
        <td class="px-4 py-3 whitespace-nowrap">{{ player.hits }}</td>
        <td class="px-4 py-3 whitespace-nowrap">{{ player.homeRuns }}</td>
        <td class="px-4 py-3 whitespace-nowrap">{{ player.avg?.toFixed(3) ?? 'N/A' }}</td>
        <td class="px-4 py-3 whitespace-nowrap">{{ player.ops?.toFixed(3) ?? 'N/A' }}</td>
      </tr>
    </tbody>
  </table>
</template>
```

**CSS classes explained:**
- `cursor-pointer` - Shows pointer cursor on hover
- `hover:bg-gray-100` - Visual feedback on hover
- `transition-colors` - Smooth hover animation
- `select-none` - Prevents text selection when clicking
- `flex items-center gap-1` - Aligns label and icon

**Null-safe rendering:**
- Use optional chaining: `player.avg?.toFixed(3)`
- Provide fallback: `?? 'N/A'`

---

### 7. Dropdown Menu (Optional, for Accessibility)

```vue
<template>
  <div class="flex items-center gap-2 mb-4">
    <USelect
      v-model="sortKey"
      :options="columns.map(col => ({ 
        value: col.key, 
        label: col.label 
      }))"
      placeholder="Sort by..."
    />
    
    <UButton
      :icon="sortDirection === 'desc' 
        ? 'i-heroicons-arrow-down' 
        : 'i-heroicons-arrow-up'"
      @click="sortDirection = sortDirection === 'desc' ? 'asc' : 'desc'"
    />
  </div>
</template>
```

**Benefits:**
- Accessible alternative to clicking headers
- Mobile-friendly
- Shows full column labels (not abbreviations)
- Syncs with header clicks automatically (shared state)

---

## Complete Example

See the baseball-chat player table implementation:
- **Types**: `types/player.ts`
- **Component**: `app/pages/index.vue`
- **Indicator**: `app/components/SortIndicator.vue`

---

## Testing Checklist

When implementing this pattern:

- [ ] Click each column header - sorts by that column
- [ ] Click same header twice - reverses direction
- [ ] Visual indicator shows correct column and direction
- [ ] Text columns sort alphabetically (case-insensitive)
- [ ] Numeric columns sort numerically (not alphabetically)
- [ ] Null/undefined values don't cause errors
- [ ] Hover states work on all headers
- [ ] Mobile/touch interactions work
- [ ] Dropdown menu (if present) syncs with header clicks
- [ ] TypeScript has no type errors

---

## Common Pitfalls

### 1. Mutating Original Array

**❌ Wrong:**
```typescript
const sorted = computed(() => {
  return players.value.sort(...) // Mutates original!
})
```

**✅ Correct:**
```typescript
const sorted = computed(() => {
  return [...players.value].sort(...) // Creates copy
})
```

### 2. Alphabetical Sorting of Numbers

**❌ Wrong:**
```typescript
// Treats numbers as strings: "10" < "2"
comparison = String(aVal).localeCompare(String(bVal))
```

**✅ Correct:**
```typescript
// Numeric comparison: 10 > 2
comparison = Number(aVal) - Number(bVal)
```

### 3. Case-Sensitive String Sorting

**❌ Wrong:**
```typescript
comparison = aVal.localeCompare(bVal) // "Zebra" < "apple"
```

**✅ Correct:**
```typescript
comparison = aVal.toLowerCase().localeCompare(bVal.toLowerCase())
```

### 4. Forgetting Null Safety

**❌ Wrong:**
```typescript
<td>{{ player.avg.toFixed(3) }}</td> // Crashes if null
```

**✅ Correct:**
```typescript
<td>{{ player.avg?.toFixed(3) ?? 'N/A' }}</td>
```

---

## Variations

### Server-Side Sorting

For large datasets, move sorting to the API:

```typescript
const { data: players } = await useFetch('/api/players', {
  query: {
    sortBy: sortKey,
    sortDir: sortDirection
  }
})
```

### Multi-Column Sorting

Add secondary sort keys:

```typescript
return [...list].sort((a, b) => {
  const primary = compareValues(a, b, sortKey.value, sortDirection.value)
  if (primary !== 0) return primary
  
  // Tie-breaker: sort by name
  return a.name.localeCompare(b.name)
})
```

### Persistent Sort State

Save sort preferences to localStorage:

```typescript
const sortKey = useLocalStorage<SortKey>('player-sort-key', 'hits')
const sortDirection = useLocalStorage<SortDirection>('player-sort-dir', 'desc')
```

---

## Related Patterns

- [Nuxt Shared Types](./nuxt-shared-types.md) - Type-safe API communication
- [Type Sharing in Nuxt](./type-sharing-nuxt.md) - Sharing types between server/client

## Related Quick References

- [Nuxt UI Forms](../quick-references/nuxt-ui-forms.md) - Using USelect and UButton components

---

## References

- [Vue Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [TypeScript Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [Array.prototype.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
- [String.prototype.localeCompare()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare)
