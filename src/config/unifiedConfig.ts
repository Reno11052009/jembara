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
        loginByIpAndIdentity: {
          limit: 5,
          windowMs: 15 * 60 * 1000,
        },
        registerByIp: {
          limit: 5,
          windowMs: 60 * 60 * 1000,
        },
        passwordChangeByUser: {
          limit: 5,
          windowMs: 60 * 60 * 1000,
        },
        profileUpdateByUser: {
          limit: 10,
          windowMs: 10 * 60 * 1000,
        },
        messageByProjectAndUser: {
          limit: 20,
          windowMs: 60 * 1000,
        },
        messageByUser: {
          limit: 60,
          windowMs: 60 * 1000,
        },
        portfolioCreateByUser: {
          limit: 5,
          windowMs: 10 * 60 * 1000,
        },
        projectCreateByUser: {
          limit: 10,
          windowMs: 60 * 60 * 1000,
        },
        proposalCreateByUser: {
          limit: 10,
          windowMs: 60 * 60 * 1000,
        },
        paymentCreateByProject: {
          limit: 5,
          windowMs: 10 * 60 * 1000,
        },
        paymentSyncByProject: {
          limit: 30,
          windowMs: 60 * 1000,
        },
        chatbotByUserMinute: {
          limit: 10,
          windowMs: 60 * 1000,
        },
        chatbotByUserDay: {
          limit: 100,
          windowMs: 24 * 60 * 60 * 1000,
        },
      },
    },
  },
} as const;
