import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Text, Float, ContactShadows, RoundedBox, MeshReflectorMaterial } from "@react-three/drei";
import { Suspense, useRef, useMemo, useState } from "react";
import * as THREE from "three";

interface Office3DProps {
  onDeskClick: (agent: string) => void;
}

const agents = [
  { id: "max_credit", name: "Max Credit", specialty: "Personal Credit", position: [-4, 0, -2] as [number, number, number], color: "#D4AF37", skinTone: "#C68642" },
  { id: "biz_credit", name: "Biz Builder Brock", specialty: "Business Credit", position: [-1.5, 0, -3.5] as [number, number, number], color: "#2196F3", skinTone: "#8D5524" },
  { id: "credit_repair", name: "Fix-It Frankie", specialty: "Credit Repair", position: [1.5, 0, -3.5] as [number, number, number], color: "#E53935", skinTone: "#F1C27D" },
  { id: "empire_eva", name: "Empire Eva", specialty: "Entity Builder", position: [3, 0, -2] as [number, number, number], color: "#7F77DD", skinTone: "#C68642" },
  { id: "revenue_rex", name: "Revenue Rex", specialty: "Revenue Tracker", position: [-3, 0, 2] as [number, number, number], color: "#4CAF50", skinTone: "#E0AC69" },
  { id: "koach_coin", name: "Koach Coin", specialty: "$KOACH Token", position: [3, 0, 2] as [number, number, number], color: "#FF9800", skinTone: "#8D5524" },
];

