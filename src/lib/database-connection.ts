import { Buffer } from "node:buffer";
import type { PoolConfig } from "pg";

const POSTGRES_PROTOCOLS = new Set(["postgres:", "postgresql:"]);
const ENCRYPTED_SSL_MODES = new Set(["require", "verify-ca", "verify-full"]);
const INSECURE_SSL_MODES = new Set(["disable", "allow", "prefer"]);
const SSL_QUERY_PARAMETERS = [
  "sslmode",
  "sslcert",
  "sslkey",
  "sslrootcert",
  "uselibpqcompat",
];

function isLocalDatabaseHost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
}

function parseDatabaseUrl(value: string | undefined, variableName: string) {
  if (!value) throw new Error(`${variableName} is required`);

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${variableName} must be a valid PostgreSQL URL`);
  }

  if (!POSTGRES_PROTOCOLS.has(url.protocol)) {
    throw new Error(`${variableName} must use the postgres or postgresql protocol`);
  }
  return url;
}

export function requireEncryptedDatabaseUrl(
  value: string | undefined,
  variableName = "DATABASE_URL",
) {
  const url = parseDatabaseUrl(value, variableName);
  if (isLocalDatabaseHost(url.hostname)) return url.toString();

  const sslMode = url.searchParams.get("sslmode")?.toLocaleLowerCase("en-US");
  if (sslMode && INSECURE_SSL_MODES.has(sslMode)) {
    throw new Error(`${variableName} explicitly enables an insecure SSL mode`);
  }
  if (sslMode && !ENCRYPTED_SSL_MODES.has(sslMode)) {
    throw new Error(`${variableName} contains an unsupported SSL mode`);
  }
  if (!sslMode) url.searchParams.set("sslmode", "require");

  return url.toString();
}

function decodeCertificate(encodedCertificate: string) {
  const certificate = Buffer.from(encodedCertificate, "base64").toString("utf8").trim();
  if (
    !certificate.startsWith("-----BEGIN CERTIFICATE-----") ||
    !certificate.endsWith("-----END CERTIFICATE-----")
  ) {
    throw new Error("DATABASE_SSL_CA_BASE64 must contain a base64-encoded PEM certificate");
  }
  return certificate;
}

export function createDatabasePoolConfig(
  value: string | undefined,
  variableName = "DATABASE_URL",
  encodedCaCertificate = process.env.DATABASE_SSL_CA_BASE64,
): PoolConfig {
  const encryptedUrl = requireEncryptedDatabaseUrl(value, variableName);
  const url = new URL(encryptedUrl);
  const sslMode = url.searchParams.get("sslmode")?.toLocaleLowerCase("en-US");

  if (!encodedCaCertificate && (sslMode === "verify-ca" || sslMode === "verify-full")) {
    return { connectionString: encryptedUrl };
  }

  if (!encodedCaCertificate) {
    // pg v8 historically aliases `require` to certificate verification. The
    // compatibility flag opts into standard libpq semantics: encryption is
    // mandatory, while CA verification is enabled separately below when the
    // project certificate is available.
    url.searchParams.set("sslmode", "require");
    url.searchParams.set("uselibpqcompat", "true");
    return { connectionString: url.toString() };
  }

  // node-postgres replaces an explicit `ssl` object when SSL parameters are
  // also present in the connection string. Remove them so the pinned CA and
  // certificate verification below cannot be silently disabled.
  for (const parameter of SSL_QUERY_PARAMETERS) url.searchParams.delete(parameter);

  return {
    connectionString: url.toString(),
    ssl: {
      ca: decodeCertificate(encodedCaCertificate),
      rejectUnauthorized: true,
    },
  };
}
