import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";

export interface AvatarConfig {
  bodyType: "slim" | "average" | "athletic" | "broad";
  skinTone: string;
  hairStyle: "short" | "medium" | "long" | "buzz" | "afro" | "braids" | "none";
  hairColor: string;
  outfit: "business_suit" | "streetwear" | "casual" | "executive" | "creative" | "tech";
  outfitColor: string;
  accessory: "none" | "glasses" | "watch" | "chain" | "hat";
}

export const defaultAvatarConfig: AvatarConfig = {
  bodyType: "average",
  skinTone: "#C68642",
  hairStyle: "short",
  hairColor: "#1a1a1a",
  outfit: "business_suit",
  outfitColor: "#1a1a2e",
  accessory: "none",
};

/* ─── Body scale by type ─── */
const bodyScale: Record<string, [number, number, number]> = {
  slim: [0.85, 1, 0.85],
  average: [1, 1, 1],
  athletic: [1.1, 1, 1.05],
  broad: [1.2, 1, 1.15],
};

/* ─── Outfit patterns ─── */
const outfitDetails: Record<string, { collar: boolean; tie: boolean; lapel: boolean }> = {
  business_suit: { collar: true, tie: true, lapel: true },
  executive: { collar: true, tie: true, lapel: true },
  streetwear: { collar: false, tie: false, lapel: false },
  casual: { collar: true, tie: false, lapel: false },
  creative: { collar: false, tie: false, lapel: false },
  tech: { collar: false, tie: false, lapel: false },
};

function AvatarModel({ config }: { config: AvatarConfig }) {
  const groupRef = useRef<THREE.Group>(null);
  const scale = bodyScale[config.bodyType] || bodyScale.average;
  const details = outfitDetails[config.outfit] || outfitDetails.casual;

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* Head */}
      <mesh position={[0, 1.65, 0]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color={config.skinTone} roughness={0.6} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.07, 1.68, 0.18]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.07, 1.68, 0.18]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.07, 1.68, 0.2]}>
        <sphereGeometry args={[0.015, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.07, 1.68, 0.2]}>
        <sphereGeometry args={[0.015, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Mouth */}
      <mesh position={[0, 1.57, 0.19]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.08, 0.015, 0.02]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Hair */}
      {config.hairStyle !== "none" && <Hair style={config.hairStyle} color={config.hairColor} />}

      {/* Neck */}
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.07, 0.08, 0.1, 16]} />
        <meshStandardMaterial color={config.skinTone} roughness={0.6} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[0.45, 0.55, 0.25]} />
        <meshStandardMaterial color={config.outfitColor} roughness={0.4} />
      </mesh>

      {/* Collar */}
      {details.collar && (
        <mesh position={[0, 1.35, 0.08]} rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[0.2, 0.06, 0.08]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
      )}

      {/* Tie */}
      {details.tie && (
        <mesh position={[0, 1.15, 0.13]}>
          <boxGeometry args={[0.06, 0.3, 0.02]} />
          <meshStandardMaterial color="#cc0000" roughness={0.3} />
        </mesh>
      )}

      {/* Arms */}
      <mesh position={[-0.32, 1.15, 0]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.12, 0.5, 0.14]} />
        <meshStandardMaterial color={config.outfitColor} roughness={0.4} />
      </mesh>
      <mesh position={[0.32, 1.15, 0]} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[0.12, 0.5, 0.14]} />
        <meshStandardMaterial color={config.outfitColor} roughness={0.4} />
      </mesh>

      {/* Hands */}
      <mesh position={[-0.36, 0.87, 0]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial color={config.skinTone} roughness={0.6} />
      </mesh>
      <mesh position={[0.36, 0.87, 0]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial color={config.skinTone} roughness={0.6} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.1, 0.5, 0]}>
        <boxGeometry args={[0.16, 0.6, 0.18]} />
        <meshStandardMaterial
          color={config.outfit === "business_suit" || config.outfit === "executive" ? config.outfitColor : "#2a2a3e"}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[0.1, 0.5, 0]}>
        <boxGeometry args={[0.16, 0.6, 0.18]} />
        <meshStandardMaterial
          color={config.outfit === "business_suit" || config.outfit === "executive" ? config.outfitColor : "#2a2a3e"}
          roughness={0.4}
        />
      </mesh>

      {/* Shoes */}
      <mesh position={[-0.1, 0.17, 0.04]}>
        <boxGeometry args={[0.14, 0.08, 0.24]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} />
      </mesh>
      <mesh position={[0.1, 0.17, 0.04]}>
        <boxGeometry args={[0.14, 0.08, 0.24]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} />
      </mesh>

      {/* Accessory */}
      <Accessory type={config.accessory} skinTone={config.skinTone} />
    </group>
  );
}

