
// src/app/(actions)/gherkinActions.ts
"use server";

import { convertManualToGherkin, type ConvertManualToGherkinInput } from "@/ai/flows/convert-manual-to-gherkin";
import { convertGherkinToTestScript, type ConvertGherkinToTestScriptInput } from "@/ai/flows/convert-gherkin-to-test-script";
import { z } from "zod";

function handleApiError(error: unknown): string {
  let errorMessage = "An unknown error occurred.";
  if (error instanceof Error) {
    errorMessage = error.message;
    if (errorMessage.includes("503") && (errorMessage.includes("Service Unavailable") || errorMessage.includes("model is overloaded"))) {
      return "The AI model is temporarily overloaded. Please try again in a few moments.";
    }
  }
  return errorMessage;
}

// Schema for converting manual test cases to Gherkin
const convertManualSchema = z.object({
  manualTestCases: z.string().min(1, "Manual test cases input cannot be empty."),
  featureName: z.string().optional(),
});

export interface ConvertManualToGherkinState {
  message: string;
  data?: string; // Will hold the generatedGherkin
  error?: string | string[];
  fieldErrors?: {
    manualTestCases?: string[];
    featureName?: string[];
  }
}

export async function convertManualToGherkinAction(
  prevState: ConvertManualToGherkinState,
  formData: FormData
): Promise<ConvertManualToGherkinState> {
  try {
    const rawManualTestCases = formData.get("manualTestCases");
    const rawFeatureName = formData.get("featureName");

    const validation = convertManualSchema.safeParse({
      manualTestCases: rawManualTestCases,
      featureName: rawFeatureName,
    });

    if (!validation.success) {
      return {
        message: "Validation failed.",
        error: validation.error.flatten().formErrors.join(', ') || "Please correct the highlighted fields.",
        fieldErrors: validation.error.flatten().fieldErrors,
      };
    }

    const input: ConvertManualToGherkinInput = {
      manualTestCases: validation.data.manualTestCases,
      featureName: validation.data.featureName,
    };
    const result = await convertManualToGherkin(input);
    return {
      message: "Success",
      data: result.generatedGherkin,
    };
  } catch (error) {
    console.error("Error converting manual tests to Gherkin:", error);
    const errorMessage = handleApiError(error);
    return { message: "Error converting to Gherkin.", error: errorMessage };
  }
}


// Schema for converting Gherkin to a test script
const convertGherkinToTestScriptSchema = z.object({
  gherkinInput: z.string().min(1, "Gherkin input cannot be empty."),
  htmlContext: z.string().optional(),
  codeSnippets: z.string().optional(),
  snippetLanguage: z.string().optional(), // Optional because codeSnippets itself is optional
});

export interface ConvertGherkinToTestScriptState {
  message: string;
  data?: string; // Will hold the test script
  error?: string | string[];
  fieldErrors?: {
    gherkinInput?: string[];
    htmlContext?: string[];
    codeSnippets?: string[];
    snippetLanguage?: string[];
  }
}

export async function convertGherkinToTestScriptAction(
  prevState: ConvertGherkinToTestScriptState,
  formData: FormData
): Promise<ConvertGherkinToTestScriptState> {
  try {
    const rawGherkinInput = formData.get("gherkinInput");
    const rawHtmlContext = formData.get("htmlContext");
    const rawCodeSnippets = formData.get("codeSnippets");
    const rawSnippetLanguage = formData.get("snippetLanguage");

    const validation = convertGherkinToTestScriptSchema.safeParse({
      gherkinInput: rawGherkinInput,
      htmlContext: rawHtmlContext,
      codeSnippets: rawCodeSnippets,
      snippetLanguage: rawSnippetLanguage,
    });

    if (!validation.success) {
      return {
        message: "Validation failed.",
        error: validation.error.flatten().formErrors.join(', ') || "Please correct the highlighted fields.",
        fieldErrors: validation.error.flatten().fieldErrors,
      };
    }

    const input: ConvertGherkinToTestScriptInput = {
      gherkinInput: validation.data.gherkinInput,
      htmlContext: validation.data.htmlContext,
      codeSnippets: validation.data.codeSnippets,
      snippetLanguage: validation.data.snippetLanguage,
    };
    const result = await convertGherkinToTestScript(input);
    return {
      message: "Success",
      data: result.testScript,
    };
  } catch (error) {
    console.error("Error converting Gherkin to test script:", error);
    const errorMessage = handleApiError(error);
    return { message: "Error generating test script.", error: errorMessage };
  }
}
