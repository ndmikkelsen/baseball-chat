# Commit Discipline

> Keep commits focused, reviewable, and meaningful

**Last Updated**: 2026-01-07

## Overview

Good commit discipline makes code review easier, debugging faster, and git history more useful. The core principle: **one logical change per commit**.

## The Golden Rule

**Each commit should represent a single, complete, logical change.**

If you can't describe your commit in one sentence without using "and", it's probably too big.

## What is a "Logical Change"?

A logical change is a set of related modifications that:
- Solve one specific problem
- Add one specific feature
- Fix one specific bug
- Refactor one specific area

### ✅ Good Examples

```bash
# Single feature
feat(pages): add sortable column headers to player table

# Single bug fix
fix(components): prevent crash when player.avg is null

# Single refactor
refactor(pages): simplify sorting logic using localeCompare

# Single documentation
docs(patterns): add sortable table columns pattern
```

### ❌ Bad Examples

```bash
# Multiple unrelated changes
feat(pages): add sorting and fix null bug and update docs

# Too vague
chore: various updates

# Mixed concerns
feat(pages): add sorting feature
- Add sortable columns
- Fix unrelated API bug
- Update git workflow docs  ← Unrelated!
```

## Common Violations

### Violation 1: Mixing Feature Work with Documentation

**Problem:**
```bash
git add app/pages/index.vue
git add app/components/SortIndicator.vue
git add types/player.ts
git add .claude/patterns/sortable-table-columns.md
git add .claude/quick-references/git-branch-sync.md  # ← Unrelated!
git commit -m "feat(pages): add sortable columns"
```

**Why it's wrong:**
- `git-branch-sync.md` has nothing to do with sortable columns
- If we need to revert the sorting feature, we'd also revert the git docs
- Code review is harder (reviewer has to context-switch)

**Solution:**
```bash
# Commit 1: Feature work
git add app/pages/index.vue
git add app/components/SortIndicator.vue
git add types/player.ts
git add .claude/patterns/sortable-table-columns.md
git commit -m "feat(pages): add sortable column headers to player table"

# Commit 2: Separate documentation
git add .claude/quick-references/git-branch-sync.md
git commit -m "docs(quick-ref): add git branch sync workflow guide"
```

**Real example from baseball-chat:**

During code review (before committing), we caught this violation:

```bash
# ❌ Initial staging included unrelated git docs
5 files staged:
  - app/pages/index.vue (sorting feature)
  - app/components/SortIndicator.vue (sorting feature)
  - types/player.ts (sorting feature)
  - .claude/patterns/sortable-table-columns.md (sorting docs)
  - .claude/quick-references/git-branch-sync.md (unrelated!)

# ✅ After review: Removed unrelated file before committing
4 files committed:
  - app/pages/index.vue (sorting feature)
  - app/components/SortIndicator.vue (sorting feature)
  - types/player.ts (sorting feature)
  - .claude/patterns/sortable-table-columns.md (sorting docs)
```

**Note**: This violation was caught during code review *before* the commit was made, which is why you won't see git-branch-sync.md in the git history. This is the ideal outcome - catching issues before they're committed.

### Violation 2: Mixing Bug Fixes with Features

**Problem:**
```bash
git add app/pages/index.vue  # Contains both sorting feature AND null fix
git commit -m "feat(pages): add sorting and fix null bug"
```

**Why it's wrong:**
- Two separate concerns (feature + bug fix)
- If sorting has issues, we can't revert without losing the bug fix
- Git history is unclear about what changed when

**Solution:**
```bash
# Commit 1: Bug fix first
git add app/pages/index.vue  # Only the null safety changes
git commit -m "fix(pages): prevent crash when player.avg is null"

# Commit 2: Feature second
git add app/pages/index.vue  # Only the sorting changes
git commit -m "feat(pages): add sortable column headers"
```

### Violation 3: Mixing Refactoring with Features

**Problem:**
```bash
# One commit with both new feature and refactoring
git commit -m "feat(pages): add sorting and simplify existing code"
```

**Why it's wrong:**
- Hard to review (which changes are feature vs cleanup?)
- If feature has issues, we lose the refactoring too
- Unclear what the actual feature is

