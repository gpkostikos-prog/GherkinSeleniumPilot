
// src/components/gherkin-selenium-pilot/ManualConversionSection.tsx
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "./SubmitButton";
import { Button } from "@/components/ui/button";
import { Wand2, FileText, Type, AlertTriangle, Upload } from "lucide-react";
import type { ConvertManualToGherkinState } from "@/app/(actions)/gherkinActions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface ManualConversionSectionProps {
  formAction: (payload: FormData) => void;
  manualTestInput: string;
  onManualTestInputChange: (text: string) => void;
  manualFeatureName: string;
  onManualFeatureNameChange: (text: string) => void;
  formState: ConvertManualToGherkinState;
  isSubmitting: boolean;
  onFileLoad: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ManualConversionSection({
  formAction,
  manualTestInput,
  onManualTestInputChange,
  manualFeatureName,
  onManualFeatureNameChange,
  formState,
  isSubmitting,
  onFileLoad,
}: ManualConversionSectionProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wand2 className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">Manual Tests to Gherkin (Optional)</CardTitle>
        </div>
        <CardDescription>
          Paste your manual test cases below, or upload a text file. The AI will attempt to convert them into Gherkin format.
          The generated Gherkin will populate the input in the section below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="manual-test-input" className="text-lg font-semibold flex items-center gap-1">
                <FileText className="h-5 w-5 text-primary" />
                Manual Test Cases
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="ml-2"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={onFileLoad}
                style={{ display: 'none' }}
                accept="text/*,.md,.feature,.txt,.doc,.docx"
              />
            </div>
            <Textarea
              id="manual-test-input"
              name="manualTestCases"
              placeholder="e.g., 1. Go to login page. 2. Enter username 'test'. 3. Enter password 'pass'. 4. Click login. 5. Verify dashboard is shown."
              value={manualTestInput}
              onChange={(e) => onManualTestInputChange(e.target.value)}
              className={cn(
                "min-h-[150px] font-mono text-sm border-2 focus:border-primary focus:ring-primary whitespace-pre resize",
                {"border-destructive": formState?.fieldErrors?.manualTestCases}
              )}
              aria-label="Manual test cases input area"
              required
            />
            {formState?.fieldErrors?.manualTestCases && (
               <Alert variant="destructive" className="mt-1 py-2 px-3 text-xs">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {formState.fieldErrors.manualTestCases.join(", ")}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="manual-feature-name" className="text-lg font-semibold flex items-center gap-1">
              <Type className="h-5 w-5 text-primary" />
              Desired Feature Name (Optional)
            </Label>
            <Input
              id="manual-feature-name"
              name="featureName"
              placeholder="e.g., User Authentication"
              value={manualFeatureName}
              onChange={(e) => onManualFeatureNameChange(e.target.value)}
              className={cn(
                "border-2 focus:border-primary focus:ring-primary",
                {"border-destructive": formState?.fieldErrors?.featureName}
              )}
              aria-label="Desired Gherkin feature name"
            />
             {formState?.fieldErrors?.featureName && (
               <Alert variant="destructive" className="mt-1 py-2 px-3 text-xs">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {formState.fieldErrors.featureName.join(", ")}
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <SubmitButton
            loading={isSubmitting}
            loadingText="Generating Gherkin..."
            className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Wand2 className="mr-2 h-5 w-5" />
            Generate Gherkin from Manual Tests
          </SubmitButton>

          {formState?.message === "Validation failed." && formState.fieldErrors && Object.keys(formState.fieldErrors).length > 0 && (
             <Alert variant="destructive" className="mt-4">
               <AlertTriangle className="h-5 w-5" />
               <AlertTitle>Validation Error</AlertTitle>
               <AlertDescription>Please correct the highlighted fields and try again.</AlertDescription>
             </Alert>
           )}
          {formState?.error && formState.message !== 'Success' && !formState.fieldErrors && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle>Gherkin Conversion Error</AlertTitle>
              <AlertDescription>{String(formState.error)}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
