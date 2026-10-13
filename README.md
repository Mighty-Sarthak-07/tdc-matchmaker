# TDC Matchmaker — Executive Matrimonial CRM & Decision Engine

> **A modern, full-stack Customer Relationship Management (CRM) and AI-augmented matchmaking workspace crafted for executive matchmakers handling high-touch Indian matrimonial clients.**

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript (Strict Mode)**, **Tailwind CSS**, and **Prisma ORM**, TDC Matchmaker pairs a **mathematically deterministic, explainable recommendation engine** with **Google Gemini 3.0 Flash AI** to evaluate compatibility, select optimal matches, draft personalized presentation letters, and track client courtship pipelines.

---

## 🌟 What is TDC Matchmaker? (Explained for Beginners)

Unlike casual dating apps where users swipe on photos, **TDC Matchmaker is an internal business tool used by professional human matchmakers**.

In traditional Indian matchmaking, families and relationship consultants manage complex criteria: family values, cultural alignment, career parity, relocation willingness, and lifestyle habits. 

As a matchmaker using TDC, you:
1. **Track client portfolios**: Maintain comprehensive profiles with verified biodata, education, and partner preferences.
2. **Run mathematical candidate scoring**: Filter hard dealbreakers and score candidates across 6 reciprocal dimensions (0–100%).
3. **Pick optimal matches with Gemini AI**: Click **AI Optimize Profile Picker** to let Gemini 3.0 Flash evaluate mutual compatibility and select the single best profile with strategic reasoning.
4. **Present candidates to clients**: Draft customized, respectful introduction letters and simulate proposal dispatch.
5. **Manage the client journey**: Track proposals through the pipeline (`Suggested` &rarr; `Sent` &rarr; `Interested` &rarr; `Meeting Scheduled` &rarr; `Matched`).

---

## 🧭 Complete End-to-End Userflow

### Visual Userflow Diagram

```mermaid
flowchart TD
    Start([🚀 Matchmaker Opens App]) --> Login[🔑 1. Sign In Page /login\n• 1-Click Demo Pre-fill\n• Smooth Ken Burns reveal]
    
    Login --> Dashboard[📊 2. Executive Dashboard /\n• Portfolio KPIs & Active Seekers\n• Workload queue & pipeline stages]
    
    Dashboard --> Clients[👥 3. Clients Directory /customers\n• Debounced search across 125+ profiles\n• Filter by city, verification, marital status\n• '+ Add Client' Modal]
    
    Clients --> Dossier[📄 4. Client Dossier /customers/id\n• Verified biodata & career facts\n• Lifestyle & partner preferences\n• Matchmaker notes & activity log]
    
    Dossier --> Recomms[🎯 5. Decision Engine Workspace /recommendations\n• Choose focal client portfolio\n• Reciprocal deterministic scores 0-100%\n• 6-dimension factor breakdown]
    
    Recomms --> AIPicker{✨ Choose Action}
    
    AIPicker -->|Click 'AI Optimize Profile Picker'| OptimalModal[👑 6. Gemini 3.0 Flash Spotlight\n• Maximum Compatible Candidate selected\n• 4 Key Alignment Pillars\n• Matchmaker pitch & comparative edge]
    
    AIPicker -->|Click 'Compare Profiles'| CompareModal[⚖️ 7. Side-by-Side Comparison Modal\n• Attribute-by-attribute fit matrix\n• Career, biodata, lifestyle alignment]
    
    AIPicker -->|Click 'Send Match Presentation'| SendModal[✉️ 8. Send Match Presentation Modal\n• Pre-filled personalized email draft\n• Optional Gemini AI regeneration\n• 1-click dispatch simulation]
    
    OptimalModal -->|1-Click Action| SendModal
    OptimalModal -->|1-Click Action| CompareModal
    
    SendModal --> SentMatches[📬 9. Sent Matches Tracker /sent-matches\n• Track proposals: Sent → Viewed → Interested\n• Update interaction milestones]
    
    SentMatches --> FollowUps[📅 10. Follow-ups Scheduler /follow-ups\n• Scheduled consultation calls\n• Overdue warnings & priority tags]
    
    FollowUps --> AuditLog[🕒 11. Activity Audit Log /activity-log\n• Complete immutable chronological audit trail]
```

