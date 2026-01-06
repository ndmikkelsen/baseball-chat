---
description: Extract lessons from conversation and git history
---

# ACTION: Extract Lessons Learned

Analyze conversation and git history to extract lessons worth capturing.

**Last Updated**: 2026-01-05

See @GARDENING.md for knowledge garden structure.

## STEPS

1. **Review conversation** - Identify problems solved, patterns discovered
2. **Check git history** - Look at recent commits for context
3. **Identify lessons** - What worked? What didn't? What would we do differently?
4. **Categorize findings** - Pattern, architecture, troubleshooting, or quick-reference?
5. **Draft documentation** - Create clear, actionable content
6. **Present findings** - Show lessons found and where they should go
7. **Add to garden** - Create or update appropriate files
8. **Update PLAN.md** - Record completed work if applicable

## CONTEXT

**Types of lessons:**

- Solutions that worked (patterns)
- Mistakes to avoid (troubleshooting)
- Decisions made (architecture)
- Commands discovered (quick-references)

**Git history analysis:**

```bash
git log --oneline -10        # Recent commits
git diff HEAD~5..HEAD --stat # Files changed
git log --format="%s" -10    # Commit messages
```

**Questions to ask:**

- What problem did we solve?
- How did we solve it?
- What would we do differently?
- What should future sessions know?

**Lesson format:**

- Clear title
- Problem context
- Solution or approach
- Why it works
- Related topics

**Baseball-chat specific lessons:**

- Nuxt 4 + Vue.js patterns that work well
- Fastify + Prisma integration patterns
- OpenAI API usage and caching strategies
- Monorepo workspace management
- Docker development workflow
- Database migration patterns
- Type-safe API patterns with shared types

**Monorepo lessons:**

- Workspace dependency management
- Shared type patterns
- Build order considerations
- Development workflow optimizations

## Follow-up Commands

- `/remember` - Capture specific insights
- `/commit` - Commit new documentation
- `/cultivate` - Organize the garden

## Related

- [@GARDENING.md](../../GARDENING.md) - Gardening philosophy
- [@.claude/commands/remember.md](./remember.md) - Capture insights
- [@PLAN.md](../../PLAN.md) - Working memory
