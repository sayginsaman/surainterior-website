"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

export type SceneSegment = {
  id: string;
  seconds: number;
  /** dissolve in from the previous segment (when the two don't share a frame) */
  blend?: boolean;
  /** project shown in the credit line while this segment plays */
  project: string;
};
export type SceneBeat = {
  id: string;
  /** window on the scene's 0..1 scroll progress */
  from: number;
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
  credit: string;
};

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (t: number) => t * t * (3 - 2 * t);

/**
 * One continuous camera move through a real room, full screen, driven by
 * scroll. The film is stored as segments. Where two segments share a frame
 * (one ends on the real photograph the next starts on) the hand-off is a
 * plain switch; otherwise they overlap and dissolve under the scroll.
 * Copy floats over the room and moves in depth; at the end the room recedes
 * into the page.
 */
export function Scene({ segments, beats, hero, credit }: Props) {
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const beatRefs = useRef<(HTMLElement | null)[]>([]);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const progressRef = useRef<HTMLSpanElement>(null);
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
    const XF = 0.045; // dissolve length, as a share of the film
    let acc = 0;
    const ranges = segments.map((seg, i) => {
      const s0 = acc / total;
      acc += seg.seconds;
      const e0 = acc / total;
      const blendIn = i > 0 && !!seg.blend;
      const blendOut = i < segments.length - 1 && !!segments[i + 1].blend;
      return { from: s0 - (blendIn ? XF / 2 : 0), to: e0 + (blendOut ? XF / 2 : 0), blendIn };
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
      // the film runs over 0..0.94, the last stretch is the hand-off to the page
      const F = clamp01(P / 0.94);
      progressRef.current?.style.setProperty("--p", F.toFixed(4));

      let primary = 0;
      let needLoad = false;
      ranges.forEach((rg, i) => {
        const visible = (F >= rg.from || i === 0) && (F <= rg.to || i === segments.length - 1);
        const v = videos.current[i];
        if (F >= rg.from - 0.12 && !want[i]) {
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
        const k = smooth(clamp01(P / 0.055));
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
        const fade = 0.035;
        const inK = smooth(clamp01((P - b.from) / fade));
        const outK = smooth(clamp01((P - (b.to - fade)) / fade));
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
        const e = smooth(clamp01((P - 0.94) / 0.06));
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
    <section ref={root} className="scene" aria-label="A walk through four finished projects">
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

        <div className="scene-foot" aria-hidden>
          <span className="scene-credit">
            <b>{segments[active]?.project}</b> · {credit}
          </span>
          <span ref={progressRef} className="scene-progress">
            <i />
          </span>
        </div>
      </div>
    </section>
  );
}
