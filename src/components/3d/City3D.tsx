import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Text, Float, ContactShadows } from "@react-three/drei";
import { Suspense } from "react";

interface City3DProps {
  onBuildingClick: (building: string) => void;
  onBackToOffice: () => void;
}

const buildings = [
  { id: "credit", name: "Credit Empire", color: "#D4AF37", position: [-6, 0, -4] as [number, number, number], height: 4, width: 2.5 },
  { id: "entity", name: "Entity Builder", color: "#7F77DD", position: [-2, 0, -4] as [number, number, number], height: 5, width: 2.5 },
  { id: "revenue", name: "Revenue HQ", color: "#4CAF50", position: [2, 0, -4] as [number, number, number], height: 4.5, width: 2.5 },
  { id: "koach", name: "$KOACH Tower", color: "#FF9800", position: [6, 0, -4] as [number, number, number], height: 6, width: 2.5 },
  { id: "grants", name: "Grant Office", color: "#E91E63", position: [-4, 0, -10] as [number, number, number], height: 3.5, width: 2.5 },
  { id: "sp500", name: "S&P 500 Tower", color: "#2196F3", position: [0, 0, -10] as [number, number, number], height: 7, width: 3 },
  { id: "crypto", name: "Crypto Exchange", color: "#00BCD4", position: [4, 0, -10] as [number, number, number], height: 5, width: 3 },
];

function Building({ id, name, color, position, height, width, onClick }: {
  id: string;
  name: string;
  color: string;
  position: [number, number, number];
  height: number;
  width: number;
  onClick: () => void;
}) {
  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {/* Building body */}
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[width, height, width]} />
        <meshStandardMaterial color="#121220" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* Windows grid */}
      {Array.from({ length: Math.floor(height) }).map((_, row) =>
        Array.from({ length: 3 }).map((_, col) => (
          <mesh
            key={`${row}-${col}`}
            position={[
              -0.5 + col * 0.5,
              row + 0.8,
              width / 2 + 0.01,
            ]}
          >
            <planeGeometry args={[0.35, 0.5]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.4}
              transparent
              opacity={0.7}
            />
          </mesh>
        ))
      )}
      {/* Top accent */}
      <mesh position={[0, height + 0.1, 0]}>
        <boxGeometry args={[width + 0.1, 0.15, width + 0.1]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} metalness={0.8} />
      </mesh>
      {/* Sign */}
      <Float speed={1.5} rotationIntensity={0} floatIntensity={0.2}>
        <Text
          position={[0, height + 1, 0]}
          fontSize={0.25}
          color={color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000"
        >
          {name}
        </Text>
      </Float>
      {/* Ground glow */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[width / 2 + 0.3, width / 2 + 0.5, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function Road() {
  return (
    <group>
      {/* Main road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[4, 20]} />
        <meshStandardMaterial color="#1a1a2a" />
      </mesh>
      {/* Road lines */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -8 + i * 2]}>
          <planeGeometry args={[0.15, 0.8]} />
          <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color="#0a0a12" metalness={0.1} roughness={0.9} />
    </mesh>
  );
}

function OfficeBuilding({ onClick }: { onClick: () => void }) {
  return (
    <group position={[0, 0, 4]} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[3, 3, 3]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.3} roughness={0.7} />
      </mesh>
      <mesh position={[0, 3.1, 0]}>
        <boxGeometry args={[3.1, 0.15, 3.1]} />
        <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={0.3} metalness={0.8} />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.8, 1.51]}>
        <planeGeometry args={[0.8, 1.6]} />
        <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={0.5} />
      </mesh>
      <Float speed={2} rotationIntensity={0} floatIntensity={0.3}>
        <Text
          position={[0, 4, 0]}
          fontSize={0.3}
          color="#D4AF37"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000"
        >
          Your Office
        </Text>
      </Float>
    </group>
  );
}

export function City3D({ onBuildingClick, onBackToOffice }: City3DProps) {
  return (
    <div className="absolute inset-0">
      <Canvas
        shadows
        camera={{ position: [0, 12, 18], fov: 50 }}
        style={{ background: "#050510" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 15, 10]} intensity={0.6} castShadow shadow-mapSize={[2048, 2048]} />
          <pointLight position={[0, 8, 0]} intensity={0.4} color="#D4AF37" />
          <pointLight position={[-6, 5, -4]} intensity={0.3} color="#D4AF37" />
          <pointLight position={[6, 5, -4]} intensity={0.3} color="#FF9800" />

          <Ground />
          <Road />
          <OfficeBuilding onClick={onBackToOffice} />

          {buildings.map((b) => (
            <Building key={b.id} {...b} onClick={() => onBuildingClick(b.id)} />
          ))}

          <ContactShadows position={[0, 0.01, 0]} opacity={0.3} scale={40} blur={2} far={6} />

          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={8}
            maxDistance={30}
            maxPolarAngle={Math.PI / 2.3}
            minPolarAngle={0.2}
            target={[0, 2, -3]}
          />

          <Environment preset="night" />

          {/* Sky stars effect */}
          <mesh position={[0, 20, -20]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={2} />
          </mesh>
        </Suspense>
      </Canvas>
    </div>
  );
}
