import { z } from "zod";
import OpenAI from "openai";
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

export type ExplanationResult = {
  isAIGenerated: boolean;
  explanation: string;
  keyHighlights: string[];
};

export type IntroductionResult = {
  isAIGenerated: boolean;
  subject: string;
  messageBody: string;
};

/**
 * Server-side AI service wrapper with robust deterministic fallback and zero PII leaks.
 */
export class AIService {
  private static getClient(): OpenAI | null {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey.trim() === "" || apiKey === "your-openai-api-key") {
      return null;
    }
    return new OpenAI({ apiKey });
  }

  /**
   * Generates a grounded match explanation.
   * If OpenAI is unavailable, returns a structured deterministic explanation.
   */
  static async generateMatchExplanation(
    customer: CustomerData,
    candidate: CustomerData,
    compatibility: RecommendationExplanation
  ): Promise<ExplanationResult> {
    const client = this.getClient();

    if (!client) {
      return this.fallbackMatchExplanation(customer, candidate, compatibility);
    }

    try {
      const custAge = calculateAge(customer.dateOfBirth);
      const candAge = calculateAge(candidate.dateOfBirth);

      // Sanitize input: Minimized permitted attributes only, strictly no contact details
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
1. Rely ONLY on the provided verified facts.
2. Never invent traits, personal finances, or claims not present in the payload.
3. Keep the tone balanced, respectful, and operational.
4. Output valid JSON in the form: {"explanation": "...", "keyHighlights": ["...", "..."]}`;

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: JSON.stringify(promptPayload) },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        return this.fallbackMatchExplanation(customer, candidate, compatibility);
      }

      const parsed = JSON.parse(content);
      const validated = ExplanationResponseSchema.parse(parsed);

      return {
        isAIGenerated: true,
        explanation: validated.explanation,
        keyHighlights: validated.keyHighlights,
      };
    } catch {
      // Deterministic fallback on timeout, rate limit, or format error
      return this.fallbackMatchExplanation(customer, candidate, compatibility);
    }
  }

  /**
   * Generates a respectful introduction message draft for the matchmaker to present to the client.
   */
  static async generateIntroductionDraft(
    customer: CustomerData,
    candidate: CustomerData,
    compatibility: RecommendationExplanation
  ): Promise<IntroductionResult> {
    const client = this.getClient();

    if (!client) {
      return this.fallbackIntroductionDraft(customer, candidate, compatibility);
    }

    try {
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
      };

      const systemPrompt = `You are writing a professional, personalized introduction note from a matchmaker to their client (${customer.firstName}).
Introduce candidate ${candidate.firstName} respectfully.
Highlight shared values and career background concisely.
Never mention caste, sensitive private financial details, or external contact numbers.
Output JSON format: {"subject": "...", "messageBody": "..."}`;

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: JSON.stringify(promptPayload) },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        return this.fallbackIntroductionDraft(customer, candidate, compatibility);
      }

      const parsed = JSON.parse(content);
      const validated = IntroductionResponseSchema.parse(parsed);

      return {
        isAIGenerated: true,
        subject: validated.subject,
        messageBody: validated.messageBody,
      };
    } catch {
      return this.fallbackIntroductionDraft(customer, candidate, compatibility);
    }
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
        ? `Both are established in ${customer.city}.`
        : `Candidate is based in ${candidate.city} while ${customer.firstName} is in ${customer.city}.`;

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
      `\nOverall compatibility is rated at ${compatibility.compatibilityScore}% (${compatibility.tier.replace("_", " ")}).\n\n` +
      `Please review this profile and let me know your thoughts so we can coordinate next steps.\n\n` +
      `Warm regards,\n` +
      `Your TDC Matchmaker`;

    return {
      isAIGenerated: false,
      subject,
      messageBody,
    };
  }
}