**Solution:**
```bash
# Commit 1: Refactor existing code
git commit -m "refactor(pages): simplify player table rendering"

# Commit 2: Add new feature on clean base
git commit -m "feat(pages): add sortable column headers"
```

### Violation 4: Mixing Multiple Features

**Problem:**
```bash
git commit -m "feat(pages): add sorting, filtering, and pagination"
```

**Why it's wrong:**
- Three separate features in one commit
- Can't enable/disable features independently
- Massive code review burden

**Solution:**
```bash
# Commit 1: Sorting
git commit -m "feat(pages): add sortable column headers"

# Commit 2: Filtering
git commit -m "feat(pages): add player name filter"

# Commit 3: Pagination
git commit -m "feat(pages): add pagination controls"
```

## How to Identify Unrelated Changes

### Method 1: The "And" Test

If your commit message contains "and", it might be too big:

```bash
# ❌ Multiple concerns
"feat(pages): add sorting and update docs and fix bug"

# ✅ Single concern
"feat(pages): add sortable column headers"
```

### Method 2: The Revert Test

Ask: "If I had to revert this commit, would I lose anything I want to keep?"

```bash
# ❌ Would lose unrelated git docs
feat(pages): add sorting
- Add sortable columns
- Add git-branch-sync.md

# ✅ Only loses sorting feature
feat(pages): add sortable column headers
- Add sortable columns
- Add sorting pattern docs
```

### Method 3: The Review Test

Ask: "Does a reviewer need to understand multiple different concepts to review this?"

```bash
# ❌ Reviewer needs to understand sorting AND git workflows
feat(pages): add sorting and git docs

# ✅ Reviewer only needs to understand sorting
feat(pages): add sortable column headers
```

### Method 4: The File Grouping Test

Look at the files changed. Do they all relate to the same concern?

```bash
# ❌ Mixed concerns
app/pages/index.vue              # Sorting feature
app/components/SortIndicator.vue # Sorting feature
.claude/quick-references/git-branch-sync.md  # Git workflow (unrelated!)

# ✅ Single concern
app/pages/index.vue              # Sorting feature
app/components/SortIndicator.vue # Sorting feature
.claude/patterns/sortable-table-columns.md  # Sorting docs (related!)
```

## When to Include Documentation

### ✅ Include Documentation When:

1. **Pattern documentation for the feature you're adding**
   ```bash
   feat(pages): add sortable column headers
   - Add sorting implementation
   - Add sortable-table-columns pattern doc  ✅ Related!
   ```

2. **API documentation for the API you're creating**
   ```bash
   feat(api): add player search endpoint
   - Add /api/players/search route
   - Update API reference docs  ✅ Related!
   ```

3. **Inline code comments explaining the feature**
   ```bash
   feat(pages): add complex sorting algorithm
   - Add sorting implementation with comments  ✅ Related!
   ```

### ❌ Don't Include Documentation When:

1. **General workflow documentation**
   ```bash
   feat(pages): add sorting
   - Add sorting feature
   - Add git workflow guide  ❌ Unrelated!
   ```

2. **Documentation for other features**
   ```bash
   feat(pages): add sorting
   - Add sorting feature
   - Update pagination docs  ❌ Different feature!
   ```

3. **Cleanup of old documentation**
   ```bash
   feat(pages): add sorting
   - Add sorting feature
   - Fix typos in README  ❌ Separate concern!
   ```

## Commit Workflow

### Step 1: Review Your Changes

```bash
# See what you've changed
git status
git diff
```

### Step 2: Group Related Changes

Mentally group files by logical change:

```
Group 1 (Sorting feature):
  - app/pages/index.vue
  - app/components/SortIndicator.vue
  - types/player.ts
  - .claude/patterns/sortable-table-columns.md

Group 2 (Git workflow docs):
  - .claude/quick-references/git-branch-sync.md
```

### Step 3: Stage and Commit Each Group

```bash
# Commit group 1
git add app/pages/index.vue
git add app/components/SortIndicator.vue
git add types/player.ts
git add .claude/patterns/sortable-table-columns.md
git commit -m "feat(pages): add sortable column headers to player table"

# Commit group 2
git add .claude/quick-references/git-branch-sync.md
git commit -m "docs(quick-ref): add git branch sync workflow guide"
```