function Hair({ style, color }: { style: string; color: string }) {
  switch (style) {
    case "buzz":
      return (
        <mesh position={[0, 1.72, 0]}>
          <sphereGeometry args={[0.225, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
      );
    case "short":
      return (
        <group>
          <mesh position={[0, 1.75, -0.02]}>
            <sphereGeometry args={[0.24, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color={color} roughness={0.7} />
          </mesh>
        </group>
      );
    case "medium":
      return (
        <group>
          <mesh position={[0, 1.75, -0.02]}>
            <sphereGeometry args={[0.26, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
            <meshStandardMaterial color={color} roughness={0.6} />
          </mesh>
          <mesh position={[0, 1.58, -0.14]}>
            <boxGeometry args={[0.3, 0.2, 0.08]} />
            <meshStandardMaterial color={color} roughness={0.6} />
          </mesh>
        </group>
      );
    case "long":
      return (
        <group>
          <mesh position={[0, 1.75, -0.02]}>
            <sphereGeometry args={[0.26, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
            <meshStandardMaterial color={color} roughness={0.6} />
          </mesh>
          <mesh position={[0, 1.45, -0.14]}>
            <boxGeometry args={[0.32, 0.45, 0.08]} />
            <meshStandardMaterial color={color} roughness={0.6} />
          </mesh>
        </group>
      );
    case "afro":
      return (
        <mesh position={[0, 1.78, 0]}>
          <sphereGeometry args={[0.32, 32, 32]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
      );
    case "braids":
      return (
        <group>
          <mesh position={[0, 1.75, -0.02]}>
            <sphereGeometry args={[0.25, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color={color} roughness={0.7} />
          </mesh>
          {[-0.12, 0, 0.12].map((x) => (
            <mesh key={x} position={[x, 1.35, -0.15]}>
              <cylinderGeometry args={[0.025, 0.02, 0.5, 8]} />
              <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
          ))}
        </group>
      );
    default:
      return null;
  }
}

function Accessory({ type, skinTone }: { type: string; skinTone: string }) {
  switch (type) {
    case "glasses":
      return (
        <group position={[0, 1.68, 0.2]}>
          <mesh position={[-0.07, 0, 0]}>
            <torusGeometry args={[0.035, 0.005, 8, 16]} />
            <meshStandardMaterial color="#333333" metalness={0.8} />
          </mesh>
          <mesh position={[0.07, 0, 0]}>
            <torusGeometry args={[0.035, 0.005, 8, 16]} />
            <meshStandardMaterial color="#333333" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0, -0.005]}>
            <boxGeometry args={[0.03, 0.005, 0.005]} />
            <meshStandardMaterial color="#333333" metalness={0.8} />
          </mesh>
        </group>
      );
    case "watch":
      return (
        <group position={[-0.38, 0.92, 0]}>
          <mesh>
            <torusGeometry args={[0.04, 0.008, 8, 16]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh>
            <circleGeometry args={[0.035, 16]} />
            <meshStandardMaterial color="#1a1a2e" />
          </mesh>
        </group>
      );
    case "chain":
      return (
        <mesh position={[0, 1.35, 0.13]}>
          <torusGeometry args={[0.15, 0.008, 8, 32]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
        </mesh>
      );
    case "hat":
      return (
        <group position={[0, 1.85, 0]}>
          <mesh>
            <cylinderGeometry args={[0.18, 0.2, 0.15, 16]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.07, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.02, 32]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
          </mesh>
        </group>
      );
    default:
      return null;
  }
}

/* ─── Canvas wrapper ─── */
export function AvatarPreview({
  config,
  className = "",
  height = "400px",
}: {
  config: AvatarConfig;
  className?: string;
  height?: string;
}) {
  return (
    <div className={className} style={{ height, width: "100%" }}>
      <Canvas camera={{ position: [0, 1.3, 2.5], fov: 40 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 5, 3]} intensity={1} />
        <directionalLight position={[-2, 3, -1]} intensity={0.3} />
        <AvatarModel config={config} />
        <OrbitControls
          target={[0, 1.1, 0]}
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI * 0.3}
          maxPolarAngle={Math.PI * 0.65}
        />
        <Environment preset="city" />
        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.13, 0]}>
          <circleGeometry args={[1.5, 32]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.8} />
        </mesh>
      </Canvas>
    </div>
  );
}