---

### Step-by-Step Screen Walkthrough

| Step | Page & Route | What You See | What You Do |
| :---: | :--- | :--- | :--- |
| **1** | **Sign In**<br>`/login` | Warm editorial split-screen, botanical branding, and segmented mode switcher (`Sign In` vs `Create Account`). | Click **"Demo Login: matchmaker@tdc.com / password123"** pill for instant 1-click credentials entry, then click **Sign in**. |
| **2** | **Executive Dashboard**<br>`/` | Real-time metric cards (Total Clients, Active Seekers, Pending Sends, Success Rate), client intake feed, and journey pipeline. | Review today's high-priority clients and click **"Review Matches"** to jump into the decision engine. |
| **3** | **Client Directory**<br>`/customers` | Searchable table of 125+ seeded profiles across 12 Indian cities with status badges and filters. | Type in the search box (e.g. "Priya" or "Mumbai"), filter by verified status, or click **"+ Add Client"** to register a new member. |
| **4** | **Client Dossier**<br>`/customers/[id]` | Full matrimonial dossier: verified age, height, education, career, diet, children, relocation, and partner expectations. | Inspect client requirements, add internal matchmaker notes, or click **"Match Recommendations"** to find candidates. |
| **5** | **Match Recommendations**<br>`/recommendations` | Focal client selector ribbon, sensitivity sliders (`60%+ Viable`, `75%+ High Match`), and ranked candidates with compatibility scores. | Select any client from the dropdown. Review the candidate list ranked by reciprocal deterministic compatibility. |
| **6** | **AI Optimize Profile Picker**<br>*(Interactive Feature)* | **"AI Optimize Profile Picker"** button in the top ribbon with a Gemini badge. | Click the button. **Gemini 3.0 Flash** evaluates the pool, picks the **single maximum compatible profile**, and displays 4 synergy pillars and a tailored opening pitch. |
| **7** | **Side-by-Side Comparison**<br>*(Modal Dialog)* | Side-by-side tabular comparison of Client vs Candidate across Personal, Education, Family, and Lifestyle dimensions. | Click **"Compare Profiles"** to verify attribute-by-attribute fit matrix and spot any potential friction points. |
| **8** | **Send Match Presentation**<br>*(Modal Dialog)* | Pre-drafted presentation letter to the client summarizing the candidate's background, strengths, and compatibility score. | Click **"Send Match Presentation"**. Optionally click **"Regenerate with Gemini AI"** to customize, then click **"Confirm & Dispatch Match"**. |
| **9** | **Sent Matches Outbox**<br>`/sent-matches` | List of all dispatched proposals with timestamps and status badges (`Suggested` &rarr; `Sent` &rarr; `Interested` &rarr; `Completed`). | Update client feedback as they respond to proposals and advance candidate stages. |
| **10** | **Follow-ups Scheduler**<br>`/follow-ups` | Task management board for scheduled client check-ins, consultation calls, and meeting prep. | Filter tasks by priority or status (`PENDING` vs `COMPLETED`), toggle tasks with 1 click, or schedule new follow-ups. |
| **11** | **Activity Audit Log**<br>`/activity-log` | Immutable chronological stream of system events: client additions, profile updates, match dispatches, and notes. | Inspect the full operational history to maintain transparency and compliance. |

---

## 🚀 5-Minute Quickstart (Step-by-Step for Beginners)

Follow these steps to run the application on your computer:

### Step 1: Check Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (**version 20 or higher**):
```bash
node -v   # Should output v20.x or v22.x or v24.x
npm -v    # Should output v10.x or higher
```

