# Prisma Client Not Found Error

**Context:** When you see "Named export 'PrismaClient' not found" in Nuxt/Node, the error message is misleading - it's not an import syntax issue.

**Last Updated:** 2026-01-07

---

## The Problem

You start your Nuxt dev server and see this error:

```
Named export 'PrismaClient' not found. The requested module 
'@prisma/client/default.js' is a CommonJS module, which may not 
support all module.exports as named exports.

CommonJS modules can always be imported via the default export, 
for example using:

import pkg from '@prisma/client';
const { PrismaClient } = pkg;
```

## The Misleading Solution ❌

The error message suggests changing your import syntax from:

```typescript
import { PrismaClient } from "@prisma/client";
```

to:

```typescript
import pkg from "@prisma/client";
const { PrismaClient } = pkg;
```

**Don't do this!** The import syntax is correct for ESM.

## The Real Solution ✅

The actual problem is that **Prisma Client hasn't been generated**. Run:

```bash
npx prisma generate
```

This creates the `node_modules/.prisma/client` directory with the generated client code.

## Why This Happens

Prisma Client needs to be generated:

1. **After fresh install** - `pnpm install` doesn't auto-generate
2. **After schema changes** - Modifying `prisma/schema.prisma`
3. **After version updates** - Upgrading `@prisma/client` or `prisma`
4. **In CI/CD** - Build pipelines need explicit generation step

## How to Diagnose

Check if the client exists:

```bash
ls node_modules/.prisma/client
```

If the directory doesn't exist or is empty, you need to generate.

## Prevention

### Option 1: Postinstall Script

Add to `package.json`:

```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

**Pros:** Automatic generation after install  
**Cons:** Slows down every `pnpm install`

### Option 2: Manual Generation

Run `npx prisma generate` when needed:
- After cloning the repo
- After schema changes
- After Prisma version updates

**Pros:** Faster installs  
**Cons:** Easy to forget

### Option 3: pnpm Configuration

Configure pnpm to auto-approve Prisma scripts in `.npmrc`:

```
enable-pre-post-scripts=true
```

This allows Prisma's built-in postinstall script to run.

## The Singleton Pattern

Once generated, use this pattern in Nuxt server utils:

```typescript
// server/utils/prisma.ts
import { PrismaClient } from "@prisma/client";
import process from "node:process";

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
```

**Why singleton?**
- Prevents connection pool exhaustion
- Handles hot reload in development
- Reuses connections across requests

## Related

- [Prisma Documentation: Client Generation](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/generating-prisma-client)
- [Nuxt Server Utils](https://nuxt.com/docs/guide/directory-structure/server#server-utilities)
