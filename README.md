# Lootboxes.com

Gaming deals aggregator + loot box analytics platform.

## Quick Start

```bash
# Install dependencies
npm install

# Copy env file and fill in your keys
cp .env.local.example .env.local

# Run the database schema (copy supabase/schema.sql into Supabase SQL Editor)

# Start development server
npm run dev
```

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Hosting:** Vercel
- **Deal Data:** IsThereAnyDeal API
- **Email:** Resend
- **Analytics:** Plausible

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── deals/            # Deals hub
│   ├── analytics/        # Analytics hub
│   ├── games/            # Individual game pages
│   ├── blog/             # Blog/news
│   ├── go/[dealId]/      # Affiliate redirect
│   ├── newsletter/       # Newsletter signup
│   └── about/            # About, disclosure, policy
├── components/
│   ├── layout/           # Header, Footer
│   ├── deals/            # Deal cards, tables
│   ├── analytics/        # Score badges, article cards
│   └── ui/               # Shared UI components
├── lib/
│   ├── supabase.ts       # Database client
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Helper functions
├── styles/
│   └── globals.css       # Tailwind + custom styles
└── content/              # MDX content files
    ├── analytics/        # Analytics articles
    └── blog/             # Blog posts
```
