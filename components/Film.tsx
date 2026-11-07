"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Chapter } from "@/lib/content";

type Props = {
  chapters: (Chapter & { projectTitle: string; projectMeta: string })[];
  intro: ReactNode;
};

/**
 * The opening film. A sticky stage holds one clip per chapter; scrolling
 * through the section scrubs the active clip frame by frame and swaps the copy.
 * Every clip starts and ends on a real photograph of the project (see docs/06).
 */
export function Film({ chapters, intro }: Props) {
  const root = useRef<HTMLElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const bar = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(-1); // -1 = intro copy
  const [clip, setClip] = useState(0);
  const [loaded, setLoaded] = useState<boolean[]>(() => chapters.map((_, i) => i === 0));
  const [variant, setVariant] = useState<"desktop" | "mobile">("desktop");
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setVariant(window.matchMedia("(max-width: 900px)").matches ? "mobile" : "desktop");
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const n = chapters.length;
    const shown = new Array(n).fill(0); // damped time per clip
    let raf = 0;
    let lastClip = -1;
    let lastActive = -2;

    const tick = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const span = Math.max(1, r.height - window.innerHeight);
      const P = Math.min(1, Math.max(0, -r.top / span));
      const idx = Math.min(n - 1, Math.floor(P * n));
      const local = Math.min(1, Math.max(0, P * n - idx));
      bar.current?.style.setProperty("--p", P.toFixed(4));

      if (idx !== lastClip) {
        lastClip = idx;
        setClip(idx);
        // load this clip and the next one ahead of time
        setLoaded((l) => (l[idx] && (idx + 1 >= n || l[idx + 1]) ? l : l.map((v, i) => v || i === idx || i === idx + 1)));
      }
      const a = P < 0.06 ? -1 : idx;
      if (a !== lastActive) {
        lastActive = a;
        setActive(a);
      }

      const v = videos.current[idx];
      if (v && v.readyState >= 1 && v.duration && !reduced) {
        const target = local * (v.duration - 0.04);
        shown[idx] += (target - shown[idx]) * 0.3;
        if (Math.abs(v.currentTime - shown[idx]) > 0.012) v.currentTime = shown[idx];
        if (Math.abs(target - shown[idx]) > 0.003) schedule();
      }
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
  }, [chapters.length, reduced]);

  // Safari only paints seeked frames once the element has played.
  const prime = (v: HTMLVideoElement) => {
    v.play()
      .then(() => v.pause())
      .catch(() => {});
  };

  return (
    <section ref={root} className="film" style={{ ["--n" as string]: chapters.length }} aria-label="Selected rooms" data-tone="film">
      <div className="film-stage">
        <div className="film-copy">
          <div className={`film-intro${active === -1 ? " is-active" : ""}`}>{intro}</div>
          {chapters.map((c, i) => (
            <article key={c.id} className={`film-chapter${active === i ? " is-active" : ""}`} aria-hidden={active !== i}>
              <p className="label">
                <span className="film-count">
                  {String(i + 1).padStart(2, "0")} <i>/</i> {String(chapters.length).padStart(2, "0")}
                </span>
                {c.kicker}
              </p>
              <h2 className="film-title">{c.title}</h2>
              <p className="film-text">{c.text}</p>
              <Link className="text-link" href={`/work/${c.project}`} tabIndex={active === i ? 0 : -1}>
                {c.projectTitle} <span aria-hidden>→</span>
              </Link>
            </article>
          ))}
        </div>

        <figure className="film-frame">
          {chapters.map((c, i) => {
            const base = `/media/film/${c.clip}`;
            return reduced ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={c.id} src={`${base}-poster.jpg`} alt="" className={clip === i ? "is-active" : ""} />
            ) : (
              <video
                key={c.id}
                ref={(v) => void (videos.current[i] = v)}
                className={clip === i ? "is-active" : ""}
                src={loaded[i] ? `${base}-${variant}.mp4` : undefined}
                poster={`${base}-poster.jpg`}
                muted
                playsInline
                preload={loaded[i] ? "auto" : "none"}
                disablePictureInPicture
                onLoadedMetadata={(e) => prime(e.currentTarget)}
                aria-hidden
              />
            );
          })}
          <figcaption>
            <span>{chapters[clip].projectTitle}</span>
            <span>{chapters[clip].projectMeta}</span>
          </figcaption>
        </figure>

        <span ref={bar} className="film-progress" aria-hidden>
          {chapters.map((c) => (
            <i key={c.id} />
          ))}
        </span>
      </div>
    </section>
  );
}
