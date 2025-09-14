// src/components/gherkin-selenium-pilot/PageClient.tsx
"use client";

import * as React from "react";
import { useActionState } from "react";
import { 
  convertManualToGherkinAction, type ConvertManualToGherkinState,
  convertGherkinToTestScriptAction, type ConvertGherkinToTestScriptState
} from "@/app/(actions)/gherkinActions";
import { useToast } from "@/hooks/use-toast";
import { ManualConversionSection } from "./ManualConversionSection";
import { TestScriptTransformSection } from "./TestScriptTransformSection";
import { PrivacyInfoFooterSection } from "./PrivacyInfoFooterSection";
import { Separator } from "@/components/ui/separator";
import Link from 'next/link';

const initialConversionState: ConvertManualToGherkinState = {
  message: "",
  fieldErrors: {},
};

const initialTestScriptTransformState: ConvertGherkinToTestScriptState = {
  message: "",
  fieldErrors: {},
};

const sharedSupportedLanguages = [
  { value: "C#", label: "C#" },
  { value: "Java", label: "Java" },
  { value: "Python", label: "Python" },
  { value: "JavaScript", label: "JavaScript" },
  { value: "TypeScript", label: "TypeScript" },
  { value: "HTML/XML", label: "HTML/XML" },
  { value: "JSON", label: "JSON" },
  { value: "Other", label: "Other/Text" },
];


export default function PageClient() {
  // State for Manual to Gherkin conversion
  const [manualTestInput, setManualTestInput] = React.useState("");
  const [manualFeatureName, setManualFeatureName] = React.useState("");
  const [manualToGherkinState, manualToServerFormAction, isConvertingManual] = useActionState(
    convertManualToGherkinAction,
    initialConversionState
  );

  // State for Gherkin to Test Script Transform
  const [scriptTransformGherkinInput, setScriptTransformGherkinInput] = React.useState("");
  const [scriptTransformHtmlContext, setScriptTransformHtmlContext] = React.useState("");
  const [scriptTransformCodeSnippets, setScriptTransformCodeSnippets] = React.useState("");
  const [scriptTransformSnippetLanguage, setScriptTransformSnippetLanguage] = React.useState<string>("Other");
  const [generatedTestScript, setGeneratedTestScript] = React.useState("");
  const [testScriptTransformState, testScriptTransformServerFormAction, isTransformingToTestScript] = useActionState(
    convertGherkinToTestScriptAction,
    initialTestScriptTransformState
  );

  const [footerYear, setFooterYear] = React.useState<number | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    setFooterYear(new Date().getFullYear());
  }, []);

  // Effect for Manual to Gherkin conversion results
  React.useEffect(() => {
    if (isConvertingManual) return;
    if (manualToGherkinState.message === "Success" && manualToGherkinState.data) {
      setScriptTransformGherkinInput(manualToGherkinState.data); // Populate Gherkin input for script transform
      toast({
        title: "Gherkin Generated!",
        description: "Manual test cases converted to Gherkin successfully. Review and proceed.",
        variant: "default",
      });
    } else if (manualToGherkinState.message !== "" && manualToGherkinState.message !== "Success" && manualToGherkinState.error) {
       toast({
        title: "Gherkin Conversion Error",
        description: String(manualToGherkinState.error) || "Failed to convert manual tests to Gherkin.",
        variant: "destructive",
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manualToGherkinState, isConvertingManual, toast]);

  // Effect for Gherkin to Test Script Transform results
  React.useEffect(() => {
    if (isTransformingToTestScript) return;
    if (testScriptTransformState.message === "Success" && testScriptTransformState.data) {
      setGeneratedTestScript(testScriptTransformState.data);
      toast({
        title: "Test Script Generated!",
        description: "Gherkin converted to test script successfully.",
        variant: "default",
      });
    } else if (testScriptTransformState.message !== "" && testScriptTransformState.message !== "Success" && testScriptTransformState.error) {
       toast({
        title: "Test Script Error",
        description: String(testScriptTransformState.error) || "Failed to generate test script.",
        variant: "destructive",
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testScriptTransformState, isTransformingToTestScript, toast]);

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: (content: string) => void
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          setter(content);
          toast({
            title: "File Loaded",
            description: `Successfully loaded content from ${file.name}.`,
          });
        } catch (readError) {
           toast({
            title: "File Read Error",
            description: `Could not read content from ${file.name}.`,
            variant: "destructive",
          });
        }
      };
      reader.onerror = () => {
        toast({
          title: "File Read Error",
          description: `Error reading file ${file.name}.`,
          variant: "destructive",
        });
      };
      reader.readAsText(file);
      if(event.target) { 
        event.target.value = '';
      }
    }
  };


  return (
    <>
      <main className="flex-grow container mx-auto p-4 md:p-6 space-y-8">
        <ManualConversionSection
          formAction={manualToServerFormAction}
          manualTestInput={manualTestInput}
          onManualTestInputChange={setManualTestInput}
          manualFeatureName={manualFeatureName}
          onManualFeatureNameChange={setManualFeatureName}
          formState={manualToGherkinState}
          isSubmitting={isConvertingManual}
          onFileLoad={(event) => handleFileUpload(event, setManualTestInput)}
        />

        <Separator />

        <TestScriptTransformSection
          formAction={testScriptTransformServerFormAction}
          gherkinInput={scriptTransformGherkinInput}
          onGherkinInputChange={setScriptTransformGherkinInput}
          onGherkinFileLoad={(event) => handleFileUpload(event, setScriptTransformGherkinInput)}
          htmlContext={scriptTransformHtmlContext}
          onHtmlContextChange={setScriptTransformHtmlContext}
          onHtmlFileLoad={(event) => handleFileUpload(event, setScriptTransformHtmlContext)}
          codeSnippets={scriptTransformCodeSnippets}
          onCodeSnippetsChange={setScriptTransformCodeSnippets}
          onCodeSnippetsFileLoad={(event) => handleFileUpload(event, setScriptTransformCodeSnippets)}
          snippetLanguage={scriptTransformSnippetLanguage}
          onSnippetLanguageChange={setScriptTransformSnippetLanguage}
          supportedSnippetLanguages={sharedSupportedLanguages}
          formState={testScriptTransformState}
          isSubmitting={isTransformingToTestScript}
          generatedScript={generatedTestScript}
        />
      </main>
      <footer className="bg-card border-t">
        <PrivacyInfoFooterSection />
        <div className="py-4 text-center text-sm text-muted-foreground border-t">
          {footerYear !== null ? (
            <>
              © {footerYear}{' '}
              <Link
                href="https://studio--gherkin-selenium-pilot.us-central1.hosted.app"
                className="underline hover:text-primary transition-colors"
              >
                Proteus
              </Link>
              . All rights reserved.
            </>
          ) : (
            'Loading year...'
          )}
        </div>
      </footer>
    </>
  );
}
