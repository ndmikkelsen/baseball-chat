# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A fresh Nuxt 4 application with TypeScript and TailwindCSS, following the constitution framework for knowledge management.

## Tech Stack

- **Frontend**: Nuxt 4 + Vue 3 + TypeScript + TailwindCSS
- **Package Manager**: pnpm

## Project Structure

```
baseball-chat/
├── pages/            # File-based routing
├── components/       # Vue components (auto-imported)
├── composables/      # Composables (auto-imported)
├── assets/css/       # Tailwind CSS
├── public/           # Static files
├── .claude/          # Knowledge garden
└── nuxt.config.ts    # Nuxt configuration
```

## Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server (http://localhost:3000)
pnpm build            # Build for production
pnpm generate         # Generate static site
pnpm preview          # Preview production build
pnpm typecheck        # Run TypeScript type checking
```

## Nuxt 4 Conventions

### File-Based Routing

Pages in `pages/` directory automatically become routes:
- `pages/index.vue` → `/`
- `pages/about.vue` → `/about`
- `pages/users/[id].vue` → `/users/:id`

### Auto-Imports

Components, composables, and utilities are automatically imported:
- `components/BaseButton.vue` → `<BaseButton />` (no import needed)
- `composables/useAuth.ts` → `useAuth()` (no import needed)
- `utils/format.ts` → `format()` (no import needed)

### TypeScript

Use strict mode and explicit types:

```typescript
// Good
interface User {
  id: string
  name: string
}

function getUser(id: string): Promise<User> {
  return fetch(`/api/users/${id}`).then(res => res.json())
}

// Bad
function getUser(id: any): any {
  return fetch(`/api/users/${id}`).then(res => res.json())
}
```

### Vue 3 Composition API

Always use `<script setup>`:

```vue
<script setup lang="ts">
import type { User } from '~/types'

const props = defineProps<{
  user: User
}>()

const count = ref(0)
const doubled = computed(() => count.value * 2)
</script>

<template>
  <div>{{ user.name }}: {{ doubled }}</div>
</template>
```

### TailwindCSS

Use utility classes for styling:

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

## Constitution Framework

This project uses the constitution framework for knowledge management:

- **[CONSTITUTION.md](./CONSTITUTION.md)** - Core values and principles
- **[VISION.md](./VISION.md)** - Project goals and direction
- **[PLAN.md](./PLAN.md)** - Current status and roadmap
- **[GARDENING.md](./GARDENING.md)** - Knowledge management guide
- **[CONVENTIONS.md](./CONVENTIONS.md)** - Coding conventions
- **[.claude/](./.claude/)** - Knowledge garden with commands and templates

## Knowledge Garden

The `.claude/` directory contains:

- **[.claude/INDEX.md](.claude/INDEX.md)** - Full knowledge base index
- **[.claude/commands/](.claude/commands/)** - Development workflow commands
- **[.claude/templates/](.claude/templates/)** - PR, issue, and decision templates

## Development Workflow

### Starting Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Open http://localhost:3000
```

### Creating Features

1. Create pages in `pages/` for new routes
2. Create components in `components/` (auto-imported)
3. Create composables in `composables/` for shared logic
4. Use TailwindCSS for styling
5. Follow TypeScript strict mode

### Committing Changes

Follow conventional commits:

```bash
git commit -m "feat(pages): add user profile page"
git commit -m "fix(components): correct button hover state"
git commit -m "docs(readme): update installation instructions"
```

See [CONVENTIONS.md](./CONVENTIONS.md) for full commit message format.

## Resources

- [Nuxt 4 Documentation](https://nuxt.com/docs/4.x)
- [Vue 3 Documentation](https://vuejs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
