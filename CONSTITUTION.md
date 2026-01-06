# Baseball Chat Constitution

> Our guiding principles and non-negotiables for building together

**This document defines WHO WE ARE.** For where we're going, see [VISION.md](./VISION.md).

## Core Values

### 1. Reliability Over Features
- The application must work consistently with minimal intervention
- Build robust error handling before adding new capabilities
- A stable baseball stats viewer is better than a feature-rich broken one
- Every change should improve or maintain reliability

### 2. Clarity Over Cleverness
- Write code that's easy to understand, not code that shows off
- Prefer explicit over implicit
- Name things clearly - no abbreviations unless universally understood
- Document the "why" not just the "what"

### 3. Modularity & Separation of Concerns
- Each service has a clear, single responsibility
- Shared utilities go in common modules, not duplicated
- Frontend components stay in `apps/web/`, API logic in `apps/api/`
- If it's used in multiple places, it belongs in `packages/shared/`

### 4. Test Before Deploy
- Always test changes locally before deploying
- Verify API functionality works with actual responses
- Check database migrations before and after changes
- Never push to production without manual verification

### 5. Documentation Evolves With Code
- Update docs when you change architecture
- Keep VISION.md aligned with product evolution
- Keep PLAN.md current as our working memory
- Maintain .claude/ knowledge base as we learn
- CLAUDE.md is the deep reference

### 6. Conventional Commits = Clear History
- Use `feat:`, `fix:`, `docs:`, `refactor:`, etc.
- Enables clear understanding of changes
- Makes git history readable and meaningful
- See `.claude/patterns/git-conventions.md` for guidance

## Non-Negotiables

### Code Quality
- Format TypeScript code with consistent style
- Check types before committing (`pnpm typecheck`)
- Run linters before deployment (`pnpm lint`)
- Use Prettier for consistent formatting

### Architecture
- No circular dependencies between modules
- Config uses environment variables (`.env` files)
- One module per concern (api, web, shared)
- Keep UI responsive - don't block on API calls
- Use pnpm workspaces for monorepo management

### Git Workflow
- Feature branches for all work (`feat/`, `fix/`, `docs/`, `style/`)
- Conventional commits for all commits
- Never force push to main
- Always quote filenames in git commands
- Create PRs for significant changes

### Deployment
- Always use Docker for production deployment
- Exclude `node_modules`, `.nuxt`, `dist` from version control
- Run database migrations before starting services
- Verify services are accessible after deployment

### Documentation
- Keep PLAN.md concise (high-level only)
- Keep .claude/ files under 400 lines (split if needed)
- Update CLAUDE.md when architecture changes
- Stay shallow in .claude/ (no deeply nested directories)

## Strong Preferences

### Code Style
- Prefer explicit types over implicit (use TypeScript strictly)
- Prefer composition over inheritance
- Prefer small functions over large ones (max ~50 lines)
- Prefer early returns over nested conditionals

### Naming Conventions
- **Classes**: PascalCase (`PlayerRepository`, `LlmService`)
- **Functions/methods**: camelCase (`fetchPlayers`, `generateDescription`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `DEFAULT_TIMEOUT`)
- **Private attributes**: Leading underscore (`_internalState`)
- **Files**: kebab-case (`player-repository.ts`, `llm-service.ts`)

### Error Handling
- Log errors with context (include service names, error codes)
- Graceful degradation when services are unavailable
- Show user-friendly messages in UI
- Fail fast on configuration errors

### Performance
- Use async where it matters (API calls, database queries)
- Avoid blocking the UI
- Cache API responses when appropriate
- Use reasonable refresh intervals (not too aggressive)

## Collaboration Principles

### Human + Agent Partnership
- **We're a team**: Not human vs AI, but human + AI
- **Ask when uncertain**: Better to clarify than assume
- **Suggest improvements**: If you see a better way, speak up
- **Learn together**: Update .claude/ as we discover patterns
- **Celebrate wins**: Every successful feature is a shared victory

### Communication Style
- **Be clear and concise**: No fluff, get to the point
- **Use examples**: Show, don't just tell
- **Provide context**: Explain the "why" behind decisions
- **Stay positive**: We're building something amazing together

### Decision Making
- **Default to action**: When in doubt, try it and iterate
- **Bias toward simplicity**: Simple solutions beat complex ones
- **Measure what matters**: Reliability, performance, user experience
- **Iterate quickly**: Small changes, fast feedback, continuous improvement

## Living Document

This constitution evolves as we work together. When you notice:
- **New strong preferences** emerging → Add them here
- **Patterns becoming established** → Document in `.claude/patterns/`
- **Better ways of working** → Update this document
- **Outdated rules** → Remove or revise them

**Last Updated**: 2026-01-05

---

## The Hierarchy

```
CONSTITUTION (who we are)
    |
VISION (where we're going)
    |
.claude/ (what we know)
    |
PLAN (what we're doing)
```

**This document anchors everything.** Our vision grows from our values. Our knowledge reflects our principles. Our plans execute our vision.

---

> "We're not just displaying stats - we're building an intelligent baseball analytics platform together."
