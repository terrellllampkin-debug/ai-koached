import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Text, Float, ContactShadows, RoundedBox } from "@react-three/drei";
import { Suspense, useRef, useMemo, useState } from "react";
import * as THREE from "three";

interface Office3DProps {
  onDeskClick: (agent: string) => void;
}

/* ── DEPARTMENT & AGENT DATA ── */
const departments = [
  {
    name: "CREDIT EMPIRE",
    color: "#D4AF37",
    signPos: [-6, 3.8, -3] as [number, number, number],
    floorCenter: [-6, 0.01, -1.5] as [number, number, number],
    floorSize: [6, 5] as [number, number],
    agents: [
      { id: "max_credit", name: "Max Credit", role: "Personal Credit", pos: [-7, 0, -3] as [number, number, number], skinTone: "#C68642" },
      { id: "biz_credit", name: "Biz Builder Brock", role: "Business Credit", pos: [-5, 0, -3] as [number, number, number], skinTone: "#8D5524" },
      { id: "credit_repair", name: "Fix-It Frankie", role: "Credit Repair", pos: [-6, 0, 0] as [number, number, number], skinTone: "#F1C27D" },
    ],
  },
  {
    name: "ENTITY BUILDER",
    color: "#7F77DD",
    signPos: [1, 3.8, -3] as [number, number, number],
    floorCenter: [1, 0.01, -3] as [number, number, number],
    floorSize: [4, 3] as [number, number],
    agents: [
      { id: "empire_eva", name: "Empire Eva", role: "Entity Formation", pos: [1, 0, -3] as [number, number, number], skinTone: "#C68642" },
    ],
  },
  {
    name: "REVENUE HQ",
    color: "#1DB977",
    signPos: [4, 3.8, -3] as [number, number, number],
    floorCenter: [4, 0.01, -3] as [number, number, number],
    floorSize: [4, 3] as [number, number],
    agents: [
      { id: "revenue_rex", name: "Revenue Rex", role: "Revenue Tracker", pos: [4, 0, -3] as [number, number, number], skinTone: "#E0AC69" },
    ],
  },
  {
    name: "$KOACH TOWER",
    color: "#FF9800",
    signPos: [7, 3.8, 0] as [number, number, number],
    floorCenter: [7, 0.01, 0] as [number, number, number],
    floorSize: [4, 4] as [number, number],
    agents: [
      { id: "koach_coin", name: "Koach Coin", role: "$KOACH Token", pos: [7, 0, 0] as [number, number, number], skinTone: "#8D5524" },
    ],
  },
];

const ceoAgent = {
  id: "the_architect",
  name: "The Architect",
  role: "Master Builder",
  pos: [0, 0, 3] as [number, number, number],
  color: "#D4AF37",
  skinTone: "#E0AC69",
};

