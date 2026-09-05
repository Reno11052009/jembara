import "server-only";

type Level = "info" | "warn" | "error";
const blockedKeys = /password|secret|token|authorization|cookie|rawStatus/i;
function sanitize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitize);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).filter(([key]) => !blockedKeys.test(key)).map(([key, entry]) => [key, sanitize(entry)]));
  return typeof value === "string" && value.length > 500 ? `${value.slice(0, 500)}…` : value;
}
export function serverLog(level: Level, event: string, context: Record<string, unknown> = {}) {
  const safeContext = sanitize(context) as Record<string, unknown>;
  const payload = JSON.stringify({ timestamp: new Date().toISOString(), level, event, ...safeContext });
  if (level === "error") console.error(payload); else if (level === "warn") console.warn(payload); else console.info(payload);
}
