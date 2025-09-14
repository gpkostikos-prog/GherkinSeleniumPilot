import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFileExtension(language: string): string {
  if (!language) return "txt"; // Default if language is somehow not set
  switch (language.toLowerCase()) {
    case "c#":
      return "cs";
    case "java":
      return "java";
    case "python":
      return "py";
    case "javascript":
      return "js";
    case "typescript":
      return "ts";
    case "html/xml":
      return "xml";
    case "json":
      return "json";
    case "other": // For "Other/Text"
    default:
      return "txt";
  }
}
