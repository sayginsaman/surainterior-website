"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/** Lenis on precise pointers only; touch devices keep native scrolling. */
export function SmoothScroll() {
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.09, anchors: { offset: 0 } });
    return () => lenis.destroy();
  }, []);
  return null;
}