/* ── Seated Avatar Figure ── */
function SeatedAvatar({ color, skinTone }: { color: string; skinTone: string }) {
  const ref = useRef<THREE.Group>(null);
  const skinMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: skinTone, roughness: 0.55, metalness: 0, clearcoat: 0.08,
    sheen: 0.25, sheenRoughness: 0.6,
    sheenColor: new THREE.Color(skinTone).lerp(new THREE.Color("#ff9999"), 0.12),
  }), [skinTone]);

  const suitMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color).lerp(new THREE.Color("#111"), 0.5).getStyle(),
    roughness: 0.6, metalness: 0.05, sheen: 0.3, sheenRoughness: 0.5,
    sheenColor: new THREE.Color(color).lerp(new THREE.Color("#fff"), 0.1),
  }), [color]);

  // Subtle idle animation
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.008;
    }
  });

  return (
    <group ref={ref} position={[0, 0.75, 0.55]} scale={0.38}>
      {/* Head */}
      <mesh position={[0, 2.15, 0]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <primitive object={skinMat} attach="material" />
      </mesh>
      {/* Hair */}
      <mesh position={[0, 2.25, -0.03]}>
        <sphereGeometry args={[0.23, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.92, 0]}>
        <capsuleGeometry args={[0.07, 0.06, 8, 12]} />
        <primitive object={skinMat} attach="material" />
      </mesh>
      {/* Torso */}
      <RoundedBox args={[0.5, 0.55, 0.28]} radius={0.06} smoothness={3} position={[0, 1.58, 0]}>
        <primitive object={suitMat} attach="material" />
      </RoundedBox>
      {/* Shoulders */}
      <mesh position={[-0.28, 1.78, 0]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <primitive object={suitMat} attach="material" />
      </mesh>
      <mesh position={[0.28, 1.78, 0]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <primitive object={suitMat} attach="material" />
      </mesh>
      {/* Arms (reaching toward desk) */}
      {[-1, 1].map((side) => (
        <group key={side}>
          {/* Upper arm */}
          <mesh position={[side * 0.32, 1.6, 0.05]} rotation={[0.4, 0, side * 0.15]}>
            <capsuleGeometry args={[0.06, 0.22, 6, 12]} />
            <primitive object={suitMat} attach="material" />
          </mesh>
          {/* Forearm - reaching forward */}
          <mesh position={[side * 0.3, 1.38, 0.18]} rotation={[1.2, 0, side * 0.05]}>
            <capsuleGeometry args={[0.05, 0.2, 6, 12]} />
            <primitive object={suitMat} attach="material" />
          </mesh>
          {/* Hand on desk */}
          <mesh position={[side * 0.25, 1.28, 0.35]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <primitive object={skinMat} attach="material" />
          </mesh>
        </group>
      ))}
      {/* Seated legs (bent at knee) */}
      {[-1, 1].map((side) => (
        <group key={side}>
          {/* Thigh (horizontal) */}
          <mesh position={[side * 0.12, 1.22, 0.12]} rotation={[1.4, 0, 0]}>
            <capsuleGeometry args={[0.075, 0.22, 6, 12]} />
            <primitive object={suitMat} attach="material" />
          </mesh>
          {/* Lower leg (hanging down) */}
          <mesh position={[side * 0.12, 0.95, 0.32]} rotation={[0.1, 0, 0]}>
            <capsuleGeometry args={[0.06, 0.25, 6, 12]} />
            <primitive object={suitMat} attach="material" />
          </mesh>
          {/* Shoe */}
          <RoundedBox args={[0.1, 0.06, 0.18]} radius={0.02} smoothness={2} position={[side * 0.12, 0.72, 0.38]}>
            <meshPhysicalMaterial color="#111" roughness={0.2} clearcoat={0.7} />
          </RoundedBox>
        </group>
      ))}
      {/* Glowing accent ring behind head (agent color indicator) */}
      <mesh position={[0, 2.15, -0.15]} rotation={[0, 0, 0]}>
        <ringGeometry args={[0.24, 0.27, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/* ── Executive Desk with Monitor + Details ── */
function Desk({ position, color, name, specialty, skinTone, onClick }: {
  position: [number, number, number];
  color: string;
  name: string;
  specialty: string;
  skinTone: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={position}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Desk surface - dark glass/wood */}
      <RoundedBox args={[2, 0.06, 1.1]} radius={0.02} smoothness={3} position={[0, 0.75, 0]} castShadow>
        <meshPhysicalMaterial
          color="#16162a"
          metalness={0.4}
          roughness={0.3}
          clearcoat={0.6}
          clearcoatRoughness={0.1}
        />
      </RoundedBox>
      {/* Desk edge accent */}
      <mesh position={[0, 0.74, -0.55]}>
        <boxGeometry args={[2, 0.02, 0.01]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.8 : 0.2} />
      </mesh>
      {/* Desk legs - metal */}
      {[[-0.85, 0.37, -0.45], [0.85, 0.37, -0.45], [-0.85, 0.37, 0.45], [0.85, 0.37, 0.45]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.025, 0.03, 0.74, 8]} />
          <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Monitor - wide ultrawide */}
      <group position={[0, 1.15, -0.35]}>
        {/* Monitor frame */}
        <RoundedBox args={[0.95, 0.55, 0.025]} radius={0.015} smoothness={2} castShadow>
          <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.15} />
        </RoundedBox>
        {/* Screen */}
        <mesh position={[0, 0, 0.014]}>
          <planeGeometry args={[0.88, 0.48]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 0.7 : 0.35}
          />
        </mesh>
        {/* Screen data lines */}
        {[-0.15, -0.05, 0.05, 0.15].map((y, i) => (
          <mesh key={i} position={[-0.15 + i * 0.08, y, 0.015]}>
            <planeGeometry args={[0.15 + Math.random() * 0.2, 0.015]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.15} transparent opacity={0.3} />
          </mesh>
        ))}
        {/* Monitor stand */}
        <mesh position={[0, -0.32, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
          <meshStandardMaterial color="#222" metalness={0.7} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.37, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.005, 16]} />
          <meshStandardMaterial color="#222" metalness={0.7} roughness={0.2} />
        </mesh>
      </group>

      {/* Keyboard */}
      <RoundedBox args={[0.35, 0.015, 0.12]} radius={0.005} smoothness={2} position={[0, 0.79, 0.05]}>
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
      </RoundedBox>
      {/* Mouse */}
      <mesh position={[0.3, 0.785, 0.05]}>
        <capsuleGeometry args={[0.02, 0.03, 4, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
      </mesh>
      {/* Coffee mug */}
      <mesh position={[-0.7, 0.84, 0.15]}>
        <cylinderGeometry args={[0.03, 0.025, 0.08, 12]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.5} />
      </mesh>

      {/* Office chair */}
      <group position={[0, 0, 0.75]}>
        {/* Seat */}
        <RoundedBox args={[0.5, 0.06, 0.5]} radius={0.02} smoothness={2} position={[0, 0.48, 0]}>
          <meshPhysicalMaterial color="#1a1a1a" roughness={0.7} sheen={0.3} sheenRoughness={0.5} sheenColor="#333" />
        </RoundedBox>
        {/* Backrest */}
        <RoundedBox args={[0.48, 0.55, 0.05]} radius={0.02} smoothness={2} position={[0, 0.8, 0.22]}>
          <meshPhysicalMaterial color="#1a1a1a" roughness={0.7} sheen={0.3} sheenRoughness={0.5} sheenColor="#333" />
        </RoundedBox>
        {/* Chair base */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.28, 8]} />
          <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Chair wheel base */}
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = (i / 5) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 0.2, 0.06, Math.sin(angle) * 0.2]}>
              <sphereGeometry args={[0.025, 8, 8]} />
              <meshStandardMaterial color="#222" metalness={0.6} roughness={0.3} />
            </mesh>
          );
        })}
      </group>

      {/* Seated Avatar */}
      <SeatedAvatar color={color} skinTone={skinTone} />

      {/* Floating name tag */}
      <Float speed={2} rotationIntensity={0} floatIntensity={0.2}>
        <Text
          position={[0, 2.1, 0]}
          fontSize={0.18}
          color={color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.012}
          outlineColor="#000"
        >
          {name}
        </Text>
        <Text
          position={[0, 1.9, 0]}
          fontSize={0.1}
          color="#888"
          anchorX="center"
          anchorY="middle"
        >
          {specialty}
        </Text>
      </Float>

      {/* Hover glow platform */}
      <mesh position={[0, 0.005, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.35, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.6 : 0.15}
          transparent
          opacity={hovered ? 0.6 : 0.25}
        />
      </mesh>
    </group>
  );
}

