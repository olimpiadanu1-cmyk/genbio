# Roleplay Biography Validator

## Overview

A web application for validating and generating roleplay character biographies for game servers. The tool allows users to check if their biographies meet server formatting rules, generate new biographies based on parameters, and view approved examples. The application is designed for Russian-speaking roleplay communities with specific formatting requirements.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for smooth UI transitions
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite with path aliases (`@/` for client source, `@shared/` for shared code)

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful endpoints defined in `shared/routes.ts` with Zod schemas
- **AI Integration**: OpenAI API (via Replit AI Integrations) for biography validation and generation

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` contains table definitions and Zod schemas
- **Migration Tool**: Drizzle Kit (`npm run db:push`)

### Key Design Patterns
1. **Shared Types**: Schema definitions in `shared/` are used by both client and server
2. **API Contract**: Routes are defined with Zod schemas for type-safe request/response handling
3. **Component Structure**: UI components use shadcn/ui patterns with Radix UI primitives
4. **Storage Abstraction**: Database operations are encapsulated in `server/storage.ts`

### Project Structure
```
├── client/src/          # React frontend
│   ├── components/      # UI components (bio/, layout/, ui/)
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   └── lib/             # Utilities and query client
├── server/              # Express backend
│   ├── routes.ts        # API endpoint handlers
│   ├── storage.ts       # Database operations
│   └── db.ts            # Database connection
├── shared/              # Shared between client/server
│   ├── schema.ts        # Drizzle tables + Zod schemas
│   └── routes.ts        # API route definitions
└── migrations/          # Drizzle database migrations
```

## External Dependencies

### AI Services
- **OpenAI API**: Used for biography validation and generation via Replit AI Integrations
  - Environment variables: `AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL`

### Database
- **PostgreSQL**: Primary database
  - Environment variable: `DATABASE_URL`
  - ORM: Drizzle with `drizzle-orm` and `drizzle-zod`

### Key NPM Packages
- **UI**: `@radix-ui/*` primitives, `class-variance-authority`, `tailwind-merge`
- **Forms**: `react-hook-form`, `@hookform/resolvers`
- **HTTP**: `@tanstack/react-query` for data fetching
- **Validation**: `zod` for runtime type validation