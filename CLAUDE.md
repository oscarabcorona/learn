# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.5.2 application using React 19.1.0 with TypeScript, Tailwind CSS v4, and the shadcn/ui component library. The project uses pnpm as the package manager.

## Commands

**Development:**
- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production with Turbopack
- `pnpm start` - Start production server

**Code Quality:**
- `pnpm lint` - Run Biome linter (`biome check`)
- `pnpm format` - Format code with Biome (`biome format --write`)

## Architecture

### Tech Stack
- **Framework:** Next.js 15.5.2 with App Router
- **UI Library:** shadcn/ui components (stored in `src/components/ui/`)
- **Styling:** Tailwind CSS v4 with CSS variables
- **Form Handling:** react-hook-form with zod validation
- **Linting/Formatting:** Biome (configured with Next.js and React recommendations)

### Project Structure
- `src/app/` - Next.js App Router pages and layouts
- `src/components/ui/` - shadcn/ui components (pre-installed complete set)
- `src/lib/utils.ts` - Utility functions including `cn()` for className merging
- `src/hooks/` - Custom React hooks

### Key Configuration
- **TypeScript:** Strict mode enabled with path alias `@/*` → `./src/*`
- **shadcn/ui:** Configured with "new-york" style, Lucide icons, and CSS variables
- **Biome:** Handles both linting and formatting with 2-space indentation

### Development Notes
- All shadcn/ui components are already installed in `src/components/ui/`
- Use the `cn()` utility from `@/lib/utils` for conditional className merging
- Components follow React Server Components (RSC) pattern where applicable