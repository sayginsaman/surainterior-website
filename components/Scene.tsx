"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

export type SceneSegment = {
  id: string;
  seconds: number;
  /** dissolve in from the previous segment (when the two don't share a frame) */
  blend?: boolean;
};
export type SceneBeat = {
  id: string;
  /** the segment this copy belongs to; from/to are seconds from that segment's start */
  seg: string;
  from: number;
  /** may run past the segment, into the next ones (or into the exit after the last) */
  to: number;
  align: "left" | "right" | "center";
  kicker: string;
  title: ReactNode;
  text?: string;
  link?: { href: string; label: string };
};

type Props = {
  segments: SceneSegment[];
  beats: SceneBeat[];
  hero: ReactNode;
};

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (t: number) => t * t * (3 - 2 * t);

// Transitions are measured in viewports of scroll, so they keep their feel
// however long the film gets. The scene's height comes from the film length
// (--film, in seconds; see .scene in globals.css).
const HERO_VP = 1.25; // headline fly-through
const DISSOLVE_VP = 1; // cross-fade between segments that don't share a frame
const FADE_VP = 0.8; // copy in / out
const EXIT_VP = 1.4; // the room receding into the page
const LOOKAHEAD_S = 7.5; // start loading a segment this many film-seconds ahead

/**
 * One continuous camera move through a real room, full screen, driven by
 * scroll. The film is stored as segments. Where two segments share a frame
 * (one ends on the real photograph the next starts on) the hand-off is a
 * plain switch; otherwise they overlap and dissolve under the scroll.
 * Copy floats over the room and moves in depth; at the end the room recedes
 * into the page.
 */
