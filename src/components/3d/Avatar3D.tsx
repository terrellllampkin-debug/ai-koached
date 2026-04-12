import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, RoundedBox } from "@react-three/drei";
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

const bodyScale: Record<string, [number, number, number]> = {
  slim: [0.88, 1, 0.88],
  average: [1, 1, 1],
  athletic: [1.08, 1.02, 1.04],
  broad: [1.15, 1, 1.1],
};

const outfitDetails: Record<string, { collar: boolean; tie: boolean; lapel: boolean; pocketSquare: boolean }> = {
  business_suit: { collar: true, tie: true, lapel: true, pocketSquare: true },
  executive: { collar: true, tie: true, lapel: true, pocketSquare: true },
  streetwear: { collar: false, tie: false, lapel: false, pocketSquare: false },
  casual: { collar: true, tie: false, lapel: false, pocketSquare: false },
  creative: { collar: false, tie: false, lapel: false, pocketSquare: false },
  tech: { collar: false, tie: false, lapel: false, pocketSquare: false },
};

/* ─── Skin material with subsurface approximation ─── */
function useSkinMaterial(color: string) {
  return useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color,
      roughness: 0.55,
      metalness: 0.0,
      clearcoat: 0.1,
      clearcoatRoughness: 0.8,
      sheen: 0.3,
      sheenRoughness: 0.6,
      sheenColor: new THREE.Color(color).lerp(new THREE.Color("#ff9999"), 0.15),
    });
    return mat;
  }, [color]);
}

/* ─── Fabric material ─── */
function useFabricMaterial(color: string, roughness = 0.65) {
  return useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color,
      roughness,
      metalness: 0.0,
      sheen: 0.4,
      sheenRoughness: 0.5,
      sheenColor: new THREE.Color(color).lerp(new THREE.Color("#ffffff"), 0.2),
    });
  }, [color, roughness]);
}

