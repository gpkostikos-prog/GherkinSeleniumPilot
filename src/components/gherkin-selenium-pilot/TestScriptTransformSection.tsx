
// src/components/gherkin-selenium-pilot/TestScriptTransformSection.tsx
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "./SubmitButton";
import { Button } from "@/components/ui/button";
import { Workflow, FileText, AlertTriangle, Upload, WandSparkles, Info, Braces, FileCode, Code2 } from "lucide-react";
import type { ConvertGherkinToTestScriptState } from "@/app/(actions)/gherkinActions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface TestScriptTransformSectionProps {
  formAction: (payload: FormData) => void;
  gherkinInput: string;
  onGherkinInputChange: (text: string) => void;
  onGherkinFileLoad: (event: React.ChangeEvent<HTMLInputElement>) => void;
  htmlContext: string;
  onHtmlContextChange: (text: string) => void;
  onHtmlFileLoad: (event: React.ChangeEvent<HTMLInputElement>) => void;
  codeSnippets: string;
  onCodeSnippetsChange: (text: string) => void;
  onCodeSnippetsFileLoad: (event: React.ChangeEvent<HTMLInputElement>) => void;
  snippetLanguage: string;
  onSnippetLanguageChange: (lang: string) => void;
  supportedSnippetLanguages: Array<{ value: string; label: string }>;
  formState: ConvertGherkinToTestScriptState;
  isSubmitting: boolean;
  generatedScript: string;
}

