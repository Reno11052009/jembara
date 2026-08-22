import "server-only";

import { cache } from "react";
import { z } from "zod";
import prisma from "./prisma";
import { requireAuthenticatedSession } from "./auth-guard";
import type { NotificationPreferences } from "@/types/notification";

export const defaultNotificationPreferences: NotificationPreferences = {
  proposalMasuk: true,
  pesanBaru: true,
  pembayaran: true,
  updateProyek: true,
  promosiInfo: false,
};

const notificationPreferencesSchema = z
  .object({
    proposalMasuk: z.boolean(),
    pesanBaru: z.boolean(),
    pembayaran: z.boolean(),
    updateProyek: z.boolean(),
    promosiInfo: z.boolean(),
  })
  .strict();

function toPreferences(value: NotificationPreferences): NotificationPreferences {
  return {
    proposalMasuk: value.proposalMasuk,
    pesanBaru: value.pesanBaru,
    pembayaran: value.pembayaran,
    updateProyek: value.updateProyek,
    promosiInfo: value.promosiInfo,
  };
}

export const getCurrentNotificationPreferences = cache(
  async (): Promise<NotificationPreferences> => {
    const session = await requireAuthenticatedSession();
    const preferences = await prisma.notification_preference.findUnique({
      where: { userId: session.userId },
      select: {
        proposalMasuk: true,
        pesanBaru: true,
        pembayaran: true,
        updateProyek: true,
        promosiInfo: true,
      },
    });

    return preferences ? toPreferences(preferences) : defaultNotificationPreferences;
  },
);

export async function updateCurrentNotificationPreferences(
  input: unknown,
): Promise<NotificationPreferences | null> {
  const parsed = notificationPreferencesSchema.safeParse(input);
  if (!parsed.success) return null;

  const session = await requireAuthenticatedSession();
  const preferences = await prisma.notification_preference.upsert({
    where: { userId: session.userId },
    update: parsed.data,
    create: {
      userId: session.userId,
      ...parsed.data,
    },
    select: {
      proposalMasuk: true,
      pesanBaru: true,
      pembayaran: true,
      updateProyek: true,
      promosiInfo: true,
    },
  });

  return toPreferences(preferences);
}
