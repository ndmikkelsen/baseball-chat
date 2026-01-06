# Coding Conventions

This document outlines the coding conventions for the baseball-chat project.

## General Principles

1. **Clarity over cleverness** - Write code that is easy to understand
2. **Consistency** - Follow established patterns in the codebase
3. **Type safety** - Use TypeScript strictly, avoid `any`
4. **Composition** - Prefer composition over inheritance
5. **Single responsibility** - Each function/component should do one thing well

## Nuxt 4 Conventions

### File Structure

```
baseball-chat/
├── pages/            # File-based routing
│   ├── index.vue     # Home page (/)
│   └── about.vue     # About page (/about)
├── components/       # Vue components (auto-imported)
│   ├── BaseButton.vue
│   └── UserProfile.vue
├── composables/      # Composables (auto-imported)
│   ├── useAuth.ts
│   └── useApi.ts
├── layouts/          # Layouts (optional)
│   └── default.vue
├── middleware/       # Route middleware (optional)
│   └── auth.ts
├── plugins/          # Plugins (optional)
│   └── api.ts
├── utils/            # Utilities (auto-imported)
│   └── format.ts
├── assets/           # CSS, fonts, images
│   └── css/
│       └── main.css
└── public/           # Static files
    └── favicon.ico
```

### Naming Conventions

**Files:**
- Pages: `kebab-case.vue` (e.g., `user-profile.vue`)
- Components: `PascalCase.vue` (e.g., `UserProfile.vue`)
- Composables: `camelCase.ts` with `use` prefix (e.g., `useAuth.ts`)
- Utils: `camelCase.ts` (e.g., `formatDate.ts`)

**Variables:**
- `camelCase` for variables and functions
- `PascalCase` for types and interfaces
- `SCREAMING_SNAKE_CASE` for constants

**Components:**
- Prefix base components with `Base` (e.g., `BaseButton.vue`)
- Prefix layout components with `Layout` (e.g., `LayoutDefault.vue`)
- Use descriptive names (e.g., `UserProfileCard.vue` not `Card.vue`)

### Vue 3 Composition API

**Always use `<script setup>`:**

```vue
<script setup lang="ts">
import type { User } from '~/types'

const props = defineProps<{
  user: User
}>()

const emit = defineEmits<{
  update: [user: User]
}>()

const count = ref(0)
const doubled = computed(() => count.value * 2)

function increment() {
  count.value++
}
</script>

<template>
  <div>
    <p>{{ user.name }}</p>
    <button @click="increment">Count: {{ count }}</button>
  </div>
</template>
```

**Composables:**

```typescript
// composables/useCounter.ts
export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  function increment() {
    count.value++
  }
  
  function decrement() {
    count.value--
  }
  
  return {
    count: readonly(count),
    increment,
    decrement,
  }
}
```

### TypeScript

**Use strict mode:**

```typescript
// tsconfig.json
{
  "extends": "./.nuxt/tsconfig.json",
  "compilerOptions": {
    "strict": true
  }
}
```

**Define types explicitly:**

```typescript
// Good
interface User {
  id: string
  name: string
  email: string
}

function getUser(id: string): Promise<User> {
  return fetch(`/api/users/${id}`).then(res => res.json())
}

// Bad
function getUser(id: any): any {
  return fetch(`/api/users/${id}`).then(res => res.json())
}
```

**Use type imports:**

```typescript
import type { User } from '~/types'
```

### TailwindCSS

**Use utility classes:**

```vue
<template>
  <div class="flex items-center justify-between p-4 bg-white rounded-lg shadow">
    <h2 class="text-xl font-bold text-gray-900">Title</h2>
    <button class="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
      Click me
    </button>
  </div>
</template>
```

**Extract repeated patterns to components:**

```vue
<!-- components/BaseButton.vue -->
<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary'
}>()
</script>

<template>
  <button
    class="px-4 py-2 rounded font-medium transition-colors"
    :class="{
      'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
      'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
    }"
  >
    <slot />
  </button>
</template>
```

### API Calls

**Use composables for API calls:**

```typescript
// composables/useApi.ts
export function useApi() {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBaseUrl
  
  async function get<T>(path: string): Promise<T> {
    const response = await fetch(`${baseUrl}${path}`)
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }
    return response.json()
  }
  
  return { get }
}
```

**Use in components:**

```vue
<script setup lang="ts">
import type { User } from '~/types'

const { get } = useApi()
const { data: user } = await useAsyncData('user', () => get<User>('/api/user'))
</script>
```

### Error Handling

**Handle errors gracefully:**

```typescript
try {
  const data = await fetchData()
  return data
} catch (error) {
  console.error('Failed to fetch data:', error)
  throw error
}
```

**Use error boundaries in components:**

```vue
<script setup lang="ts">
const error = ref<Error | null>(null)

async function loadData() {
  try {
    error.value = null
    await fetchData()
  } catch (e) {
    error.value = e as Error
  }
}
</script>

<template>
  <div>
    <div v-if="error" class="text-red-600">
      Error: {{ error.message }}
    </div>
    <div v-else>
      <!-- Content -->
    </div>
  </div>
</template>
```

## Git Conventions

### Commit Messages

Follow conventional commits:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

**Scopes:**
- `pages` - Page components
- `components` - Vue components
- `composables` - Composables
- `config` - Configuration files
- `deps` - Dependencies

**Examples:**

```
feat(pages): add user profile page
fix(components): correct button hover state
docs(readme): update installation instructions
style(components): format with prettier
refactor(composables): simplify useAuth logic
chore(deps): update nuxt to 4.0.0
```

### Branch Naming

```
type/short-description
```

**Examples:**
- `feat/user-profile`
- `fix/button-hover`
- `docs/update-readme`
- `refactor/auth-logic`

## Code Review

### Checklist

- [ ] Code follows TypeScript strict mode
- [ ] Components use `<script setup>`
- [ ] Composables are properly typed
- [ ] TailwindCSS classes are used consistently
- [ ] Error handling is implemented
- [ ] No console.log statements (use proper logging)
- [ ] Code is formatted with Prettier
- [ ] Commit messages follow conventional commits
- [ ] Documentation is updated if needed

## Resources

- [Nuxt 4 Documentation](https://nuxt.com/docs/4.x)
- [Vue 3 Documentation](https://vuejs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