/* ── Seated Avatar ── */
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

  useFrame((state) => {
    if (ref.current) ref.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.008;
  });

  return (
    <group ref={ref} position={[0, 0.75, 0.55]} scale={0.38}>
      <mesh position={[0, 2.15, 0]}><sphereGeometry args={[0.22, 32, 32]} /><primitive object={skinMat} attach="material" /></mesh>
      <mesh position={[0, 2.25, -0.03]}><sphereGeometry args={[0.23, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} /><meshStandardMaterial color="#1a1a1a" roughness={0.7} /></mesh>
      <mesh position={[0, 1.92, 0]}><capsuleGeometry args={[0.07, 0.06, 8, 12]} /><primitive object={skinMat} attach="material" /></mesh>
      <RoundedBox args={[0.5, 0.55, 0.28]} radius={0.06} smoothness={3} position={[0, 1.58, 0]}><primitive object={suitMat} attach="material" /></RoundedBox>
      <mesh position={[-0.28, 1.78, 0]}><sphereGeometry args={[0.09, 16, 16]} /><primitive object={suitMat} attach="material" /></mesh>
      <mesh position={[0.28, 1.78, 0]}><sphereGeometry args={[0.09, 16, 16]} /><primitive object={suitMat} attach="material" /></mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 0.32, 1.6, 0.05]} rotation={[0.4, 0, side * 0.15]}><capsuleGeometry args={[0.06, 0.22, 6, 12]} /><primitive object={suitMat} attach="material" /></mesh>
          <mesh position={[side * 0.3, 1.38, 0.18]} rotation={[1.2, 0, side * 0.05]}><capsuleGeometry args={[0.05, 0.2, 6, 12]} /><primitive object={suitMat} attach="material" /></mesh>
          <mesh position={[side * 0.25, 1.28, 0.35]}><sphereGeometry args={[0.04, 12, 12]} /><primitive object={skinMat} attach="material" /></mesh>
        </group>
      ))}
      {[-1, 1].map((side) => (
        <group key={`leg${side}`}>
          <mesh position={[side * 0.12, 1.22, 0.12]} rotation={[1.4, 0, 0]}><capsuleGeometry args={[0.075, 0.22, 6, 12]} /><primitive object={suitMat} attach="material" /></mesh>
          <mesh position={[side * 0.12, 0.95, 0.32]} rotation={[0.1, 0, 0]}><capsuleGeometry args={[0.06, 0.25, 6, 12]} /><primitive object={suitMat} attach="material" /></mesh>
          <RoundedBox args={[0.1, 0.06, 0.18]} radius={0.02} smoothness={2} position={[side * 0.12, 0.72, 0.38]}><meshPhysicalMaterial color="#111" roughness={0.2} clearcoat={0.7} /></RoundedBox>
        </group>
      ))}
      <mesh position={[0, 2.15, -0.15]}>
        <ringGeometry args={[0.24, 0.27, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/* ── Desk ── */
function Desk({ position, color, name, role, skinTone, onClick, scale = 1 }: {
  position: [number, number, number]; color: string; name: string; role: string; skinTone: string; onClick: () => void; scale?: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={position}
      scale={scale}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = "auto"; }}
    >
      {/* Desk surface */}
      <RoundedBox args={[2, 0.06, 1.1]} radius={0.02} smoothness={3} position={[0, 0.75, 0]} castShadow>
        <meshPhysicalMaterial color="#16162a" metalness={0.4} roughness={0.3} clearcoat={0.6} clearcoatRoughness={0.1} />
      </RoundedBox>
      {/* Edge accent */}
      <mesh position={[0, 0.74, -0.55]}><boxGeometry args={[2, 0.02, 0.01]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.8 : 0.2} /></mesh>
      {/* Legs */}
      {[[-0.85, 0.37, -0.45], [0.85, 0.37, -0.45], [-0.85, 0.37, 0.45], [0.85, 0.37, 0.45]].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}><cylinderGeometry args={[0.025, 0.03, 0.74, 8]} /><meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} /></mesh>
      ))}
      {/* Monitor */}
      <group position={[0, 1.15, -0.35]}>
        <RoundedBox args={[0.95, 0.55, 0.025]} radius={0.015} smoothness={2} castShadow><meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.15} /></RoundedBox>
        <mesh position={[0, 0, 0.014]}><planeGeometry args={[0.88, 0.48]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.7 : 0.35} /></mesh>
        <mesh position={[0, -0.32, 0]}><cylinderGeometry args={[0.02, 0.02, 0.1, 8]} /><meshStandardMaterial color="#222" metalness={0.7} roughness={0.2} /></mesh>
        <mesh position={[0, -0.37, 0.05]} rotation={[-Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.12, 0.12, 0.005, 16]} /><meshStandardMaterial color="#222" metalness={0.7} roughness={0.2} /></mesh>
      </group>
      {/* Keyboard + Mouse */}
      <RoundedBox args={[0.35, 0.015, 0.12]} radius={0.005} smoothness={2} position={[0, 0.79, 0.05]}><meshStandardMaterial color="#1a1a1a" roughness={0.6} /></RoundedBox>
      <mesh position={[0.3, 0.785, 0.05]}><capsuleGeometry args={[0.02, 0.03, 4, 8]} /><meshStandardMaterial color="#1a1a1a" roughness={0.4} /></mesh>
      {/* Nameplate on desk */}
      <group position={[-0.6, 0.8, 0.2]}>
        <RoundedBox args={[0.4, 0.1, 0.05]} radius={0.01} smoothness={2}><meshStandardMaterial color="#111" metalness={0.5} roughness={0.3} /></RoundedBox>
        <Text position={[0, 0, 0.03]} fontSize={0.04} color={color} anchorX="center" anchorY="middle">{name}</Text>
      </group>
      {/* Chair */}
      <group position={[0, 0, 0.75]}>
        <RoundedBox args={[0.5, 0.06, 0.5]} radius={0.02} smoothness={2} position={[0, 0.48, 0]}><meshPhysicalMaterial color="#1a1a1a" roughness={0.7} /></RoundedBox>
        <RoundedBox args={[0.48, 0.55, 0.05]} radius={0.02} smoothness={2} position={[0, 0.8, 0.22]}><meshPhysicalMaterial color="#1a1a1a" roughness={0.7} /></RoundedBox>
        <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.03, 0.03, 0.28, 8]} /><meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} /></mesh>
        {[0, 1, 2, 3, 4].map((i) => {
          const a = (i / 5) * Math.PI * 2;
          return <mesh key={i} position={[Math.cos(a) * 0.2, 0.06, Math.sin(a) * 0.2]}><sphereGeometry args={[0.025, 8, 8]} /><meshStandardMaterial color="#222" metalness={0.6} roughness={0.3} /></mesh>;
        })}
      </group>
      {/* Avatar */}
      <SeatedAvatar color={color} skinTone={skinTone} />
      {/* Floating name */}
      <Float speed={2} rotationIntensity={0} floatIntensity={0.2}>
        <Text position={[0, 2.1, 0]} fontSize={0.18} color={color} anchorX="center" anchorY="middle" outlineWidth={0.012} outlineColor="#000">{name}</Text>
        <Text position={[0, 1.9, 0]} fontSize={0.1} color="#888" anchorX="center" anchorY="middle">{role}</Text>
      </Float>
      {/* Hover text */}
      {hovered && (
        <Text position={[0, 2.4, 0]} fontSize={0.12} color="#ffffff" anchorX="center" anchorY="middle" outlineWidth={0.01} outlineColor="#000">
          ▶ Click to Chat
        </Text>
      )}
      {/* Hover glow ring */}
      <mesh position={[0, 0.005, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.35, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.6 : 0.15} transparent opacity={hovered ? 0.6 : 0.25} />
      </mesh>
    </group>
  );
}

