# Product Research & Matrimonial Domain Architecture

This document summarizes verified public product patterns from leading matrimonial and relationship platforms (**Shaadi.com**, **BharatMatrimony**, and **Hinge**) and maps them directly to the architectural decisions for **TDC Matchmaker**—an operational CRM and recommendation workspace built for professional human matchmakers.

---

## 1. Competitive Product Analysis

### A. Shaadi.com
* **Core Patterns Observed**:
  - **Structured Matrimonial Biodata**: Distinct categorization of personal facts (age, height, marital status, location), career/education (degrees, profession, income bracket), and family orientation.
  - **Hard vs. Soft Partner Preferences**: Explicit separation between strict criteria (e.g., age range, marital status, religion/community, location) and aspirational preferences.
  - **Match Discovery & Two-Way Fit**: Daily match feeds filtered by mutual suitability; compatibility percentages driven by preference intersections; "Strict Dealbreakers" that filter out non-viable candidates before ranking.
  - **Communication Workflows**: Structured introductions, express-interest states, and managed photo/contact privacy prior to explicit mutual consent.
* **Relevance to TDC Matchmaker**:
  - TDC's matching engine must separate **Phase A (Candidate Eligibility / Hard Constraints)** from **Phase B (Weighted Soft Scoring)**.
  - Profile completeness indicators and verification badges are critical for trust before a matchmaker pitches a profile.
* **Adopted vs. Deliberately Avoided**:
  - **Adopted**: Multi-dimensional biodata modeling; hard dealbreaker filtering; mutual reciprocal fit calculation.
  - **Avoided**: Algorithmic black-box percentages; gamified endless swiping; predatory upsells or artificial urgency counters.

---

### B. BharatMatrimony
* **Core Patterns Observed**:
  - **Deep Cultural & Regional Specificity**: Granular attributes for mother tongue, ancestral origin, family values (Traditional, Moderate, Liberal), family structure (Nuclear vs. Joint), and siblings' status.
  - **Family Involvement in Discovery**: Profiles are often managed or assisted by parents/relatives; detailed family backgrounds and lifestyle expectations (diet: vegetarian/eggetarian/non-veg, smoking, drinking) carry significant weight.
  - **Verified Credentialing**: Document verification (ID, education, income) to ensure high-intent, scam-free candidate pools.
* **Relevance to TDC Matchmaker**:
  - High-touch Indian matchmaking requires sensitive handling of cultural parameters.
  - Diet, family values, and relocation preferences are pivotal decision gates for clients and their families.
* **Adopted vs. Deliberately Avoided**:
  - **Adopted**: Rich family background schema (family values, type, parent occupations, siblings); diet and lifestyle preferences; explicit verification tracking and notes.
  - **Avoided**: Rigid caste-first sorting or offensive proxy inferences (e.g., guessing values or caste from names/photos); invasive or unsolicited parent-controlled overrides.

---

### C. Hinge ("Designed to be Deleted")
* **Core Patterns Observed**:
  - **Preference Transparency & Explainable Recommendations**: Showing *why* two people are suggested (e.g., "You both value family and enjoy hiking"), highlighting shared interests and dealbreakers.
  - **Prompt-Based Lifestyle & Values**: Moving beyond dry statistics into qualitative voice, humor, relationship expectations, and communication styles.
  - **Focused Interaction Limits & Follow-up**: Encouraging intentional, one-at-a-time conversation rather than overwhelming users with hundreds of low-relevance candidates.
* **Relevance to TDC Matchmaker**:
  - Matchmakers need structured talking points: Top 3 compatibility factors, potential friction points, and unknown/missing data points.
  - Highlighting mutual alignment prevents matchmaker cognitive fatigue.
* **Adopted vs. Deliberately Avoided**:
  - **Adopted**: Explainable compatibility breakdowns (positive drivers + potential friction points); qualitative lifestyle notes; high-signal, manageable recommendation feeds.
  - **Avoided**: Casual dating swipe mechanics; shallow superficial photo-first sorting; ephemeral chat without CRM follow-up tracking.

---

## 2. Synthesis: The TDC Matchmaker Domain Model

TDC Matchmaker is not an end-user dating app; it is an **enterprise operational workspace for professional matchmakers**. 

### Profile Information Architecture
1. **Factual Biodata (Immutable/Verified Facts)**:
   - Personal: Name, DOB (from which age is calculated dynamically), Gender, Height, City, Country, Marital Status.
   - Professional: Undergraduate college, highest degree, company, designation, industry, employment type, annual income.
   - Cultural/Family: Religion, Community (voluntarily supplied only), Mother tongue, Languages spoken, Family type (Nuclear/Joint), Family values, Family location, Parents' occupations, Siblings.
   - Lifestyle & Goals: Want children (Yes/No/Maybe), Relocation openness (Yes/No/Maybe), Pet openness (Yes/No/Maybe), Diet, Drinking/Smoking, Hobbies, Marriage timeline.
2. **Partner Preferences (Explicit Client Mandate)**:
   - Acceptable age & height ranges.
   - Acceptable locations (cities/regions).
   - Education & profession criteria.
   - Marital status & children preferences.
   - Non-negotiable dealbreakers vs. flexible soft preferences.
3. **Matchmaker Operations (Internal Workflow)**:
   - Verification status & internal audit notes.
   - Assigned matchmaker ID.
   - Client Journey Stage (from New Lead to Successfully Matched).
   - Chronological Activity Log (calls, notes, client interactions).
   - Follow-up tracker with due dates.

---

## 3. Matrimonial Matchmaking Principles Adopted

1. **Deterministic Scoring Over LLM Hallucinations**:
   - The core match score (0-100) and eligibility checks are computed via pure TypeScript logic with mathematical rigor.
   - LLMs are utilized solely for generating human-friendly match explanations and draft introduction letters based on verified facts.
2. **Two-Way Reciprocal Verification**:
   - A recommendation is only valid if both Customer A fits Candidate B's preferences AND Candidate B fits Customer A's preferences.
3. **Data Sensitivity & Privacy**:
   - Religion, community, and income are strictly voluntary.
   - No sensitive data is inferred or fabricated.
   - Contact details are never exposed to external models or premature candidates.