function AvatarModel({ config }: { config: AvatarConfig }) {
  const groupRef = useRef<THREE.Group>(null);
  const scale = bodyScale[config.bodyType] || bodyScale.average;
  const details = outfitDetails[config.outfit] || outfitDetails.casual;
  const skinMat = useSkinMaterial(config.skinTone);
  const outfitMat = useFabricMaterial(config.outfitColor);
  const pantsMat = useFabricMaterial(
    config.outfit === "business_suit" || config.outfit === "executive" ? config.outfitColor : "#2a2a3e",
    0.7
  );

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
      // Subtle breathing
      const breathe = Math.sin(state.clock.elapsedTime * 1.5) * 0.003;
      groupRef.current.position.y = breathe;
    }
  });

  const shoulderWidth = 0.24;

  return (
    <group ref={groupRef} scale={scale}>
      {/* ── HEAD ── */}
      <group position={[0, 1.68, 0]}>
        {/* Skull - slightly elongated sphere */}
        <mesh>
          <sphereGeometry args={[0.2, 48, 48]} />
          <primitive object={skinMat} attach="material" />
        </mesh>
        {/* Jaw / chin area */}
        <mesh position={[0, -0.1, 0.02]} scale={[0.85, 0.6, 0.8]}>
          <sphereGeometry args={[0.18, 32, 32]} />
          <primitive object={skinMat} attach="material" />
        </mesh>

        {/* Ears */}
        <mesh position={[-0.19, -0.02, 0]} rotation={[0, 0, -0.2]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <primitive object={skinMat} attach="material" />
        </mesh>
        <mesh position={[0.19, -0.02, 0]} rotation={[0, 0, 0.2]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <primitive object={skinMat} attach="material" />
        </mesh>

        {/* Eyes */}
        <group position={[0, 0.02, 0.14]}>
          {/* Eye whites */}
          <mesh position={[-0.065, 0, 0]}>
            <sphereGeometry args={[0.032, 24, 24]} />
            <meshStandardMaterial color="#f5f5f5" roughness={0.1} />
          </mesh>
          <mesh position={[0.065, 0, 0]}>
            <sphereGeometry args={[0.032, 24, 24]} />
            <meshStandardMaterial color="#f5f5f5" roughness={0.1} />
          </mesh>
          {/* Iris */}
          <mesh position={[-0.065, 0, 0.022]}>
            <sphereGeometry args={[0.018, 16, 16]} />
            <meshStandardMaterial color="#3d2b1f" roughness={0.2} />
          </mesh>
          <mesh position={[0.065, 0, 0.022]}>
            <sphereGeometry args={[0.018, 16, 16]} />
            <meshStandardMaterial color="#3d2b1f" roughness={0.2} />
          </mesh>
          {/* Pupil */}
          <mesh position={[-0.065, 0, 0.032]}>
            <sphereGeometry args={[0.008, 12, 12]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.1} />
          </mesh>
          <mesh position={[0.065, 0, 0.032]}>
            <sphereGeometry args={[0.008, 12, 12]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.1} />
          </mesh>
          {/* Eye highlight */}
          <mesh position={[-0.06, 0.008, 0.035]}>
            <sphereGeometry args={[0.004, 8, 8]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0.07, 0.008, 0.035]}>
            <sphereGeometry args={[0.004, 8, 8]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
          </mesh>
        </group>

        {/* Eyebrows */}
        <mesh position={[-0.065, 0.07, 0.16]} rotation={[0.1, 0, 0.1]}>
          <capsuleGeometry args={[0.008, 0.04, 4, 8]} />
          <meshStandardMaterial color={config.hairColor} roughness={0.8} />
        </mesh>
        <mesh position={[0.065, 0.07, 0.16]} rotation={[0.1, 0, -0.1]}>
          <capsuleGeometry args={[0.008, 0.04, 4, 8]} />
          <meshStandardMaterial color={config.hairColor} roughness={0.8} />
        </mesh>

        {/* Nose */}
        <mesh position={[0, -0.02, 0.19]} rotation={[-0.3, 0, 0]}>
          <capsuleGeometry args={[0.02, 0.03, 8, 8]} />
          <primitive object={skinMat} attach="material" />
        </mesh>

        {/* Lips */}
        <group position={[0, -0.08, 0.16]}>
          {/* Upper lip */}
          <mesh>
            <capsuleGeometry args={[0.012, 0.04, 4, 8]} />
            <meshPhysicalMaterial
              color={new THREE.Color(config.skinTone).lerp(new THREE.Color("#cc6666"), 0.35).getStyle()}
              roughness={0.3}
              clearcoat={0.2}
            />
          </mesh>
          {/* Lower lip */}
          <mesh position={[0, -0.015, 0.003]}>
            <capsuleGeometry args={[0.014, 0.035, 4, 8]} />
            <meshPhysicalMaterial
              color={new THREE.Color(config.skinTone).lerp(new THREE.Color("#cc6666"), 0.4).getStyle()}
              roughness={0.3}
              clearcoat={0.2}
            />
          </mesh>
        </group>
      </group>

      {/* Hair */}
      {config.hairStyle !== "none" && <Hair style={config.hairStyle} color={config.hairColor} />}

      {/* ── NECK ── */}
      <mesh position={[0, 1.44, 0]}>
        <capsuleGeometry args={[0.06, 0.08, 8, 16]} />
        <primitive object={skinMat} attach="material" />
      </mesh>

      {/* ── TORSO ── */}
      <group position={[0, 1.12, 0]}>
        {/* Main torso - rounded box for softer look */}
        <RoundedBox args={[0.44, 0.52, 0.24]} radius={0.06} smoothness={4} position={[0, 0, 0]}>
          <primitive object={outfitMat} attach="material" />
        </RoundedBox>

        {/* Shoulders - rounded caps */}
        <mesh position={[-shoulderWidth, 0.22, 0]}>
          <sphereGeometry args={[0.08, 24, 24]} />
          <primitive object={outfitMat} attach="material" />
        </mesh>
        <mesh position={[shoulderWidth, 0.22, 0]}>
          <sphereGeometry args={[0.08, 24, 24]} />
          <primitive object={outfitMat} attach="material" />
        </mesh>

        {/* Collar */}
        {details.collar && (
          <group position={[0, 0.28, 0.08]}>
            <mesh position={[-0.06, 0, 0]} rotation={[-0.4, 0.3, -0.2]}>
              <RoundedBox args={[0.08, 0.06, 0.02]} radius={0.005} smoothness={2}>
                <meshStandardMaterial color="#f0ede6" roughness={0.4} />
              </RoundedBox>
            </mesh>
            <mesh position={[0.06, 0, 0]} rotation={[-0.4, -0.3, 0.2]}>
              <RoundedBox args={[0.08, 0.06, 0.02]} radius={0.005} smoothness={2}>
                <meshStandardMaterial color="#f0ede6" roughness={0.4} />
              </RoundedBox>
            </mesh>
          </group>
        )}

        {/* Tie */}
        {details.tie && (
          <group position={[0, 0.1, 0.13]}>
            {/* Knot */}
            <mesh position={[0, 0.14, 0]}>
              <sphereGeometry args={[0.02, 12, 12]} />
              <meshStandardMaterial color="#cc0000" roughness={0.4} />
            </mesh>
            {/* Tie body */}
            <mesh position={[0, 0, 0]} rotation={[0.05, 0, 0]}>
              <capsuleGeometry args={[0.022, 0.22, 4, 8]} />
              <meshPhysicalMaterial color="#cc0000" roughness={0.35} sheen={0.5} sheenRoughness={0.4} sheenColor="#ff4444" />
            </mesh>
            {/* Tie tip */}
            <mesh position={[0, -0.14, 0.005]} rotation={[0.1, 0, 0]}>
              <coneGeometry args={[0.028, 0.04, 4]} />
              <meshPhysicalMaterial color="#cc0000" roughness={0.35} />
            </mesh>
          </group>
        )}

        {/* Lapels */}
        {details.lapel && (
          <>
            <mesh position={[-0.12, 0.12, 0.12]} rotation={[-0.2, 0.4, -0.15]}>
              <RoundedBox args={[0.1, 0.3, 0.015]} radius={0.005} smoothness={2}>
                <primitive object={outfitMat} attach="material" />
              </RoundedBox>
            </mesh>
            <mesh position={[0.12, 0.12, 0.12]} rotation={[-0.2, -0.4, 0.15]}>
              <RoundedBox args={[0.1, 0.3, 0.015]} radius={0.005} smoothness={2}>
                <primitive object={outfitMat} attach="material" />
              </RoundedBox>
            </mesh>
          </>
        )}

        {/* Pocket square */}
        {details.pocketSquare && (
          <mesh position={[-0.14, 0.15, 0.125]}>
            <RoundedBox args={[0.04, 0.03, 0.01]} radius={0.003} smoothness={2}>
              <meshStandardMaterial color="#f0ede6" roughness={0.3} />
            </RoundedBox>
          </mesh>
        )}

        {/* Buttons */}
        {(config.outfit === "business_suit" || config.outfit === "executive" || config.outfit === "casual") && (
          <>
            {[0.06, -0.04, -0.14].map((y) => (
              <mesh key={y} position={[0, y, 0.125]}>
                <cylinderGeometry args={[0.008, 0.008, 0.004, 12]} />
                <meshStandardMaterial color="#888888" metalness={0.6} roughness={0.3} />
              </mesh>
            ))}
          </>
        )}
      </group>

      {/* ── ARMS ── */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.3, 1.2, 0]}>
          {/* Upper arm */}
          <mesh position={[side * 0.02, -0.02, 0]} rotation={[0, 0, side * 0.08]}>
            <capsuleGeometry args={[0.055, 0.22, 8, 16]} />
            <primitive object={outfitMat} attach="material" />
          </mesh>
          {/* Forearm */}
          <mesh position={[side * 0.04, -0.28, 0.02]} rotation={[0.1, 0, side * 0.05]}>
            <capsuleGeometry args={[0.045, 0.2, 8, 16]} />
            <primitive object={outfitMat} attach="material" />
          </mesh>
          {/* Wrist cuff for suits */}
          {(config.outfit === "business_suit" || config.outfit === "executive") && (
            <mesh position={[side * 0.04, -0.38, 0.02]}>
              <cylinderGeometry args={[0.05, 0.048, 0.03, 12]} />
              <meshStandardMaterial color="#f0ede6" roughness={0.4} />
            </mesh>
          )}
          {/* Hand */}
          <group position={[side * 0.04, -0.42, 0.02]}>
            <mesh>
              <sphereGeometry args={[0.04, 16, 16]} />
              <primitive object={skinMat} attach="material" />
            </mesh>
            {/* Fingers hint */}
            {[0, 1, 2, 3].map((i) => (
              <mesh key={i} position={[(i - 1.5) * 0.012, -0.04, 0.01]} rotation={[0.2, 0, 0]}>
                <capsuleGeometry args={[0.007, 0.025, 4, 6]} />
                <primitive object={skinMat} attach="material" />
              </mesh>
            ))}
            {/* Thumb */}
            <mesh position={[side * 0.025, -0.02, 0.025]} rotation={[0.3, side * 0.5, 0]}>
              <capsuleGeometry args={[0.009, 0.02, 4, 6]} />
              <primitive object={skinMat} attach="material" />
            </mesh>
          </group>
        </group>
      ))}

      {/* ── BELT / WAIST ── */}
      <mesh position={[0, 0.84, 0]}>
        <cylinderGeometry args={[0.22, 0.21, 0.04, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Belt buckle */}
      <mesh position={[0, 0.84, 0.21]}>
        <RoundedBox args={[0.04, 0.035, 0.008]} radius={0.003} smoothness={2}>
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.15} />
        </RoundedBox>
      </mesh>

      {/* ── LEGS ── */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.1, 0.55, 0]}>
          {/* Upper leg */}
          <mesh position={[0, 0.08, 0]}>
            <capsuleGeometry args={[0.07, 0.25, 8, 16]} />
            <primitive object={pantsMat} attach="material" />
          </mesh>
          {/* Lower leg */}
          <mesh position={[0, -0.22, 0]}>
            <capsuleGeometry args={[0.06, 0.25, 8, 16]} />
            <primitive object={pantsMat} attach="material" />
          </mesh>
          {/* Shoe */}
          <group position={[0, -0.42, 0.03]}>
            <mesh>
              <RoundedBox args={[0.1, 0.07, 0.2]} radius={0.02} smoothness={3}>
                <meshPhysicalMaterial color="#111111" roughness={0.2} clearcoat={0.8} clearcoatRoughness={0.1} />
              </RoundedBox>
            </mesh>
            {/* Sole */}
            <mesh position={[0, -0.035, 0]}>
              <RoundedBox args={[0.1, 0.015, 0.21]} radius={0.005} smoothness={2}>
                <meshStandardMaterial color="#333333" roughness={0.9} />
              </RoundedBox>
            </mesh>
          </group>
        </group>
      ))}

      {/* Accessory */}
      <Accessory type={config.accessory} skinTone={config.skinTone} />
    </group>
  );
}

