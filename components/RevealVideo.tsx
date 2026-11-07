"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Seam-locked hand-off from the real-time maquette to the Higgsfield clip.
 * The clip's first frame is the canvas rendered at pose P (lib/timeline.ts
 * REVEAL_POSE), so the cross-fade is invisible. Inside the "materials" section
 * the clip is scrubbed by scroll; from "proof" on, real photographs take over.
 */
export function RevealVideo() {
  const video = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(rm);
    const portrait = window.matchMedia("(max-aspect-ratio: 1/1)").matches;
    const start = document.querySelector<HTMLElement>('[data-key="materials"]');
    const end = document.querySelector<HTMLElement>('[data-key="proof"]');
    const build = document.querySelector<HTMLElement>('[data-key="build"]');
    if (!start || !end) return;

    let raf = 0;
    let shown = false;
    let covered = false;
    let loaded = false;
    let shownTime = 0;
    let displayT = 0;

    const tick = () => {
      raf = 0;
      const y = window.scrollY;
      const a = start.getBoundingClientRect().top + y;
      const b = end.getBoundingClientRect().top + y;
      const near = build ? build.getBoundingClientRect().top + y - window.innerHeight : a - 2 * window.innerHeight;
      if (!loaded && y > near) {
        loaded = true;
        if (!rm) setSrc(portrait ? "/media/reveal-mobile.mp4" : "/media/reveal-desktop.mp4");
      }
      const inRange = y >= a - 2 && y < b;
      if (inRange !== shown) {
        shown = inRange;
        setVisible(inRange);
        shownTime = performance.now();
      }
      const p = Math.min(1, Math.max(0, (y - a) / Math.max(1, b - a - window.innerHeight * 0.35)));
      const v = video.current;
      if (v && v.readyState >= 1 && v.duration && !rm) {
        const target = p * (v.duration - 0.05);
        displayT += (target - displayT) * 0.35;
        if (Math.abs(v.currentTime - displayT) > 0.016) v.currentTime = displayT;
        if (Math.abs(target - displayT) > 0.002) schedule();
      }
      // let the canvas sleep once the clip fully covers it
      const nowCovered = inRange && performance.now() - shownTime > 380 && p > 0.01;
      if (nowCovered !== covered) {
        covered = nowCovered;
        document.documentElement.dataset.reveal = covered ? "covered" : "";
        window.dispatchEvent(new Event("reveal-cover"));
      }
      if (inRange && !covered) schedule();
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  // iOS only paints seeked frames after the element has played once.
  const onLoaded = () => {
    const v = video.current;
    if (!v) return;
    v.play()
      .then(() => v.pause())
      .catch(() => {});
  };

  return (
    <div className={`reveal-layer${visible ? " is-visible" : ""}`} aria-hidden>
      {reduced ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/media/reveal-end.jpg" alt="" />
      ) : (
        <video
          ref={video}
          src={src ?? undefined}
          poster="/media/reveal-poster.jpg"
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          onLoadedMetadata={onLoaded}
        />
      )}
    </div>
  );
}
