# AI Integration Architecture & Reliability Safeguards

**Service Module**: `lib/services/ai.service.ts`  
**Primary Engine**: **Google Gemini API** (`gemini-1.5-flash`, `gemini-2.0-flash`, `gemini-1.5-pro`) via `GEMINI_API_KEY`  
**Zero-Dependency Fallback**: **Deterministic Mathematical Rule Engine** (activated automatically when key is omitted or offline)  
**Primary Role**: Operational productivity enhancement, natural language fit reasoning, and communication drafting; **zero authority over hard dealbreakers or legal constraints**.

> **Design Decision: Why Google Gemini was chosen over OpenAI**  
> OpenAI's API requires an active paid credit balance and billing account, creating friction for testing, peer evaluation, and demonstration. Google Gemini API (`gemini-1.5-flash`) offers a developer tier with generous rate limits, allowing immediate out-of-the-box AI evaluation without mandatory billing hurdles.

---

## 1. Where AI is Used in TDC Matchmaker
AI is deployed strictly in bounded human-in-the-loop operational touchpoints:
1. **Score/Rank Explanations**: Synthesizing the deterministic 6-component breakdown into succinct, executive 2–3 sentence briefings with key highlights.
2. **Personalized Introductions for Email**: Drafting respectful, tailored presentation letters from matchmakers to clients about recommended candidates.
3. **LLM-Based Rule Engine & Natural Language Fit Reasoning**: Evaluating deep qualitative synergy, cultural and family value alignment, career and intellectual parity, and identifying subtle interpersonal friction points with matchmaker consultation guidance.

---

## 2. Why Deterministic Scoring Remains Authoritative
Large Language Models are probabilistic and prone to hallucination, sycophancy, and inconsistency. Matrimonial decisions involve legal, cultural, and deeply personal boundaries.
- **Scoring Authority**: All compatibility calculations (0–100%) and hard constraint filtering are executed by **pure TypeScript business logic** (`lib/matching/*`).
- **No Hallucinated Factors**: The AI is forbidden from generating, altering, or weighting match scores. It only receives already-calculated mathematical facts.

---

## 3. Privacy Safeguards & Data Minimization
Matrimonial profiles contain sensitive personally identifiable information (PII). TDC enforces strict sanitization before sending any payload to external LLM providers:

| Data Type | Sent to AI? | Justification / Handling |
| :--- | :---: | :--- |
| **Phone Number & Email** | ❌ **Strictly Redacted** | PII leak prevention; LLM does not need contact vectors |
| **Full Last Name** | ❌ **Omitted** | First name only is used in drafts |
| **Caste / Community** | ❌ **Excluded** | Sensitive cultural attribute protected against bias |
| **Exact Financial Details** | ❌ **Excluded** | General career field and education tier used instead |
| **Age & City** | ✅ **Passed** | Necessary for context |
| **Verified Positive Factors** | ✅ **Passed** | Derived from the deterministic matching engine |

---

## 4. Schema Validation & Reliability
LLM responses are validated via **Zod schemas** at runtime:

```typescript
const ExplanationResponseSchema = z.object({
  explanation: z.string(),
  keyHighlights: z.array(z.string()).default([]),
});

const IntroductionResponseSchema = z.object({
  subject: z.string(),
  messageBody: z.string(),
});
```

If the LLM returns invalid JSON or schema violations, execution safely catches the error and invokes the deterministic fallback pipeline.

---

## 5. Deterministic Fallback Pipeline
The application never crashes or disables user workflows if the Gemini API key is unset, rate-limited, timed out, or unavailable.

1. **Missing Key**: If `GEMINI_API_KEY` is not present in `.env`, the service immediately routes to `fallbackMatchExplanation()`, `fallbackIntroductionDraft()`, and `fallbackFitReasoning()`.
2. **Network / Rate-Limit Failure**: Any promise rejection or non-200 HTTP response in the Gemini fetch calls triggers the fallback, returning a pre-templated, grounded response.
3. **Editable Human-in-the-Loop**: All generated drafts are presented inside an editable modal, ensuring matchmakers maintain full editorial control before an introduction is recorded or sent.