/* ── Reflective Floor ── */
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[24, 24]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={512}
        mixBlur={1}
        mixStrength={0.6}
        roughness={0.85}
        depthScale={1.2}
        color="#0d0d18"
        metalness={0.15}
        mirror={0.4}
      />
    </mesh>
  );
}

/* ── Walls with ambient windows ── */
function Walls() {
  return (
    <group>
      {/* Back wall */}
      <mesh position={[0, 3, -6]}>
        <planeGeometry args={[24, 6]} />
        <meshStandardMaterial color="#10101c" />
      </mesh>
      {/* Left wall */}
      <mesh position={[-12, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color="#10101c" />
      </mesh>
      {/* Right wall */}
      <mesh position={[12, 3, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color="#10101c" />
      </mesh>

      {/* Panoramic window on back wall */}
      <mesh position={[0, 3.5, -5.97]}>
        <planeGeometry args={[16, 3]} />
        <meshStandardMaterial
          color="#0a1628"
          emissive="#0a1628"
          emissiveIntensity={0.4}
          transparent
          opacity={0.7}
        />
      </mesh>
      {/* City skyline silhouette (subtle glow) */}
      {[-6, -4, -2, -0.5, 1, 2.5, 4, 6].map((x, i) => {
        const h = 0.4 + Math.abs(Math.sin(i * 1.5)) * 1.2;
        return (
          <mesh key={i} position={[x, 2.2 + h / 2, -5.95]}>
            <planeGeometry args={[0.6 + (i % 2) * 0.3, h]} />
            <meshStandardMaterial
              color="#0d1a2e"
              emissive="#162a44"
              emissiveIntensity={0.2}
              transparent
              opacity={0.6}
            />
          </mesh>
        );
      })}
      {/* Window trim light strips */}
      <mesh position={[0, 4.98, -5.96]}>
        <planeGeometry args={[16, 0.02]} />
        <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 2.02, -5.96]}>
        <planeGeometry args={[16, 0.02]} />
        <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

/* ── Center Conference Table with Logo ── */
function CenterTable() {
  return (
    <group position={[0, 0, 0]}>
      {/* Table top */}
      <mesh position={[0, 0.42, 0]} castShadow>
        <cylinderGeometry args={[1, 1, 0.05, 48]} />
        <meshPhysicalMaterial color="#14142a" metalness={0.5} roughness={0.3} clearcoat={0.5} clearcoatRoughness={0.1} />
      </mesh>
      {/* Gold inlay */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.015, 48]} />
        <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={0.25} metalness={0.9} roughness={0.15} />
      </mesh>
      {/* $K text on table */}
      <Text
        position={[0, 0.465, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.25}
        color="#D4AF37"
        anchorX="center"
        anchorY="middle"
      >
        $K
      </Text>
      {/* Table pedestal */}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 0.42, 16]} />
        <meshStandardMaterial color="#111" metalness={0.6} roughness={0.2} />
      </mesh>
      {/* Table base */}
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.02, 24]} />
        <meshStandardMaterial color="#111" metalness={0.6} roughness={0.2} />
      </mesh>
    </group>
  );
}

