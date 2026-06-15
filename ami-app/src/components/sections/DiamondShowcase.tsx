"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  Float,
  OrbitControls,
} from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

const easeOut = [0.16, 1, 0.3, 1] as const;

// ─── Improved round brilliant cut diamond ────────────────────────────────────
// Higher facet count + separate crown angles for realism

function createDiamondGeometry() {
  const segments = 32;
  const crownHeight = 0.4;
  const pavilionDepth = 0.9;
  const girdleRadius = 1.0;
  const tableRadius = 0.5;
  const tableY = crownHeight;
  const girdleY = 0;
  const cutletY = -pavilionDepth;
  const starMidY = crownHeight * 0.5;
  const starMidRadius = (girdleRadius + tableRadius) * 0.5;

  const positions: number[] = [];

  function tri(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3) {
    positions.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  }

  function pointAt(radius: number, y: number, angle: number) {
    return new THREE.Vector3(
      Math.cos(angle) * radius,
      y,
      Math.sin(angle) * radius
    );
  }

  const tableCenter = new THREE.Vector3(0, tableY, 0);
  const cutlet = new THREE.Vector3(0, cutletY, 0);

  for (let i = 0; i < segments; i++) {
    const a0 = (i / segments) * Math.PI * 2;
    const a1 = ((i + 1) / segments) * Math.PI * 2;
    const aMid = ((i + 0.5) / segments) * Math.PI * 2;

    const g0 = pointAt(girdleRadius, girdleY, a0);
    const g1 = pointAt(girdleRadius, girdleY, a1);
    const t0 = pointAt(tableRadius, tableY, a0);
    const t1 = pointAt(tableRadius, tableY, a1);
    const sm = pointAt(starMidRadius, starMidY, aMid);

    // Table
    tri(tableCenter, t0, t1);
    // Upper star facets
    tri(t0, sm, t1);
    // Upper kite facets
    tri(t0, g0, sm);
    tri(sm, g1, t1);
    // Lower kite (to girdle)
    tri(g0, g1, sm);
    // Pavilion
    tri(g0, cutlet, g1);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  geometry.computeVertexNormals();
  return geometry;
}

// ─── Diamond mesh ────────────────────────────────────────────────────────────

function Diamond() {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => createDiamondGeometry(), []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
      <mesh ref={meshRef} geometry={geometry} scale={1.5}>
        <meshPhysicalMaterial
          color="#f8f6f0"
          metalness={0}
          roughness={0}
          transmission={0.98}
          thickness={2.0}
          ior={2.42}
          envMapIntensity={2.5}
          clearcoat={1}
          clearcoatRoughness={0}
          transparent
          opacity={0.95}
          attenuationColor={new THREE.Color("#e8e0d2")}
          attenuationDistance={3}
          specularIntensity={1.2}
          specularColor={new THREE.Color("#ffffff")}
          sheen={0.2}
          sheenColor={new THREE.Color("#ffeedd")}
          side={THREE.DoubleSide}
        />
      </mesh>
    </Float>
  );
}

// ─── Scene ───────────────────────────────────────────────────────────────────

function DiamondScene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <spotLight
        position={[5, 8, 5]}
        intensity={2}
        angle={0.35}
        penumbra={0.6}
        castShadow
        color="#fff5e6"
      />
      <spotLight
        position={[-4, 6, -3]}
        intensity={1.0}
        angle={0.3}
        penumbra={0.8}
        color="#e8eeff"
      />
      <pointLight position={[0, -3, 4]} intensity={0.5} color="#ffeedd" />
      <pointLight position={[3, 2, -2]} intensity={0.3} color="#ffe0c0" />

      <Diamond />

      <ContactShadows
        position={[0, -1.3, 0]}
        opacity={0.2}
        scale={8}
        blur={3}
        far={4}
        color="#a09080"
      />

      <Environment preset="studio" />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.8}
        autoRotate
        autoRotateSpeed={0.4}
      />
    </>
  );
}

// ─── Value props ─────────────────────────────────────────────────────────────

const VALUE_PROPS = [
  {
    stat: "60–80%",
    label: "Lower cost",
    detail: "versus mined equivalents at the same carat and clarity",
  },
  {
    stat: "2.42",
    label: "Refractive index",
    detail: "identical optical properties — same fire, same brilliance",
  },
  {
    stat: "Zero",
    label: "Earth displaced",
    detail: "grown above ground in controlled labs, not open-pit mines",
  },
] as const;

// ─── Exported section ────────────────────────────────────────────────────────

export function DiamondShowcase() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <section className="relative z-0 overflow-hidden bg-surface-dark pb-20 pt-40 md:pb-section md:pt-64">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Copy first on mobile, side-by-side on desktop */}
        <div className="grid grid-cols-12 gap-8">
          {/* Copy column */}
          <div className="col-span-12 flex flex-col justify-center md:col-span-5">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: easeOut }}
              className="caption-uppercase text-on-dark-soft"
            >
              The Science of Beauty
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.05, ease: easeOut }}
              className="display-lg mt-5 max-w-md text-on-dark"
            >
              Same diamond.{" "}
              <em className="not-italic text-accent-amber">Smarter</em> origin.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.18, ease: easeOut }}
              className="mt-6 max-w-md text-base leading-relaxed text-on-dark-soft md:text-lg"
            >
              Lab-grown diamonds share the exact crystal structure, hardness,
              and optical fire of mined stones — certified by the same
              gemological institutes. The only difference? They&rsquo;re grown
              in weeks instead of millennia, at a fraction of the cost and
              environmental impact.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.28, ease: easeOut }}
              className="mt-4 max-w-md text-base leading-relaxed text-on-dark-soft md:text-lg"
            >
              That means you get a larger, higher-clarity stone in your dream
              setting — without the ethical weight or the inflated price.
            </motion.p>
          </div>

          {/* 3D Canvas */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: easeOut }}
            className="col-span-12 md:col-span-7"
          >
            <div className="relative aspect-square w-full md:aspect-[4/3]">
              <Canvas
                camera={{ position: [0, 1.2, 4.5], fov: 30 }}
                gl={{ antialias: true, alpha: true }}
                onCreated={() => setIsLoaded(true)}
                style={{ background: "transparent" }}
              >
                <DiamondScene />
              </Canvas>

              {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="caption-uppercase animate-pulse text-on-dark-soft">
                    Loading...
                  </span>
                </div>
              )}
            </div>

            <p className="mt-4 text-center text-xs uppercase tracking-[0.18em] text-on-dark-soft">
              Drag to rotate
            </p>
          </motion.div>
        </div>

        {/* Value propositions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1, ease: easeOut }}
          className="mt-16 grid gap-8 border-t border-white/10 pt-12 md:mt-20 md:grid-cols-3"
        >
          {VALUE_PROPS.map((prop) => (
            <div key={prop.label}>
              <span
                className="block text-on-dark"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.75rem, 2vw + 1rem, 2.5rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                }}
              >
                {prop.stat}
              </span>
              <span className="mt-2 block text-sm font-medium uppercase tracking-[0.12em] text-accent-amber">
                {prop.label}
              </span>
              <p className="mt-2 text-sm leading-relaxed text-on-dark-soft">
                {prop.detail}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
