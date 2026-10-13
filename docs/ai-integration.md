# AI Integration Architecture & Reliability Safeguards

**Service Module**: `lib/services/ai.service.ts`  
**Model Utilized**: `gpt-4o-mini` (OpenAI Structured JSON Completion)  
**Primary Role**: Operational productivity enhancement; **zero authority over compatibility scoring or eligibility**.

---

## 1. Where AI is Used in TDC Matchmaker
AI is deployed strictly in bounded human-in-the-loop operational touchpoints:
1. **Personalized Match Explanations**: Synthesizing the deterministic 6-component breakdown into a succinct, executive 2–3 sentence briefing for the matchmaker.
2. **Introduction Message Generation**: Drafting a warm, respectful introductory letter from the matchmaker to the client about a suggested candidate.
3. *(Optional future extension)*: Summarizing meeting and follow-up notes.

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
The application never crashes or disables user workflows if the OpenAI API key is unset, rate-limited, timed out, or unavailable.

1. **Missing Key**: If `OPENAI_API_KEY` is not present in `.env`, the service immediately routes to `fallbackMatchExplanation()` and `fallbackIntroductionDraft()`.
2. **Network / Rate-Limit Failure**: Any promise rejection in the OpenAI SDK triggers the catch block, returning a pre-templated, grounded response.
3. **Editable Human-in-the-Loop**: All generated drafts are presented inside an editable modal, ensuring matchmakers maintain full editorial control before an introduction is recorded or sent.