/* ── Department Zone ── */
function DepartmentZone({ name, color, signPos, floorCenter, floorSize }: {
  name: string; color: string; signPos: [number, number, number]; floorCenter: [number, number, number]; floorSize: [number, number];
}) {
  const hw = floorSize[0] / 2;
  const hd = floorSize[1] / 2;
  const corners: [number, number][] = [[-hw, -hd], [hw, -hd], [-hw, hd], [hw, hd]];

  return (
    <group>
      {/* Colored floor section */}
      <mesh position={floorCenter} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={floorSize} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.08} transparent opacity={0.15} />
      </mesh>
      {/* Corner posts */}
      {corners.map(([cx, cz], i) => (
        <group key={i} position={[floorCenter[0] + cx, 0, floorCenter[2] + cz]}>
          <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.03, 0.03, 1, 8]} /><meshStandardMaterial color="#222" metalness={0.7} roughness={0.3} /></mesh>
          <mesh position={[0, 1.02, 0]}><sphereGeometry args={[0.06, 12, 12]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} /></mesh>
        </group>
      ))}
      {/* Floating sign */}
      <group position={signPos}>
        <RoundedBox args={[2.2, 0.4, 0.08]} radius={0.05} smoothness={3}>
          <meshPhysicalMaterial color="#0a0a14" roughness={0.4} metalness={0.3} clearcoat={0.3} />
        </RoundedBox>
        <Text position={[0, 0, 0.05]} fontSize={0.16} color={color} anchorX="center" anchorY="middle" outlineWidth={0.008} outlineColor="#000">{name}</Text>
        {/* Rod connecting sign to floor */}
        <mesh position={[0, -1.9, 0]}><cylinderGeometry args={[0.015, 0.015, 3.8, 6]} /><meshStandardMaterial color="#222" metalness={0.6} roughness={0.3} /></mesh>
      </group>
    </group>
  );
}

