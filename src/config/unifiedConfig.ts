import "server-only";

import { validateSessionSecret } from "@/lib/session-secret";

export const config = {
  security: {
    auth: {
      session: {
        secret: validateSessionSecret(process.env.SESSION_SECRET),
        issuer: "jembara",
        audience: "jembara:web",
      },
      rateLimit: {
        loginByIp: {
          limit: 30,
          windowMs: 15 * 60 * 1000,
        },
        loginByIdentity: {
          limit: 5,
          windowMs: 15 * 60 * 1000,
        },
        registerByIp: {
          limit: 5,
          windowMs: 60 * 60 * 1000,
        },
      },
    },
  },
} as const;
