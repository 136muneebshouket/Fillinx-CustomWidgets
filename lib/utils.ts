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

export function jsToJson(jsCode: string) {
  try {
    const cleaned = jsCode
      // remove variable declaration
      .replace(/^(const|let|var)\s+[a-zA-Z0-9_$]+\s*=\s*/, "")
      // remove trailing semicolon + whitespace
      .replace(/;\s*$/, "");
      // console.log(cleaned)
    const evalForm = eval("(" + cleaned + ")");
    // console.log(evalForm)
    return JSON.stringify(evalForm);
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
