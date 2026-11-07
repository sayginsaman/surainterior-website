"use client";

import { useLayoutEffect, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Line, RoundedBox } from "@react-three/drei";
import { clamp01, ease, type V3 } from "@/lib/timeline";
import { GLOW, PLAN_DIMS, materials, scene, type MaterialName } from "./state";

// A white clay maquette of an open-plan kitchen + living room with a media
// wall: the three typologies Sura's portfolio is strongest in. Units: metres.
// Room interior x ∈ [-6, 6], z ∈ [-4, 4], floor at y = 0.

const unitBox = new THREE.BoxGeometry(1, 1, 1);

function B({ s, p, m = "clay", shadow = true }: { s: V3; p: V3; m?: MaterialName; shadow?: boolean }) {
  return <mesh geometry={unitBox} material={materials[m]} scale={s} position={p} castShadow={shadow} receiveShadow />;
}

/** Millwork that flies in from above during the "built to be built" chapter. */
function Part({ p = [0, 0, 0], lift = 2.4, drift = [0, 0, 0], delay = 0, spin = 0, children }: {
  p?: V3; lift?: number; drift?: V3; delay?: number; spin?: number; children: ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const e = 1 - ease(clamp01((scene.assemble - delay) / 0.5));
    g.position.set(p[0] + drift[0] * e, p[1] + lift * e + drift[1] * e, p[2] + drift[2] * e);
    g.rotation.y = spin * e;
  });
  return (
    <group ref={ref} position={p}>
      {children}
    </group>
  );
}

function Instanced({ count, geometry, material, place }: {
  count: number;
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  place: (i: number, m: THREE.Object3D) => void;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const o = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      o.position.set(0, 0, 0);
      o.rotation.set(0, 0, 0);
      o.scale.set(1, 1, 1);
      place(i, o);
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [count, place]);
  return <instancedMesh ref={ref} args={[geometry, material, count]} castShadow receiveShadow />;
}

/* ───────────────────────── walls ───────────────────────── */

function Walls() {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ref.current) ref.current.scale.y = Math.max(0.001, scene.wallH);
  });
  const H = 3;
  return (
    <group ref={ref}>
      {/* back wall */}
      <B s={[12.32, H, 0.16]} p={[0, H / 2, -4.08]} />
      {/* right return framing the media wall */}
      <B s={[0.16, H, 1.9]} p={[6.08, H / 2, -3.21]} />
      {/* left wall with two windows */}
      <B s={[0.16, 0.95, 8.16]} p={[-6.08, 0.475, -0.08]} />
      <B s={[0.16, 0.55, 8.16]} p={[-6.08, 2.725, -0.08]} />
      <B s={[0.16, 1.5, 1.56]} p={[-6.08, 1.7, -3.38]} />
      <B s={[0.16, 1.5, 0.8]} p={[-6.08, 1.7, -0.2]} />
      <B s={[0.16, 1.5, 1.8]} p={[-6.08, 1.7, 3.1]} />
      {[-1.6, 1.2].map((z) => (
        <group key={z}>
          <B s={[0.02, 1.5, 2.0]} p={[-6.08, 1.7, z]} m="glass" shadow={false} />
          <B s={[0.05, 1.5, 0.04]} p={[-6.08, 1.7, z]} m="clayMid" />
          <B s={[0.05, 0.04, 2.0]} p={[-6.08, 2.05, z]} m="clayMid" />
        </group>
      ))}
    </group>
  );
}

/* ───────────────────────── kitchen ───────────────────────── */

