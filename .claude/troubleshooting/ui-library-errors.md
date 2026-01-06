# Troubleshooting: UI Library Errors

> When complex UI libraries cause persistent errors, consider replacing with simple HTML

**Last Updated**: 2026-01-05

---

## Problem

Third-party UI component libraries (like TanStack Table, AG Grid, etc.) can cause persistent errors that are difficult to debug, especially when:
- Error messages point to library internals
- Documentation doesn't match your use case
- Type definitions are complex or incorrect
- The library is over-engineered for your needs

---

## Example: UTable / TanStack Table Error

### The Error
```
H3Error: Columns require an id when using a non-string header
at createColumn (node_modules/@tanstack/table-core/build/lib/index.mjs:216:13)
```

### What We Tried
1. ✅ Added `id` property to columns
2. ✅ Removed `sortable: false` property
3. ✅ Used `as any` for type assertions
4. ✅ Simplified column definitions
5. ❌ Error persisted despite all fixes

### Root Cause
Compatibility issue between Nuxt UI's `UTable` wrapper and TanStack Table Core v8.21.3. The wrapper wasn't properly mapping column properties to TanStack's expected format.

---

## Solution: Replace with Simple HTML

Instead of fighting the library, we replaced `UTable` with a custom HTML table:

### Before (UTable - 20 lines)
```vue
<UTable
  :columns="columns"
  :rows="sorted"
  @select="(row) => navigateTo(`/players/${row.id}`)"
/>

<script setup>
const columns = [
  { key: 'name', label: 'Player', id: 'name' },
  { key: 'position', label: 'Pos', id: 'position' },
  // ... more columns
]
</script>
```

### After (Custom HTML - 30 lines)
```vue
<UCard>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
      <thead class="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Player
          </th>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Pos
          </th>
          <!-- ... more headers -->
        </tr>
      </thead>
      <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
        <tr
          v-for="player in sorted"
          :key="player.id"
          class="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
          @click="navigateTo(`/players/${player.id}`)"
        >
          <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
            {{ player.name }}
          </td>
          <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
            {{ player.position }}
          </td>
          <!-- ... more cells -->
        </tr>
      </tbody>
    </table>
  </div>
</UCard>
```

---

## Benefits of Simple HTML

### ✅ Advantages
- **No library errors** - Full control over rendering
- **Better performance** - No heavy table library overhead
- **Easier debugging** - Standard HTML elements
- **More maintainable** - Clear, readable code
- **Full customization** - Complete control over styling and behavior
- **Type safety** - No complex library type definitions

### ⚠️ Trade-offs
- **More code** - ~10 extra lines for basic table
- **Manual features** - Need to implement sorting, filtering, etc. yourself
- **No advanced features** - No built-in virtualization, column resizing, etc.

---

## When to Use This Approach

### ✅ Use Simple HTML When:
- Table has < 1000 rows (no virtualization needed)
- Simple sorting/filtering requirements
- Library causes persistent errors
- You need full control over styling
- Performance is critical
- Team prefers explicit code over abstractions

### ❌ Keep the Library When:
- Table has > 1000 rows (need virtualization)
- Complex features needed (column resizing, drag-drop, etc.)
- Library works without issues
- Team is familiar with the library
- Time constraints (library saves development time)

---

## General Troubleshooting Steps

When facing persistent UI library errors:

1. **Check library version** - Is it compatible with your framework version?
2. **Review documentation** - Are you using the API correctly?
3. **Search issues** - Has someone else reported this?
4. **Try minimal example** - Does it work in isolation?
5. **Estimate complexity** - How hard would it be to replace?
6. **Consider alternatives** - Are there simpler libraries?
7. **Evaluate trade-offs** - Is the library worth the complexity?

**Decision threshold:** If you spend > 2 hours debugging a library error, consider replacing it with simple HTML.

---

## Related Patterns

- [Nuxt Dynamic Routes](../quick-references/nuxt-dynamic-routes.md) - File-based routing
- [Type Sharing in Nuxt](../patterns/type-sharing-nuxt.md) - Server/client type sharing
- [Tailwind Component Patterns](../patterns/tailwind-components.md) - Styling custom components

---

## Lessons Learned

1. **Simplicity wins** - Sometimes the simplest solution is the best
2. **Know when to quit** - Don't fight libraries for hours
3. **HTML is powerful** - Modern CSS makes custom components easy
4. **Performance matters** - Heavy libraries have real costs
5. **Maintainability counts** - Simple code is easier to maintain

---

**Tags:** #troubleshooting #ui-libraries #nuxt #tailwind #tables #tanstack
