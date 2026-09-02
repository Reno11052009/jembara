"use client";

import { useEffect } from "react";
import PublicTopBar from "@/components/errors/PublicTopBar";
import ServerErrorContent from "@/components/errors/ServerErrorContent";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-canvas">
      <PublicTopBar />
      <div className="flex flex-1 items-center justify-center">
        <ServerErrorContent onRetry={reset} />
      </div>
    </div>
  );
}