/* ── Partition Wall ── */
function PartitionWall({ position, rotation = [0, 0, 0], color, length = 3 }: {
  position: [number, number, number]; rotation?: [number, number, number]; color: string; length?: number;
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Dark panel bottom */}
      <RoundedBox args={[length, 1.8, 0.08]} radius={0.02} smoothness={2} position={[0, 0.9, 0]}>
        <meshPhysicalMaterial color="#0e0e1a" roughness={0.5} metalness={0.2} />
      </RoundedBox>
      {/* Frosted glass top */}
      <RoundedBox args={[length, 0.8, 0.06]} radius={0.02} smoothness={2} position={[0, 2.2, 0]}>
        <meshPhysicalMaterial color="#1a1a2e" roughness={0.8} metalness={0.05} transparent opacity={0.4} />
      </RoundedBox>
      {/* Colored accent bar */}
      <mesh position={[0, 1.8, 0.045]}><boxGeometry args={[length, 0.03, 0.01]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} /></mesh>
    </group>
  );
}

/* ── Room Shell ── */
function Room() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[28, 20]} />
        <meshPhysicalMaterial color="#0d0d18" metalness={0.15} roughness={0.6} clearcoat={0.3} clearcoatRoughness={0.4} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, 3, -7]}><planeGeometry args={[28, 6]} /><meshStandardMaterial color="#10101c" /></mesh>
      {/* Left wall */}
      <mesh position={[-14, 3, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[14, 6]} /><meshStandardMaterial color="#10101c" /></mesh>
      {/* Right wall */}
      <mesh position={[14, 3, 0]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[14, 6]} /><meshStandardMaterial color="#10101c" /></mesh>
      {/* Panoramic window */}
      <mesh position={[0, 3.5, -6.97]}><planeGeometry args={[20, 3]} /><meshStandardMaterial color="#0a1628" emissive="#0a1628" emissiveIntensity={0.4} transparent opacity={0.7} /></mesh>
      {/* City skyline */}
      {[-8, -6, -4, -2, -0.5, 1, 2.5, 4, 6, 8].map((x, i) => {
        const h = 0.4 + Math.abs(Math.sin(i * 1.5)) * 1.2;
        return <mesh key={i} position={[x, 2.2 + h / 2, -6.95]}><planeGeometry args={[0.6 + (i % 2) * 0.3, h]} /><meshStandardMaterial color="#0d1a2e" emissive="#162a44" emissiveIntensity={0.2} transparent opacity={0.6} /></mesh>;
      })}
      {/* Window trim */}
      <mesh position={[0, 4.98, -6.96]}><planeGeometry args={[20, 0.02]} /><meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={0.5} /></mesh>
      <mesh position={[0, 2.02, -6.96]}><planeGeometry args={[20, 0.02]} /><meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={0.3} /></mesh>
      {/* Ceiling */}
      <mesh position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[28, 20]} /><meshStandardMaterial color="#0e0e16" /></mesh>
      {/* Ceiling light strips */}
      {[-6, -2, 2, 6].map((x) => (
        <mesh key={x} position={[x, 4.8, -1]}><boxGeometry args={[3, 0.03, 0.15]} /><meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} /></mesh>
      ))}
      {/* Wall accent bars */}
      {[-13.9, 13.9].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 2, -3]}><boxGeometry args={[0.02, 1.5, 0.05]} /><meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={0.3} /></mesh>
          <mesh position={[x, 2, 2]}><boxGeometry args={[0.02, 1.5, 0.05]} /><meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={0.3} /></mesh>
        </group>
      ))}
    </group>
  );
}

