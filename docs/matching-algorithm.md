# TDC Matchmaker Deterministic Matching Algorithm Documentation

**Algorithm Version**: `v1.2.0`  
**Engine Architecture**: Pure TypeScript business logic, zero external AI dependencies for scoring.

---

## 1. Architectural Philosophy
In professional matrimonial matchmaking, recommendations must be **authoritative, explainable, and accountable**. A matchmaker presenting a profile to an eligible client or family must be able to justify *why* two individuals are compatible without relying on nondeterministic black-box algorithms or AI hallucinations.

The TDC Matchmaker engine operates in a strict multi-phase pipeline:
1. **Phase A**: Candidate Eligibility & Hard Dealbreaker Enforcement
2. **Phase B**: Multi-Dimensional Normalized Component Scoring (0–100)
3. **Phase C**: Assignment-Specific Gender Demo Presets
4. **Phase D**: Two-Way Reciprocal Compatibility Calculation
5. **Phase E**: Structured Recommendation Explanations & Tiers

---

## 2. Phase A: Eligibility Rules & Hard Dealbreakers

Before calculating any compatibility score, candidates are filtered through strict eligibility gates:
1. **Self-Exclusion**: A customer cannot be matched with themselves.
2. **Archived / Inactive Status**: Inactive or archived profiles are excluded.
3. **Gender Eligibility**: In the standard binary demo configuration, matches require complementary genders (Male $\leftrightarrow$ Female).
4. **Identity Verification**: Matchmakers can optionally enforce that only verified profiles enter active recommendation queues.
5. **Deduplication**: Candidates previously recommended or in active match workflows are filtered out.
6. **Prior Dismissal / Rejection**: Candidates marked as rejected or dismissed for this customer are excluded.
7. **Explicit Hard Constraints (Dealbreakers)**:
   - **Age Window**: If `AGE` is marked as a dealbreaker, candidates outside $[minAge, maxAge]$ are excluded.
   - **Marital Status**: If `MARITAL_STATUS` is marked as a dealbreaker, candidates whose status is not in the allowed list are excluded.
   - **Location**: If `LOCATION` is marked as a dealbreaker, candidates residing outside specified cities are excluded.
   - **Children**: If `CHILDREN` is marked as a dealbreaker, irreconcilable conflicts (e.g. `YES` vs `NO`) immediately disqualify the candidate.
   - **Dietary Code**: If `DIET` is a dealbreaker, incompatible diets (e.g., strictly Jain vs Non-Vegetarian) disqualify the candidate.

---

## 3. Phase B & C: Compatibility Scoring & Weights

Each eligible candidate receives a normalized score between **0 and 100** across six distinct dimensions:

| Dimension | Configured Weight | Core Evaluation Factors |
| :--- | :---: | :--- |
| **Mutual Partner Preference** | **30%** | Two-way criteria satisfaction (education, religion, professions, dietary expectations) |
| **Family Plans & Values** | **25%** | Views on children (35%), Family values alignment (25%), Family structure (20%), Marriage timeline (20%) |
| **Career & Education** | **15%** | Highest education tier synergy (40%), Industry & employment type (30%), Income proportionality (30%) |
| **Location & Relocation** | **10%** | Same city (100 pts), same state (75 pts), relocation openness synergy (80/65/50 pts) |
| **Lifestyle & Interests** | **10%** | Diet alignment (35%), Pet openness (25%), Smoking/drinking habits (20%), Shared leisure hobbies (20%) |
| **Age & Height Fit** | **10%** | Age tolerance curve (60%) and Height tolerance curve (40%) |
| **Total** | **100%** | Weighted linear combination |

### Mathematical Formula:
$$\text{Score}_{\text{weighted}} = \sum_{i=1}^{6} (S_i \times W_i)$$
Where:
- $S_i \in [0, 100]$ is the normalized component score.
- $W_i$ is the configured weight, with $\sum W_i = 1.0$.

### Missing Data Handling:
Missing attributes are treated as **Unknown / Neutral**, rather than as an automatic failure or artificial perfection. For example, when family values are not declared, a neutral score of 68/100 is assigned with a flag logged to the `missingInformation` array for matchmaker review.

---

