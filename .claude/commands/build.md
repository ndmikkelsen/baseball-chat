---
description: Build for production
---

# 🎯 ACTION: Build for Production

Build the Nuxt application for production deployment.

See @CONSTITUTION.md for project conventions.

## 📋 STEPS

1. **Check dependencies** - Verify node_modules exists
2. **Install if needed** - Run `pnpm install` if dependencies are missing
3. **Type check** - Run `pnpm typecheck` to verify no TypeScript errors
4. **Build** - Run `pnpm build` to create production build
5. **Verify output** - Check `.output/` directory for build artifacts
6. **Test preview** - Run `pnpm preview` to test production build locally
7. **Confirm success** - Verify build completed without errors

## 💡 CONTEXT

**Build output:**

- `.output/` - Production build artifacts
- `.output/public/` - Static assets
- `.output/server/` - Server-side code

**Build features:**

- TypeScript compilation
- Tailwind CSS optimization
- Vue component compilation
- Code splitting and tree shaking
- Asset optimization

**Preview server:**

```bash
pnpm preview
# Opens http://localhost:3000
```

**Deployment:**

The `.output/` directory can be deployed to:
- Vercel
- Netlify
- Cloudflare Pages
- Node.js server
- Static hosting (with `pnpm generate`)

**Static generation:**

```bash
pnpm generate
# Creates static site in .output/public/
```

**Common issues:**

- Type errors: Run `pnpm typecheck` to see all errors
- Build errors: Check console output for specific errors
- Missing dependencies: Run `pnpm install`

## 🔗 Follow-up Commands

- `/dev` - Start development server
- `/commit` - Commit changes
- `/cultivate` - Update documentation

## Related

- [@README.md](../../README.md) - Project overview
- [@.claude/INDEX.md](../INDEX.md) - Command directory
