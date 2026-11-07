// Camera + scene keyframes, one per <section data-key="...">.
// A key's value is reached when its section's top meets the top of the
// viewport (Tiny Villa's anchor idea, see docs/03). Between two anchors every
// value is eased linearly, so the scroll position fully determines the frame.

export type V3 = [number, number, number];

export type SceneValues = {
  wallH: number; // wall height factor, 0 = flat plan, 1 = full height
  assemble: number; // 0 = millwork exploded upward, 1 = in place
  dims: number; // plan annotations opacity
  glow: number; // LED strip intensity
  dusk: number; // 0 = daylight studio, 1 = evening
};

export type Key = SceneValues & {
  id: string;
  pos: V3;
  target: V3;
  fov: number;
  /** horizontal composition shift as a fraction of the viewport (+ moves the model right) */
  shift: number;
  /** the pose the Higgsfield reveal clip starts from: never reframed, no parallax */
  lock?: boolean;
  /** portrait viewports: explicit camera (otherwise the key is pulled back automatically) */
  portrait?: { pos?: V3; target?: V3; fov?: number };
};

// Pose P: the clay frame rendered here is the first frame of the reveal clip.
export const REVEAL_POSE = { pos: [-0.9, 1.55, 4.3] as V3, target: [-3.4, 1.0, -2.4] as V3, fov: 38 };

export const KEYS: Key[] = [
  { id: "hero", pos: [10.1, 9.9, 13.0], target: [0, 0.4, 0], fov: 26, shift: 0.17, wallH: 1, assemble: 1, dims: 0, glow: 0.25, dusk: 0 },
  { id: "studio", pos: [-10.25, 8.6, 11.2], target: [-0.6, 0.6, -0.3], fov: 26, shift: -0.17, wallH: 1, assemble: 1, dims: 0, glow: 0.25, dusk: 0 },
  {
    id: "plan", pos: [0, 26.5, 0.004], target: [0, 0, 0], fov: 30, shift: 0.16, wallH: 0.035, assemble: 1, dims: 1, glow: 0, dusk: 0,
    // portrait: rotate so the long side runs down the screen, room in the upper half
    portrait: { pos: [3.904, 45, 0], target: [3.9, 0, 0] },
  },
  { id: "build", pos: [11.2, 10.8, 12.6], target: [-0.6, 1.9, -0.8], fov: 28, shift: -0.15, wallH: 0.035, assemble: 0, dims: 0, glow: 0, dusk: 0 },
  // anchored part-way down the build chapter: assembly finishes before the camera descends to P
  { id: "assembled", pos: [4.6, 5.4, 8.8], target: [-2.4, 0.9, -1.6], fov: 30, shift: -0.12, wallH: 1, assemble: 1, dims: 0, glow: 0.3, dusk: 0 },
  { id: "materials", ...REVEAL_POSE, shift: 0, wallH: 1, assemble: 1, dims: 0, glow: 0.35, dusk: 0, lock: true },
  { id: "proof", ...REVEAL_POSE, shift: 0, wallH: 1, assemble: 1, dims: 0, glow: 0.35, dusk: 0, lock: true },
  { id: "contact", pos: [5.0, 1.55, 5.6], target: [3.0, 1.25, -3.6], fov: 30, shift: -0.2, wallH: 1, assemble: 1, dims: 0, glow: 1, dusk: 1 },
];

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const ease = (t: number) => t * t * (3 - 2 * t);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
