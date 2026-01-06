# Commands

Commands are reusable workflows that AI agents can execute to perform common tasks. They provide consistent, documented procedures for development operations.

## Available Commands

### Development Workflows

- **[dev](./dev.md)** - Start development servers (API + Web) and open in browser
- **[build](./build.md)** - Build application for production
- **[commit](./commit.md)** - Stage changes and create conventional commit

### Knowledge Garden Workflows

- **[learn](./learn.md)** - Extract lessons from conversation and git history
- **[remember](./remember.md)** - Capture patterns and insights in the garden
- **[cultivate](./cultivate.md)** - Maintain and organize the knowledge garden
- **[plan](./plan.md)** - Review and update project plan (working memory)

## Using Commands

Commands can be invoked by referencing them in conversation:

```
"Run the dev command"
"Execute /dev"
"Follow the build command"
"Run /learn to extract lessons"
"Execute /remember to capture this pattern"
"Run /cultivate to organize the garden"
"Update the plan with /plan"
```

## Command Workflow

Typical session flow:

1. **Start**: `/dev` - Begin development
2. **Work**: Build features, solve problems
3. **Capture**: `/remember` - Document patterns as you discover them
4. **Commit**: `/commit` - Save your work
5. **Reflect**: `/learn` - Extract lessons from the session
6. **Plan**: `/plan` - Update roadmap with progress
7. **Maintain**: `/cultivate` - Keep the garden healthy

## Command Structure

Each command follows this format:

```markdown
---
description: Brief description of what the command does
---

# 🎯 ACTION: Command Title

Brief overview of the command's purpose.

## 📋 STEPS

1. Step one
2. Step two
   ...

## 💡 CONTEXT

Additional context, tips, and information.

## 🔗 Follow-up Commands

Related commands to run next.

## Related

Links to related documentation.
```

## Creating New Commands

When creating a new command:

1. Use the template structure above
2. Be specific and actionable in steps
3. Include context for why/when to use it
4. Link to related documentation
5. Add it to this README
6. Update the INDEX.md

## Philosophy

Commands embody the **constitution framework** - they're not just scripts, they're documented workflows that capture institutional knowledge and best practices.