### Step 4: Verify

```bash
# Check your commits
git log --oneline -5

# Check each commit's changes
git show HEAD
git show HEAD~1
```

## Benefits of Good Commit Discipline

### 1. Easier Code Review

**Bad:**
```
feat(pages): add sorting and fix bugs and update docs
Files changed: 15
Lines changed: +500, -200
```
Reviewer thinks: "This is huge, where do I even start?"

**Good:**
```
feat(pages): add sortable column headers
Files changed: 4
Lines changed: +150, -20
```
Reviewer thinks: "Clear scope, I can review this in 10 minutes."

### 2. Better Git History

**Bad:**
```bash
git log --oneline
a1b2c3d feat: various updates
d4e5f6g chore: stuff
g7h8i9j fix: things
```

**Good:**
```bash
git log --oneline
a1b2c3d feat(pages): add sortable column headers
d4e5f6g fix(pages): prevent crash when avg is null
g7h8i9j docs(patterns): add sortable table pattern
```

### 3. Safer Reverts

**Bad:**
```bash
# Reverting this loses both sorting AND unrelated docs
git revert a1b2c3d
```

**Good:**
```bash
# Reverting only loses sorting, keeps other work
git revert a1b2c3d
```

### 4. Easier Debugging

**Bad:**
```bash
git bisect  # "Which commit broke it?"
# Hard to tell because commits are huge and mixed
```

**Good:**
```bash
git bisect  # "Which commit broke it?"
# Easy to identify because each commit is focused
```

### 5. Better Collaboration

**Bad:**
```
PR #123: Add sorting and fix bugs and update docs
- 15 files changed
- Multiple concerns
- Hard to discuss specific changes
```

**Good:**
```
PR #123: Add sortable column headers
- 4 files changed
- Single concern
- Easy to discuss and approve
```

## Quick Reference

| Scenario | Action |
|----------|--------|
| Feature + unrelated docs | Split into 2 commits |
| Feature + feature docs | Keep in 1 commit |
| Feature + bug fix | Split into 2 commits |
| Bug fix + test | Keep in 1 commit |
| Refactor + feature | Split into 2 commits |
| Multiple features | Split into N commits |
| Typo fixes across files | Keep in 1 commit if all typos |

## Checklist Before Committing

- [ ] Can I describe this commit in one sentence without "and"?
- [ ] Do all changed files relate to the same concern?
- [ ] Would reverting this commit lose anything I want to keep?
- [ ] Can a reviewer understand this without context-switching?
- [ ] Is the commit message clear and specific?
- [ ] Are there any unrelated changes I should remove?

## Related

- [Conventional Commits](https://www.conventionalcommits.org/) - Commit message format
- [Git Best Practices](https://git-scm.com/book/en/v2/Distributed-Git-Contributing-to-a-Project) - Official Git guide
- [CONSTITUTION.md](../../CONSTITUTION.md) - Our commit conventions

## Real-World Example

From our baseball-chat sorting feature:

**Initial staging (mixed concerns):**
```bash
git add app/pages/index.vue
git add app/components/SortIndicator.vue
git add types/player.ts
git add .claude/patterns/sortable-table-columns.md
git add .claude/quick-references/git-branch-sync.md  # ← Unrelated!
# About to commit...
```

**After code review (focused):**
```bash
# Code review caught the unrelated file before commit
# Removed git-branch-sync.md from staging
git reset .claude/quick-references/git-branch-sync.md

# Now commit only the related files
git commit -m "feat(pages): add sortable column headers to player table"

# Git workflow docs will be a separate commit later
```

**Result:**
- ✅ Commit is focused on sorting feature
- ✅ Easy to review (4 related files)
- ✅ Safe to revert if needed
- ✅ Clear git history
- ✅ Pattern docs included (related to feature)
- ✅ Git workflow docs excluded (unrelated)
- ✅ Issue caught before commit (not in git history)

## Key Takeaway

**One commit = one logical change.** When in doubt, split it up. It's easier to squash commits later than to split them apart.
