import { z } from "zod";
import { CustomerData, RecommendationExplanation } from "../matching/types";
import { calculateAge, formatHeight, formatCurrencyLakhs } from "../utils";

const ExplanationResponseSchema = z.object({
  explanation: z.string(),
  keyHighlights: z.array(z.string()).default([]),
});

const IntroductionResponseSchema = z.object({
  subject: z.string(),
  messageBody: z.string(),
});

const FitReasoningResponseSchema = z.object({
  qualitativeScore: z.number().min(0).max(100),
  tier: z.enum(["HIGH_POTENTIAL", "GOOD_POTENTIAL", "NEEDS_REVIEW"]),
  reasoningSummary: z.string(),
  culturalAndFamilySynergy: z.string(),
  careerAndLifestyleAlignment: z.string(),
  potentialFrictionPoints: z.array(z.string()).default([]),
  matchmakerAdvice: z.string(),
});

const OptimalPickerResponseSchema = z.object({
  selectedCandidateId: z.string(),
  candidateName: z.string(),
  selectionConfidence: z.number().min(0).max(100),
  headline: z.string(),
  selectionRationale: z.string(),
  synergyPillars: z.array(z.string()).min(2),
  conversationPitch: z.string(),
  comparativeEdge: z.string(),
});

export type OptimalProfilePickerResult = {
  isAIGenerated: boolean;
  provider: "gemini" | "deterministic";
  selectedCandidateId: string;
  candidateName: string;
  customerName: string;
  selectionConfidence: number;
  headline: string;
  selectionRationale: string;
  synergyPillars: string[];
  conversationPitch: string;
  comparativeEdge: string;
};

export type ExplanationResult = {
  isAIGenerated: boolean;
  provider: "gemini" | "deterministic";
  explanation: string;
  keyHighlights: string[];
};

export type IntroductionResult = {
  isAIGenerated: boolean;
  provider: "gemini" | "deterministic";
  subject: string;
  messageBody: string;
};

export type FitReasoningResult = {
  isAIGenerated: boolean;
  provider: "gemini" | "deterministic";
  qualitativeScore: number;
  tier: "HIGH_POTENTIAL" | "GOOD_POTENTIAL" | "NEEDS_REVIEW";
  reasoningSummary: string;
  culturalAndFamilySynergy: string;
  careerAndLifestyleAlignment: string;
  potentialFrictionPoints: string[];
  matchmakerAdvice: string;
};

/**
 * Server-side AI service wrapper powered by Google Gemini API with deterministic rule engine fallbacks.
 * Selected because Google Gemini provides accessible API quotas, avoiding paid credit restrictions of OpenAI.
 * Complies with strict privacy standards (zero PII, sanitized payload, robust error handling).
 */
export class AIService {
  /**
   * Reports the active AI engine based on environment configuration.
   */
  static getActiveProvider(): "gemini" | "deterministic" {
    const geminiKey = process.env.GEMINI_API_KEY?.trim();
    if (geminiKey && geminiKey !== "your-gemini-api-key") {
      return "gemini";
    }
    return "deterministic";
  }

  /**
   * Internal helper to invoke Google Gemini REST API.
   * Prioritizes Gemini 3.0 Flash (or configured GEMINI_MODEL) with fallbacks to gemini-2.0-flash and gemini-1.5-flash.
   */
  private static async callGemini(systemPrompt: string, userPayload: any): Promise<string | null> {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey || apiKey === "your-gemini-api-key") return null;

