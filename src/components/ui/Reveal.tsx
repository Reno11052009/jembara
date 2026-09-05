"use client";

import React from "react";
import { useReveal } from "@/hooks/useReveal";

type RevealTag = keyof React.JSX.IntrinsicElements;

type RevealProps = {
  children: React.ReactNode;
  delay?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  as?: RevealTag;
  className?: string;
  active?: boolean;
};

const DELAY_MS = { 0: 0, 1: 80, 2: 160, 3: 240, 4: 320, 5: 400, 6: 480 } as const;

export function Reveal({
  children,
  delay = 0,
  as = "div",
  className = "",
  active,
}: RevealProps) {
  const { ref, isVisible: ownVisible } = useReveal<HTMLElement>();
  const isControlled = active !== undefined;
  const isVisible = isControlled ? active : ownVisible;
  const Tag = as as React.ElementType;

  const classes = [
    "transition-all duration-700 ease-out",
    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag
      ref={isControlled ? undefined : (ref as React.Ref<HTMLElement>)}
      style={{ transitionDelay: `${DELAY_MS[delay]}ms` }}
      className={classes}
    >
      {children}
    </Tag>
  );
}
