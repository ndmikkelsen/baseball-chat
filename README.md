# Baseball Chat

A full-stack baseball statistics application with AI-powered player insights.

## 🎯 Features

- ✅ **Player List** - Browse 172 baseball players with career statistics
- ✅ **Smart Sorting** - Sort by Hits or Home Runs (ascending/descending)
- ✅ **Player Details** - View comprehensive career statistics
- ✅ **AI Scouting Reports** - Generate player descriptions using OpenAI GPT-4o-mini
- ✅ **Edit Players** - Update player data with persistence to PostgreSQL
- ✅ **Responsive UI** - Modern interface built with Nuxt UI components

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Docker (for PostgreSQL)
- OpenAI API key

### Installation

```bash
# 1. Install dependencies
pnpm install

# 2. Start PostgreSQL database
docker compose up -d

# 3. Configure environment
cp .env.example .env
# Edit .env and add your NUXT_OPENAI_API_KEY

# 4. Run database migrations
pnpm prisma generate
pnpm prisma migrate dev

# 5. Start development server
pnpm dev
```

Open http://localhost:3000

## 🛠️ Tech Stack

- **Frontend**: Nuxt 4 + Vue 3 + TypeScript
- **UI**: @nuxt/ui (TailwindCSS + Headless UI)
- **Backend**: Nuxt Server API Routes
- **Database**: PostgreSQL 16 + Prisma ORM
- **AI**: OpenAI GPT-4o-mini
- **Package Manager**: pnpm

## 📁 Project Structure

```
baseball-chat/
├── app/
│   ├── pages/
│   │   ├── index.vue                    # Player list with sorting
│   │   └── players/
│   │       ├── [id].vue                 # Player detail view
│   │       └── [id]/edit.vue            # Edit player form
│   └── assets/css/main.css              # Global styles
├── server/
│   ├── api/
│   │   ├── players.get.ts               # GET /api/players
│   │   └── players/
│   │       ├── [id].get.ts              # GET /api/players/:id
│   │       ├── [id].patch.ts            # PATCH /api/players/:id
│   │       └── [id]/description.post.ts # POST /api/players/:id/description
│   ├── services/
│   │   └── players.ts                   # Player business logic
│   └── utils/
│       ├── player.ts                    # Type definitions & mapping
│       └── prisma.ts                    # Prisma client singleton
├── prisma/
│   └── schema.prisma                    # Database schema
├── .claude/                             # Knowledge garden & commands
└── docker-compose.yml                   # PostgreSQL container
```

## 🏗️ Architecture

### Data Flow
1. Fetches baseline data from upstream API: `https://api.hirefraction.com/api/test/baseball`
2. Normalizes inconsistent field names (e.g., "home run" → `homeRuns`)
3. Caches upstream data for 5 minutes
4. Overlays database edits onto upstream data
5. Serves normalized data to client

### Smart Persistence
- Upstream API is read-only (baseline)
- User edits stored in PostgreSQL
- Database overrides merged onto upstream
- "Import baseline + local overrides" model

### AI Integration
- On-demand generation (not automatic)
- Caches descriptions in database
- Uses GPT-4o-mini for cost efficiency
- Prompt includes key stats for context

## 📚 Documentation

- **[CONSTITUTION.md](./CONSTITUTION.md)** - Core values and principles
- **[VISION.md](./VISION.md)** - Project goals and direction
- **[PLAN.md](./PLAN.md)** - Current status and roadmap
- **[CLAUDE.md](./CLAUDE.md)** - Technical reference
- **[CONVENTIONS.md](./CONVENTIONS.md)** - Coding conventions

## 🎮 Available Commands

### Development
```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm preview      # Preview production build
```

### Database
```bash
pnpm prisma generate        # Generate Prisma Client
pnpm prisma migrate dev     # Run migrations
pnpm prisma studio          # Open Prisma Studio GUI
```

### Docker
```bash
docker compose up -d        # Start database
docker compose down         # Stop database
docker compose logs -f db   # View database logs
```

### Workflow Commands
See `.claude/commands/` for workflow commands:
- `/dev` - Start development servers
- `/build` - Build for production
- `/commit` - Create conventional commit
- `/learn` - Extract lessons from work
- `/remember` - Capture patterns

## 🌿 Constitution Framework

This project follows the constitution framework for knowledge management and development practices. See the `.claude/` directory for the knowledge garden.

## 📝 License

Private project for technical exercise.