function TallWall() {
  // modules left → right along the back wall
  const mods: { w: number; kind: "door" | "fridge" | "oven" | "glass" }[] = [
    { w: 0.6, kind: "door" },
    { w: 0.6, kind: "door" },
    { w: 0.95, kind: "fridge" },
    { w: 0.6, kind: "oven" },
    { w: 0.75, kind: "glass" },
    { w: 0.75, kind: "glass" },
  ];
  let x = -5.84;
  const D = 0.62, H = 2.45, zc = -4.0 + D / 2, front = -4.0 + D;
  return (
    <>
      {mods.map((m, i) => {
        const cx = x + m.w / 2;
        x += m.w;
        return (
          <Part key={i} p={[cx, 0, zc]} delay={0.04 * i} lift={3.2} drift={[0, 0, 0.6]}>
            {m.kind === "glass" ? (
              <>
                <B s={[m.w - 0.01, 0.04, D]} p={[0, 0.02, 0]} m="clayDark" />
                <B s={[m.w - 0.01, 0.04, D]} p={[0, H - 0.02, 0]} m="clayDark" />
                <B s={[0.04, H, D]} p={[-m.w / 2 + 0.025, H / 2, 0]} m="clayDark" />
                <B s={[0.04, H, D]} p={[m.w / 2 - 0.025, H / 2, 0]} m="clayDark" />
                <B s={[m.w - 0.06, H - 0.06, 0.02]} p={[0, H / 2, -D / 2 + 0.02]} m="clayMid" />
                {[0.55, 1.05, 1.55, 2.0].map((y) => (
                  <B key={y} s={[m.w - 0.08, 0.025, D - 0.08]} p={[0, y, 0]} m="clay" />
                ))}
                <mesh geometry={unitBox} material={materials.led} scale={[0.012, H - 0.12, 0.012]} position={[-m.w / 2 + 0.05, H / 2, D / 2 - 0.05]} />
                <mesh geometry={unitBox} material={materials.led} scale={[0.012, H - 0.12, 0.012]} position={[m.w / 2 - 0.05, H / 2, D / 2 - 0.05]} />
                <B s={[m.w - 0.08, H - 0.08, 0.012]} p={[0, H / 2, D / 2 - 0.01]} m="glass" shadow={false} />
                <Vases w={m.w} seed={i} />
              </>
            ) : (
              <>
                <B s={[m.w - 0.008, H, D - 0.02]} p={[0, H / 2, -0.01]} />
                <B s={[m.w - 0.03, H - 0.06, 0.02]} p={[0, H / 2, D / 2 - 0.0]} m={m.kind === "fridge" ? "clayMid" : "clay"} />
                {m.kind === "oven" && (
                  <>
                    <B s={[m.w - 0.1, 0.5, 0.02]} p={[0, 1.05, D / 2 + 0.012]} m="clayDark" />
                    <B s={[m.w - 0.1, 0.5, 0.02]} p={[0, 1.62, D / 2 + 0.012]} m="clayDark" />
                  </>
                )}
                {m.kind === "fridge" && <B s={[0.02, 1.9, 0.03]} p={[0, 1.2, D / 2 + 0.02]} m="clayDark" />}
                {m.kind === "door" && <B s={[0.015, 0.9, 0.025]} p={[i % 2 ? -m.w / 2 + 0.06 : m.w / 2 - 0.06, 1.15, D / 2 + 0.02]} m="clayDark" />}
              </>
            )}
          </Part>
        );
      })}
      {/* bulkhead strip above the run */}
      <B s={[4.42, 0.06, D]} p={[-3.63, H + 0.03, zc]} m="clayMid" />
      {/* plinth (fixed, it's part of the floor build-up) */}
      <B s={[4.42, 0.02, 0.02]} p={[-3.63, 0.01, front - 0.04]} m="clayDark" shadow={false} />
    </>
  );
}

function Vases({ w, seed }: { w: number; seed: number }) {
  const shapes = useMemo(() => {
    const out: { p: V3; r: number; h: number; round: boolean }[] = [];
    const ys = [0.55, 1.05, 1.55, 2.0];
    ys.forEach((y, j) => {
      const n = (seed + j) % 2 === 0 ? 2 : 1;
      for (let k = 0; k < n; k++) {
        const x = n === 1 ? 0 : (k === 0 ? -1 : 1) * w * 0.2;
        const round = (seed + j + k) % 3 === 0;
        out.push({ p: [x, y + 0.015, 0], r: 0.05 + ((seed * 7 + j * 3 + k) % 3) * 0.015, h: 0.14 + ((seed + j + k) % 3) * 0.06, round });
      }
    });
    return out;
  }, [w, seed]);
  return (
    <>
      {shapes.map((s, i) =>
        s.round ? (
          <mesh key={i} position={[s.p[0], s.p[1] + s.r, s.p[2]]} material={materials.clay} castShadow>
            <sphereGeometry args={[s.r, 20, 14]} />
          </mesh>
        ) : (
          <mesh key={i} position={[s.p[0], s.p[1] + s.h / 2, s.p[2]]} material={materials.clay} castShadow>
            <cylinderGeometry args={[s.r * 0.7, s.r, s.h, 20]} />
          </mesh>
        ),
      )}
    </>
  );
}

