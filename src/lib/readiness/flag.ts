/**
 * BLOYI Readiness — feature flag guard.
 * Set ENABLE_READINESS=false to fully disable the module (UI returns 404, APIs reject).
 */
export const READINESS_ENABLED =
  (process.env.ENABLE_READINESS ?? "true").toLowerCase() !== "false";
