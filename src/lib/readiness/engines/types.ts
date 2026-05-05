/**
 * BLOYI Readiness — engine adapter contract.
 */
import type { EngineFinding } from "../store";

export interface EngineContext {
  accountId: string;
  sectionId: string;
  itemId: string;
  input: Record<string, unknown>;
}

export interface EngineResult {
  status: "pass" | "warn" | "fail" | "error";
  score: number; // 0..100
  findings: EngineFinding[];
  inputSummary: string;
}

export interface EngineAdapter {
  id: string;
  label: string;
  kind: "real" | "mock";
  inputSchema: { fields: EngineField[] };
  description: string;
  run: (ctx: EngineContext) => Promise<EngineResult>;
}

export interface EngineField {
  name: string;
  label: string;
  kind: "text" | "textarea" | "url";
  placeholder?: string;
  required?: boolean;
}

export function fid(id: string): string {
  return `f_${id}_${Math.random().toString(36).slice(2, 8)}`;
}