## 4. Phase C: Assignment Gender Demo Presets

The assignment requires demonstration of gender-specific matchmaking behavior:
- **Male Customer Preset**: Demonstrates sensitivity toward age window preferences, height proportionality, and shared outlook on children.
- **Female Customer Preset**: Emphasizes educational synergy, family values alignment, relocation clarity, and reciprocal partner preference fit.

*Implementation Safeguards*:
- These adjustments are configurable demo presets rather than rigid demographic assumptions.
- Individual explicit partner preferences always override demo defaults.
- Any applied demo adjustment is explicitly tagged in `appliedDemoPresets` and visible in the match explanation breakdown.

---

## 5. Phase D: Reciprocal Compatibility

Matrimonial relationships require two-way satisfaction. The engine calculates:
1. $S_{A \rightarrow B}$: How well Candidate B satisfies Customer A's stated partner preferences.
2. $S_{B \rightarrow A}$: How well Customer A satisfies Candidate B's stated partner preferences.
3. **Mutual Preference Component ($S_{\text{mutual}}$)**:
   $$S_{\text{mutual}} = \frac{2 \times S_{A \rightarrow B} \times S_{B \rightarrow A}}{S_{A \rightarrow B} + S_{B \rightarrow A}}$$
   The harmonic mean is utilized to penalize extreme asymmetry (e.g., if A loves B (95%) but B strictly prefers someone outside A's profile (30%), the mutual fit is penalized to 45.6%, flagging an asymmetric concern to the matchmaker).

---

## 6. Phase E: Recommendation Tiers

| Score Range | Tier | Matchmaker Action |
| :--- | :--- | :--- |
| **$\ge$ 78%** | `HIGH_POTENTIAL` | Priority candidate for introduction drafting |
| **60% – 77%** | `GOOD_POTENTIAL` | Viable candidate; check minor trade-offs before presenting |
| **$<$ 60%** | `NEEDS_REVIEW` | Borderline suitability; requires client consultation |

---

## 7. Example Calculation Walkthrough

### Profiles:
- **Customer A (Rohan, 31, Mumbai)**: Masters, Tech, Veg, Wants Children, Seeks age 25–31 in Mumbai/Pune.
- **Candidate B (Ananya, 29, Mumbai)**: Masters, Finance, Veg, Wants Children, Seeks age 28–34 in Mumbai.

### Breakdown:
1. **Eligibility**: Passed (No dealbreaker violations, reciprocal cities overlap).
2. **Mutual Preference Fit**: Rohan $\rightarrow$ Ananya: 95%, Ananya $\rightarrow$ Rohan: 95% $\implies$ Harmonic Mean = **95.0** (Weight 30% $\rightarrow$ **28.5 pts**).
3. **Family Plans & Values**: Both want children (+35), Moderate values (+25), Nuclear (+20), 6–12 months timeline (+20) $\implies$ **100.0** (Weight 25% $\rightarrow$ **25.0 pts**).
4. **Career & Education**: Both Masters (+40), Corporate (+30), Income ratio 0.75 (+30) $\implies$ **100.0** (Weight 15% $\rightarrow$ **15.0 pts**).
5. **Location & Relocation**: Both in Mumbai $\implies$ **100.0** (Weight 10% $\rightarrow$ **10.0 pts**).
6. **Lifestyle & Interests**: Vegetarian (+35), Pet friendly (+25), Social drinkers (+20), Travel hobbies (+15) $\implies$ **95.0** (Weight 10% $\rightarrow$ **9.5 pts**).
7. **Age & Height**: Ananya is 29 (in 25–31 range), Height 165 cm $\implies$ **100.0** (Weight 10% $\rightarrow$ **10.0 pts**).

$$\text{Final Compatibility Score} = 28.5 + 25.0 + 15.0 + 10.0 + 9.5 + 10.0 = \mathbf{98.0\%} \quad (\text{HIGH\_POTENTIAL})$$

---

## 8. Limitations & Future Roadmap
- Geocoding distance is currently evaluated at the city and state boundary levels; future versions will support latitude/longitude geodesic distance calculations.
- Horoscope / Kundali matching is not integrated in v1.2 and can be incorporated as an optional cultural compatibility plugin.
