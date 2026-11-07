"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { Bloom, EffectComposer, N8AO, Noise, SMAA, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { Maquette } from "./Maquette";
import { Rig } from "./Rig";
import { PLAN_LABELS, labelEls, scene } from "./state";

const DAY_BG = new THREE.Color("#efe9e1");
const DUSK_BG = new THREE.Color("#2b2521");
const DAY_SUN = new THREE.Color("#fffaf2");
const DUSK_SUN = new THREE.Color("#ffb37a");

function Atmosphere() {
  const sun = useRef<THREE.DirectionalLight>(null);
  const fill = useRef<THREE.HemisphereLight>(null);
  const three = useThree((s) => s.scene);
  const bg = useMemo(() => new THREE.Color(), []);
  useEffect(() => {
    three.background = bg;
  }, [three, bg]);
  useFrame(() => {
    const d = scene.dusk;
    bg.copy(DAY_BG).lerp(DUSK_BG, d);
    three.environmentIntensity = THREE.MathUtils.lerp(0.95, 0.18, d);
    if (sun.current) {
      sun.current.intensity = THREE.MathUtils.lerp(2.3, 0.35, d);
      sun.current.color.copy(DAY_SUN).lerp(DUSK_SUN, d);
    }
    if (fill.current) fill.current.intensity = THREE.MathUtils.lerp(0.35, 0.08, d);
  });
  return (
    <>
      <hemisphereLight ref={fill} args={["#ffffff", "#d9d2c8", 0.35]} />
      <directionalLight
        ref={sun}
        position={[7, 12, 6]}
        intensity={2.3}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.025}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-camera-near={1}
        shadow-camera-far={40}
      />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.2} position={[0, 8, 2]} rotation-x={Math.PI / 2} scale={[14, 10, 1]} />
        <Lightformer form="rect" intensity={0.9} position={[-10, 3, 4]} rotation-y={Math.PI / 2} scale={[10, 4, 1]} />
        <Lightformer form="rect" intensity={0.6} position={[10, 2, -2]} rotation-y={-Math.PI / 2} scale={[10, 3, 1]} />
        <Lightformer form="ring" intensity={0.4} position={[0, 4, 12]} scale={6} />
      </Environment>
    </>
  );
}

/** Stop rendering while an opaque section or the reveal clip covers the canvas. */
function FrameGate() {
  const set = useThree((s) => s.set);
  useEffect(() => {
    let current: "always" | "never" = "always";
    const check = () => {
      const vh = window.innerHeight;
      let covered = document.documentElement.dataset.reveal === "covered";
      if (!covered) {
        for (const el of document.querySelectorAll<HTMLElement>("[data-opaque]")) {
          const r = el.getBoundingClientRect();
          if (r.top <= 0 && r.bottom >= vh) {
            covered = true;
            break;
          }
        }
      }
      const next = covered ? "never" : "always";
      if (next !== current) {
        current = next;
        set({ frameloop: next });
      }
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("reveal-cover", check);
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("reveal-cover", check);
      window.removeEventListener("resize", check);
    };
  }, [set]);
  return null;
}

const v3 = new THREE.Vector3();
function LabelProjector() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  useFrame(() => {
    const o = scene.dims;
    PLAN_LABELS.forEach((l, i) => {
      const el = labelEls[i];
      if (!el) return;
      if (o < 0.01) {
        if (el.style.opacity !== "0") el.style.opacity = "0";
        return;
      }
      v3.set(l.p[0], l.p[1], l.p[2]).project(camera);
      const x = (v3.x * 0.5 + 0.5) * size.width;
      const y = (-v3.y * 0.5 + 0.5) * size.height;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
      el.style.opacity = String(o);
    });
  });
  return null;
}

export function LabelLayer() {
  return (
    <div className="label-layer">
      {PLAN_LABELS.map((l, i) => (
        <span key={l.text} ref={(el) => void (labelEls[i] = el)} className={l.kind === "dim" ? "dim-label" : "room-label"} style={{ opacity: 0 }}>
          {l.text}
        </span>
      ))}
    </div>
  );
}

function ReadySignal() {
  const frames = useRef(0);
  useFrame(() => {
    frames.current++;
    if (frames.current === 3) {
      document.documentElement.dataset.stage = "ready";
      window.dispatchEvent(new Event("stage-ready"));
    }
  });
  return null;
}

export default function Stage({ reducedMotion, mobile }: { reducedMotion: boolean; mobile: boolean }) {
  const [dpr, setDpr] = useState(mobile ? 1.5 : 1.75);
  return (
    <>
    <Canvas
      className="stage-canvas"
      shadows="percentage"
      flat
      dpr={[1, dpr]}
      gl={{ antialias: false, powerPreference: "high-performance", stencil: false }}
      camera={{ fov: 26, near: 0.1, far: 140, position: [10, 10, 13] }}
      aria-hidden
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(mobile ? 1.5 : 1.75)} flipflops={3} />
      <Atmosphere />
      <Maquette />
      <Rig reducedMotion={reducedMotion} />
      <FrameGate />
      <ReadySignal />
      <LabelProjector />
      <EffectComposer multisampling={0} enableNormalPass={false}>
        <N8AO aoRadius={0.55} distanceFalloff={0.7} intensity={2.4} quality={mobile ? "performance" : "medium"} />
        <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.2} intensity={0.9} radius={0.7} />
        <SMAA />
        <ToneMapping mode={ToneMappingMode.AGX} />
        <Vignette offset={0.32} darkness={0.32} />
        <Noise opacity={0.03} premultiply />
      </EffectComposer>
    </Canvas>
    <LabelLayer />
    </>
  );
}
