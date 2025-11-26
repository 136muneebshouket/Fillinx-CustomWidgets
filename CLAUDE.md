# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application using React 19 with TypeScript, Tailwind CSS v4, and shadcn/ui components. The project is called "template-blocks" and uses pnpm as the package manager.

## Development Commands

```bash
# Start development server with Turbopack
pnpm dev

# Build for production with Turbopack
pnpm build --turbopack

# Start production server
pnpm start

# Run linter
pnpm lint
```

## Architecture

**Framework**: Next.js 15 with App Router (`app/` directory)

**UI Components**: Uses shadcn/ui (New York style) with Radix UI primitives. All UI components live in `components/ui/`.

**Styling**:
- Tailwind CSS v4 with CSS variables for theming
- Base color: stone
- Dark mode enabled by default (see `app/layout.tsx:28`)
- Uses `cn()` utility in `lib/utils.ts` for merging class names (clsx + tailwind-merge)

**Path Aliases**:
- `@/` maps to root directory
- `@/components`, `@/lib`, `@/hooks`, `@/ui` configured

**Fonts**: Geist Sans and Geist Mono loaded via next/font/google

**Component Configuration**: `components.json` contains shadcn/ui settings. When adding new shadcn components, they'll follow the "new-york" style with RSC support.

## Key Patterns

- All pages use `'use client'` directive when needed (see `app/page.tsx`)
- Components use TypeScript with strict mode enabled
- Dark mode is hardcoded in the root layout className
