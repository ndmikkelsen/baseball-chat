# Troubleshooting: Silent UI Failures

> When UI elements don't render but there are no error messages

**Last Updated**: 2026-01-06

---

## Problem

"Silent UI failures" occur when UI elements fail to render but produce no error messages, making them extremely difficult to debug. The page loads successfully, the URL is correct, but something is missing or broken.

### Characteristics

- ✅ Page loads without errors
- ✅ URL is correct
- ✅ No console errors
- ✅ No network errors
- ❌ UI elements missing or not rendering
- ❌ No obvious indication of what's wrong

### Why This Pattern Is Dangerous

- **No error messages** - Nothing to Google or search in docs
- **Wastes time** - Can spend hours debugging with no leads
- **Common in upgrades** - Framework/library updates often cause these
- **Hard to reproduce** - May work in one context but not another

---

## Common Causes

### 1. Routing Conflicts

**Symptom:** Entire page is blank, no API requests made

**Example:** `pages/players/[id].vue` catches all `/players/:id/*` routes, preventing `/players/:id/edit` from loading

**Solution:** Use nested routing structure with `[id]/index.vue`

**See:** [Nuxt Dynamic Routes - Routing Priority](../quick-references/nuxt-dynamic-routes.md#routing-priority-and-conflicts)

---

### 2. Component API Changes

**Symptom:** Page loads but specific UI elements (labels, buttons, etc.) are missing

**Example:** Nuxt UI v3 renamed `UFormGroup` → `UFormField`, old component name silently fails to render

**Solution:** Check component library migration guides, update component names

**See:** [Nuxt UI Forms - Migration](../quick-references/nuxt-ui-forms.md#migration-from-nuxt-ui-2-to-3)

---

### 3. Framework Version Mismatches

**Symptom:** Components that worked before suddenly don't render after upgrade

**Common scenarios:**
- Major version upgrades (Vue 2 → 3, Nuxt 3 → 4)
- UI library updates (Nuxt UI 2 → 3)
- Breaking changes in minor versions

**Solution:** 
1. Check migration guides
2. Search for breaking changes in release notes
3. Compare component API docs between versions

---

### 4. Missing or Incorrect Imports

**Symptom:** Component doesn't render, but no "component not found" error

**Example:**
```vue
<!-- Wrong - component won't render -->
<UFormGroup label="Name">
  <UInput v-model="name" />
</UFormGroup>

<!-- Right - but if UFormGroup doesn't exist in v3, it silently fails -->
<UFormField label="Name">
  <UInput v-model="name" />
</UFormField>
```

**Solution:** Verify component names in current version docs

---

### 5. Conditional Rendering Logic Errors

**Symptom:** Component exists in DOM but never shows

**Example:**
```vue
<!-- Wrong order - if error is set, player never shows -->
<div v-if="error">Error</div>
<div v-else-if="player">Player data</div>
<div v-else>Loading...</div>

<!-- Right order - check pending first -->
<div v-if="pending">Loading...</div>
<div v-else-if="error">Error</div>
<div v-else-if="player">Player data</div>
```

**Solution:** Review conditional logic order, ensure all states are handled

---

## Debugging Checklist

When facing a silent UI failure, work through this checklist systematically:

### 1. Inspect the DOM

```
□ Open browser DevTools → Elements tab
□ Is any HTML rendering at all?
□ Is the component in the DOM but hidden?
□ Are there empty divs or placeholder elements?
```

**What to look for:**
- Empty `<div>` tags where content should be
- Missing elements entirely
- Elements with `display: none` or `visibility: hidden`

---

### 2. Check Network Activity

```
□ Open DevTools → Network tab
□ Are expected API calls being made?
□ Are API calls returning data?
□ Are there any failed requests (even 404s)?
```

**Red flags:**
- No API calls when you expect them (routing issue)
- API calls failing silently
- Requests to wrong endpoints

---

### 3. Review Console Output

```
□ Check Console tab for warnings (not just errors)
□ Look for deprecation notices
□ Check for "component not found" warnings
□ Look for Vue warnings about props or slots
```

**Common warnings:**
- "Component X is not registered"
- "Unknown custom element"
- "Invalid prop type"

---

### 4. Use Vue DevTools

```
□ Install Vue DevTools browser extension
□ Check Components tab - is component mounting?
□ Check component props - are they correct?
□ Check component state - is data loading?
```

**What to verify:**
- Component appears in component tree
- Props have expected values
- State updates when expected

---

### 5. Check Recent Changes

```
□ Did you recently upgrade a framework or library?
□ Did you rename or move files?
□ Did you change routing structure?
□ Did you modify component imports?
```

**High-risk changes:**
- Framework major version upgrades
- UI library updates
- Routing structure changes
- Component refactoring

---

### 6. Verify Component API

```
□ Check component library documentation
□ Compare current version vs. version you're using
□ Look for migration guides
□ Search for breaking changes in release notes
```

**Where to look:**
- Official docs migration guides
- GitHub releases page
- CHANGELOG.md files
- Community discussions

---

### 7. Test in Isolation

```
□ Create minimal reproduction
□ Test component in isolation
□ Remove complexity incrementally
□ Verify basic functionality works
```

**Isolation techniques:**
- Create new test page with just the component
- Remove all props and slots
- Use hardcoded data instead of API calls
- Strip out styling and logic

---

## Case Studies

### Case Study 1: Edit Page Completely Blank

**Symptom:**
- Detail page at `/players/b-bonds-0` works perfectly
- Edit page at `/players/b-bonds-0/edit` shows blank page
- No console errors
- No API requests made
- URL is correct

**Investigation:**
1. ✅ Checked DevTools - no HTML rendering
2. ✅ Checked Network - no API calls
3. ✅ Checked Console - no errors or warnings
4. ✅ Checked routing structure - found conflict!

**Root Cause:** 
`pages/players/[id].vue` was catching all `/players/:id/*` routes, preventing nested `pages/players/[id]/edit.vue` from ever being reached.

**Solution:**
```bash
# Move detail page to nested structure
mv pages/players/[id].vue pages/players/[id]/index.vue
```

**Lesson:** Nuxt routing priority means `[id].vue` takes precedence over `[id]/edit.vue`. Use `[id]/index.vue` for nested routes.

**See:** [Nuxt Dynamic Routes - Routing Priority](../quick-references/nuxt-dynamic-routes.md#routing-priority-and-conflicts)

---

### Case Study 2: Form Labels Missing

**Symptom:**
- Edit page loads successfully
- Form inputs render and work
- All labels are missing
- No console errors
- No warnings

**Investigation:**
1. ✅ Checked DevTools - inputs present, labels missing
2. ✅ Checked Console - no errors
3. ✅ Checked component code - using `UFormGroup`
4. ✅ Checked Nuxt UI version - v4.3.0 (v3 series)
5. ✅ Checked docs - `UFormGroup` renamed to `UFormField`!

**Root Cause:**
Nuxt UI v3 (4.x) renamed `UFormGroup` → `UFormField`. The old component name doesn't exist, so it silently fails to render.

**Solution:**
```bash
# Find all usages
rg "UFormGroup" app/

# Replace in file
sed -i '' 's/UFormGroup/UFormField/g' app/pages/players/[id]/edit.vue
```

**Lesson:** Component API changes in major versions can cause silent failures. Always check migration guides after upgrades.

**See:** [Nuxt UI Forms - Migration](../quick-references/nuxt-ui-forms.md#migration-from-nuxt-ui-2-to-3)

---

## Prevention Strategies

### 1. Read Migration Guides

When upgrading frameworks or libraries:
- ✅ Read official migration guides thoroughly
- ✅ Check for breaking changes in release notes
- ✅ Search for "breaking" in CHANGELOG
- ✅ Review component API changes

### 2. Test Incrementally

Don't upgrade everything at once:
- ✅ Upgrade one dependency at a time
- ✅ Test after each upgrade
- ✅ Commit working state before next upgrade
- ✅ Keep notes on what changed

### 3. Use TypeScript

TypeScript can catch some issues at compile time:
- ✅ Type errors for renamed components
- ✅ Prop type mismatches
- ✅ Missing required props
- ⚠️ Won't catch all silent failures (like routing)

### 4. Enable Strict Mode

Vue and Nuxt have strict modes that show more warnings:
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => false // Warn about unknown elements
    }
  }
})
```

### 5. Use Linting

ESLint plugins can catch some issues:
- `eslint-plugin-vue` - Vue-specific rules
- `eslint-plugin-nuxt` - Nuxt-specific rules
- Custom rules for your component library

### 6. Document Component Versions

Keep track of what versions you're using:
```json
// package.json
{
  "dependencies": {
    "@nuxt/ui": "^4.3.0",  // v3 series - uses UFormField
    "nuxt": "^4.0.0"
  }
}
```

Add comments when using version-specific APIs:
```vue
<!-- Nuxt UI v3 (4.x) - uses UFormField not UFormGroup -->
<UFormField label="Name">
  <UInput v-model="name" />
