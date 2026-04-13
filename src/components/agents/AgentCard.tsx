import { motion } from "framer-motion";
import { Coins } from "lucide-react";
import type { AgentProfile } from "./agentProfiles";

interface AgentCardProps {
  agentKey: string;
  profile: AgentProfile;
  onClick: (agentKey: string) => void;
}

export function AgentCard({ agentKey, profile, onClick }: AgentCardProps) {
  return (
    <motion.button
      onClick={() => onClick(agentKey)}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="relative group rounded-2xl overflow-hidden text-left cursor-pointer"
      style={{
        background: profile.gradient,
        boxShadow: `0 0 20px ${profile.color}20, 0 8px 32px rgba(0,0,0,0.4)`,
      }}
    >
      {/* Glowing border */}
      <div
        className="absolute inset-0 rounded-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-500"
        style={{
          border: `1px solid ${profile.color}40`,
          boxShadow: `inset 0 0 30px ${profile.color}10`,
        }}
      />

      {/* Pulse glow animation */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{
          boxShadow: [
            `0 0 20px ${profile.color}15`,
            `0 0 40px ${profile.color}30`,
            `0 0 20px ${profile.color}15`,
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Sparkle particles */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full pointer-events-none"
          style={{ backgroundColor: profile.color }}
          animate={{
            opacity: [0, 0.8, 0],
            y: [0, -20, -40],
            x: [0, (i % 2 === 0 ? 10 : -10)],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.6,
            ease: "easeOut",
          }}
          initial={{
            top: `${60 + i * 5}%`,
            left: `${20 + i * 15}%`,
          }}
        />
      ))}

      <div className="relative z-10 p-5 backdrop-blur-sm bg-black/30">
        {/* Online status */}
        <div className="flex items-center gap-1.5 mb-3">
          <motion.div
            className="w-2 h-2 rounded-full bg-green-500"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-[9px] font-mono text-green-400 uppercase tracking-wider">Online 24/7</span>
        </div>

        {/* Character image */}
        <motion.div
          className="w-40 h-40 mx-auto mb-4 relative"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src={profile.image}
            alt={profile.name}
            className="w-full h-full object-contain drop-shadow-2xl"
            loading="lazy"
            width={512}
            height={512}
          />
          {/* Glow behind character */}
          <div
            className="absolute inset-0 -z-10 blur-2xl opacity-30 rounded-full"
            style={{ backgroundColor: profile.color }}
          />
        </motion.div>

        {/* Name & specialty */}
        <h3
          className="text-lg font-heading font-bold text-center mb-1"
          style={{ color: profile.color }}
        >
          {profile.name}
        </h3>
        <p className="text-[11px] text-center text-muted-foreground mb-2">
          {profile.specialty}
        </p>
        <p className="text-[10px] text-center text-muted-foreground/70 leading-relaxed mb-3">
          {profile.description}
        </p>

        {/* KOACH earn rate */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono">
          <Coins className="w-3 h-3" style={{ color: profile.color }} />
          <span style={{ color: profile.color }}>+5 $KOACHED per message</span>
        </div>
      </div>
    </motion.button>
  );
}
