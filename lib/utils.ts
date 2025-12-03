import { clsx, type ClassValue } from "clsx";
import * as ts from "typescript";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function transpileTS(tsCode: string) {
  const result = ts.transpileModule(tsCode, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2015,
      jsx: ts.JsxEmit.React,
      removeComments: true,
    },
  });
  return result.outputText;
}

function extractFirstVariableValue(code: string) {
  // Match: let/const/var variableName = <value>;
  const match = code.match(/(let|const|var)\s+(\w+)\s*=\s*([^;]+);/);

  if (!match) return null;

  const varName = match[2];
  const varValueCode = match[3];

  // Safely evaluate the value only
  const value = Function(`"use strict"; return (${varValueCode});`)();

  return { name: varName, value };
}

export function jsToJson(jsCode: string) {
  try {
    // console.log(jsCode);
    // var translationsData;
    // translationsData is now a pure JS object

    // const cleaned = jsCode
    //   // remove variable declaration
    //   .replace(/^(const|let|var)\s+[a-zA-Z0-9_$]+\s*=\s*/, "")
    //   // remove trailing semicolon + whitespace
    //   .replace(/;\s*$/, "");
    const cleaned = extractFirstVariableValue(jsCode);
    // console.log(cleaned);
    // const evalForm = eval("(" + cleaned + ")");
    // console.log(evalForm)
    return JSON.stringify(cleaned?.value);
  } catch (error: any) {
    throw new Error("Error converting js to json" + error?.message);
  }
}
// Usage
export function tsToJs(tsCode: string, toJson: boolean = false) {
  const jsCode = transpileTS(tsCode);
  if (toJson) {
    const JSONdata = jsToJson(jsCode);
    return JSONdata;
  } else {
    return jsCode;
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}
