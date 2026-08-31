import "dotenv/config";

import { Pool } from "pg";
import { createDatabasePoolConfig } from "../src/lib/database-connection";

const ROLE_NAME_PATTERN = /^[a-z][a-z0-9_]{2,62}$/;
const MINIMUM_RUNTIME_PASSWORD_BYTES = 24;

function requiredEnvironmentValue(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} wajib tersedia.`);
  return value;
}

function quoteIdentifier(value: string) {
  if (!ROLE_NAME_PATTERN.test(value)) throw new Error("DATABASE_RUNTIME_ROLE tidak valid.");
  return `"${value}"`;
}

function quoteLiteral(value: string) {
  return `'${value.replaceAll("'", "''")}'`;
}

const runtimeRole = requiredEnvironmentValue("DATABASE_RUNTIME_ROLE");
const runtimePassword = requiredEnvironmentValue("DATABASE_RUNTIME_PASSWORD");
const rotateExistingPassword = process.env.DATABASE_RUNTIME_ROTATE_PASSWORD === "true";
if (Buffer.byteLength(runtimePassword, "utf8") < MINIMUM_RUNTIME_PASSWORD_BYTES) {
  throw new Error("DATABASE_RUNTIME_PASSWORD minimal 24 byte.");
}

const pool = new Pool(
  createDatabasePoolConfig(process.env.DIRECT_URL, "DIRECT_URL"),
);

async function main() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const existingRole = await client.query<{
      rolname: string;
      rolsuper: boolean;
      rolcreatedb: boolean;
      rolcreaterole: boolean;
      rolreplication: boolean;
      rolbypassrls: boolean;
      rolcanlogin: boolean;
      rolinherit: boolean;
    }>(
      `SELECT rolname, rolsuper, rolcreatedb, rolcreaterole, rolreplication,
              rolbypassrls, rolcanlogin, rolinherit
       FROM pg_roles WHERE rolname = $1`,
      [runtimeRole],
    );
    const roleIdentifier = quoteIdentifier(runtimeRole);
    const currentRole = existingRole.rows[0];
    if (!currentRole) {
      await client.query(
        `CREATE ROLE ${roleIdentifier} LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS PASSWORD ${quoteLiteral(runtimePassword)}`,
      );
    } else {
      if (
        currentRole.rolsuper ||
        currentRole.rolcreatedb ||
        currentRole.rolcreaterole ||
        currentRole.rolreplication ||
        currentRole.rolbypassrls ||
        !currentRole.rolcanlogin ||
        !currentRole.rolinherit
      ) {
        throw new Error(
          "Role runtime yang sudah ada memiliki atribut tidak aman; periksa secara manual.",
        );
      }
      if (rotateExistingPassword) {
        await client.query(
          `ALTER ROLE ${roleIdentifier} PASSWORD ${quoteLiteral(runtimePassword)}`,
        );
      }
    }
    await client.query(`GRANT jembara_app TO ${roleIdentifier}`);
    await client.query("COMMIT");
    console.info("Role database runtime berhasil diprovisikan tanpa hak administratif.");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

main()
  .catch((error: unknown) => {
    console.error("Provisioning role runtime gagal:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
