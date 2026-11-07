// SURA INTERIOR mark: loose, overlapping rings in ink and taupe, redrawn as SVG
// from the brand lockup the client supplied (2026-11-07). Replace with the
// original vector when it arrives. Strokes don't scale, so the mark reads at
// favicon size and at loader size alike: set --mark-stroke where it's used.

const INK = [
  { cx: 748, cy: 330, rx: 162, ry: 164, r: 0 },
  { cx: 762, cy: 333, rx: 172, ry: 128, r: -6 },
  { cx: 770, cy: 346, rx: 140, ry: 121, r: 8 },
  { cx: 757, cy: 336, rx: 106, ry: 96, r: 0 },
];
const TAUPE = [
  { cx: 815, cy: 338, rx: 146, ry: 152, r: 0 },
  { cx: 792, cy: 333, rx: 120, ry: 111, r: 4 },
];

export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg className={`logo-mark ${className ?? ""}`} viewBox="576 156 394 350" role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <g fill="none" strokeLinecap="round">
        {TAUPE.map((e, i) => (
          <ellipse key={`t${i}`} className="ring ring-taupe" cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry} transform={`rotate(${e.r} ${e.cx} ${e.cy})`} pathLength={100} vectorEffect="non-scaling-stroke" />
        ))}
        {INK.map((e, i) => (
          <ellipse key={`k${i}`} className="ring ring-ink" cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry} transform={`rotate(${e.r} ${e.cx} ${e.cy})`} pathLength={100} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
    </svg>
  );
}

export function Wordmark({ llc = false }: { llc?: boolean }) {
  return (
    <span className="wordmark-text">
      SURA INTERIOR{llc && <small> LLC</small>}
    </span>
  );
}
