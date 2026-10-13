# TDC Matchmaker — Executive Matrimonial CRM & Decision Engine

**TDC Matchmaker** is a full-stack Customer Relationship Management (CRM) and algorithmic matchmaking platform tailored for professional human matchmakers handling elite Indian matrimonial clients.

Built with **Next.js 16 App Router**, **React 19**, **TypeScript (Strict Mode)**, **Tailwind CSS v4 (Editorial Tokens)**, and **Prisma ORM**, the platform combines a **mathematically deterministic, explainable recommendation engine** with **grounded server-side AI integration** to streamline client discovery, compatibility assessment, presentation drafting, and consultation workflows.

---

## 1. Executive Summary & Assignment Write-Up

### Algorithm Design
In high-touch matrimonial matchmaking, recommendations must be authoritative, explainable, and accountable. Unlike casual dating apps that employ black-box swipe algorithms or unverified heuristics, TDC Matchmaker separates recommendation logic into two independent phases:
1. **Phase A (Candidate Eligibility & Hard Constraints)**: Strict filtering against non-negotiable criteria (gender matching, self-match prevention, archived profiles, duplicate recommendation checks, prior dismissals, and explicit dealbreakers such as age limits, marital status, location, and children preferences).
2. **Phase B (Weighted Reciprocal Compatibility Scoring)**: Eligible candidates are scored across six normalized dimensions (0–100): Mutual Partner-Preference Fit (30%), Family Plans & Values (25%), Career & Education Alignment (15%), Location & Relocation Proximity (10%), Lifestyle, Diet & Interests (10%), and Age & Height Tolerance (10%).

To ensure true mutual suitability rather than one-sided suitability, the engine evaluates both directions ($S_{A \rightarrow B}$ and $S_{B \rightarrow A}$) and computes the harmonic mean to penalize extreme asymmetry. Assignment-specific demo presets provide visible sensitivity shifts (e.g. height proportionality and age windows for male profiles; educational synergy and family values for female profiles) while strictly preserving the primacy of individual declared preferences.

### AI Integration (Google Gemini API)
Large Language Models are utilized solely for operational matchmaker productivity—specifically synthesizing deterministic comparison facts into concise briefings, drafting respectful introductory presentation letters, and providing deep qualitative natural language fit reasoning.

> **Why Google Gemini API was chosen over OpenAI**:  
> **Google Gemini API (`gemini-1.5-flash`) was selected as the platform's primary LLM provider because OpenAI API is strictly paid (requiring paid credit balance and active billing).** In contrast, Google Gemini provides an accessible developer tier with generous rate limits, enabling reviewers and developers to run AI-powered match briefings, introductory email drafts, and profile fit reasoning without incurring mandatory API billing barriers.

The AI service (`lib/services/ai.service.ts`) communicates with the Google Gemini REST API via server-side route handlers with zero client exposure of API keys. Strict privacy safeguards ensure contact vectors (phone/email), full surnames, sensitive caste data, and exact incomes are never transmitted to external models. All AI responses are validated using Zod schemas; if the model fails, times out, or `GEMINI_API_KEY` is omitted, the engine deterministically falls back to structured templates and mathematical rules without interrupting user workflows.

### Assumptions and Limitations
The current MVP implements a binary matrimonial demo configuration (Male $\leftrightarrow$ Female) reflecting traditional industry search patterns. Geographic proximity is evaluated through city and state boundaries rather than geodesic latitude/longitude calculations. Cultural horoscope / Kundali matching is treated as a modular plugin candidate for future releases rather than a default mandatory constraint.

---

## 2. Key Product Features

- **Executive Operational Dashboard**: Real application metrics derived from PostgreSQL/SQLite (total assigned clients, verified profiles, active seekers, pending sends, accepted matches, follow-ups due, recent workload queue, and journey stage pipeline).
- **Client Management Directory**: Data table with live debounced search (by name, city, profession, or ID), multi-attribute filtering (gender, city, verification, marital status, journey stage), multi-column sorting, and pagination across 125+ profiles.
- **Detailed Matrimonial Dossier**: Dynamic age calculation from Date of Birth, education & career background, voluntary cultural parameters, lifestyle preferences (diet, children, relocation, pets), partner preferences, internal notes, and activity timeline.
- **Explainable Match Recommendations Workspace**: Candidate ranking with full 6-component score breakdowns, reciprocal compatibility scores, top positive compatibility drivers, operational friction points, and pending verification items.
- **Side-by-Side Profile Comparison**: Side-by-side modal comparing client and candidate across biodata, career, lifestyle, and stated partner criteria.
- **Send Match Presentation Workflow**: Confirmation modal with pre-filled, AI-assisted introductory letter, duplicate-send prevention, simulated dispatch, and automatic status updates.
- **Operational Outbox (Sent Matches)**: Comprehensive interaction lifecycle tracking (`Suggested` $\rightarrow$ `Sent` $\rightarrow$ `Viewed` $\rightarrow$ `Interested` $\rightarrow$ `Meeting Scheduled` $\rightarrow$ `Completed`).
- **Follow-up & Consultation Scheduler**: Priority-based task tracking with overdue warnings and one-click completion toggling.
- **Immutable Activity Audit Log**: Chronological audit trail of all client additions, note entries, match presentations, and status changes.
- **Zero AI-Slop Design Language**: Tailored editorial aesthetic inspired by Linear, Stripe Dashboard, and Notion—warm ivory (`#F8F7F4`), charcoal (`#242522`), forest green (`#315747`), and muted terracotta (`#B76E57`).

