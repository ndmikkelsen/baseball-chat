# Nuxt UI Forms Quick Reference

Guide for working with form components in Nuxt UI 3 (v4.x).

**Last Updated:** 2026-01-06

## Form Field Component

### ✅ Correct (Nuxt UI 3)

```vue
<UFormField label="Name" name="name">
  <UInput v-model="form.name" />
</UFormField>
```

### ❌ Incorrect (Nuxt UI 2 - deprecated)

```vue
<!-- This will NOT show labels in Nuxt UI 3 -->
<UFormGroup label="Name" name="name">
  <UInput v-model="form.name" />
</UFormGroup>
```

## Migration from Nuxt UI 2 to 3

**Component Renamed:** `UFormGroup` → `UFormField`

**Symptom:** Labels don't appear on form inputs, but no errors in console

**Fix:** Replace all instances:

```bash
# Find all usages
rg "UFormGroup" app/

# Replace in a specific file
sed -i '' 's/UFormGroup/UFormField/g' app/pages/your-page.vue

# Or use your editor's find/replace (Cmd+Shift+H in VS Code)
```

## Common Patterns

### Basic Input with Label

```vue
<script setup lang="ts">
const form = reactive({
  name: '',
  email: '',
  age: 0
})
</script>

<template>
  <UForm :state="form">
    <UFormField label="Name" name="name">
      <UInput v-model="form.name" />
    </UFormField>

    <UFormField label="Email" name="email">
      <UInput v-model="form.email" type="email" />
    </UFormField>

    <UFormField label="Age" name="age">
      <UInput v-model.number="form.age" type="number" />
    </UFormField>
  </UForm>
</template>
```

### Select with Label

```vue
<UFormField label="Position" name="position">
  <USelect
    v-model="form.position"
    :options="['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH']"
  />
</UFormField>
```

### Textarea with Label

```vue
<UFormField label="Notes" name="notes">
  <UTextarea v-model="form.notes" :rows="4" />
</UFormField>
```

### Number Input with Label

```vue
<UFormField label="Games Played" name="games">
  <UInput v-model.number="form.games" type="number" />
</UFormField>
```

### Optional Field with Description

```vue
<UFormField 
  label="Middle Name" 
  name="middleName"
  description="Optional"
>
  <UInput v-model="form.middleName" />
</UFormField>
```

## Form Validation

### With Zod Schema

```vue
<script setup lang="ts">
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  age: z.number().min(18, 'Must be 18 or older')
})

type Schema = z.output<typeof schema>

const form = reactive({
  name: '',
  email: '',
  age: 0
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log('Valid form data:', event.data)
}
</script>

<template>
  <UForm :schema="schema" :state="form" @submit="onSubmit">
    <UFormField label="Name" name="name">
      <UInput v-model="form.name" />
    </UFormField>

    <UFormField label="Email" name="email">
      <UInput v-model="form.email" type="email" />
    </UFormField>

    <UFormField label="Age" name="age">
      <UInput v-model.number="form.age" type="number" />
    </UFormField>

    <UButton type="submit">Submit</UButton>
  </UForm>
</template>
```

### Manual Error Handling

```vue
<script setup lang="ts">
const form = reactive({
  name: ''
})

const errors = ref<{ name?: string }>({})

function validate() {
  errors.value = {}
  
  if (!form.name) {
    errors.value.name = 'Name is required'
  }
  
  return Object.keys(errors.value).length === 0
}

async function onSubmit() {
  if (!validate()) return
  
  // Submit form
}
</script>

<template>
  <UForm :state="form" @submit="onSubmit">
    <UFormField 
      label="Name" 
      name="name"
      :error="errors.name"
    >
      <UInput v-model="form.name" />
    </UFormField>

    <UButton type="submit">Submit</UButton>
  </UForm>
</template>
```

## Complete Edit Form Example

```vue
<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const { data: player, pending, error } = await useFetch(`/api/players/${route.params.id}`)

const form = reactive({
  name: player.value?.name || '',
  position: player.value?.position || '',
  games: player.value?.games || 0,
  atBats: player.value?.atBats || 0,
  runs: player.value?.runs || 0,
  hits: player.value?.hits || 0
})

async function onSubmit() {
  await $fetch(`/api/players/${route.params.id}`, {
    method: 'PATCH',
    body: form
  })
  
  router.push(`/players/${route.params.id}`)
}
</script>

<template>
  <div v-if="pending">Loading...</div>
  <div v-else-if="error">Error loading player</div>
  <div v-else>
    <UForm :state="form" @submit="onSubmit">
      <UFormField label="Name" name="name">
        <UInput v-model="form.name" />
      </UFormField>

      <UFormField label="Position" name="position">
        <USelect
          v-model="form.position"
          :options="['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH']"
        />
      </UFormField>

      <UFormField label="Games" name="games">
        <UInput v-model.number="form.games" type="number" />
      </UFormField>

      <UFormField label="At Bats" name="atBats">
        <UInput v-model.number="form.atBats" type="number" />
      </UFormField>

      <UFormField label="Runs" name="runs">
        <UInput v-model.number="form.runs" type="number" />
      </UFormField>

      <UFormField label="Hits" name="hits">
        <UInput v-model.number="form.hits" type="number" />
      </UFormField>

      <div class="flex gap-2">
        <UButton type="submit">Save Changes</UButton>
        <UButton color="gray" @click="router.back()">Cancel</UButton>
      </div>
    </UForm>
  </div>
</template>
```

## Troubleshooting

### Labels not showing?

**Symptoms:**
- Form inputs render correctly
- No labels appear above inputs
- No errors in console
- Using Nuxt UI 3 (v4.x)

**Solution:**
1. Check you're using `UFormField` not `UFormGroup`
2. Verify the `label` prop is set
3. Check Nuxt UI version: `pnpm list @nuxt/ui`

```bash
# Find incorrect usage
rg "UFormGroup" app/

# Replace with correct component
# In VS Code: Cmd+Shift+H, find "UFormGroup", replace with "UFormField"
```

### Form not submitting?

**Check:**
- `@submit` handler is attached to `<UForm>`
- Submit button has `type="submit"`
- No validation errors blocking submission

### Validation not working?

**Check:**
- Schema is passed to `<UForm :schema="schema">`
- Form state matches schema shape
- Using `FormSubmitEvent<Schema>` type for submit handler

### Input values not updating?

**Check:**
- Using `v-model` on input components
- Using `.number` modifier for numeric inputs: `v-model.number`
- Form state is `reactive()` not `ref()`

## Related

- [Nuxt UI Documentation](https://ui.nuxt.com)
- [Nuxt UI Forms](https://ui.nuxt.com/components/form)
- [Nuxt Dynamic Routes](./nuxt-dynamic-routes.md)
- [Nuxt Path Aliases](./nuxt-path-aliases.md)

## Version Info

This guide is for **Nuxt UI 3** (v4.x). If you're using Nuxt UI 2, use `UFormGroup` instead of `UFormField`.

Check your version:
```bash
pnpm list @nuxt/ui
```