### Step 2: Open Terminal and Navigate to Project
```bash
cd tdc-matchmaker
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Configure Environment Variables
Create a `.env` file in the project folder (or copy `.env.example`):
```bash
cp .env.example .env
```
Default local `.env` configuration (works immediately out of the box with zero external setup):
```env
# Local zero-configuration SQLite database
DATABASE_URL="file:./dev.db"

# Session JWT Secret
JWT_SECRET="tdc-matchmaker-development-jwt-session-secret-change-in-production"

# AI Integration: Powered by Google Gemini 3.0 Flash API
# (Optional: Add your Gemini API key from Google AI Studio. If omitted, built-in deterministic engine runs automatically!)
GEMINI_API_KEY=""
GEMINI_MODEL="gemini-3.0-flash"

# Environment
NODE_ENV="development"
```

### Step 5: Push Database Schema
Create the local SQLite database (`dev.db`) automatically using Prisma:
```bash
npx prisma db push
```

### Step 6: Seed 125 Realistic Indian Profiles
Populate the database with the default matchmaker account and 125 rich, diverse matrimonial profiles across 12 Indian cities:
```bash
npm run seed
```

### Step 7: Launch the Application
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Lead Matchmaker** | `matchmaker@tdc.com` | `password123` | Full CRM & Decision Engine Access |

> **Beginner Tip**: On the `/login` page, simply click the pill **"Demo Login: matchmaker@tdc.com / password123"** to auto-fill the credentials in 1 click!

---

## 🧠 How the Matchmaking Algorithm Works

In high-stakes matrimonial matchmaking, matches cannot rely on random chance or unexplainable black-box swipe algorithms. TDC uses a **two-phase deterministic evaluation pipeline**:

```mermaid
graph LR
    Pool[(125+ Candidates)] --> PhaseA[Phase A: Hard Constraints\n• Gender Matching\n• Exclude Self & Duplicates\n• Dealbreakers: Age, City, Diet, Children]
    PhaseA --> Eligible{Eligible?}
    Eligible -->|No| Reject[Excluded / Dismissed]
    Eligible -->|Yes| PhaseB[Phase B: 6-Dimension Reciprocal Scoring\n• Partner Preferences: 30%\n• Family & Values: 25%\n• Career & Education: 15%\n• Location Proximity: 10%\n• Lifestyle & Diet: 10%\n• Physical Parameters: 10%]
    PhaseB --> Harmonic[Harmonic Mean S_A↔B\nPrevents one-sided suitability]
    Harmonic --> Ranked[(Ranked Candidates 0-100%)]
