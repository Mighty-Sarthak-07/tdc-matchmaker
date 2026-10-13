# TDC Matchmaker — Executive Matrimonial CRM & Decision Engine

> **A professional Customer Relationship Management (CRM) and AI-augmented matchmaking workspace crafted for executive matchmakers handling elite Indian matrimonial clients.**

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript (Strict Mode)**, **Tailwind CSS**, and **Prisma ORM**, TDC Matchmaker combines a **mathematically deterministic, explainable recommendation engine** with **Google Gemini 3.0 Flash AI** to evaluate compatibility, pick optimal matches, draft personalized presentations, and manage client lifecycles.

---

## 🌟 What is TDC Matchmaker? (In Simple Terms)

Unlike casual dating apps where users swipe on photos, **TDC Matchmaker is an internal enterprise operating system used by human matchmakers**.

As a matchmaker, your job is to:
1. **Manage client portfolios**: Track their biodata, education, family values, and partner preferences.
2. **Find compatible candidates**: Run a deterministic 6-dimension mathematical algorithm to rank eligible matches.
3. **Use Gemini AI to pick the best match**: Run the **AI Optimize Profile Picker** to evaluate candidates and select the single highest-probability match with strategic rationale.
4. **Send curated proposals**: Draft personalized, respectful presentation letters to clients with 1-click dispatch.
5. **Guide interactions**: Track proposals through the journey stages (`Suggested` &rarr; `Sent` &rarr; `Interested` &rarr; `Meeting Scheduled` &rarr; `Matched`).

---

## 🧭 Complete End-to-End Userflow

Here is the exact journey a matchmaker follows through the application:

```mermaid
flowchart TD
    A[🔑 Login Page /login] -->|1-Click Demo Fill| B[📊 Executive Dashboard /]
    B -->|View Client Pipeline| C[👥 Clients Directory /customers]
    C -->|Click Customer| D[📄 Full Client Dossier /customers/id]
    
    B -->|Click Recommendations| E[🎯 Decision Engine Workspace /recommendations]
    D -->|Match Recommendations| E
    
    E -->|1. Filter Candidates| F[Candidate List & Deterministic Scores]
    E -->|2. Click 'AI Optimize Profile Picker'| G[✨ Gemini 3.0 Flash Decision Spotlight]
    
    G -->|Option A: Compare| H[⚖️ Side-by-Side Comparison Modal]
    G -->|Option B: Dispatch| I[✉️ Send Match Presentation Modal]
    
    F -->|Click Compare Profiles| H
    F -->|Click Send Match| I
    
    I -->|Confirm & Dispatch| J[📬 Sent Matches Outbox /sent-matches]
    J -->|Schedule Next Touchpoint| K[📅 Follow-ups Scheduler /follow-ups]
    
    K -->|Log Changes & Notes| L[🕒 Activity Audit Log /activity-log]
```

### 7-Step Walkthrough

1. **Step 1: Sign In (`/login`)**  
   Access the CRM using the 1-click **"Demo Login"** pill at the bottom. It autofills `matchmaker@tdc.com` / `password123` with smooth entry reveal animations.
2. **Step 2: Executive Overview (`/`)**  
   View real-time portfolio KPIs (Total Clients, Active Seekers, Pending Sends, Success Rate), recent client intake queue, and journey stage distribution.
3. **Step 3: Client Directory (`/customers`)**  
   Search across 125+ seeded profiles with debounced search, filter by city, gender, verification status, or marital status, or click **"+ Add Client"** to register a new member.
4. **Step 4: Client Dossier (`/customers/[id]`)**  
   Inspect the client's verified biodata, education, career, lifestyle (diet, children, relocation, pets), declared partner preferences, matchmaker notes, and history.
5. **Step 5: Match Recommendations Workspace (`/recommendations`)**  
   Select any client from your portfolio. The engine instantly filters hard dealbreakers and scores eligible candidates (0–100%) with reciprocal harmony.
