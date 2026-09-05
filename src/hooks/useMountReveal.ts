"use client";
import { useEffect, useState } from "react";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useMountReveal() {
  const [isVisible, setIsVisible] = useState(prefersReducedMotion);

  useEffect(() => {
    if (isVisible) return;

    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsVisible(true));
    });
    return () => cancelAnimationFrame(raf);
  }, [isVisible]);

  return isVisible;
}