</UFormField>
```

---

## Quick Reference

### Debugging Flow

```
Silent UI Failure Detected
         ↓
Is HTML rendering at all?
    ↓ No → Check routing structure
    ↓ Yes
         ↓
Are API calls being made?
    ↓ No → Check routing or component mounting
    ↓ Yes
         ↓
Are specific elements missing?
    ↓ Yes → Check component API and version
         ↓
Check conditional rendering logic
         ↓
Test component in isolation
         ↓
Review recent changes
```

### Common Fixes

| Symptom | Likely Cause | Quick Fix |
|---------|--------------|-----------|
| Entire page blank | Routing conflict | Use nested `[id]/index.vue` |
| Labels missing | Component API change | Check migration guide |
| Component not rendering | Wrong component name | Verify in docs |
| Data not loading | API call not made | Check routing/mounting |
| Element hidden | Conditional logic | Review `v-if` order |

---

## Related Documentation

- [Nuxt Dynamic Routes](../quick-references/nuxt-dynamic-routes.md) - Routing patterns and conflicts
- [Nuxt UI Forms](../quick-references/nuxt-ui-forms.md) - Form component migration
- [UI Library Errors](./ui-library-errors.md) - When to replace complex libraries

---

## Lessons Learned

1. **No errors ≠ no problems** - Silent failures are real and common
2. **Check versions first** - After upgrades, verify component APIs
3. **Systematic debugging** - Work through checklist, don't guess
4. **Document versions** - Know what APIs you're using
5. **Test incrementally** - Upgrade one thing at a time
6. **Read migration guides** - They exist for a reason

---

**Tags:** #troubleshooting #silent-failures #debugging #nuxt #vue #ui-components #routing
