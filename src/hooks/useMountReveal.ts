"use client";
import { useEffect, useState } from "react";

export function useMountReveal() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // double rAF, bukan setTimeout — pastiin browser sempat paint
    // state "hidden" dulu di frame pertama, baru flip ke visible
    // di frame berikutnya. Kalau langsung setState di useEffect biasa,
    // browser kadang nge-batch dua-duanya jadi satu frame — transisinya
    // nggak sempat kerender, keliatannya kayak "nggak ada animasi sama sekali"
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsVisible(true));
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return isVisible;
}