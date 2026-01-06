---
description: Create a conventional commit with proper scope and message
---

# 🎯 ACTION: Create Conventional Commit

Stage changes and create a commit following conventional commit format.

See @CONSTITUTION.md for commit conventions.

## 📋 STEPS

1. **Review changes** - Run `git status` and `git diff` to see what changed
2. **Stage changes** - Run `git add <files>` to stage specific files
3. **Determine type** - Choose commit type (feat, fix, docs, style, refactor, test, chore)
4. **Determine scope** - Choose scope (pages, components, composables, config, deps)
5. **Write message** - Create commit message following format: `type(scope): subject`
6. **Commit** - Run `git commit -m "type(scope): subject"`
7. **Verify** - Run `git log -1` to verify commit message

## 💡 CONTEXT

**Conventional commit format:**

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
- `assets` - CSS, images, fonts
- `types` - TypeScript types

**Examples:**

```bash
git commit -m "feat(pages): add user profile page"
git commit -m "fix(components): correct button hover state"
git commit -m "docs(readme): update installation instructions"
git commit -m "style(components): format with prettier"
git commit -m "refactor(composables): simplify useAuth logic"
git commit -m "chore(deps): update nuxt to 4.0.0"
```

**Multi-line commits:**

```bash
git commit -m "feat(pages): add user profile page" -m "- Add profile page with user info
- Add edit profile functionality
- Add avatar upload"
```

**Breaking changes:**

```bash
git commit -m "feat(api)!: change API response format" -m "BREAKING CHANGE: API now returns data in new format"
```

**Common patterns:**

```bash
# Feature work
git add pages/profile.vue components/UserCard.vue
git commit -m "feat(pages): add user profile page"

# Bug fix
git add components/Button.vue
git commit -m "fix(components): correct button hover state"

# Documentation
git add README.md
git commit -m "docs(readme): update installation instructions"

# Dependencies
git add package.json pnpm-lock.yaml
git commit -m "chore(deps): update nuxt to 4.0.0"

# Configuration
git add nuxt.config.ts
git commit -m "chore(config): enable devtools"
```

## 🔗 Follow-up Commands

- `/dev` - Start development server
- `/build` - Build for production
- `/cultivate` - Update documentation

## Related

- [@CONVENTIONS.md](../../CONVENTIONS.md) - Coding conventions
- [@.claude/INDEX.md](../INDEX.md) - Command directory