---

## 3. Technology Stack

- **Framework**: Next.js 16.4.0 (App Router, Turbopack)
- **UI & Components**: React 19, Tailwind CSS v4, Lucide Icons, clsx, tailwind-merge
- **Form Management & Validation**: React Hook Form, Zod v4
- **ORM & Database**: Prisma ORM v6 (SQLite for zero-config local development; PostgreSQL schema ready for cloud deployment)
- **Authentication**: Stateless HMAC-signed session cookies via `jose` and `bcryptjs` password hashing
- **AI Service**: Google Gemini API (`gemini-1.5-flash`, `gemini-2.0-flash`) with Zod schema validation and deterministic rule engine fallback (chosen over OpenAI due to paid billing constraints)
- **Testing Framework**: Vitest v5, Vite

---

## 4. Local Development Setup

### Prerequisites
- Node.js `v20+` or `v24+` (tested on `v24.20.0`)
- npm `v10+`

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default local `.env` content:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="tdc-matchmaker-development-jwt-session-secret-change-in-production"
GEMINI_API_KEY="" # Enter your Gemini API key (Free tier available; deterministic rules run if omitted)
NODE_ENV="development"
```

### Step 3: Initialize Database Schema
Synchronize the local SQLite database via Prisma:
```bash
npx prisma db push
```

### Step 4: Seed Database with 125 Synthetic Profiles
Populate the database with the seed matchmaker user and 125 diverse Indian profiles across 12 cities:
```bash
npm run seed
```

### Step 5: Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Demo Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Lead Matchmaker** | `matchmaker@tdc.com` | `password123` | Full CRM & Engine Access |

*Protected routes automatically redirect unauthenticated sessions to `/login`.*

---

## 6. Running Automated Tests

Run the complete test suite verifying eligibility rules, scoring formulas, reciprocal balance, demo presets, and AI fallback behavior:
```bash
npm run test
```
Result summary:
- `lib/matching/__tests__/matching.test.ts` (Eligibility, dealbreakers, weights, deterministic scoring, ranking)
- `lib/__tests__/services.test.ts` (Dynamic age calculation, height/currency formatting, AI service fallbacks)
- **Status: 9 / 9 tests passing (0 failures)**

---

## 7. Production Deployment (Vercel & PostgreSQL)

The application is structured for instant deployment to **Vercel** with any managed PostgreSQL provider (Neon, Supabase, AWS RDS, or Vercel Postgres).

### PostgreSQL Switching Steps:
1. In `prisma/schema.prisma`, update the datasource provider to `postgresql`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
   *(Alternatively, copy `prisma/schema.postgresql.prisma` to `prisma/schema.prisma`)*
2. In your Vercel Project Settings, configure:
   - `DATABASE_URL`: `postgresql://user:password@host:5432/dbname?sslmode=require`
   - `JWT_SECRET`: Random 32+ character string
   - `OPENAI_API_KEY`: Your OpenAI API Key (optional)
3. Deploy via GitHub or Vercel CLI:
   ```bash
   npx vercel
   ```
4. Run migrations and seed on the remote database:
   ```bash
   npx prisma db push
   npm run seed
   ```

---

## 8. Documentation Index

- [`docs/product-research.md`](./docs/product-research.md) — Research synthesis of Shaadi.com, BharatMatrimony, and Hinge workflows and domain decisions.
- [`docs/matching-algorithm.md`](./docs/matching-algorithm.md) — Comprehensive technical documentation of Phase A–E matching formulas, weights, dealbreakers, and reciprocal calculations.
- [`docs/ai-integration.md`](./docs/ai-integration.md) — Architectural overview of OpenAI integration, privacy protections, and deterministic fallback mechanics.