export function TestScriptTransformSection({
  formAction,
  gherkinInput,
  onGherkinInputChange,
  onGherkinFileLoad,
  htmlContext,
  onHtmlContextChange,
  onHtmlFileLoad,
  codeSnippets,
  onCodeSnippetsChange,
  onCodeSnippetsFileLoad,
  snippetLanguage,
  onSnippetLanguageChange,
  supportedSnippetLanguages,
  formState,
  isSubmitting,
  generatedScript,
}: TestScriptTransformSectionProps) {
  const gherkinFileInputRef = React.useRef<HTMLInputElement>(null);
  const htmlFileInputRef = React.useRef<HTMLInputElement>(null);
  const codeSnippetsFileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Workflow className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">Gherkin to Test Script</CardTitle>
        </div>
        <CardDescription>
          Paste your Gherkin test cases or upload a .feature file. Optionally provide HTML context or code snippets. The AI will convert them into a generic, human-readable automation script format.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          {/* Gherkin Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="gherkin-input-test-script" className="text-lg font-semibold flex items-center gap-1">
                <FileText className="h-5 w-5 text-primary" />
                Gherkin Test Cases
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => gherkinFileInputRef.current?.click()}
                className="ml-2"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload .feature File
              </Button>
              <input
                type="file"
                ref={gherkinFileInputRef}
                onChange={onGherkinFileLoad}
                style={{ display: 'none' }}
                accept=".feature,text/*"
                name="gherkinFile"
              />
            </div>
            <Textarea
              id="gherkin-input-test-script"
              name="gherkinInput"
              placeholder="Feature: User Login..."
              value={gherkinInput}
              onChange={(e) => onGherkinInputChange(e.target.value)}
              className={cn(
                "min-h-[150px] font-mono text-sm border-2 focus:border-primary focus:ring-primary whitespace-pre resize",
                {"border-destructive": formState?.fieldErrors?.gherkinInput}
              )}
              aria-label="Gherkin test cases input for test script conversion"
              required
            />
            {formState?.fieldErrors?.gherkinInput && (
               <Alert variant="destructive" className="mt-1 py-2 px-3 text-xs">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {formState.fieldErrors.gherkinInput.join(", ")}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* HTML Context */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                <Label htmlFor="html-context-test-script" className="text-lg font-semibold flex items-center gap-1">
                  <Braces className="h-5 w-5 text-primary" />
                  HTML Context (Optional)
                </Label>
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger type="button" aria-label="HTML Context Information for Test Script">
                      <Info className="h-4 w-4 text-muted-foreground hover:text-primary" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs p-2 text-sm bg-popover text-popover-foreground shadow-md rounded-md">
                      <p>Paste relevant HTML snippets or upload an HTML/XML file. This can help the AI understand UI structure for more accurate command generation.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => htmlFileInputRef.current?.click()}
                className="ml-2"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </Button>
              <input
                type="file"
                ref={htmlFileInputRef}
                onChange={onHtmlFileLoad}
                style={{ display: 'none' }}
                accept="text/*,.html,.xml,.xhtml"
                name="htmlContextFile"
              />
            </div>
            <Textarea
              id="html-context-test-script"
              name="htmlContext"
              placeholder="<html>...</html> (Helps AI understand UI structure for script commands)"
              value={htmlContext}
              onChange={(e) => onHtmlContextChange(e.target.value)}
              className="min-h-[100px] font-mono text-sm border-2 focus:border-primary focus:ring-primary whitespace-pre resize"
              aria-label="HTML context input for test script conversion"
            />
            {formState?.fieldErrors?.htmlContext && (
               <Alert variant="destructive" className="mt-1 py-2 px-3 text-xs">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {formState.fieldErrors.htmlContext.join(", ")}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Code Snippets */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-x-6 gap-y-2 mb-1">
              <div className="flex items-center gap-2 flex-shrink-0">
                 <Label htmlFor="code-snippets-test-script" className="text-lg font-semibold flex items-center gap-1">
                  <FileCode className="h-5 w-5 text-primary" />
                  Code Snippets (Optional)
                </Label>
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger type="button" aria-label="Code Snippets Information for Test Script">
                      <Info className="h-4 w-4 text-muted-foreground hover:text-primary" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs p-2 text-sm bg-popover text-popover-foreground shadow-md rounded-md">
                      <p>Paste relevant code or upload a file. This gives AI context about custom actions or application logic that might influence command generation.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                 <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => codeSnippetsFileInputRef.current?.click()}
                  className="ml-auto sm:ml-2"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload File
                </Button>
                 <input
                  type="file"
                  ref={codeSnippetsFileInputRef}
                  onChange={onCodeSnippetsFileLoad}
                  style={{ display: 'none' }}
                  accept="text/*,.cs,.java,.py,.js,.ts,.json,.xml,.rb,.php,.go,.swift,.kt,.pl,.sh,.bat,.txt"
                  name="codeSnippetsFile"
                />
              </div>
              <div className="relative z-10 flex items-center gap-2 w-full sm:w-auto sm:justify-end">
                <Label htmlFor="snippet-language-test-script" className="text-base font-semibold flex items-center gap-1 whitespace-nowrap">
                  <Code2 className="h-5 w-5 text-primary" />
                  Input Language
                </Label>
                <div className="sm:min-w-[200px] w-full flex-grow sm:flex-grow-0">
                  <Select name="snippetLanguage" value={snippetLanguage} onValueChange={onSnippetLanguageChange}>
                    <SelectTrigger
                      id="snippet-language-test-script"
                      aria-label="Snippet Input Language for Test Script"
                      className={cn(
                        "w-full border-2 focus:border-primary focus:ring-primary",
                        {"border-destructive": formState?.fieldErrors?.snippetLanguage}
                      )}
                    >
                      <SelectValue placeholder="Select input language..." />
                    </SelectTrigger>
                    <SelectContent>
                      {supportedSnippetLanguages.map(lang => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formState?.fieldErrors?.snippetLanguage && (
                     <Alert variant="destructive" className="mt-1 py-2 px-3 text-xs">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        {formState.fieldErrors.snippetLanguage.join(", ")}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </div>
            <Textarea
              id="code-snippets-test-script"
              name="codeSnippets"
              placeholder="public class CustomAction { ... } // (Helps AI understand custom logic for script commands)"
              value={codeSnippets}
              onChange={(e) => onCodeSnippetsChange(e.target.value)}
              className="min-h-[100px] font-mono text-sm border-2 focus:border-primary focus:ring-primary whitespace-pre resize"
              aria-label="Code snippets input for test script conversion"
            />
            {formState?.fieldErrors?.codeSnippets && (
               <Alert variant="destructive" className="mt-1 py-2 px-3 text-xs">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {formState.fieldErrors.codeSnippets.join(", ")}
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <SubmitButton
            loading={isSubmitting}
            loadingText="Generating Test Script..."
            className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <WandSparkles className="mr-2 h-5 w-5" />
            Convert to Test Script
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
              <AlertTitle>Test Script Conversion Error</AlertTitle>
              <AlertDescription>{String(formState.error)}</AlertDescription>
            </Alert>
          )}
        </form>

        {generatedScript && !isSubmitting && (
          <div className="mt-6 space-y-2">
            <Label htmlFor="test-script-output" className="text-lg font-semibold flex items-center gap-1">
              <FileText className="h-5 w-5 text-accent" />
              Generated Test Script
            </Label>
            <Textarea
              id="test-script-output"
              value={generatedScript}
              readOnly
              className="min-h-[150px] text-sm bg-muted/30 border-2 whitespace-pre-wrap resize font-mono"
              aria-label="Generated test script"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
