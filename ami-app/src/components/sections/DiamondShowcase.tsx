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

// ─── Round brilliant cut diamond geometry ────────────────────────────────────
// 57-facet standard: 33 crown facets + 24 pavilion facets

function createDiamondGeometry(
  crownHeight = 0.35,
  pavilionDepth = 0.85,
  tableRatio = 0.55,
  girdleRadius = 1.0,
  crownFacets = 16,
  pavilionFacets = 16
) {
  const vertices: number[] = [];
  const normals: number[] = [];

  function pushTri(
    a: THREE.Vector3,
    b: THREE.Vector3,
    c: THREE.Vector3
  ) {
    const edge1 = new THREE.Vector3().subVectors(b, a);
    const edge2 = new THREE.Vector3().subVectors(c, a);
    const n = new THREE.Vector3().crossVectors(edge1, edge2).normalize();

    vertices.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
    normals.push(n.x, n.y, n.z, n.x, n.y, n.z, n.x, n.y, n.z);
  }

  const tableY = crownHeight;
  const girdleY = 0;
  const cutletY = -pavilionDepth;

  const tableRadius = girdleRadius * tableRatio;

  // Girdle points
  const girdlePoints: THREE.Vector3[] = [];
  const tablePoints: THREE.Vector3[] = [];
  for (let i = 0; i < crownFacets; i++) {
    const angle = (i / crownFacets) * Math.PI * 2;
    girdlePoints.push(
      new THREE.Vector3(
        Math.cos(angle) * girdleRadius,
        girdleY,
        Math.sin(angle) * girdleRadius
      )
    );
    tablePoints.push(
      new THREE.Vector3(
        Math.cos(angle) * tableRadius,
        tableY,
        Math.sin(angle) * tableRadius
      )
    );
  }

  const cutlet = new THREE.Vector3(0, cutletY, 0);

  // Crown: table facets (top polygon triangulated from center)
  const tableCenter = new THREE.Vector3(0, tableY, 0);
  for (let i = 0; i < crownFacets; i++) {
    const next = (i + 1) % crownFacets;
    pushTri(tableCenter, tablePoints[i]!, tablePoints[next]!);
  }

  // Crown: star and bezel facets (table edge to girdle)
  for (let i = 0; i < crownFacets; i++) {
    const next = (i + 1) % crownFacets;
    pushTri(tablePoints[i]!, girdlePoints[i]!, tablePoints[next]!);
    pushTri(tablePoints[next]!, girdlePoints[i]!, girdlePoints[next]!);
  }

  // Pavilion: facets from girdle to cutlet
  for (let i = 0; i < pavilionFacets; i++) {
    const angle1 = (i / pavilionFacets) * Math.PI * 2;
    const angle2 = ((i + 1) / pavilionFacets) * Math.PI * 2;
    const g1 = new THREE.Vector3(
      Math.cos(angle1) * girdleRadius,
      girdleY,
      Math.sin(angle1) * girdleRadius
    );
    const g2 = new THREE.Vector3(
      Math.cos(angle2) * girdleRadius,
      girdleY,
      Math.sin(angle2) * girdleRadius
    );
    pushTri(g1, cutlet, g2);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  geometry.setAttribute(
    "normal",
    new THREE.Float32BufferAttribute(normals, 3)
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
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} geometry={geometry} scale={1.4}>
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0.0}
          roughness={0.0}
          transmission={0.95}
          thickness={1.5}
          ior={2.42}
          envMapIntensity={3}
          clearcoat={1}
          clearcoatRoughness={0}
          transparent
          opacity={0.9}
          attenuationColor={new THREE.Color("#f0e6d4")}
          attenuationDistance={2}
          specularIntensity={1}
          specularColor={new THREE.Color("#ffffff")}
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
      <ambientLight intensity={0.3} />
      <spotLight
        position={[5, 8, 5]}
        intensity={1.5}
        angle={0.4}
        penumbra={0.5}
        castShadow
        color="#fff5e6"
      />
      <spotLight
        position={[-3, 6, -4]}
        intensity={0.8}
        angle={0.3}
        penumbra={0.8}
        color="#e6f0ff"
      />
      <pointLight position={[0, -2, 3]} intensity={0.4} color="#ffeedd" />

      <Diamond />

      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.25}
        scale={8}
        blur={2.5}
        far={4}
        color="#c4b5a0"
      />

      <Environment preset="studio" />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.8}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

// ─── Exported section ────────────────────────────────────────────────────────

export function DiamondShowcase() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <section className="relative z-0 overflow-hidden bg-surface-dark pb-20 pt-40 md:pb-section md:pt-64">
      <div className="mx-auto grid max-w-[1200px] grid-cols-12 gap-8 px-6">
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
              camera={{ position: [0, 1.5, 4], fov: 35 }}
              gl={{ antialias: true, alpha: true }}
              onCreated={() => setIsLoaded(true)}
              style={{ background: "transparent" }}
            >
              <DiamondScene />
            </Canvas>

            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="caption-uppercase text-on-dark-soft animate-pulse">
                  Loading...
                </span>
              </div>
            )}
          </div>

          <p className="mt-4 text-center text-xs uppercase tracking-[0.18em] text-on-dark-soft">
            Drag to rotate
          </p>
        </motion.div>

        {/* Copy */}
        <div className="col-span-12 flex flex-col justify-center md:col-span-5">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="caption-uppercase text-on-dark-soft"
          >
            Precision in Every Facet
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.05, ease: easeOut }}
            className="display-lg mt-5 max-w-md text-on-dark"
          >
            57 facets of{" "}
            <em className="not-italic text-accent-amber">light</em>,
            engineered to perfection.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.18, ease: easeOut }}
            className="mt-6 max-w-md text-base text-on-dark-soft md:text-lg"
          >
            Each lab-grown diamond is cut to ideal proportions — maximising
            brilliance, fire, and scintillation. The same science. None of the
            compromise.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.32, ease: easeOut }}
            className="mt-8 flex flex-wrap gap-8"
          >
            <Stat label="Refractive Index" value="2.42" />
            <Stat label="Brilliance" value="Ideal" />
            <Stat label="Origin" value="Lab-grown" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="block font-display text-2xl tracking-tight text-on-dark">
        {value}
      </span>
      <span className="mt-1 block text-xs uppercase tracking-[0.15em] text-on-dark-soft">
        {label}
      </span>
    </div>
  );
}