/* ── Decorative Elements ── */
function OfficeDecor() {
  return (
    <group>
      {/* Ceiling light strips */}
      {[-4, 0, 4].map((x) => (
        <mesh key={x} position={[x, 4.8, -1]}>
          <boxGeometry args={[3, 0.03, 0.15]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
        </mesh>
      ))}
      {/* Side accent lights on walls */}
      {[-11.9, 11.9].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 2, -2]}>
            <boxGeometry args={[0.02, 1.5, 0.05]} />
            <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[x, 2, 2]}>
            <boxGeometry args={[0.02, 1.5, 0.05]} />
            <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={0.3} />
          </mesh>
        </group>
      ))}
      {/* Ceiling */}
      <mesh position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[24, 12]} />
        <meshStandardMaterial color="#0e0e16" />
      </mesh>
    </group>
  );
}

export function Office3D({ onDeskClick }: Office3DProps) {
  return (
    <div className="absolute inset-0" style={{ width: "100%", height: "100%" }}>
      <Canvas
        shadows
        camera={{ position: [0, 6, 10], fov: 45 }}
        style={{ background: "#080810", width: "100%", height: "100%" }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
      >
        <Suspense fallback={null}>
          {/* Lighting rig */}
          <ambientLight intensity={0.25} />
          <directionalLight
            position={[5, 10, 5]}
            intensity={0.9}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.001}
          />
          <pointLight position={[0, 4, 0]} intensity={0.6} color="#D4AF37" distance={12} />
          <pointLight position={[-6, 3, -2]} intensity={0.3} color="#2196F3" distance={8} />
          <pointLight position={[6, 3, -2]} intensity={0.3} color="#7F77DD" distance={8} />
          {/* Rim light from window */}
          <rectAreaLight position={[0, 4, -5.5]} width={14} height={3} intensity={0.8} color="#1a2a4a" />

          <Floor />
          <Walls />
          <OfficeDecor />
          <CenterTable />

          {agents.map((agent) => (
            <Desk
              key={agent.id}
              position={agent.position}
              color={agent.color}
              name={agent.name}
              specialty={agent.specialty}
              skinTone={agent.skinTone}
              onClick={() => onDeskClick(agent.id)}
            />
          ))}

          <ContactShadows
            position={[0, 0.01, 0]}
            opacity={0.5}
            scale={24}
            blur={2.5}
            far={5}
          />

          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={4}
            maxDistance={16}
            maxPolarAngle={Math.PI / 2.1}
            minPolarAngle={0.2}
            target={[0, 1, 0]}
          />

          <Environment preset="night" />

          {/* Fog for depth */}
          <fog attach="fog" args={["#080810", 10, 25]} />
        </Suspense>
      </Canvas>
    </div>
  );
}
