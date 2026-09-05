import "server-only";

import prisma from "./prisma";
import { requireAuthenticatedSession } from "./auth-guard";

export async function getPrivacySettingsData() {
  const session = await requireAuthenticatedSession();
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      role: true,
      student: { select: { isPublicProfile: true } },
    },
  });

  return {
    role: user?.role ?? session.role,
    isPublicProfile: user?.student?.isPublicProfile ?? false,
  };
}

export type PrivacySettingsData = Awaited<
  ReturnType<typeof getPrivacySettingsData>
>;
