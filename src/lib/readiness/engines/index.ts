/** Engine registry. */
import type { EngineAdapter } from "./types";
import { scaNpmAudit } from "./sca-npm-audit";
import { secretsRegex } from "./secrets-regex";
import { headersCheck } from "./headers-check";
import { tlsCheck } from "./tls-check";
import { privacyPolicyLint } from "./privacy-policy-lint";
import { ledgerIntegrity } from "./ledger-integrity";
import { allMocks } from "./mocks";

const REAL: EngineAdapter[] = [scaNpmAudit, secretsRegex, headersCheck, tlsCheck, privacyPolicyLint, ledgerIntegrity];

export const ENGINES: Record<string, EngineAdapter> = Object.fromEntries(
  [...REAL, ...allMocks].map((e) => [e.id, e])
);

export function getEngine(id: string): EngineAdapter | undefined {
  return ENGINES[id];
}
