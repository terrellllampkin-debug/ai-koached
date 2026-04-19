import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { stateSetter, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, ArrowRight, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/empire/office")({
  head: () => ({
    meta: [
      { title: "Empire Office   AI KOACHED" },
      { name: "description", content: "Your AI team headquarters. 15 agents. One office." },
    ],
  }),
  component: EmpireOfficePage,
});

const DESKS = [
  { id: "hawk_atlas",       name: "Haw Atlas",        role: "Intel & Markets",     emoji: "🪅", color: "#607D8B", x: 50, y: 10, size: "medium" },
  { id: "website_builder",  name: "Site Builder",      role: "Website Strategy",    emoji: "🌐", color: "#00BCD4", x: 30, y: 12, size: "small" },
  { id: "koach_coin",       name: "KOACHed Coin",      role: "$KOACH Rewards",      emoji: "🪙", color: "#FF9800", x: 70, y: 12, size: "small" },
  { id: "ceo_coach",        name: "The Architect",     role: "Master Builder",      emoji: "🍗️", color: "#D4AF37", x: 50, y: 40, size: "large" },
  { id: "empire_eva",       name: "Empire Eva",        role: "Entity Formation",    emoji: "🏛️", color: "#7F77DD", x: 18, y: 26, size: "medium" },
  { id: "legal_docs",       name: "Doc Builder",       role: "Legal Documents",     emoji: "🐄", color: "#26A69A", x: 18, y: 50, size: "medium" },
  { id: "brand_builder",    name: "Brand Kit",         role: "Brand Identity",      emoji: "🎨", color: "#E91E63", x: 18, y: 72, size: "medium" },
  { id: "max_credit",       name: "Max Credit",        role: "Personal Credit",     emoji: "💳", color: "#D4AF37", x: 82, y: 26, size: "medium" },
  { id: "biz_credit",       name: "Biz Builder Brock", role: "Business Credit",     emoji: "🏢", color: "#2196F3", x: 82, y: 50, size: "medium" },
  { id: "credit_repair",    name: "Fix-It Frankie",    role: "Credit Repair",       emoji: "🔗", color: "#E53935", x: 82, y: 72, size: "medium" },
  { id: "revenue_rex",      name: "RevKAnue Resx",      role: "Revenue Growth",      emoji: "💐", color: "#4CAF50", x: 35, y: 60, size: "medium" },
  { id: "compliance_coach", name: "Compliance Coach",   role: "Deadlines & Filings", emoji: "🤑", color: "#FF5722", x: 65, y: 60, size: "medium" },
  { id: "sales_closer",     name: "Sales Closer",      role: "Sales Strategy",      emoji: "🏯", color: "#F44336", x: 27, y: 83, size: "small" },
  { id: "biz_growth",       name: "Growth Engine",      role: "Get More Business",   emoji: "📈", color: "#00E676", x: 50, y: 84, size: "small" },
  { id: "profile_builder",  name: "Profile Pro",        role: "B2B Marketplace",     emoji: "👤", color: "#9C27B0", x: 73, y: 83, size: "small" },
];

const SIZES = {
  large:  { w: 100, h: 84, emoji: "text-3xl",  name: "text-xs",     role: "text-[10px]" },
  medium: { w: 80,  h: 66, emoji: "text-xl",   name: "text-[11px]", role: "text-[9px]"  },
  small:  { w: 64,  h: 52, emoji: "text-lg",   name: "text-[10px]", role: "text-[9px]"  },
};

const DESK_DESCRIPTIONS: Record<string, string> = {
  ceo_coach:        "Build your full business plan and dispatch the team",
  empire_eva:       "Form your LLC or Corp in 83+ countries",
  max_credit:       "Build your personal credit score to 800+",
  biz_credit:       "DUNS, Paydex, net-30 vendors, Tier 1\u20134",
  credit_repair:    "Dispute errors, goodwill letters, FCRA law",
  revenue_rex:      "Payment processing, pricing, $12K roadmap",
  brand_builder:    "Colors, fonts, logo, tagline, domain strategy",
  legal_docs:       "Contracts, NDAs, operating agreements",
  website_builder:  "Platform selection, SEO, conversion optimization",
  compliance_coach: "BOI, tax deadlines, license renewals",
  sales_closer:     "Scripts, funnels, objection handling",
  biz_growth:       "Lead gen, government contracting, scale strategy",
  profile_builder:  "B2B community marketplace profile",
  koach_coin:       "Token rewards, milestones, staking",
  hawk_atlas:       "Global market intel, competitor tracking daily",
};

function EmpireOfficePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<string | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [journeyPhase, setJourneyPhase] = useState("discovery");

  useEffect(() => {
    if (!user) return;
    supabase.from("empire_journey").select("phase").eq("user_id", user.id).single()
      .then(({ data }) => { if (data?.phase) setJourneyPhase(data.phase); });
  }, [user]);

  if (isLoading) return null;
  if (!isAuthenticated) { navigate({ to: "/login" }); return null; }

  const hoveredDesk = DESKS.find((d) => d.id === hovered);

  return (
    <div className="h-screen bg-background text-foreground overflow-hidden flex flex-col">
      <div className="h-11 border-b border-border flex items-center px-4 gap-3 shrink-0 bg-card/50">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="font-heading text-sm font-bold text-primary">Empire HQ</span>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground"><div className="w-1.5 h-1.5 rounded-full bg-green-500" />{DESKS.length} agents online</div>
        <span className="text-[10px] font-mono text-muted-foreground ml-1">Phase: {journeyPhase.replace(/_/g, " ").toUpperCase()}</span>
        <div className="ml-auto flex items-center gap-3">
          <button onClick={() => setVoiceEnabled(!voiceEnabled)} className="text-muted-foreground hover:text-primary transition-colors">{voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}</button>
          <Button size="sm" variant="outline" onClick={() => navigate({ to: "/empire/ai-workers" })} className="text-xs h-7 gap-1">List View <ArrowRight className="w-3 h-3" /></Button>
        </div>
      </div>
      <div className="flex-1 relative overflow-hidden select-none">
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, oklch(0.10 0.005 285) 0%, oklch(0.08 0.005 285) 100%)", backgroundImage: "linear-gradient(rgba(212,175,55,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.04) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="absolute top-3 left-1/2 -translate-x-1/2 text-[10px] font-mono text-muted-foreground/30 uppercase tracking-widest pointer-events-none">Koach Bridge Holdings \u2014 AI KOACHED Headquarters</div>
        {DESKS.map((desk) => {
          const sz = SIZES[desk.size as keyof typeof SIZES];
          const isHov = hovered === desk.id;
          return (
            <motion.button
              key={desk.id}
              style={{ position: "absolute", left: `calc(${desk.x}% - ${sz.w / 2}px)`, top: `calc(${desk.y}% - ${sz.h / 2}px)`, width: sz.w, height: sz.h }}
              animate={{ scale: isHov ? 1.1 : 1, y: isHov ? -5 : 0 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
              onClick={() => navigate({ to: "/empire/ai-workers" })}
              onMouseEnter={() => setHovered(desk.id)}
              onMouseLeave={() => setHovered(null)}
              className="flex flex-col items-center justify-center rounded-xl border transition-all cursor-pointer"
              style={{ borderColor: isHov ? desk.color + "90" : desk.color + "28", background: isHov ? desk.color + "18" : desk.color + "09", overflow: "visible" } as React.CSSProperties}
            >
              <span className={`${sz.emoji} leading-none mb-0.5`}>{desk.emoji}</span>
              <span className={`${sz.name} font-semibold text-center leading-tight px-1`} style={{ color: isHov ? desk.color : undefined }}>{desk.name}</span>
              <span className={`${sz.role} text-muted-foreground leading-tight`}>{desk.role}</span>
              <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-green-500" style={{ boxShadow: "0 0 4px #22c55e" }} />
            </motion.button>
          );
        })}
        <AnimatePresence>
          {hoveredDesk && (
            <motion.div
              key={hoveredDesk.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl border border-border bg-card/95 backdrop-blur text-center pointer-events-none z-10"
              style={{ minWidth: 220 }}
            >
              <p className="text-sm font-semibold" style={{ color: hoveredDesk.color }}>{hoveredDesk.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{DESK_DESCRIPTIONS[hoveredDesk.id]}</p>
              <p className="text-[10px] text-muted-foreground mt-1.5 font-mono">Click to open chat •</p>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute bottom-3 right-4 text-[9px] text-muted-foreground/30 font-mono pointer-events-none">Hover a desk • Click to chat</div>
      </div>
    </div>
  );
}