function BaseRun() {
  const D = 0.62, H = 0.88, x = -5.84 + D / 2;
  const n = 6, z0 = -3.38, z1 = 1.0, w = (z1 - z0) / n;
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <Part key={i} p={[x, 0, z0 + w * (i + 0.5)]} delay={0.18 + 0.03 * i} lift={2.6} drift={[0.5, 0, 0]}>
          <B s={[D - 0.02, H, w - 0.008]} p={[0, H / 2, 0]} />
          <B s={[0.02, H - 0.12, w - 0.03]} p={[D / 2, H / 2 + 0.03, 0]} m="clay" />
          <B s={[0.025, 0.015, w * 0.45]} p={[D / 2 + 0.015, H - 0.12, 0]} m="clayDark" />
        </Part>
      ))}
      <Part p={[x + 0.02, 0, (z0 + z1) / 2]} delay={0.42} lift={3}>
        <B s={[D + 0.04, 0.04, z1 - z0 + 0.04]} p={[0, H + 0.02, 0]} m="clayMid" />
        {/* sink + faucet under window 1 */}
        <B s={[0.42, 0.006, 0.7]} p={[0.02, H + 0.043, -1.6 - (z0 + z1) / 2]} m="clayDark" shadow={false} />
        <mesh position={[-0.2, H + 0.2, -1.6 - (z0 + z1) / 2]} material={materials.clayDark} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.32, 10]} />
        </mesh>
        <mesh position={[-0.12, H + 0.355, -1.6 - (z0 + z1) / 2]} rotation={[0, 0, Math.PI / 2]} material={materials.clayDark} castShadow>
          <cylinderGeometry args={[0.011, 0.011, 0.17, 10]} />
        </mesh>
        {/* cooktop */}
        <B s={[0.5, 0.006, 0.62]} p={[0.0, H + 0.043, 0.45 - (z0 + z1) / 2]} m="clayDark" shadow={false} />
      </Part>
    </>
  );
}