export function Scene({ segments, beats, hero }: Props) {
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const beatRefs = useRef<(HTMLElement | null)[]>([]);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState<boolean[]>(() => segments.map((_, i) => i === 0));
  const [variant, setVariant] = useState<"desktop" | "mobile">("desktop");
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setVariant(window.matchMedia("(max-aspect-ratio: 1/1)").matches ? "mobile" : "desktop");
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const total = segments.reduce((sum, x) => sum + x.seconds, 0);
    const starts: Record<string, number> = {};
    segments.reduce((t, s) => ((starts[s.id] = t), t + s.seconds), 0);
    // film-seconds of each beat, resolved once
    const beatT = beats.map((b) => {
      const s0 = starts[b.seg] ?? 0;
      return { from: (s0 + b.from) / total, to: (s0 + b.to) / total };
    });
    const shown = segments.map(() => 0);
    const want = segments.map((_, i) => i === 0);
    let raf = 0;
    let lastPrimary = -1;

    const tick = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const span = Math.max(1, r.height - window.innerHeight);
      const P = clamp01(-r.top / span);
      const vp = window.innerHeight / span; // one viewport of scroll, as a share of P
      // the film runs over 0..filmEnd, the last stretch is the hand-off to the page
      const filmEnd = 1 - EXIT_VP * vp;
      const F = clamp01(P / filmEnd);
      const XF = (DISSOLVE_VP * vp) / filmEnd; // dissolve, as a share of the film

      let primary = 0;
      let needLoad = false;
      let acc = 0;
      const ranges = segments.map((seg, i) => {
        const s0 = acc / total;
        acc += seg.seconds;
        const e0 = acc / total;
        const blendIn = i > 0 && !!seg.blend;
        const blendOut = i < segments.length - 1 && !!segments[i + 1].blend;
        return { from: s0 - (blendIn ? XF / 2 : 0), to: e0 + (blendOut ? XF / 2 : 0), blendIn };
      });
      ranges.forEach((rg, i) => {
        const visible = (F >= rg.from || i === 0) && (F <= rg.to || i === segments.length - 1);
        const v = videos.current[i];
        if (F >= rg.from - LOOKAHEAD_S / total && !want[i]) {
          want[i] = true;
          needLoad = true;
        }
        if (visible) primary = i;
        if (!v) return;
        const op = !visible ? 0 : rg.blendIn ? smooth(clamp01((F - rg.from) / XF)) : 1;
        v.style.opacity = op.toFixed(3);
        v.style.visibility = op > 0 ? "visible" : "hidden";
        if (!visible || reduced || v.readyState < 1 || !v.duration) return;
        const local = clamp01((F - rg.from) / (rg.to - rg.from));
        const target = local * (v.duration - 0.05);
        shown[i] += (target - shown[i]) * 0.28;
        if (Math.abs(v.currentTime - shown[i]) > 0.01) v.currentTime = shown[i];
        if (Math.abs(target - shown[i]) > 0.002) schedule();
      });
      if (needLoad) setLoaded(want.slice());
      if (primary !== lastPrimary) {
        lastPrimary = primary;
        setActive(primary);
      }

      // hero: we fly through the headline into the room
      const h = heroRef.current;
      if (h) {
        const k = smooth(clamp01(P / (HERO_VP * vp)));
        h.style.opacity = String(1 - k);
        h.style.transform = `translate3d(0, ${-k * 4}vh, 0) scale(${1 + k * 0.35})`;
        h.style.filter = k > 0.01 ? `blur(${(k * 10).toFixed(1)}px)` : "";
        h.style.visibility = k >= 0.999 ? "hidden" : "visible";
      }

      // beats arrive from depth and leave upward; the shade follows whichever copy is up
      let shadeL = h ? Number(h.style.opacity || 1) : 0;
      let shadeR = 0;
      let shadeC = 0;
      beats.forEach((b, i) => {
        const n = beatRefs.current[i];
        if (!n) return;
        const fade = FADE_VP * vp;
        const from = beatT[i].from * filmEnd;
        const to = beatT[i].to * filmEnd;
        const inK = smooth(clamp01((P - from) / fade));
        const outK = smooth(clamp01((P - (to - fade)) / fade));
        const o = inK * (1 - outK);
        n.style.opacity = o.toFixed(3);
        n.style.visibility = o < 0.01 ? "hidden" : "visible";
        const z = (1 - inK) * -160 + outK * 90;
        n.style.transform = `perspective(900px) translate3d(0, ${((1 - inK) * 40 - outK * 50).toFixed(1)}px, ${z.toFixed(1)}px)`;
        n.style.filter = o < 0.99 ? `blur(${((1 - o) * 6).toFixed(1)}px)` : "";
        n.toggleAttribute("inert", o < 0.5);
        if (b.align === "left") shadeL = Math.max(shadeL, o);
        else if (b.align === "right") shadeR = Math.max(shadeR, o);
        else shadeC = Math.max(shadeC, o);
      });
      const st = stage.current;
      if (st) {
        st.style.setProperty("--sl", shadeL.toFixed(3));
        st.style.setProperty("--sr", shadeR.toFixed(3));
        st.style.setProperty("--sc", shadeC.toFixed(3));
      }

      // the room recedes into the page at the end
      const m = media.current;
      if (m) {
        const e = smooth(clamp01((P - filmEnd) / (1 - filmEnd)));
        m.style.transform = e > 0 ? `scale(${1 - e * 0.12})` : "";
        m.style.borderRadius = e > 0 ? `${(e * 6).toFixed(1)}px` : "";
        m.style.filter = e > 0 ? `brightness(${1 - e * 0.15})` : "";
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
  }, [segments, beats, reduced]);

  // Safari paints seeked frames only after a play()
  const prime = (v: HTMLVideoElement) => {
    v.play()
      .then(() => v.pause())
      .catch(() => {});
  };

  return (
    <section
      ref={root}
      className="scene"
      aria-label="A walk through finished projects"
      style={{ "--film": segments.reduce((sum, x) => sum + x.seconds, 0) } as CSSProperties}
    >
      <div ref={stage} className="scene-stage">
        {/* data-tone sits on the media so the header turns dark again once the room recedes */}
        <div ref={media} className="scene-media" data-tone="dark">
          {segments.map((s, i) => {
            const base = `/media/scene/${s.id}`;
            const cls = active === i ? "is-active" : "";
            const first = i === 0 ? { opacity: 1, visibility: "visible" as const } : { opacity: 0, visibility: "hidden" as const };
            return reduced ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={s.id} src={`${base}-poster.jpg`} alt="" className={cls} />
            ) : (
              <video
                key={s.id}
                ref={(v) => void (videos.current[i] = v)}
                style={first}
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
          <div className="scene-shade" aria-hidden>
            <i className="shade-l" />
            <i className="shade-r" />
            <i className="shade-c" />
          </div>
        </div>

        <div ref={heroRef} className="scene-hero">
          {hero}
        </div>

        {beats.map((b, i) => (
          <article key={b.id} ref={(n) => void (beatRefs.current[i] = n)} className={`scene-beat scene-beat-${b.align}`} style={{ opacity: 0, visibility: "hidden" }}>
            <p className="label">
              <span className="beat-n">{String(i + 1).padStart(2, "0")}</span>
              {b.kicker}
            </p>
            <h2 className="beat-title">{b.title}</h2>
            {b.text && <p className="beat-text">{b.text}</p>}
            {b.link && (
              <Link className="text-link" href={b.link.href}>
                {b.link.label} <span aria-hidden>→</span>
              </Link>
            )}
          </article>
        ))}

      </div>
    </section>
  );
}
