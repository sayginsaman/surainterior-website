"use client";

import { useEffect } from "react";

/** Remember UTM tags and the landing page for this visit so the inquiry can report them. */
export function Attribution() {
  useEffect(() => {
    try {
      const s = window.sessionStorage;
      const q = new URLSearchParams(window.location.search);
      for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
        const v = q.get(k);
        if (v) s.setItem(k, v.slice(0, 120));
      }
      if (!s.getItem("landing")) s.setItem("landing", window.location.pathname);
    } catch {
      /* storage blocked: the form falls back to the current page */
    }
  }, []);
  return null;
}
