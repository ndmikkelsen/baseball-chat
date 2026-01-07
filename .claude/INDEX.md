# Baseball Chat Knowledge Base Index

> Your comprehensive guide to building Baseball Chat together ⚾

**Last Updated**: 2026-01-07

## 🎯 Start Here

- **[agents.md](../agents.md)** - Quick reference for working with this project
- **[CLAUDE.md](../CLAUDE.md)** - Comprehensive technical documentation for AI agents
- **[CONSTITUTION.md](../CONSTITUTION.md)** - Our guiding principles and non-negotiables
- **[PLAN.md](../PLAN.md)** - Current status and next steps (working memory)
- **[VISION.md](../VISION.md)** - Where we're going (the dream)
- **[GARDENING.md](../GARDENING.md)** - Knowledge garden philosophy and cultivation
- **[CONVENTIONS.md](../CONVENTIONS.md)** - Coding conventions and standards

## 📊 Garden Statistics

- **Total Files**: 21+ markdown files
- **Active**: 21+ files
- **Categories**: 6 (commands, templates, architecture, patterns, quick-references, troubleshooting)
- **Last Cultivation**: 2026-01-07

## 📁 Knowledge Base Structure

### Commands (`commands/`)

Reusable workflows for common development tasks.

- **[README](commands/README.md)**
  - Overview of the command system and how to use it

**Development Workflows:**

- **[dev](commands/dev.md)**
  - Start development server and open in browser
- **[build](commands/build.md)**
  - Build application for production deployment
- **[commit](commands/commit.md)**
  - Stage files and create conventional commit

**Knowledge Garden Workflows:**

- **[learn](commands/learn.md)**
  - Extract lessons from conversation and git history
- **[remember](commands/remember.md)**
  - Capture patterns and decisions in the knowledge garden
- **[cultivate](commands/cultivate.md)**
  - Maintain and organize the knowledge garden
- **[plan](commands/plan.md)**
  - Update PLAN.md with current status and next steps

### Templates (`templates/`)

Reusable templates for documentation and communication.

- **[Decision Record](templates/decision-record.md)**
  - Template for documenting architectural decisions (ADRs)
- **[PR Template](templates/pr-template.md)**
  - Template for pull request descriptions
- **[Issue Template](templates/issue-template.md)**
  - Template for GitHub issues

### Architecture (`architecture/`)

System design and technology decisions.

- **[Frontend-Only Nuxt Structure](architecture/frontend-only-nuxt.md)**
  - How we simplified from monorepo to single Nuxt app
  - Directory structure and data flow
  - When to use this architecture vs monorepo

### Patterns (`patterns/`)

Reusable solutions to common problems.

- **[Nuxt Shared Types](patterns/nuxt-shared-types.md)**
  - Centralized types directory for type-safe server/client communication
  - Organizing types by concern (domain, schemas, API)
  - Import patterns and path alias usage
  - Real examples from baseball-chat project
- **[Type Sharing in Nuxt](patterns/type-sharing-nuxt.md)**
  - How to share TypeScript types between server and client
  - Single source of truth for types
  - Common patterns and anti-patterns

### Quick References (`quick-references/`)

Fast lookups and how-to guides.

- **[Nuxt Path Aliases](quick-references/nuxt-path-aliases.md)**
  - Understanding `~` vs `~~` vs `@` vs `@@`
  - When to use each alias
  - Common errors and solutions
  - Decision tree and cheat sheet
- **[Nuxt Dynamic Routes](quick-references/nuxt-dynamic-routes.md)**
  - How `[id]` syntax works in file-based routing
  - Navigation patterns and examples
  - Type-safe route parameters

### Troubleshooting (`troubleshooting/`)

Common issues and solutions.

- **[Prisma Client Not Found](troubleshooting/prisma-client-not-found.md)**
  - Misleading "Named export 'PrismaClient' not found" error
  - Real cause: Client not generated, not import syntax
  - Prevention strategies and singleton pattern
- **[UI Library Errors](troubleshooting/ui-library-errors.md)**
  - When to replace complex UI libraries with simple HTML
  - TanStack Table error resolution
  - Decision framework for library vs custom code

## 🌱 Future Growth Areas

As we continue building, we may add:

### Architecture
- Data flow diagrams
- API design patterns
- Database schema design rationale

### Patterns
- Vue component patterns
- Composable patterns
- Error handling patterns
- LLM caching strategies

### Standards (`standards/`)
- Coding standards (Nuxt/Vue/TypeScript)
- Testing standards
- Git workflow
- Environment & secrets management

### Quick References
- API endpoints reference
- Environment variables guide
- Deployment guide
- Common commands cheatsheet

## 🔄 Maintenance

The knowledge garden is a living document. It should be:

- **Updated** after significant work or decisions
- **Pruned** to remove outdated information
- **Organized** to keep related information together
- **Accessible** with clear navigation and cross-references

Use the `/cultivate` command to maintain the garden regularly.

## 📖 How to Use This Index

1. **Starting a new task?** Check the relevant section for patterns and standards
2. **Made a decision?** Document it using the decision record template
3. **Learned something?** Use `/remember` to capture it in the garden
4. **Finished a task?** Use `/learn` to extract lessons
5. **Weekly maintenance?** Use `/cultivate` to keep the garden healthy

## 🤝 Contributing to the Garden

When adding new knowledge:

1. Choose the appropriate category (or create a new one)
2. Use clear, descriptive filenames
3. Include cross-references to related documents
4. Update this index
5. Follow the markdown formatting conventions

See [GARDENING.md](../GARDENING.md) for detailed guidance on knowledge management.
