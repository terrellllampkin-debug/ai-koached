import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Text, Float, ContactShadows } from "@react-three/drei";
import { Suspense } from "react";

interface Office3DProps {
  onDeskClick: (agent: string) => void;
}

const agents = [
  { id: "max_credit", name: "Max Credit", specialty: "Credit Empire", position: [-3, 0, -2] as [number, number, number], color: "#D4AF37" },
  { id: "credit_repair", name: "Fix-It Frankie", specialty: "Credit Repair", position: [0, 0, -3.5] as [number, number, number], color: "#E53935" },
  { id: "empire_eva", name: "Empire Eva", specialty: "Entity Builder", position: [3, 0, -2] as [number, number, number], color: "#7F77DD" },
  { id: "revenue_rex", name: "Revenue Rex", specialty: "Revenue Tracker", position: [-3, 0, 2] as [number, number, number], color: "#4CAF50" },
  { id: "koach_coin", name: "Koach Coin", specialty: "$KOACH Token", position: [3, 0, 2] as [number, number, number], color: "#FF9800" },
];

function Desk({ position, color, name, specialty, onClick }: {
  position: [number, number, number];
  color: string;
  name: string;
  specialty: string;
  onClick: () => void;
}) {
  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {/* Desk surface */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[1.8, 0.08, 1]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.3} roughness={0.7} />
      </mesh>
      {/* Desk legs */}
      {[[-0.8, 0.375, -0.4], [0.8, 0.375, -0.4], [-0.8, 0.375, 0.4], [0.8, 0.375, 0.4]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.06, 0.75, 0.06]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      ))}
      {/* Monitor */}
      <mesh position={[0, 1.2, -0.3]} castShadow>
        <boxGeometry args={[0.8, 0.5, 0.03]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Monitor screen glow */}
      <mesh position={[0, 1.2, -0.28]}>
        <planeGeometry args={[0.72, 0.42]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      {/* Chair */}
      <mesh position={[0, 0.5, 0.7]}>
        <boxGeometry args={[0.5, 0.08, 0.5]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0, 0.8, 1]}>
        <boxGeometry args={[0.5, 0.6, 0.08]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Floating name tag */}
      <Float speed={2} rotationIntensity={0} floatIntensity={0.3}>
        <Text
          position={[0, 2, 0]}
          fontSize={0.18}
          color={color}
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Bold.woff"
          outlineWidth={0.01}
          outlineColor="#000"
        >
          {name}
        </Text>
        <Text
          position={[0, 1.75, 0]}
          fontSize={0.1}
          color="#888"
          anchorX="center"
          anchorY="middle"
        >
          {specialty}
        </Text>
      </Float>
      {/* Hover glow ring */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.1, 1.2, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#0d0d14" metalness={0.1} roughness={0.9} />
    </mesh>
  );
}

function Walls() {
  return (
    <group>
      {/* Back wall */}
      <mesh position={[0, 2.5, -5]}>
        <planeGeometry args={[20, 5]} />
        <meshStandardMaterial color="#12121c" />
      </mesh>
      {/* Left wall */}
      <mesh position={[-10, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color="#12121c" />
      </mesh>
      {/* Right wall */}
      <mesh position={[10, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color="#12121c" />
      </mesh>
      {/* Window effect on back wall */}
      <mesh position={[0, 3, -4.98]}>
        <planeGeometry args={[8, 2.5]} />
        <meshStandardMaterial
          color="#1a1a3a"
          emissive="#1a1a3a"
          emissiveIntensity={0.2}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

function CenterTable() {
  return (
    <group position={[0, 0, 0]}>
      {/* AI KOACHED logo table */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.8, 0.8, 0.06, 32]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.44, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.02, 32]} />
        <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={0.3} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Table leg */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.4, 16]} />
        <meshStandardMaterial color="#111" metalness={0.5} />
      </mesh>
    </group>
  );
}

export function Office3D({ onDeskClick }: Office3DProps) {
  return (
    <div className="absolute inset-0">
      <Canvas
        shadows
        camera={{ position: [0, 5, 8], fov: 50 }}
        style={{ background: "#080810" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={0.8}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight position={[0, 3, 0]} intensity={0.5} color="#D4AF37" />

          <Floor />
          <Walls />
          <CenterTable />

          {agents.map((agent) => (
            <Desk
              key={agent.id}
              position={agent.position}
              color={agent.color}
              name={agent.name}
              specialty={agent.specialty}
              onClick={() => onDeskClick(agent.id)}
            />
          ))}

          <ContactShadows
            position={[0, 0.01, 0]}
            opacity={0.4}
            scale={20}
            blur={2}
            far={4}
          />

          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={4}
            maxDistance={15}
            maxPolarAngle={Math.PI / 2.2}
            minPolarAngle={0.3}
            target={[0, 1, 0]}
          />

          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}