function Island() {
  const cx = -3.3, cz = -0.9, L = 3.0, D = 1.05, H = 0.88;
  const flute = useMemo(() => new THREE.CylinderGeometry(0.019, 0.019, H - 0.08, 10), []);
  const count = 66;
  const place = useMemo(
    () => (i: number, o: THREE.Object3D) => {
      o.position.set(-L / 2 + 0.08 + (i * (L - 0.16)) / (count - 1), (H - 0.08) / 2 + 0.04, D / 2 - 0.035);
    },
    [],
  );
  const tableShape = useMemo(() => {
    const s = new THREE.Shape();
    const len = 1.55, hw = 0.46;
    s.moveTo(0, -hw);
    s.lineTo(len - hw, -hw);
    s.absarc(len - hw, 0, hw, -Math.PI / 2, Math.PI / 2, false);
    s.lineTo(0, hw);
    s.lineTo(0, -hw);
    return new THREE.ExtrudeGeometry(s, { depth: 0.045, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2, curveSegments: 32 });
  }, []);
  return (
    <>
      <Part p={[cx, 0, cz]} delay={0.3} lift={3.4} spin={0.25}>
        <B s={[L - 0.1, H - 0.04, D - 0.1]} p={[0, (H - 0.04) / 2, 0]} />
        <Instanced count={count} geometry={flute} material={materials.clay} place={place} />
      </Part>
      <Part p={[cx, 0, cz]} delay={0.5} lift={4.2}>
        {/* waterfall stone: top + two ends */}
        <B s={[L, 0.05, D]} p={[0, H + 0.025, 0]} m="clayMid" />
        <B s={[0.05, H + 0.05, D]} p={[-L / 2 + 0.025, (H + 0.05) / 2, 0]} m="clayMid" />
        <B s={[0.05, H + 0.05, D]} p={[L / 2 - 0.025, (H + 0.05) / 2, 0]} m="clayMid" />
        <mesh geometry={unitBox} material={materials.led} scale={[L - 0.2, 0.01, 0.015]} position={[0, 0.035, D / 2 - 0.02]} />
      </Part>
      {/* attached table on a single cylinder base (Biscayne Blvd typology) */}
      <Part p={[cx + L / 2, 0, cz]} delay={0.58} lift={3.6} drift={[0.6, 0, 0]}>
        <mesh geometry={tableShape} material={materials.clay} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.735, 0]} castShadow receiveShadow />
        <mesh position={[1.1, 0.37, 0]} material={materials.clay} castShadow receiveShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.74, 40]} />
        </mesh>
      </Part>
      {/* stools */}
      {[-1.0, 0, 1.0].map((dx, i) => (
        <Part key={dx} p={[cx + dx, 0, cz + 0.98]} delay={0.62 + i * 0.04} lift={2.2}>
          <mesh position={[0, 0.66, 0]} material={materials.clay} castShadow receiveShadow>
            <cylinderGeometry args={[0.19, 0.17, 0.06, 32]} />
          </mesh>
          <mesh position={[0, 0.33, 0]} material={materials.clayDark} castShadow>
            <cylinderGeometry args={[0.022, 0.022, 0.62, 12]} />
          </mesh>
          <mesh position={[0, 0.25, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.clayDark} castShadow>
            <torusGeometry args={[0.15, 0.008, 8, 32]} />
          </mesh>
          <mesh position={[0, 0.01, 0]} material={materials.clayDark} castShadow receiveShadow>
            <cylinderGeometry args={[0.19, 0.2, 0.02, 32]} />
          </mesh>
        </Part>
      ))}
      {/* dome pendants */}
      {[-1.0, 0, 1.0].map((dx, i) => (
        <Part key={`p${dx}`} p={[cx + dx, 0, cz]} delay={0.7 + i * 0.04} lift={1.6}>
          <mesh position={[0, 2.6, 0]} material={materials.clayDark}>
            <cylinderGeometry args={[0.004, 0.004, 0.8, 6]} />
          </mesh>
          <mesh position={[0, 2.03, 0]} material={materials.clay} castShadow>
            <sphereGeometry args={[0.17, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
          <mesh position={[0, 2.03, 0]} material={materials.led} scale={0.6}>
            <sphereGeometry args={[0.07, 16, 8]} />
          </mesh>
        </Part>
      ))}
    </>
  );
}

/* ───────────────────────── living ───────────────────────── */

function MediaWall() {
  const slat = useMemo(() => new THREE.BoxGeometry(0.045, 1, 0.04), []);
  const topCount = 34, lowCount = 18;
  const placeTop = useMemo(
    () => (i: number, o: THREE.Object3D) => {
      o.position.set(2.0 + i * 0.076, 2.79, -3.94);
      o.scale.set(1, 0.42, 1);
    },
    [],
  );
  const placeLow = useMemo(
    () => (i: number, o: THREE.Object3D) => {
      // vertical cladding to the right of the right niche
      o.position.set(5.52 + (i % 6) * 0.07, 1.5, -3.94);
      o.scale.set(1, 3, 1);
      if (i >= 6) o.scale.set(0, 0, 0);
    },
    [],
  );
  return (
    <>
      <Part p={[0, 0, 0]} delay={0.2} lift={0} drift={[0, 0, 1.4]}>
        <B s={[2.6, 2.12, 0.06]} p={[3.25, 1.62, -3.97]} m="clayMid" />
        <Instanced count={topCount} geometry={slat} material={materials.clay} place={placeTop} />
        <Instanced count={lowCount} geometry={slat} material={materials.clay} place={placeLow} />
      </Part>
      <Part p={[3.25, 0, -3.9]} delay={0.45} lift={1.8} drift={[0, 0, 1.2]}>
        <B s={[1.6, 0.9, 0.04]} p={[0, 1.62, 0]} m="clayDark" />
      </Part>
      {/* floating console with LED underline */}
      <Part p={[3.25, 0, -3.77]} delay={0.36} lift={2.4} drift={[0, 0, 0.8]}>
        <B s={[2.7, 0.42, 0.45]} p={[0, 0.48, 0]} />
        {[-0.9, 0, 0.9].map((dx) => (
          <B key={dx} s={[0.86, 0.36, 0.015]} p={[dx, 0.48, 0.226]} m="clay" />
        ))}
        <mesh geometry={unitBox} material={materials.led} scale={[2.6, 0.012, 0.02]} position={[0, 0.262, 0.17]} />
      </Part>
      {/* lit display niches either side */}
      {[1.45, 5.05].map((nx, k) => (
        <Part key={nx} p={[nx, 0, -3.8]} delay={0.26 + k * 0.06} lift={3} drift={[k ? 0.7 : -0.7, 0, 0.4]}>
          <B s={[0.9, 0.05, 0.4]} p={[0, 0.3, 0]} m="clayDark" />
          <B s={[0.9, 0.05, 0.4]} p={[0, 2.78, 0]} m="clayDark" />
          <B s={[0.05, 2.53, 0.4]} p={[-0.425, 1.54, 0]} m="clayDark" />
          <B s={[0.05, 2.53, 0.4]} p={[0.425, 1.54, 0]} m="clayDark" />
          <B s={[0.8, 2.45, 0.02]} p={[0, 1.54, -0.19]} m="clayMid" />
          {[0.95, 1.5, 2.1].map((y) => (
            <B key={y} s={[0.8, 0.03, 0.36]} p={[0, y, 0]} />
          ))}
          <B s={[0.9, 0.3, 0.42]} p={[0, 0.15, 0]} />
          <mesh geometry={unitBox} material={materials.led} scale={[0.012, 2.4, 0.012]} position={[-0.39, 1.54, 0.16]} />
          <mesh geometry={unitBox} material={materials.led} scale={[0.012, 2.4, 0.012]} position={[0.39, 1.54, 0.16]} />
          <Vases w={0.9} seed={k + 3} />
        </Part>
      ))}
    </>
  );
}

function Lounge() {
  return (
    <>
      <Part p={[3.1, 0, -0.2]} delay={0.1} lift={0.6}>
        <B s={[3.9, 0.014, 2.8]} p={[0, 0.007, 0]} m="clayMid" shadow={false} />
      </Part>
      <Part p={[0, 0, 0]} delay={0.5} lift={2.4} drift={[0, 0, 0.4]}>
        <RoundedBox args={[3.0, 0.38, 0.95]} radius={0.06} smoothness={3} position={[3.2, 0.19, 0.76]} material={materials.clay} castShadow receiveShadow />
        <RoundedBox args={[0.98, 0.38, 1.6]} radius={0.06} smoothness={3} position={[4.21, 0.19, -0.42]} material={materials.clay} castShadow receiveShadow />
        <RoundedBox args={[3.0, 0.44, 0.24]} radius={0.08} smoothness={3} position={[3.2, 0.6, 1.11]} material={materials.clay} castShadow receiveShadow />
        <RoundedBox args={[0.24, 0.44, 2.66]} radius={0.08} smoothness={3} position={[4.58, 0.6, 0.12]} material={materials.clay} castShadow receiveShadow />
        {[2.2, 3.25].map((x) => (
          <RoundedBox key={x} args={[1.02, 0.12, 0.74]} radius={0.05} smoothness={3} position={[x, 0.44, 0.66]} material={materials.clay} castShadow receiveShadow />
        ))}
        <RoundedBox args={[0.74, 0.12, 1.5]} radius={0.05} smoothness={3} position={[4.1, 0.44, -0.4]} material={materials.clay} castShadow receiveShadow />
      </Part>
      <Part p={[2.65, 0, -0.75]} delay={0.6} lift={2}>
        <mesh position={[0, 0.18, 0]} material={materials.clay} castShadow receiveShadow>
          <cylinderGeometry args={[0.5, 0.5, 0.36, 56]} />
        </mesh>
      </Part>
      <Part p={[3.45, 0, -1.2]} delay={0.64} lift={2.2}>
        <mesh position={[0, 0.14, 0]} material={materials.clayMid} castShadow receiveShadow>
          <cylinderGeometry args={[0.32, 0.32, 0.28, 48]} />
        </mesh>
      </Part>
      {/* lounge chair */}
      <Part p={[0.95, 0, -1.25]} delay={0.68} lift={2.2} spin={-0.5}>
        <group rotation={[0, 0.9, 0]}>
          <RoundedBox args={[0.82, 0.4, 0.82]} radius={0.12} smoothness={3} position={[0, 0.2, 0]} material={materials.clay} castShadow receiveShadow />
          <RoundedBox args={[0.82, 0.42, 0.2]} radius={0.09} smoothness={3} position={[0, 0.55, -0.32]} material={materials.clay} castShadow receiveShadow />
        </group>
      </Part>
      {/* plant */}
      <Part p={[5.5, 0, 2.75]} delay={0.74} lift={2}>
        <mesh position={[0, 0.26, 0]} material={materials.clayMid} castShadow receiveShadow>
          <cylinderGeometry args={[0.2, 0.24, 0.52, 32]} />
        </mesh>
        {([[0, 0.95, 0, 0.32], [0.18, 1.25, 0.08, 0.24], [-0.15, 1.3, -0.1, 0.26], [0.02, 1.58, 0.02, 0.2]] as const).map(([x, y, z, r], i) => (
          <mesh key={i} position={[x, y, z]} material={materials.clay} castShadow receiveShadow>
            <icosahedronGeometry args={[r, 1]} />
          </mesh>
        ))}
      </Part>
    </>
  );
}

/* ───────────────────────── plan annotations ───────────────────────── */

// Plan annotations: lines live in the scene, their text lives in the DOM
// (see PLAN_LABELS + LabelLayer) so it stays crisp and selectable-free.
function Dim({ a, b }: { a: V3; b: V3 }) {
  const ref = useRef<THREE.Group>(null);
  const dir = new THREE.Vector3(b[0] - a[0], 0, b[2] - a[2]).normalize();
  const n = new THREE.Vector3(-dir.z, 0, dir.x).multiplyScalar(0.18);
  useFrame(() => {
    const o = scene.dims;
    const g = ref.current;
    if (!g) return;
    g.visible = o > 0.01;
    g.traverse((c) => {
      const m = (c as THREE.Mesh).material as THREE.Material & { opacity?: number };
      if (m && "opacity" in m) m.opacity = o;
    });
  });
  return (
    <group ref={ref}>
      <Line points={[a, b]} color="#141210" lineWidth={1} transparent />
      <Line points={[[a[0] - n.x, a[1], a[2] - n.z], [a[0] + n.x, a[1], a[2] + n.z]]} color="#141210" lineWidth={1} transparent />
      <Line points={[[b[0] - n.x, b[1], b[2] - n.z], [b[0] + n.x, b[1], b[2] + n.z]]} color="#141210" lineWidth={1} transparent />
    </group>
  );
}

function Plan() {
  return (
    <>
      {PLAN_DIMS.map((d, i) => (
        <Dim key={i} a={d.a} b={d.b} />
      ))}
    </>
  );
}

/* ───────────────────────── lights that react to the timeline ───────────────────────── */

function LedDriver() {
  const base = useMemo(() => GLOW.clone(), []);
  const lamp = useRef<THREE.PointLight>(null);
  useFrame(() => {
    const k = 0.25 + scene.glow * 3.2 + scene.dusk * 1.2;
    materials.led.color.copy(base).multiplyScalar(k);
    if (lamp.current) lamp.current.intensity = scene.glow * scene.dusk * 6;
  });
  return <pointLight ref={lamp} position={[3.25, 0.16, -3.42]} distance={3.2} decay={2} color={GLOW} intensity={0} />;
}

export function Maquette() {
  return (
    <group>
      {/* plinth: the model sits on a board like a physical maquette */}
      <mesh geometry={unitBox} material={materials.plinth} scale={[12.7, 0.36, 8.7]} position={[0, -0.18, 0]} receiveShadow castShadow />
      <Walls />
      <TallWall />
      <BaseRun />
      <Island />
      <MediaWall />
      <Lounge />
      <Plan />
      <LedDriver />
    </group>
  );
}