/* ── Center Conference Table ── */
function CenterTable() {
  return (
    <group position={[0, 0, -1]}>
      <mesh position={[0, 0.42, 0]} castShadow><cylinderGeometry args={[1, 1, 0.05, 48]} /><meshPhysicalMaterial color="#14142a" metalness={0.5} roughness={0.3} clearcoat={0.5} clearcoatRoughness={0.1} /></mesh>
      <mesh position={[0, 0.45, 0]}><cylinderGeometry args={[0.6, 0.6, 0.015, 48]} /><meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={0.25} metalness={0.9} roughness={0.15} /></mesh>
      <Text position={[0, 0.465, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.25} color="#D4AF37" anchorX="center" anchorY="middle">$K</Text>
      <mesh position={[0, 0.22, 0]}><cylinderGeometry args={[0.1, 0.15, 0.42, 16]} /><meshStandardMaterial color="#111" metalness={0.6} roughness={0.2} /></mesh>
      <mesh position={[0, 0.01, 0]}><cylinderGeometry args={[0.4, 0.4, 0.02, 24]} /><meshStandardMaterial color="#111" metalness={0.6} roughness={0.2} /></mesh>
    </group>
  );
}

/* ── Main Export ── */
export function Office3D({ onDeskClick }: Office3DProps) {
  return (
    <div className="absolute inset-0" style={{ width: "100%", height: "100%" }}>
      <Canvas
        shadows
        camera={{ position: [0, 8, 13], fov: 45 }}
        style={{ background: "#080810", width: "100%", height: "100%" }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.25} />
          <directionalLight position={[5, 10, 5]} intensity={0.9} castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.001} />
          <pointLight position={[0, 4, 0]} intensity={0.6} color="#D4AF37" distance={14} />
          <pointLight position={[-7, 3, -2]} intensity={0.3} color="#D4AF37" distance={8} />
          <pointLight position={[4, 3, -2]} intensity={0.3} color="#1DB977" distance={8} />
          <pointLight position={[7, 3, 0]} intensity={0.3} color="#FF9800" distance={8} />
          <pointLight position={[1, 3, -3]} intensity={0.3} color="#7F77DD" distance={8} />
          <spotLight position={[0, 4.5, -6]} intensity={0.6} color="#1a2a4a" angle={1} penumbra={1} />

          <Room />
          <CenterTable />

          {/* Department zones */}
          {departments.map((dept) => (
            <DepartmentZone key={dept.name} name={dept.name} color={dept.color} signPos={dept.signPos} floorCenter={dept.floorCenter} floorSize={dept.floorSize} />
          ))}

          {/* Partition walls */}
          <PartitionWall position={[-2.8, 0, -1.5]} rotation={[0, Math.PI / 2, 0]} color="#D4AF37" length={4} />
          <PartitionWall position={[2.8, 0, -3]} rotation={[0, Math.PI / 2, 0]} color="#7F77DD" length={3} />
          <PartitionWall position={[5.5, 0, -1]} rotation={[0, 0, 0]} color="#FF9800" length={2} />

          {/* Department agents */}
          {departments.map((dept) =>
            dept.agents.map((agent) => (
              <Desk
                key={agent.id}
                position={agent.pos}
                color={dept.color}
                name={agent.name}
                role={agent.role}
                skinTone={agent.skinTone}
                onClick={() => onDeskClick(agent.id)}
              />
            ))
          )}

          {/* CEO Desk — 25% bigger */}
          <Desk
            position={ceoAgent.pos}
            color={ceoAgent.color}
            name={ceoAgent.name}
            role={ceoAgent.role}
            skinTone={ceoAgent.skinTone}
            onClick={() => onDeskClick(ceoAgent.id)}
            scale={1.25}
          />
          {/* CEO floating sign */}
          <Float speed={1.5} rotationIntensity={0} floatIntensity={0.15}>
            <group position={[0, 4.2, 3]}>
              <RoundedBox args={[2, 0.4, 0.08]} radius={0.05} smoothness={3}>
                <meshPhysicalMaterial color="#0a0a14" roughness={0.4} metalness={0.3} clearcoat={0.3} />
              </RoundedBox>
              <Text position={[0, 0, 0.05]} fontSize={0.16} color="#D4AF37" anchorX="center" anchorY="middle" outlineWidth={0.008} outlineColor="#000">
                👑 CEO OFFICE
              </Text>
            </group>
          </Float>

          {/* CEO floor zone */}
          <mesh position={[0, 0.01, 3]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[5, 4]} />
            <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={0.08} transparent opacity={0.15} />
          </mesh>

          <ContactShadows position={[0, 0.01, 0]} opacity={0.5} scale={28} blur={2.5} far={5} />
          <OrbitControls enablePan={false} enableZoom minDistance={5} maxDistance={18} maxPolarAngle={Math.PI / 2.1} minPolarAngle={0.2} target={[0, 1.5, 0]} />
          <Environment preset="night" />
          <fog attach="fog" args={["#080810", 12, 28]} />
        </Suspense>
      </Canvas>
    </div>
  );
}
