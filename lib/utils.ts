import { clsx, type ClassValue } from "clsx"
import * as ts from "typescript";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



function transpileTS(tsCode: string) {
  const result = ts.transpileModule(tsCode, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2015,
      jsx: ts.JsxEmit.React,
    },
  });
  return result.outputText;
}

// Usage
export function tsToJs(tsCode: string) {
  const jsCode = transpileTS(tsCode);
  return jsCode;
}