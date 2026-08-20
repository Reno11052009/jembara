const MINIMUM_SESSION_SECRET_BYTES = 32;
const INSECURE_SESSION_SECRETS = new Set([
  "default_secret_key_change_this_in_production",
]);

export function validateSessionSecret(value: string | undefined): string {
  if (!value) {
    throw new Error("SESSION_SECRET is required");
  }

  if (value !== value.trim()) {
    throw new Error("SESSION_SECRET must not have leading or trailing whitespace");
  }

  if (INSECURE_SESSION_SECRETS.has(value)) {
    throw new Error("SESSION_SECRET uses a known insecure value");
  }

  const byteLength = new TextEncoder().encode(value).length;
  if (byteLength < MINIMUM_SESSION_SECRET_BYTES) {
    throw new Error(
      `SESSION_SECRET must be at least ${MINIMUM_SESSION_SECRET_BYTES} bytes`,
    );
  }

  return value;
}
