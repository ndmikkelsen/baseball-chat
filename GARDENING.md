# Gardening Guide

> How we cultivate and maintain our knowledge garden

**Last Updated**: 2026-01-05

---

## What is the Knowledge Garden?

The `.claude/` directory is our **knowledge garden** - a living collection of patterns, architecture decisions, troubleshooting guides, and quick references that grow as we build.

Unlike traditional documentation that becomes stale, our garden:
- **Grows organically** as we discover patterns
- **Stays relevant** through continuous cultivation
- **Captures context** that code comments can't
- **Guides decisions** for future work

---

## Garden Structure

```
.claude/
├── INDEX.md                    # Garden map (start here)
├── architecture/               # System design decisions
│   ├── data-flow.md
│   ├── api-design.md
│   └── database-schema.md
├── patterns/                   # Reusable solutions
│   ├── llm-caching.md
│   ├── edit-tracking.md
│   └── error-handling.md
├── quick-references/           # Fast lookups
│   ├── baseball-api.md
│   ├── api-endpoints.md
│   └── environment-vars.md
└── troubleshooting/            # Problem solutions
    ├── database-connection.md
    ├── docker-issues.md
    └── type-errors.md
```

---

## When to Add to the Garden

### Architecture Decisions
**Add when:** You make a significant design choice

**Example:**
- Why we chose Fastify over Express
- How we structure the monorepo
- Database schema design rationale

**Location:** `.claude/architecture/`

### Patterns
**Add when:** You solve a problem that might recur

**Example:**
- How we cache LLM responses
- How we track manual edits
- How we handle API errors

**Location:** `.claude/patterns/`

### Quick References
**Add when:** You need to look something up repeatedly

**Example:**
- API endpoint specifications
- Environment variable list
- Common commands

**Location:** `.claude/quick-references/`

### Troubleshooting
**Add when:** You solve a non-obvious problem

**Example:**
- Database connection issues
- Docker networking problems
- TypeScript type errors

**Location:** `.claude/troubleshooting/`

---

## How to Write Garden Documents

### Structure

Every garden document should have:

1. **Title** - Clear, descriptive
2. **Context** - Why this matters
3. **Content** - The actual knowledge
4. **Examples** - Show, don't just tell
5. **Related** - Links to connected documents

### Example Template

```markdown
# Pattern Name

**Context:** Brief explanation of when/why this pattern is used

**Last Updated:** YYYY-MM-DD

---

## The Problem

Describe the problem this pattern solves.

## The Solution

Explain the solution clearly.

## Implementation

Show code examples or step-by-step instructions.

## Trade-offs

What are the pros and cons?

## Related

- [Other Pattern](./other-pattern.md)
- [Architecture Doc](../architecture/related.md)
```

### Writing Style

- **Be concise** - Get to the point quickly
- **Use examples** - Code snippets, diagrams, real scenarios
- **Stay current** - Update when things change
- **Link liberally** - Connect related concepts
- **Explain why** - Not just what, but why

---

## Maintenance

### Regular Cultivation

**Weekly:**
- Review recent changes
- Add new patterns discovered
- Update outdated information

**Monthly:**
- Check for dead links
- Consolidate similar documents
- Archive obsolete content

**Quarterly:**
- Review entire garden structure
- Reorganize if needed
- Update INDEX.md

### Signs of Garden Health

**Healthy:**
- Documents are under 400 lines
- Links work and are relevant
- Examples are current
- Information is easy to find

**Needs Attention:**
- Documents over 400 lines (split them)
- Broken or circular links
- Outdated examples
- Duplicate information

---

## Garden Principles

### 1. Shallow Over Deep
Keep directory structure flat. Two levels max:
- `.claude/patterns/` ✅
- `.claude/patterns/frontend/components/` ❌

### 2. Split Over Sprawl
If a document exceeds 400 lines, split it:
- `api-design.md` → `api-design-rest.md` + `api-design-graphql.md`

### 3. Link Over Duplicate
Don't copy information. Link to the source:
- "See [API Design](../architecture/api-design.md)" ✅
- Copy-pasting the same content ❌

### 4. Show Over Tell
Examples beat explanations:
```typescript
// Good: Show the pattern
const result = await cache.getOrSet(key, () => fetchData())
```

### 5. Context Over Code
Explain the "why" not just the "what":
- "We cache LLM responses because they're expensive and slow" ✅
- "This function caches responses" ❌

---

## INDEX.md

The `INDEX.md` is the **map of the garden**. It should:

1. **List all documents** with brief descriptions
2. **Group by category** (architecture, patterns, etc.)
3. **Highlight key documents** for newcomers
4. **Stay updated** as the garden grows

Update INDEX.md whenever you add or remove documents.

---

## Integration with Other Documents

### The Hierarchy

```
CONSTITUTION.md     → Core values (what we believe)
    |
VISION.md          → Goals (where we're going)
    |
.claude/           → Knowledge (what we know)
    |
PLAN.md            → Tasks (what we're doing)
```

### When to Use Each

- **CONSTITUTION.md** - Principles and values (rarely changes)
- **VISION.md** - Long-term goals (evolves slowly)
- **CLAUDE.md** - Technical overview (updates with major changes)
- **.claude/** - Detailed knowledge (grows continuously)
- **PLAN.md** - Current work (updates frequently)

---

## Examples from the Garden

### Good Document: Pattern

```markdown
# LLM Response Caching

**Context:** LLM API calls are expensive ($) and slow (seconds). We cache responses to improve performance and reduce costs.

**Last Updated:** 2026-01-05

---

## The Problem

Generating player descriptions via OpenAI:
- Costs $0.002 per request
- Takes 2-3 seconds
- Same stats = same description

## The Solution

Cache descriptions based on a hash of player stats:

```typescript
const statsHash = hashStats(player.stats)
const cached = await db.playerDescription.findUnique({
  where: { playerId, statsHash }
})

if (cached) return cached
const description = await generateDescription(player)
await db.playerDescription.create({ playerId, statsHash, description })
```

## Trade-offs

**Pros:**
- Fast subsequent requests
- Reduced API costs
- Consistent descriptions

**Cons:**
- Storage overhead
- Cache invalidation complexity
- Stale descriptions if stats change

## Related

- [Edit Tracking](./edit-tracking.md)
- [Database Schema](../architecture/database-schema.md)
```

### Bad Document: Too Vague

```markdown
# Caching

We use caching to make things faster.

## How

Cache stuff in the database.
```

---

## Tools for Gardening

### Finding Documents

```bash
# Search for a topic
rg "pattern name" .claude/

# List all documents
fd -e md . .claude/

# Check document length
wc -l .claude/patterns/*.md
```

### Checking Links

```bash
# Find broken links (manual check)
rg '\[.*\]\(.*\.md\)' .claude/
```

### Updating INDEX.md

After adding documents, regenerate the index:

```bash
# List all documents with descriptions
fd -e md . .claude/ -x head -n 3 {}
```

---

## Remember

The garden is **alive**. It grows, changes, and evolves with the project.

- **Don't be precious** - Update freely
- **Don't be lazy** - Keep it current
- **Don't be verbose** - Stay concise
- **Don't be cryptic** - Explain clearly

**The best garden is the one that's used.**

---

## Related Documents

- [CONSTITUTION.md](./CONSTITUTION.md) - Our values
- [VISION.md](./VISION.md) - Our goals
- [PLAN.md](./PLAN.md) - Our work
- [CLAUDE.md](./CLAUDE.md) - Technical overview
- [.claude/INDEX.md](.claude/INDEX.md) - Garden map
