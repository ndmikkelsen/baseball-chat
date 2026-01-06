---
description: Cultivate the knowledge garden through maintenance and organization
---

# ACTION: Maintain and Organize Knowledge Garden

Organize, link, verify, and maintain the knowledge garden to keep it healthy and useful.

See @CONSTITUTION.md for project conventions and @GARDENING.md for cultivation guidelines.

## STEPS

1. **Survey the garden** - Review all files in .claude/ directories for organization and health
2. **Check file sizes** - Identify files over 400 lines that need splitting
3. **Verify patterns** - Ensure documented patterns match actual code in the project
4. **Create cross-links** - Add links between related topics to build knowledge graph
5. **Distill content** - Summarize verbose sections, remove redundancy
6. **Weed outdated info** - Remove or update information that no longer applies
7. **Organize structure** - Ensure files are in correct directories with clear names
8. **Update index** - Refresh INDEX.md with new or changed files
9. **Present findings** - Show what needs attention and suggest improvements
10. **Apply improvements** - Make approved changes to garden files

## CONTEXT

**Garden health indicators:**

- Files under 400 lines
- Clear cross-links between related topics
- Patterns verified against actual code
- No redundant or outdated information
- Logical organization and naming
- Easy to navigate and search

**Cultivation tasks:**

- Split large files into focused topics
- Add "Related" sections with links
- Remove obsolete patterns
- Consolidate duplicate information
- Improve file naming and structure
- Update examples to match current code

**File organization:**

- `.claude/patterns/` - Code patterns and solutions
- `.claude/standards/` - Best practices and conventions
- `.claude/architecture/` - Design decisions and system docs
- `.claude/quick-references/` - How-tos and troubleshooting
- `.claude/commands/` - Reusable workflows
- `.claude/templates/` - Document templates

**Cultivation frequency:**

- Weekly: Quick health check
- Monthly: Deep cultivation
- After major changes: Verify patterns still apply

**What to cultivate:**

- Architecture docs when structure changes
- Patterns when new solutions emerge
- Quick references when common questions arise
- Commands when workflows evolve

**Baseball-chat specific areas:**

- Monorepo patterns and workspace management
- Nuxt 4 + Vue.js component patterns
- Fastify + Prisma backend patterns
- OpenAI integration and caching
- Docker development workflow
- Database migration strategies
- Type-safe API patterns

## Follow-up Commands

- `/commit` - Commit garden improvements
- `/learn` - Extract new lessons to add
- `/remember` - Capture new patterns

## Related

- [@GARDENING.md](../../GARDENING.md) - Gardening philosophy
- [@.claude/INDEX.md](../INDEX.md) - Garden index
- [@.claude/commands/commit.md](./commit.md) - Commit changes
- [@CONSTITUTION.md](../../CONSTITUTION.md) - Project values
