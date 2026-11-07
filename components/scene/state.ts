import * as THREE from "three";
import type { SceneValues, V3 } from "@/lib/timeline";

// Mutable per-frame scene state. The rig writes it first in each frame,
// everything else reads it in useFrame. No React state: 60 writes a second.
export const scene: SceneValues & { time: number } = {
  wallH: 1,
  assemble: 1,
  dims: 0,
  glow: 0.25,
  dusk: 0,
  time: 0,
};

export const GLOW = new THREE.Color("#F0B46A");

export const materials = {
  clay: new THREE.MeshStandardMaterial({ color: "#f6f1ea", roughness: 0.9, metalness: 0 }),
  clayMid: new THREE.MeshStandardMaterial({ color: "#e9e2d9", roughness: 0.92, metalness: 0 }),
  clayDark: new THREE.MeshStandardMaterial({ color: "#cdbfb1", roughness: 0.75, metalness: 0 }),
  plinth: new THREE.MeshStandardMaterial({ color: "#dedad3", roughness: 0.95, metalness: 0 }),
  glass: new THREE.MeshStandardMaterial({
    color: "#ffffff",
    roughness: 0.08,
    metalness: 0,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
  }),
  // HDR emissive (toneMapped off) so only the LED lines reach the bloom threshold.
  led: new THREE.MeshBasicMaterial({ color: GLOW.clone(), toneMapped: false }),
};

export type MaterialName = keyof typeof materials;

// Plan-view annotations (feet-inches, US market). Lines are drawn in the
// scene; labels are DOM nodes positioned by LabelProjector each frame.
export const PLAN_DIMS: { a: V3; b: V3; label: string }[] = [
  { a: [-6, 0.05, 4.7], b: [6, 0.05, 4.7], label: "39′-4″" },
  { a: [6.75, 0.05, -4], b: [6.75, 0.05, 4], label: "26′-3″" },
  { a: [-4.8, 1.0, -2.0], b: [-1.8, 1.0, -2.0], label: "9′-10″ island" },
  { a: [1.95, 1.0, -2.85], b: [4.55, 1.0, -2.85], label: "8′-6″ media wall" },
];

export const PLAN_LABELS: { p: V3; text: string; kind: "dim" | "room" }[] = [
  ...PLAN_DIMS.map((d) => ({ p: [(d.a[0] + d.b[0]) / 2, d.a[1] + 0.01, (d.a[2] + d.b[2]) / 2] as V3, text: d.label, kind: "dim" as const })),
  { p: [-3.3, 0.2, 1.7], text: "Kitchen", kind: "room" },
  { p: [3.1, 0.2, 2.4], text: "Living", kind: "room" },
];

/** DOM nodes for PLAN_LABELS, filled by LabelLayer's ref callbacks. */
export const labelEls: (HTMLElement | null)[] = [];
