"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { KEYS } from "@/lib/timeline";

const Stage = dynamic(() => import("./scene/Stage"), { ssr: false });

type Mode = "pending" | "webgl" | "poster";

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Fixed layer behind the page. Real-time maquette when WebGL is available and
 * motion is allowed; otherwise pre-rendered stills of the same poses that
 * swap per section, so the story still reads.
 */
export function Experience() {
  const [mode, setMode] = useState<Mode>("pending");
  const [reduced, setReduced] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const forcePoster = new URLSearchParams(window.location.search).has("poster");
    setReduced(rm);
    setMobile(window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 760);
    setMode(!forcePoster && !rm && hasWebGL() ? "webgl" : "poster");
  }, []);

  useEffect(() => {
    if (mode === "poster") {
      document.documentElement.dataset.stage = "ready";
      window.dispatchEvent(new Event("stage-ready"));
    }
  }, [mode]);

  return (
    <div className="stage" aria-hidden>
      {mode === "webgl" && <Stage reducedMotion={reduced} mobile={mobile} />}
      {mode === "poster" && <PosterStage />}
    </div>
  );
}

const POSTERS = KEYS.filter((k) => k.id !== "proof").map((k) => k.id);

function PosterStage() {
  const [active, setActive] = useState("hero");
  useEffect(() => {
    const els = POSTERS.map((id) => document.querySelector<HTMLElement>(`[data-key="${id}"]`)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive((e.target as HTMLElement).dataset.key ?? "hero");
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <div className="poster-stage">
      {POSTERS.map((id) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={id} src={`/media/posters/${id}.jpg`} alt="" className={id === active ? "is-active" : ""} decoding="async" />
      ))}
    </div>
  );
}
