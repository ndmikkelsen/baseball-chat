---
description: Start development server and open in browser
---

# 🎯 ACTION: Start Development Environment

Install dependencies, start the Nuxt development server, and open the site in your browser.

See @CONSTITUTION.md for project conventions.

## 📋 STEPS

1. **Check dependencies** - Verify node_modules exists
2. **Install if needed** - Run `pnpm install` if dependencies are missing or package.json changed
3. **Kill existing processes** - Check for processes on port 3000 and kill if needed
4. **Start dev server** - Run `pnpm dev` to start Nuxt development server
5. **Wait for ready** - Monitor output for server to be ready
   - "Local: http://localhost:3000"
6. **Open browser** - Launch default browser to http://localhost:3000
7. **Confirm success** - Verify server is running and site loads correctly

## 💡 CONTEXT

**Development server features:**

- Hot module replacement (HMR)
- TypeScript type checking
- Auto-imports (components, composables, utils)
- Tailwind JIT compilation
- Vue DevTools integration

**Port:**

- 3000: Nuxt web application

**Browser opening:**

```bash
# macOS
open http://localhost:3000

# Linux
xdg-open http://localhost:3000

# Windows
start http://localhost:3000
```

**Common issues:**

- Port already in use: Kill process with `lsof -ti:3000 | xargs kill -9`
- Dependencies out of sync: Delete node_modules and run `pnpm install`
- Type errors: Run `pnpm typecheck` to see all TypeScript errors

**Performance tips:**

- Use `pnpm dev --host` to expose server on network
- Use `pnpm dev --port 3001` to use different port

## 🔗 Follow-up Commands

- `/build` - Build for production
- `/commit` - Commit changes
- `/cultivate` - Update documentation

## Related

- [@README.md](../../README.md) - Project overview
- [@.claude/INDEX.md](../INDEX.md) - Command directory