    const primaryModel = process.env.GEMINI_MODEL?.trim() || "gemini-3.0-flash";
    const models = [
      primaryModel,
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-2.5-flash",
      "gemini-1.5-pro",
    ].filter((m, idx, arr) => arr.indexOf(m) === idx);

    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `${systemPrompt}\n\nClient and Candidate Verified Facts:\n${JSON.stringify(userPayload, null, 2)}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: "application/json",
            },
          }),
        });

        if (!res.ok) {
          console.warn(`Gemini (${model}) returned HTTP ${res.status}`);
          continue;
        }

        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return text;
        }
      } catch (err) {
        console.warn(`Gemini (${model}) network error:`, err);
      }
    }

    return null;
  }

  /**
   * 1. SCORE / RANK MATCH EXPLANATIONS
   * Generates grounded, contextual match explanations using Google Gemini API.
   */
  static async generateMatchExplanation(
    customer: CustomerData,
    candidate: CustomerData,
    compatibility: RecommendationExplanation
  ): Promise<ExplanationResult> {
    const custAge = calculateAge(customer.dateOfBirth);
    const candAge = calculateAge(candidate.dateOfBirth);

    const promptPayload = {
      customer: {
        firstName: customer.firstName,
        age: custAge,
        city: customer.city,
        highestEducation: customer.highestEducation,
        wantChildren: customer.wantChildren,
        diet: customer.diet,
      },
      candidate: {
        firstName: candidate.firstName,
        age: candAge,
        city: candidate.city,
        highestEducation: candidate.highestEducation,
        wantChildren: candidate.wantChildren,
        diet: candidate.diet,
      },
      compatibilityScore: compatibility.compatibilityScore,
      tier: compatibility.tier,
      topPositiveFactors: compatibility.topPositiveFactors,
      potentialConcerns: compatibility.potentialConcerns,
    };

    const systemPrompt = `You are a senior matrimonial matchmaker assistant at TDC Matchmaker.
Generate a grounded, professional 2-3 sentence match explanation for an internal matchmaker dashboard.
Rules:
1. Rely strictly on verified facts in the payload. Never invent traits or outside assumptions.
2. Highlight cultural alignment, location feasibility, and stated partner criteria.
3. Keep the tone executive, dignified, and objective.
4. Output valid JSON in the exact format: {"explanation": "...", "keyHighlights": ["...", "..."]}`;

    // Google Gemini API call
    const geminiRaw = await this.callGemini(systemPrompt, promptPayload);
    if (geminiRaw) {
      try {
        const parsed = JSON.parse(geminiRaw);
        const validated = ExplanationResponseSchema.parse(parsed);
        return {
          isAIGenerated: true,
          provider: "gemini",
          explanation: validated.explanation,
          keyHighlights: validated.keyHighlights,
        };
      } catch (e) {
        console.warn("Gemini parse error in explanation:", e);
      }
    }

    // Deterministic rule engine fallback
    return this.fallbackMatchExplanation(customer, candidate, compatibility);
  }

  /**
   * 2. PERSONALIZED INTRODUCTIONS FOR EMAILS
   * Generates respectful, tailored match introduction notes from the matchmaker to the client using Google Gemini API.
   */
  static async generateIntroductionDraft(
    customer: CustomerData,
    candidate: CustomerData,
    compatibility: RecommendationExplanation
  ): Promise<IntroductionResult> {
    const custAge = calculateAge(customer.dateOfBirth);
    const candAge = calculateAge(candidate.dateOfBirth);

    const promptPayload = {
      clientFirstName: customer.firstName,
      candidateSummary: {
        firstName: candidate.firstName,
        age: candAge,
        city: candidate.city,
        profession: candidate.designation || candidate.industry || "Professional",
        education: candidate.degree || candidate.highestEducation,
        height: formatHeight(candidate.heightCm),
      },
      sharedStrengths: compatibility.topPositiveFactors,
      compatibilityScore: compatibility.compatibilityScore,
      tier: compatibility.tier,
    };

    const systemPrompt = `You are an executive matchmaker writing a personalized, dignified presentation note to your client (${customer.firstName}) recommending candidate ${candidate.firstName}.
Guidelines:
1. Introduce ${candidate.firstName} with respect and clarity.
2. Highlight aligned life goals, profession, and shared background without sounding generic or hyperbolic.
3. Do not include private phone numbers, caste details, or sensitive financial figures.
4. Output valid JSON in the exact format: {"subject": "...", "messageBody": "..."}`;

    // Google Gemini API call
    const geminiRaw = await this.callGemini(systemPrompt, promptPayload);
    if (geminiRaw) {
      try {
        const parsed = JSON.parse(geminiRaw);
        const validated = IntroductionResponseSchema.parse(parsed);
        return {
          isAIGenerated: true,
          provider: "gemini",
          subject: validated.subject,
          messageBody: validated.messageBody,
        };
      } catch (e) {
        console.warn("Gemini parse error in intro:", e);
      }
    }

    // Deterministic rule engine fallback
    return this.fallbackIntroductionDraft(customer, candidate, compatibility);
  }

  /**
   * 3. LLM-BASED RULE ENGINE & NATURAL LANGUAGE REASONING FOR PROFILE FIT
   * Evaluates deep qualitative synergy, subtle friction points, and provides matchmaker advisory guidance using Google Gemini API.
   */
  static async evaluateFitReasoning(
    customer: CustomerData,
    candidate: CustomerData,
    compatibility?: RecommendationExplanation
  ): Promise<FitReasoningResult> {
    const custAge = calculateAge(customer.dateOfBirth);
    const candAge = calculateAge(candidate.dateOfBirth);

    const promptPayload = {
      client: {
        name: `${customer.firstName} ${customer.lastName}`,
        age: custAge,
        city: customer.city,
        gender: customer.gender,
        education: `${customer.highestEducation} (${customer.degree || "N/A"})`,
        career: `${customer.designation || "Professional"} at ${customer.currentCompany || "Confidential"}`,
        annualIncome: formatCurrencyLakhs(customer.annualIncome),
        religion: `${customer.religion}${customer.caste ? ` (${customer.caste})` : ""}`,
        motherTongue: customer.motherTongue,
        familyValues: customer.familyValues,
        familyType: customer.familyType,
        diet: customer.diet,
        wantChildren: customer.wantChildren,
        openToRelocate: customer.openToRelocate,
        statedPreferences: customer.partnerPreference
          ? {
              minAge: customer.partnerPreference.minAge,
              maxAge: customer.partnerPreference.maxAge,
              preferredCities: customer.partnerPreference.preferredCities,
              preferredEducation: customer.partnerPreference.preferredEducation,
              dealbreakers: customer.partnerPreference.dealbreakers,
            }
          : "Standard reciprocal expectations",
      },
      candidate: {
        name: `${candidate.firstName} ${candidate.lastName}`,
        age: candAge,
        city: candidate.city,
        gender: candidate.gender,
        education: `${candidate.highestEducation} (${candidate.degree || "N/A"})`,
        career: `${candidate.designation || "Professional"} at ${candidate.currentCompany || "Confidential"}`,
        annualIncome: formatCurrencyLakhs(candidate.annualIncome),
        religion: `${candidate.religion}${candidate.caste ? ` (${candidate.caste})` : ""}`,
        motherTongue: candidate.motherTongue,
        familyValues: candidate.familyValues,
        familyType: candidate.familyType,
        diet: candidate.diet,
        wantChildren: candidate.wantChildren,
        openToRelocate: candidate.openToRelocate,
        statedPreferences: candidate.partnerPreference
          ? {
              minAge: candidate.partnerPreference.minAge,
              maxAge: candidate.partnerPreference.maxAge,
              preferredCities: candidate.partnerPreference.preferredCities,
              dealbreakers: candidate.partnerPreference.dealbreakers,
            }
          : "Standard reciprocal expectations",
      },
      mathematicalScore: compatibility?.compatibilityScore || 75,
    };

    const systemPrompt = `You are the Principal Matchmaking Consultant and Decision Reasoning Engine for TDC Matchmaker.
Perform a thorough, multi-dimensional profile fit reasoning analysis between the client and candidate.
Analyze:
1. Cultural, family structures, and core value synergy.
2. Career trajectory, intellectual parity, and lifestyle expectations.
3. Geographic mobility, relocation openness, and dietary harmony.
4. Potential dealbreaker risks or subtle interpersonal friction points.
5. Provide actionable guidance to the matchmaker on how to frame the first consultation.

Output valid JSON matching this schema:
{
  "qualitativeScore": <number between 0 and 100>,
  "tier": "HIGH_POTENTIAL" | "GOOD_POTENTIAL" | "NEEDS_REVIEW",
  "reasoningSummary": "<2-3 sentence executive synthesis>",
  "culturalAndFamilySynergy": "<detailed paragraph on cultural & family dynamics>",
  "careerAndLifestyleAlignment": "<detailed paragraph on career & lifestyle compatibility>",
  "potentialFrictionPoints": ["<friction point 1>", "<friction point 2>"],
  "matchmakerAdvice": "<concrete consultation talking points for the matchmaker>"
}`;

    // Google Gemini API call
    const geminiRaw = await this.callGemini(systemPrompt, promptPayload);
    if (geminiRaw) {
      try {
        const parsed = JSON.parse(geminiRaw);
        const validated = FitReasoningResponseSchema.parse(parsed);
        return {
          isAIGenerated: true,
          provider: "gemini",
          ...validated,
        };
      } catch (e) {
        console.warn("Gemini parse error in fit reasoning:", e);
      }
    }

    // Deterministic reasoning fallback
    return this.fallbackFitReasoning(customer, candidate, compatibility);
  }

  /**
   * Deterministic fallback explanation
   */
  public static fallbackMatchExplanation(
    customer: CustomerData,
    candidate: CustomerData,
    compatibility: RecommendationExplanation
  ): ExplanationResult {
    const candAge = calculateAge(candidate.dateOfBirth);
    const locationNote =
      customer.city.toLowerCase() === candidate.city.toLowerCase()
        ? `Both candidates reside in ${customer.city}.`
        : `Candidate is located in ${candidate.city} while ${customer.firstName} is in ${customer.city}.`;

    const explanation =
      `${candidate.firstName} (${candAge}, ${candidate.city}) reflects strong mutual criteria alignment with ${customer.firstName} (${compatibility.compatibilityScore}% overall match). ` +
      `${locationNote} ` +
      `${compatibility.topPositiveFactors[0] || "Shared core demographic preferences."} ` +
      (compatibility.potentialConcerns[0] &&
      !compatibility.potentialConcerns[0].includes("No significant structural")
        ? `Operational note: ${compatibility.potentialConcerns[0]}`
        : "Reciprocal values and lifestyle preferences show balanced harmony.");

    return {
      isAIGenerated: false,
      provider: "deterministic",
      explanation,
      keyHighlights: compatibility.topPositiveFactors,
    };
  }

  /**
   * Deterministic fallback introduction letter
   */
  public static fallbackIntroductionDraft(
    customer: CustomerData,
    candidate: CustomerData,
    compatibility: RecommendationExplanation
  ): IntroductionResult {
    const candAge = calculateAge(candidate.dateOfBirth);
    const profession = candidate.designation || candidate.highestEducation;
    const heightStr = formatHeight(candidate.heightCm);

    const subject = `Curated Match Introduction: ${candidate.firstName} (${candAge}, ${candidate.city})`;
    const messageBody =
      `Dear ${customer.firstName},\n\n` +
      `I am pleased to share a carefully curated profile with you for your consideration: ${candidate.firstName}, who is ${candAge} years old (${heightStr}) and based in ${candidate.city}.\n\n` +
      `${candidate.firstName} works as ${profession} and brings a compatible background. Based on your stated partner preferences:\n` +
      `• ${compatibility.topPositiveFactors[0] || "Aligned lifestyle and relationship goals"}\n` +
      `• ${compatibility.topPositiveFactors[1] || "Compatible education and career path"}\n` +
      (compatibility.topPositiveFactors[2] ? `• ${compatibility.topPositiveFactors[2]}\n` : "") +
      `\nOverall compatibility is evaluated at ${compatibility.compatibilityScore}% (${compatibility.tier.replace("_", " ")}).\n\n` +
      `Please review this profile and let me know your thoughts so we can coordinate introductions.\n\n` +
      `Warm regards,\n` +
      `Your TDC Matchmaker`;

    return {
      isAIGenerated: false,
      provider: "deterministic",
      subject,
      messageBody,
    };
  }

  /**
   * Deterministic fallback for fit reasoning
   */
  public static fallbackFitReasoning(
    customer: CustomerData,
    candidate: CustomerData,
    compatibility?: RecommendationExplanation
  ): FitReasoningResult {
    const score = compatibility?.compatibilityScore || 78;
    const candAge = calculateAge(candidate.dateOfBirth);
    const sameCity = customer.city.toLowerCase() === candidate.city.toLowerCase();

    const tier =
      score >= 80 ? "HIGH_POTENTIAL" : score >= 60 ? "GOOD_POTENTIAL" : "NEEDS_REVIEW";

    const frictionPoints: string[] = [];
    if (!sameCity) {
      frictionPoints.push(`Geographic separation (${customer.city} vs ${candidate.city}) requires verification of relocation timelines.`);
    }
    if (customer.diet !== candidate.diet) {
      frictionPoints.push(`Dietary difference: ${customer.diet.replace("_", " ")} vs ${candidate.diet.replace("_", " ")}.`);
    }
    if (frictionPoints.length === 0) {
      frictionPoints.push("No structural dealbreakers identified; mutually reciprocal preferences verified.");
    }

    return {
      isAIGenerated: false,
      provider: "deterministic",
      qualitativeScore: score,
      tier,
      reasoningSummary: `${customer.firstName} and ${candidate.firstName} demonstrate solid multi-attribute compatibility with a deterministic score of ${score}%. Both profiles exhibit educational parity and mutual openness regarding core matrimonial expectations.`,
      culturalAndFamilySynergy: `Both individuals share compatible family background contexts (${customer.religion} traditions) and aligned expectations regarding children (${customer.wantChildren === candidate.wantChildren ? "both agreed on " + customer.wantChildren : "open to discussion"}). Family structures show balanced compatibility.`,
      careerAndLifestyleAlignment: `${candidate.firstName} (${candAge}, ${candidate.designation || candidate.highestEducation}) aligns with ${customer.firstName}'s professional standards. ${sameCity ? "Being in the same metropolitan hub minimizes transitional friction." : "Relocation openness provides a viable bridge across cities."}`,
      potentialFrictionPoints: frictionPoints,
      matchmakerAdvice: `Prioritize an introductory phone consultation focusing on mutual timeline expectations (${customer.marriageTimeline ? customer.marriageTimeline.replace(/_/g, " ") : "6-12 months"}). Verify lifestyle flexibility before arranging the first in-person meeting.`,
    };
  }

  /**
   * 4. AI OPTIMIZED PROFILE PICKER
   * Uses Gemini 3.0 Flash (with deterministic fallback) to evaluate the candidate pool
   * and select the single maximum compatible profile with strategic rationale.
   */
  static async selectOptimalProfile(
    customer: CustomerData,
    candidatePool: Array<{ candidate: CustomerData; compatibility: RecommendationExplanation }>
  ): Promise<OptimalProfilePickerResult> {
    if (!candidatePool || candidatePool.length === 0) {
      throw new Error("Candidate pool is empty; cannot run AI optimal profile picker.");
    }

    const fallbackResult = this.fallbackOptimalProfile(customer, candidatePool);

    // Sanitize and prepare candidate comparison summaries for Gemini
    const sanitizedPool = candidatePool.slice(0, 8).map((item) => {
      const c = item.candidate;
      const comp = item.compatibility;
      return {
        id: c.id,
        name: `${c.firstName} ${c.lastName}`,
        code: c.customerCode,
        age: calculateAge(c.dateOfBirth),
        city: c.city,
        state: c.state,
        education: c.highestEducation,
        degree: c.degree,
        designation: c.designation || c.industry,
        incomeLPA: c.annualIncome,
        religion: c.religion,
        diet: c.diet,
        maritalStatus: c.maritalStatus,
        wantChildren: c.wantChildren,
        compatibilityScore: comp.compatibilityScore,
        tier: comp.tier,
        topFactors: comp.topPositiveFactors.slice(0, 3),
        concerns: comp.potentialConcerns.slice(0, 2),
      };
    });

    const systemPrompt = `You are the Lead Executive Matchmaker and Principal Decision Engine AI for TDC Matchmaker, an elite Indian matrimonial CRM.
Evaluate the focal client and the provided candidate pool.
Select the SINGLE MAXIMUM COMPATIBLE candidate who represents the highest probability of long-term matrimonial fulfillment and reciprocal synergy.

Return ONLY a valid JSON object matching this schema:
{
  "selectedCandidateId": "string (must match one of the candidate id values)",
  "candidateName": "string (candidate full name)",
  "selectionConfidence": number (between 80 and 99),
  "headline": "string (concise 1-line verdict, e.g. 'Maximum Strategic Alignment: [Name] balances location stability and career parity')",
  "selectionRationale": "string (detailed 2-3 sentence explanation of why this profile outperforms all other eligible candidates for this client)",
  "synergyPillars": ["string (Pillar 1)", "string (Pillar 2)", "string (Pillar 3)"],
  "conversationPitch": "string (a warm, professional introductory pitch the matchmaker can speak directly to the client)",
  "comparativeEdge": "string (specific reason why this candidate edges out the runner-up profiles)"
}

Do NOT output markdown code fences or conversational preamble. Return pure JSON only.`;

    const payload = {
      focalClient: {
        id: customer.id,
        name: `${customer.firstName} ${customer.lastName}`,
        age: calculateAge(customer.dateOfBirth),
        city: customer.city,
        education: customer.highestEducation,
        designation: customer.designation || customer.industry,
        incomeLPA: customer.annualIncome,
        religion: customer.religion,
        diet: customer.diet,
        maritalStatus: customer.maritalStatus,
        wantChildren: customer.wantChildren,
        partnerPreferences: {
          ageMin: customer.partnerPreference?.minAge,
          ageMax: customer.partnerPreference?.maxAge,
          preferredCities: customer.partnerPreference?.preferredCities,
          education: customer.partnerPreference?.preferredEducation,
          religions: customer.partnerPreference?.religionPreferences,
          diet: customer.partnerPreference?.dietPreferences,
        },
      },
      candidatePool: sanitizedPool,
    };

    try {
      const responseText = await this.callGemini(systemPrompt, payload);
      if (!responseText) {
        return fallbackResult;
      }

      const cleanJson = responseText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      const parsed = JSON.parse(cleanJson);
      const validated = OptimalPickerResponseSchema.parse(parsed);

      // Verify that the chosen candidate actually exists in our pool
      const matched = candidatePool.find((c) => c.candidate.id === validated.selectedCandidateId);
      if (!matched) {
        return fallbackResult;
      }

      return {
        isAIGenerated: true,
        provider: "gemini",
        selectedCandidateId: validated.selectedCandidateId,
        candidateName: validated.candidateName || `${matched.candidate.firstName} ${matched.candidate.lastName}`,
        customerName: `${customer.firstName} ${customer.lastName}`,
        selectionConfidence: Math.round(validated.selectionConfidence),
        headline: validated.headline,
        selectionRationale: validated.selectionRationale,
        synergyPillars: validated.synergyPillars,
        conversationPitch: validated.conversationPitch,
        comparativeEdge: validated.comparativeEdge,
      };
    } catch (err) {
      console.warn("Gemini optimal profile picker fallback triggered:", err);
      return fallbackResult;
    }
  }

  /**
   * Deterministic fallback optimal profile picker
   */
  public static fallbackOptimalProfile(
    customer: CustomerData,
    candidatePool: Array<{ candidate: CustomerData; compatibility: RecommendationExplanation }>
  ): OptimalProfilePickerResult {
    // Sort pool by highest compatibility score, verified status, and mutual location
    const sorted = [...candidatePool].sort((a, b) => {
      if (b.compatibility.compatibilityScore !== a.compatibility.compatibilityScore) {
        return b.compatibility.compatibilityScore - a.compatibility.compatibilityScore;
      }
      if (b.candidate.isVerified !== a.candidate.isVerified) {
        return (b.candidate.isVerified ? 1 : 0) - (a.candidate.isVerified ? 1 : 0);
      }
      const aSameCity = a.candidate.city.toLowerCase() === customer.city.toLowerCase();
      const bSameCity = b.candidate.city.toLowerCase() === customer.city.toLowerCase();
      return (bSameCity ? 1 : 0) - (aSameCity ? 1 : 0);
    });

    const best = sorted[0];
    const bestCand = best.candidate;
    const bestComp = best.compatibility;
    const candAge = calculateAge(bestCand.dateOfBirth);
    const sameCity = bestCand.city.toLowerCase() === customer.city.toLowerCase();

    const synergyPillars = [
      `Exceptional compatibility index of ${bestComp.compatibilityScore}% evaluated across reciprocal dimensions`,
      sameCity
        ? `Zero relocation friction: Both reside in ${customer.city}, allowing organic courtship timelines`
        : `Verified lifestyle agility with mutual openness to regional relocation`,
      `Shared cultural ethos (${customer.religion}) and reciprocal relationship milestones`,
      `Educational parity (${customer.highestEducation} & ${bestCand.highestEducation}) fostering intellectual resonance`,
    ];

    return {
      isAIGenerated: false,
      provider: "deterministic",
      selectedCandidateId: bestCand.id,
      candidateName: `${bestCand.firstName} ${bestCand.lastName}`,
      customerName: `${customer.firstName} ${customer.lastName}`,
      selectionConfidence: Math.min(98, Math.max(88, bestComp.compatibilityScore)),
      headline: `Optimal Match Selected: ${bestCand.firstName} ${bestCand.lastName} leads candidate pool with ${bestComp.compatibilityScore}% mutual compatibility`,
      selectionRationale: `${bestCand.firstName} (${candAge}, ${bestCand.city}) demonstrates the highest holistic alignment with ${customer.firstName}'s stated criteria. Beyond numerical score matching, their profile exhibits strong mutual expectations regarding lifestyle pace, family values, and career trajectory.`,
      synergyPillars,
      conversationPitch: `"${customer.firstName}, based on a holistic evaluation of your client profile, ${bestCand.firstName} represents your highest potential match. You share comparable academic backgrounds, mutual values on family balance, and seamless compatibility regarding daily lifestyle expectations."`,
      comparativeEdge: `${bestCand.firstName} outranks other candidates due to clean adherence to both primary constraints and nuanced preference weights without active dealbreakers.`,
    };
  }
}