```

### 1. Phase A: Hard Constraints (Zero Dealbreakers)
Before scoring, candidates must satisfy mandatory requirements:
- **Reciprocal Gender Matching**: Opposite gender pairing (Male $\leftrightarrow$ Female).
- **Self & Duplicate Filtering**: Prevents clients from matching themselves or receiving duplicate proposals.
- **Archive & Prior Dismissals**: Automatically filters inactive or previously dismissed candidates.
- **Explicit Dealbreakers**: Checks strict client dealbreaker rules regarding age boundaries, location flexibility, marital status, and children preferences.

### 2. Phase B: 6-Dimension Reciprocal Scoring (0–100%)
Eligible candidates are scored across 6 normalized dimensions:

| Dimension | Weight | What It Evaluates |
| :--- | :---: | :--- |
| **1. Partner Preference Fit** | **30%** | How accurately each candidate satisfies the partner criteria declared by the other |
| **2. Family Plans & Values** | **25%** | Agreement on desire for children, family structure (Nuclear vs Joint), and cultural values |
| **3. Career & Education** | **15%** | Academic parity (Doctorate, Masters, Bachelors) and professional alignment |
| **4. Location & Relocation** | **10%** | Proximity advantage (same city) or mutual flexibility regarding regional relocation |
| **5. Lifestyle & Diet** | **10%** | Compatibility on dietary lifestyle (Vegetarian, Non-Veg, Jain) and pet friendliness |
| **6. Age & Height Tolerance** | **10%** | Alignment with preferred physical parameters and age windows |

To ensure mutual satisfaction, the engine evaluates compatibility in **both directions** ($A \rightarrow B$ and $B \rightarrow A$) and computes their harmonic mean:
$$\text{Reciprocal Score} = \frac{2 \cdot S_{A \rightarrow B} \cdot S_{B \rightarrow A}}{S_{A \rightarrow B} + S_{B \rightarrow A}}$$
This mathematically penalizes asymmetric matches where candidate A loves candidate B, but candidate B would not consider candidate A.

---

## 🤖 AI Features (Powered by Google Gemini 3.0 Flash)

> **Why Google Gemini over OpenAI?**  
> OpenAI's API requires an active paid credit card and balance, creating friction for reviewers, teachers, and developers testing this repository. **Google Gemini API (`gemini-3.0-flash`)** provides a free developer tier with generous rate limits.  
> **Safety Guarantee**: If `GEMINI_API_KEY` is blank or the network is offline, the platform automatically runs built-in deterministic mathematical fallbacks so the application **never crashes**.

### 4 Core AI Capabilities:

1. **AI Optimize Profile Picker (Gemini 3.0 Flash)**:  
   Click the **"AI Optimize Profile Picker"** button in the recommendations workspace. Gemini evaluates the candidate pool to select the single maximum compatible profile, presenting:
   - **4 Strategic Synergy Pillars**: Why these profiles align in daily life.
   - **Matchmaker Opening Pitch**: A natural conversational pitch the matchmaker can speak directly to the client.
   - **Comparative Edge**: Exactly why this candidate outranks the runner-ups.
2. **Contextual Match Explanations**:  
   Translates raw mathematical percentage scores into concise, executive briefings for the matchmaker.
3. **Personalized Presentation Letters**:  
   Drafts formal, respectful matrimonial presentation emails for clients, pre-filled with candidate background highlights.
4. **Qualitative Fit Reasoning**:  
   Evaluates subtle interpersonal dynamics such as lifestyle pace, cultural resonance, and career trajectories.

---

## 📁 Project Directory Structure

```
tdc-matchmaker/
├── app/                              # Next.js 16 App Router
│   ├── api/                          # Server-side REST API Routes
│   │   ├── auth/                     # Login, register, logout, session
│   │   ├── customers/                # Client CRUD, notes, recommendations
│   │   ├── recommendations/          # AI reasoning, AI intro, AI optimal picker
│   │   ├── matches/                  # Proposal dispatch & tracking
│   │   └── follow-ups/               # Tasks & reminders
│   ├── customers/                    # Client directory & detailed dossiers
│   ├── recommendations/              # Decision engine & AI Optimal Picker
│   ├── sent-matches/                 # Dispatched match outbox
│   ├── follow-ups/                   # Follow-up consultation scheduler
│   ├── activity-log/                 # Chronological audit trail
│   ├── login/                        # Split-screen editorial authentication
│   └── globals.css                   # Editorial design tokens & animations
├── components/                       # Reusable React 19 UI Components
│   ├── AppShell.tsx                  # Global responsive layout wrapper
│   ├── Sidebar.tsx                   # Persistent desktop navigation & mobile drawer
│   ├── AIOptimalPickerModal.tsx      # Gemini 3.0 Flash Optimal Profile Spotlight
│   ├── SendMatchModal.tsx            # Portal-mounted match dispatch modal
│   ├── CompareProfilesModal.tsx      # Portal-mounted side-by-side comparison modal
│   └── AddCustomerModal.tsx          # Portal-mounted client intake modal
├── lib/                              # Core Business Logic & Services
│   ├── matching/                     # Pure TypeScript Matching Engine
│   │   ├── eligibility.ts            # Phase A: Hard constraint evaluation
│   │   ├── scoring.ts                # Phase B: 6-dimension scoring formulas
│   │   ├── explanations.ts           # Grounded factor derivation
│   │   └── config.ts                 # Weight configuration & thresholds
│   ├── services/                     # Application services
│   │   ├── ai.service.ts             # Google Gemini 3.0 Flash & fallback engine
│   │   ├── customer.service.ts       # Database operations for clients
│   │   └── matching.service.ts       # Service orchestration for recommendations
│   ├── auth.ts                       # Stateless HMAC session cookies (jose)
│   ├── db.ts                         # Prisma client instance
│   └── utils.ts                      # Helpers (calculateAge, formatHeight, currency)
├── prisma/
│   ├── schema.prisma                 # SQLite development schema
│   ├── schema.postgresql.prisma      # PostgreSQL cloud schema (Vercel/Neon)
│   └── seed.ts                       # Generates 125 realistic Indian profiles
├── docs/                             # Technical Architecture Documentation
│   ├── product-research.md           # Domain research on matrimonial platforms
│   ├── matching-algorithm.md         # Detailed math, formulas, and weights
│   └── ai-integration.md             # Gemini architecture & privacy safeguards
├── public/                           # Static assets, hero images, and branding
├── .env.example                      # Template environment variables
└── README.md                         # You are here!
```

---

## 🧪 Running Automated Tests

Run the Vitest test suite to verify eligibility logic, scoring mathematics, age calculations, and AI fallback behavior:

```bash
npm run test
```

### Test Suite Summary:
- `lib/matching/__tests__/matching.test.ts` (Phase A eligibility, dealbreakers, reciprocal scoring, demo presets)
- `lib/__tests__/services.test.ts` (Dynamic age calculations, currency formatting, AI fallback reliability)
- **Status: 10 / 10 tests passing (100%)**

---

## ❓ Frequently Asked Questions (FAQ) & Troubleshooting

### Q1: What if port 3000 is already in use?
If another program is running on port 3000, Next.js will automatically launch on port 3001. Open **[http://localhost:3001](http://localhost:3001)** instead!

### Q2: Do I need a paid API key to run the app?
**No!** You can leave `GEMINI_API_KEY=""` empty. The app includes a built-in deterministic mathematical engine that generates match explanations, recommendation letters, and fit reasoning automatically. If you want live AI, you can get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/).

### Q3: How do I reset or re-seed the sample data?
If you add or delete test profiles and want to restore the original 125 profiles, simply run:
```bash
npm run seed
```

### Q4: Why are client ages calculated dynamically?
In professional matchmaking, client ages must never go out of date. TDC calculates client age in real time from their `dateOfBirth` on every render, ensuring 100% accuracy year after year.

---

## 🌐 Production Deployment (Vercel & PostgreSQL)

The project is ready for one-click deployment to **Vercel** with hosted PostgreSQL (Neon, Supabase, or AWS RDS):

1. **Switch Prisma Schema**:  
   Update `prisma/schema.prisma` provider to `postgresql`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. **Add Environment Variables in Vercel Dashboard**:
   - `DATABASE_URL`: `postgresql://user:password@host:5432/dbname?sslmode=require`
   - `JWT_SECRET`: Random 32+ character string
   - `GEMINI_API_KEY`: Your Google Gemini API Key (optional)
   - `GEMINI_MODEL`: `gemini-3.0-flash`
3. **Deploy & Push Database**:
   ```bash
   npx prisma db push
   npm run seed
   ```

---

## 📚 Technical Documentation Index

For deeper architectural and domain deep-dives, consult the technical documents in `/docs`:
- [`docs/product-research.md`](./docs/product-research.md) — Research synthesis comparing Shaadi.com, BharatMatrimony, and Hinge workflows and domain decisions.
- [`docs/matching-algorithm.md`](./docs/matching-algorithm.md) — Comprehensive technical documentation of Phase A–E matching formulas, weights, dealbreakers, and reciprocal calculations.
- [`docs/ai-integration.md`](./docs/ai-integration.md) — Architectural overview of Google Gemini 3.0 Flash integration, data privacy safeguards, and deterministic fallback mechanics.

---

Crafted with precision for relationship architects and professional matchmakers.
