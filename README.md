# GrowthDesk — SemenTanks.com

Internal growth operations dashboard for Select Genetics / SemenTanks.com.

## Stack
- **Next.js 14** (App Router)
- **Tailwind CSS**
- **Supabase** (Postgres database)
- **Vercel** (hosting + auto-deploy)

## Local Setup

### 1. Clone and install
```bash
git clone https://github.com/askanythingx/semen-tanks-growth-desk.git
cd semen-tanks-growth-desk
npm install
```

### 2. Environment variables
```bash
cp .env.example .env.local
```
Add your Supabase credentials to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Supabase migrations
Go to **Supabase → SQL Editor** and run in order:
1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_keywords_table.sql`

### 4. Run locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## Features — V1

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/` | Team overview, stats, quick links |
| Sprint Board | `/sprints` | 29 website audit tasks for Dhruvi — filter, expand, update status |
| Buyer Quiz | `/quiz` | 8-angle priority quiz for Janey & Mark — saves to Supabase |
| Keywords | `/keywords` | XC20 + Vapor keyword lists — approve/reject per keyword |

## Branch Strategy
- `main` — production (Vercel auto-deploys)
- `feature/growthdesk-*` — all new features built here, reviewed and merged manually

## Team
- **Smit** — Growth Manager (strategy, reports)
- **Dhruvi Axit** — Shopify Developer (sprint board)
- **Deepak** — Google Ads Manager (keywords, campaigns)
- **Janey** — Client Stakeholder (buyer quiz)
