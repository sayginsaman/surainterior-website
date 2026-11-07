"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { KEYS, clamp01, ease, lerp, type Key } from "@/lib/timeline";
import { scene } from "./state";

type Pose = {
  key: Key;
  target: THREE.Vector3;
  r: number;
  theta: number;
  phi: number;
  fov: number;
  shift: number;
};

const REF_ASPECT = 16 / 9;

/** Turn a key into spherical coordinates around its target, adapted to the viewport. */
function resolve(key: Key, aspect: number): Pose {
  const portrait = aspect < 1;
  const src = portrait && key.portrait ? { ...key, ...key.portrait } : key;
  const target = new THREE.Vector3(...src.target);
  const off = new THREE.Vector3(...src.pos).sub(target);
  let r = off.length();
  // Narrow screens see less horizontally: pull the camera back. Never for the
  // locked pose, whose frame has to match the reveal clip pixel for pixel.
  if (!key.lock && aspect < 1.25) r *= Math.pow(Math.min(2.4, 1.25 / aspect), 0.85);
  return {
    key,
    target,
    r,
    theta: Math.atan2(off.x, off.z),
    phi: Math.acos(THREE.MathUtils.clamp(off.y / r, -1, 1)),
    fov: src.fov,
    shift: portrait ? 0 : key.shift,
  };
}

function anchorsFromDom(): number[] {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  let last = 0;
  return KEYS.map((k, i) => {
    const el = document.querySelector<HTMLElement>(`[data-key="${k.id}"]`);
    const top = el ? el.getBoundingClientRect().top + window.scrollY : last;
    const a = i === 0 ? 0 : Math.min(Math.max(top, last + 1), max);
    last = a;
    return a;
  });
}

function progress(y: number, anchors: number[]) {
  const n = anchors.length;
  if (y <= anchors[0]) return 0;
  for (let i = 0; i < n - 1; i++) {
    if (y < anchors[i + 1]) return i + clamp01((y - anchors[i]) / (anchors[i + 1] - anchors[i]));
  }
  return n - 1;
}

const tmp = new THREE.Vector3();

export function Rig({ reducedMotion }: { reducedMotion: boolean }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const aspect = size.width / size.height;
  const poses = useMemo(() => KEYS.map((k) => resolve(k, aspect)), [aspect]);
  const anchors = useRef<number[]>(KEYS.map((_, i) => i * 1000));
  const u = useRef<number | null>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const measure = () => (anchors.current = anchorsFromDom());
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const par = useRef({ x: 0, y: 0 });
  // ?pose=<key id> freezes the camera on one key (used to render the reveal
  // clip's first frame and the no-WebGL posters).
  const fixed = useMemo(() => {
    if (typeof window === "undefined") return -1;
    const id = new URLSearchParams(window.location.search).get("pose");
    return id ? KEYS.findIndex((k) => k.id === id) : -1;
  }, []);

  useFrame((state, dt) => {
    const raw = fixed >= 0 ? fixed : progress(window.scrollY, anchors.current);
    // Damp the timeline position, not the camera, so every value stays in sync.
    if (u.current === null || reducedMotion || fixed >= 0 || Math.abs(raw - u.current) > 1.5) u.current = raw;
    else u.current += (raw - u.current) * (1 - Math.exp(-dt * 7));
    const t = u.current;
    const i = Math.min(Math.floor(t), poses.length - 1);
    const j = Math.min(i + 1, poses.length - 1);
    const f = ease(t - i);
    const a = poses[i], b = poses[j];

    // scene values
    scene.wallH = lerp(a.key.wallH, b.key.wallH, f);
    scene.assemble = lerp(a.key.assemble, b.key.assemble, f);
    scene.dims = lerp(a.key.dims, b.key.dims, f);
    scene.glow = lerp(a.key.glow, b.key.glow, f);
    scene.dusk = lerp(a.key.dusk, b.key.dusk, f);
    scene.time = state.clock.elapsedTime;

    // how "locked" we are to pose P: no parallax, no idle motion there
    const lock = a.key.lock && b.key.lock ? 1 : a.key.lock ? 1 - f : b.key.lock ? f : 0;
    const free = (1 - lock) * (reducedMotion || fixed >= 0 ? 0 : 1);

    // camera in spherical space around an interpolated target
    let dTheta = b.theta - a.theta;
    if (dTheta > Math.PI) dTheta -= Math.PI * 2;
    if (dTheta < -Math.PI) dTheta += Math.PI * 2;
    const heroW = 1 - clamp01(t);
    par.current.x += (pointer.current.x - par.current.x) * (1 - Math.exp(-dt * 3));
    par.current.y += (pointer.current.y - par.current.y) * (1 - Math.exp(-dt * 3));
    const theta = a.theta + dTheta * f + free * (Math.sin(scene.time * 0.11) * 0.16 * heroW + par.current.x * 0.035);
    const phi = lerp(a.phi, b.phi, f) + free * par.current.y * 0.02;
    const r = Math.exp(lerp(Math.log(a.r), Math.log(b.r), f));
    tmp.lerpVectors(a.target, b.target, f);
    camera.position.set(
      tmp.x + r * Math.sin(phi) * Math.sin(theta),
      tmp.y + r * Math.cos(phi),
      tmp.z + r * Math.sin(phi) * Math.cos(theta),
    );
    camera.lookAt(tmp);

    // Keep horizontal framing on screens wider than 16:9 (the clip is 16:9, cover-fit).
    let fov = lerp(a.fov, b.fov, f);
    if (aspect > REF_ASPECT) fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(fov) / 2) * (REF_ASPECT / aspect)));
    const shift = lerp(a.shift, b.shift, f);
    if (camera.fov !== fov) camera.fov = fov;
    if (Math.abs(shift) > 1e-4) camera.setViewOffset(size.width, size.height, -shift * size.width, 0, size.width, size.height);
    else if (camera.view?.enabled) camera.clearViewOffset();
    camera.updateProjectionMatrix();
  });

  return null;
}
