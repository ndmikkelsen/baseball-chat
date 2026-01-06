---
description: Capture patterns and lessons in the knowledge garden
---

# ACTION: Capture Insights and Patterns

Record patterns, lessons, and insights from the current conversation into the knowledge garden.

**Last Updated**: 2026-01-05

See @GARDENING.md for knowledge garden structure.

## STEPS

1. **Identify patterns** - Review conversation for recurring solutions or approaches
2. **Extract insights** - Capture key learnings or realizations
3. **Determine category** - Decide: pattern, architecture, quick-reference, or troubleshooting
4. **Draft content** - Create clear, actionable documentation with examples
5. **Add cross-links** - Link to related content in the garden
6. **Present for approval** - Show what will be added and where
7. **Add to garden** - Create or update files in appropriate directory
8. **Confirm addition** - Show what was added

## CONTEXT

**Categories:**

- `.claude/patterns/` - Reusable solutions and approaches
- `.claude/architecture/` - Design decisions and system docs
- `.claude/quick-references/` - How-to guides and commands
- `.claude/standards/` - Coding standards and conventions

**Content structure:**

- Clear title and description
- Concrete examples from actual work
- When to use / when not to use
- Cross-links to related content
- Keep files under 400 lines

**What to capture:**

- Solutions that worked well
- Decisions and their rationale
- Patterns that emerged
- Lessons learned
- Troubleshooting steps

**Baseball-chat patterns to capture:**

- Nuxt 4 + Vue.js component patterns
- Fastify route handler patterns
- Prisma query patterns
- OpenAI API integration patterns
- LLM response caching strategies
- Monorepo workspace patterns
- Docker development workflows
- Type-safe API communication
- Database migration strategies
- Error handling patterns

**Monorepo-specific patterns:**

- Shared type usage across workspaces
- Workspace dependency management
- Build orchestration
- Development server coordination
- Environment variable management

**API patterns:**

- RESTful endpoint design
- Request validation with Zod
- Error handling and responses
- Database transaction patterns
- External API integration (baseball API, OpenAI)

## Follow-up Commands

- `/commit` - Commit the new knowledge
- `/cultivate` - Organize and maintain the garden

## Related

- [@GARDENING.md](../../GARDENING.md) - Gardening philosophy
- [@.claude/INDEX.md](../INDEX.md) - Garden index
- [@.claude/commands/cultivate.md](./cultivate.md) - Garden maintenance