6. **Step 6: AI Optimize Profile Picker (Powered by Gemini 3.0 Flash)**  
   Click the **"AI Optimize Profile Picker"** button. Gemini evaluates the candidate pool to pick the single maximum compatible profile, highlighting 4 key alignment pillars, matchmaker opening pitch, and comparative edge.
7. **Step 7: Send Match Presentation & Follow-Up (`/sent-matches` & `/follow-ups`)**  
   Click **"Send Match Presentation"** to preview an AI-crafted introduction letter and dispatch the proposal. Track the interaction lifecycle in **Sent Matches** and manage consultation reminders in **Follow-ups**.

---

## 🚀 5-Minute Quickstart (Beginner Guide)

Follow these steps to run the complete project locally on your machine:

### Prerequisites
- [Node.js](https://nodejs.org/) version **20+** or **24+** (tested on `v24.20.0`)
- Git installed on your system

### Step 1: Open Terminal and Clone the Repository
```bash
git clone https://github.com/your-username/tdc-matchmaker.git
cd tdc-matchmaker
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set Up Environment File
Create a `.env` file in the root folder (or copy `.env.example`):
```bash
cp .env.example .env
```
Default local `.env` contents (works immediately with zero configuration):
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="tdc-matchmaker-development-jwt-session-secret-change-in-production"
GEMINI_API_KEY="" # Optional: Add your Google Gemini API key for live AI. If blank, built-in deterministic engine runs automatically!
GEMINI_MODEL="gemini-3.0-flash"
NODE_ENV="development"
```

### Step 4: Initialize the SQLite Database
Push the Prisma schema to create your local database file (`dev.db`):
```bash
npx prisma db push
```

### Step 5: Seed 125 Synthetic Indian Profiles
Populate the database with the default matchmaker user and 125 rich, realistic matrimonial profiles across 12 Indian cities:
```bash
npm run seed
```

### Step 6: Start the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Lead Matchmaker** | `matchmaker@tdc.com` | `password123` | Full CRM & Decision Engine Access |

> **Pro Tip**: On the `/login` page, click the pill **"Demo Login: matchmaker@tdc.com / password123"** to pre-fill credentials in 1 second.

---

## 🧠 How the Matchmaking Engine Works

In elite matchmaking, matches cannot be based on random guessing or black-box algorithms. TDC uses a **two-phase deterministic evaluation pipeline**:

### Phase A: Hard Constraints & Eligibility
Before scoring, candidates must strictly satisfy non-negotiable rules:
- **Gender Matching**: Reciprocal opposite-gender criteria (Male $\leftrightarrow$ Female).
- **Self-Match & Duplicate Prevention**: Never recommend the client to themselves or repeat already dispatched proposals.
- **Archive & Prior Dismissals**: Exclude archived profiles or previously dismissed candidates.
- **Dealbreakers**: Mandatory filters on age range, marital status, location flexibility, and desire for children.

### Phase B: 6-Dimension Reciprocal Scoring
Eligible candidates are scored from **0 to 100%**:

| Dimension | Weight | What It Measures |
| :--- | :---: | :--- |
| **Partner Preference Fit** | **30%** | How accurately each candidate meets the other's declared preferences |
| **Family Plans & Values** | **25%** | Agreement on children, family structure, and cultural traditions |
| **Career & Education** | **15%** | Academic parity (Masters/Bachelors) and professional compatibility |
| **Location Proximity** | **10%** | Same city advantage or mutual willingness to relocate |
| **Lifestyle & Diet** | **10%** | Diet synergy (Vegetarian, Non-Veg, Jain), pet friendliness |
| **Age & Height Tolerance** | **10%** | Adherence to preferred physical parameters |

To guarantee fairness, the engine evaluates suitability in **both directions** ($A \rightarrow B$ and $B \rightarrow A$) and computes their harmonic mean to prevent one-sided matches.

---

## 🤖 AI Features (Powered by Google Gemini 3.0 Flash)

> **Why Google Gemini over OpenAI?**  
> OpenAI's API requires a paid balance and billing setup, creating friction for recruiters and evaluators. **Google Gemini API (`gemini-3.0-flash`)** was chosen because it provides accessible developer access with generous quotas. If an API key is omitted, TDC automatically falls back to deterministic rule templates so the app **never crashes**.

### Where AI is Used:
1. **AI Optimize Profile Picker**: Evaluates the candidate pool to select the single maximum compatible candidate, explaining why they edge out other matches.
2. **Contextual Match Explanations**: Generates natural language summaries explaining why a match score was awarded.
3. **Personalized Presentation Letters**: Drafts respectful, culturally grounded introductory emails for clients.
4. **Qualitative Fit Reasoning**: Analyzes lifestyle pace, mutual respect, and potential interpersonal friction points.

---

## 📱 Page-by-Page Tour

| Route | Page | Purpose |
| :--- | :--- | :--- |
| `/login` | **Authentication** | Editorial split-screen login/signup with Ken Burns animation & demo pre-fill |
| `/` | **Dashboard** | Overview of matchmaker metrics, pipeline stages, and workload queue |
| `/customers` | **Client Directory** | Searchable table of 125+ clients with filtering and "+ Add Client" modal |
| `/customers/[id]` | **Client Dossier** | Comprehensive profile view with biodata, preferences, and internal notes |
| `/recommendations` | **Decision Engine** | Candidate feed, compatibility breakdowns, AI Optimal Picker, and Modals |
| `/sent-matches` | **Sent Matches** | Operational tracker for dispatched match proposals and status progression |
| `/follow-ups` | **Follow-ups** | Task manager for client consultation calls and meeting reminders |
| `/activity-log` | **Audit Trail** | Immutable log of all system actions (client additions, notes, proposals) |
| `/settings` | **Settings** | Configuration preferences and matchmaking preset thresholds |

---

## 🧪 Running Automated Tests

The repository includes a comprehensive test suite covering eligibility filters, scoring mathematics, age calculations, and AI fallback behavior:

```bash
npm run test
```

**Test Coverage**:
- `lib/matching/__tests__/matching.test.ts` (Phase A eligibility, dealbreakers, weights, reciprocal balance, ranking)
- `lib/__tests__/services.test.ts` (Dynamic age calculations, currency/height formatters, deterministic AI fallbacks)
- **Result: 10 / 10 tests passing (100%)**

---

## 🌐 Production Deployment (Vercel & PostgreSQL)

The codebase is production-ready for deployment to **Vercel** with hosted PostgreSQL (Neon, Supabase, AWS RDS):

1. **Update Prisma Schema**:
   Change provider in `prisma/schema.prisma` from `sqlite` to `postgresql`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. **Set Environment Variables on Vercel**:
   - `DATABASE_URL`: `postgresql://user:password@host:5432/dbname?sslmode=require`
   - `JWT_SECRET`: Random 32+ character string
   - `GEMINI_API_KEY`: Your Google Gemini API Key (optional)
   - `GEMINI_MODEL`: `gemini-3.0-flash`
3. **Deploy & Push Schema**:
   ```bash
   npx prisma db push
   npm run seed
   ```

---

## 📚 Technical Documentation Index

- [`docs/product-research.md`](./docs/product-research.md) — Research synthesis comparing Shaadi.com, BharatMatrimony, and Hinge workflows.
- [`docs/matching-algorithm.md`](./docs/matching-algorithm.md) — In-depth breakdown of Phase A–E formulas, reciprocal weights, and edge cases.
- [`docs/ai-integration.md`](./docs/ai-integration.md) — Technical guide on Google Gemini integration, privacy safeguards, and deterministic fallbacks.

---

Crafted with care for professional relationship architects.