function Hair({ style, color }: { style: string; color: string }) {
  const hairMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.7,
        metalness: 0.0,
        sheen: 0.6,
        sheenRoughness: 0.3,
        sheenColor: new THREE.Color(color).lerp(new THREE.Color("#ffffff"), 0.15),
      }),
    [color]
  );

  switch (style) {
    case "buzz":
      return (
        <mesh position={[0, 1.74, 0]}>
          <sphereGeometry args={[0.205, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
          <primitive object={hairMat} attach="material" />
        </mesh>
      );
    case "short":
      return (
        <group>
          <mesh position={[0, 1.76, -0.01]}>
            <sphereGeometry args={[0.22, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <primitive object={hairMat} attach="material" />
          </mesh>
          {/* Side volume */}
          <mesh position={[-0.15, 1.72, -0.02]} scale={[0.6, 0.8, 0.5]}>
            <sphereGeometry args={[0.12, 24, 24]} />
            <primitive object={hairMat} attach="material" />
          </mesh>
          <mesh position={[0.15, 1.72, -0.02]} scale={[0.6, 0.8, 0.5]}>
            <sphereGeometry args={[0.12, 24, 24]} />
            <primitive object={hairMat} attach="material" />
          </mesh>
        </group>
      );
    case "medium":
      return (
        <group>
          <mesh position={[0, 1.77, -0.01]}>
            <sphereGeometry args={[0.24, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
            <primitive object={hairMat} attach="material" />
          </mesh>
          {/* Back hair */}
          <mesh position={[0, 1.58, -0.12]} scale={[1, 1.2, 0.6]}>
            <sphereGeometry args={[0.18, 32, 32]} />
            <primitive object={hairMat} attach="material" />
          </mesh>
          {/* Side swoop */}
          <mesh position={[-0.18, 1.72, 0]} scale={[0.5, 0.9, 0.7]}>
            <sphereGeometry args={[0.12, 24, 24]} />
            <primitive object={hairMat} attach="material" />
          </mesh>
          <mesh position={[0.18, 1.72, 0]} scale={[0.5, 0.9, 0.7]}>
            <sphereGeometry args={[0.12, 24, 24]} />
            <primitive object={hairMat} attach="material" />
          </mesh>
        </group>
      );
    case "long":
      return (
        <group>
          <mesh position={[0, 1.77, -0.01]}>
            <sphereGeometry args={[0.24, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
            <primitive object={hairMat} attach="material" />
          </mesh>
          {/* Flowing back */}
          <mesh position={[0, 1.45, -0.1]} scale={[1.1, 1.6, 0.5]}>
            <sphereGeometry args={[0.18, 32, 32]} />
            <primitive object={hairMat} attach="material" />
          </mesh>
          {/* Side curtains */}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.19, 1.55, 0]} scale={[0.4, 1.3, 0.5]}>
              <sphereGeometry args={[0.14, 24, 24]} />
              <primitive object={hairMat} attach="material" />
            </mesh>
          ))}
        </group>
      );
    case "afro":
      return (
        <mesh position={[0, 1.78, 0]}>
          <sphereGeometry args={[0.3, 48, 48]} />
          <meshPhysicalMaterial color={color} roughness={0.95} sheen={0.8} sheenRoughness={0.9} sheenColor={color} />
        </mesh>
      );
    case "braids":
      return (
        <group>
          <mesh position={[0, 1.76, -0.01]}>
            <sphereGeometry args={[0.22, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
            <primitive object={hairMat} attach="material" />
          </mesh>
          {/* Braids */}
          {[-0.1, 0, 0.1].map((x) => (
            <group key={x}>
              <mesh position={[x, 1.4, -0.12]}>
                <capsuleGeometry args={[0.02, 0.35, 6, 8]} />
                <primitive object={hairMat} attach="material" />
              </mesh>
              {/* Braid beads */}
              <mesh position={[x, 1.2, -0.12]}>
                <sphereGeometry args={[0.025, 8, 8]} />
                <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
              </mesh>
            </group>
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
        <group position={[0, 1.7, 0.18]}>
          {/* Frames */}
          {[-1, 1].map((s) => (
            <group key={s} position={[s * 0.065, 0, 0]}>
              <mesh>
                <torusGeometry args={[0.035, 0.004, 12, 24]} />
                <meshPhysicalMaterial color="#222222" metalness={0.9} roughness={0.1} clearcoat={1} />
              </mesh>
              {/* Lens */}
              <mesh position={[0, 0, 0.002]}>
                <circleGeometry args={[0.032, 24]} />
                <meshPhysicalMaterial
                  color="#aaccee"
                  transparent
                  opacity={0.15}
                  metalness={0.1}
                  roughness={0}
                  clearcoat={1}
                />
              </mesh>
            </group>
          ))}
          {/* Bridge */}
          <mesh position={[0, 0, 0]}>
            <capsuleGeometry args={[0.003, 0.03, 4, 8]} />
            <meshPhysicalMaterial color="#222222" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Temples */}
          {[-1, 1].map((s) => (
            <mesh key={`t${s}`} position={[s * 0.1, 0, -0.08]} rotation={[0, s * 0.3, 0]}>
              <capsuleGeometry args={[0.003, 0.12, 4, 6]} />
              <meshPhysicalMaterial color="#222222" metalness={0.9} roughness={0.1} />
            </mesh>
          ))}
        </group>
      );
    case "watch":
      return (
        <group position={[-0.34, 0.82, 0.02]}>
          {/* Band */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.045, 0.01, 8, 24]} />
            <meshPhysicalMaterial color="#D4AF37" metalness={0.95} roughness={0.08} clearcoat={1} />
          </mesh>
          {/* Face */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.032, 0.032, 0.008, 24]} />
            <meshPhysicalMaterial color="#0a0a1a" roughness={0.1} metalness={0.3} clearcoat={1} />
          </mesh>
          {/* Crown */}
          <mesh position={[0, 0, 0.035]}>
            <cylinderGeometry args={[0.006, 0.006, 0.012, 8]} />
            <meshPhysicalMaterial color="#D4AF37" metalness={0.95} roughness={0.08} />
          </mesh>
        </group>
      );
    case "chain":
      return (
        <group position={[0, 1.38, 0.12]}>
          <mesh>
            <torusGeometry args={[0.14, 0.006, 8, 48]} />
            <meshPhysicalMaterial color="#D4AF37" metalness={0.95} roughness={0.05} clearcoat={1} />
          </mesh>
          {/* Pendant */}
          <mesh position={[0, -0.13, 0.01]}>
            <octahedronGeometry args={[0.025, 0]} />
            <meshPhysicalMaterial color="#D4AF37" metalness={0.95} roughness={0.05} clearcoat={1} />
          </mesh>
        </group>
      );
    case "hat":
      return (
        <group position={[0, 1.88, 0]}>
          {/* Crown */}
          <mesh>
            <cylinderGeometry args={[0.16, 0.18, 0.14, 24]} />
            <meshPhysicalMaterial color="#111111" roughness={0.3} sheen={0.4} sheenRoughness={0.5} sheenColor="#333333" />
          </mesh>
          {/* Brim */}
          <mesh position={[0, -0.07, 0]}>
            <cylinderGeometry args={[0.28, 0.28, 0.015, 48]} />
            <meshPhysicalMaterial color="#111111" roughness={0.3} sheen={0.4} sheenRoughness={0.5} sheenColor="#333333" />
          </mesh>
          {/* Hat band */}
          <mesh position={[0, -0.04, 0]}>
            <cylinderGeometry args={[0.182, 0.182, 0.02, 24]} />
            <meshPhysicalMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
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
      <Canvas camera={{ position: [0, 1.3, 2.5], fov: 40 }} dpr={[1, 2]}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 5, 3]} intensity={1.2} castShadow />
        <directionalLight position={[-2, 3, -1]} intensity={0.4} color="#8888ff" />
        <pointLight position={[0, 2, 2]} intensity={0.3} color="#D4AF37" />
        <AvatarModel config={config} />
        <OrbitControls
          target={[0, 1.1, 0]}
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI * 0.3}
          maxPolarAngle={Math.PI * 0.65}
        />
        <ContactShadows position={[0, 0.13, 0]} opacity={0.4} scale={3} blur={2.5} />
        <Environment preset="city" />
        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.12, 0]}>
          <circleGeometry args={[1.5, 64]} />
          <meshPhysicalMaterial color="#12121e" roughness={0.15} metalness={0.3} clearcoat={0.6} />
        </mesh>
      </Canvas>
    </div>
  );
}
