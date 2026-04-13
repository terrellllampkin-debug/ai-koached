import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Building2, CreditCard, DollarSign, Coins, Send, Sparkles,
  Bot, ArrowRight, Wrench, Briefcase, Users,
  Newspaper, Zap, FileText, Palette, CalendarCheck, Globe,
  Target, TrendingUp, CheckCircle2, Circle, MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/empire/ai-workers")({
  head: () => ({
    meta: [
      { title: "AI Workers — Build Your Business — AI KOACHED" },
      { name: "description", content: "AI workers build your entire business from scratch, step by step." },
    ],
  }),
  component: AIWorkersPage,
});

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

// ═══════════════════════════════════════════════════════════
// EMPIRE JOURNEY PHASES (mirrors server-side)
// ═══════════════════════════════════════════════════════════
const EMPIRE_PHASES = [
  { id: "discovery", name: "Discovery & Plan", agent: "ceo_coach", icon: Briefcase, color: "#D4AF37", steps: ["Identify passion & skills", "Define target market", "Set budget & goals", "Country selected", "Credit assessed", "Business plan generated"] },
  { id: "entity", name: "Entity Formation", agent: "empire_eva", icon: Building2, color: "#7F77DD", steps: ["Entity type chosen", "Jurisdiction selected", "Entity filed", "EIN/Tax ID obtained", "Registered agent set", "Operating agreement"] },
  { id: "brand", name: "Brand & Identity", agent: "brand_builder", icon: Palette, color: "#E91E63", steps: ["Name finalized", "Colors & typography", "Logo concept", "Voice & tagline", "Domain & socials"] },
  { id: "legal", name: "Legal Documents", agent: "legal_docs", icon: FileText, color: "#26A69A", steps: ["Operating agreement", "NDA template", "Service agreement", "Privacy & terms"] },
  { id: "website", name: "Website", agent: "website_builder", icon: Globe, color: "#00BCD4", steps: ["Platform chosen", "Content written", "SEO setup", "Analytics installed"] },
  { id: "compliance", name: "Compliance", agent: "compliance_coach", icon: CalendarCheck, color: "#FF5722", steps: ["Filing calendar", "Tax deadlines", "License renewals"] },
  { id: "credit", name: "Personal Credit", agent: "max_credit", icon: CreditCard, color: "#D4AF37", steps: ["Report reviewed", "Plan created", "Accounts opened"] },
  { id: "biz_credit", name: "Business Credit", agent: "biz_credit", icon: Briefcase, color: "#2196F3", steps: ["D-U-N-S obtained", "Vendor accounts", "Monitoring active"] },
  { id: "revenue", name: "Revenue & Sales", agent: "revenue_rex", icon: DollarSign, color: "#4CAF50", steps: ["Processor set up", "Pricing defined", "Funnel created", "First revenue"] },
  { id: "growth", name: "Growth & Scale", agent: "biz_growth", icon: TrendingUp, color: "#00E676", steps: ["Lead gen active", "Partnerships set", "90-day plan running", "Scaling revenue"] },
];

const WORKERS = [
  { id: "ceo_coach", name: "The Architect", role: "Master Builder", icon: Briefcase, color: "#D4AF37", description: "Interviews you, builds your full business plan, and dispatches AI workers" },
  { id: "profile_builder", name: "Profile Pro", role: "B2B Profile Builder", icon: Users, color: "#9C27B0", description: "Creates your business profile for the B2B community marketplace" },
  { id: "empire_eva", name: "Empire Eva", role: "Entity Formation (Global)", icon: Building2, color: "#7F77DD", description: "Files entities in any country — US LLC, UK Ltd, Nigerian CAC, UAE Free Zone & more" },
  { id: "legal_docs", name: "Doc Builder", role: "Legal Documents", icon: FileText, color: "#26A69A", description: "Generates contracts, NDAs, operating agreements, privacy policies & more" },
  { id: "brand_builder", name: "Brand Kit", role: "Branding & Identity", icon: Palette, color: "#E91E63", description: "Creates your complete brand — colors, fonts, logo concepts, taglines, domain ideas" },
  { id: "website_builder", name: "Site Builder", role: "Website Strategy", icon: Globe, color: "#00BCD4", description: "Plans your website, writes page content, recommends platforms, sets up SEO" },
  { id: "compliance_coach", name: "Compliance Coach", role: "Deadlines & Filings", icon: CalendarCheck, color: "#FF5722", description: "Tracks every filing deadline, tax date, and license renewal so you never get shut down" },
  { id: "max_credit", name: "Max Credit", role: "Personal Credit", icon: CreditCard, color: "#D4AF37", description: "Builds your personal credit profile and score" },
  { id: "biz_credit", name: "Biz Builder Brock", role: "Business Credit", icon: Briefcase, color: "#2196F3", description: "Establishes D&B profile, Paydex score, vendor accounts" },
  { id: "credit_repair", name: "Fix-It Frankie", role: "Credit Repair", icon: Wrench, color: "#E53935", description: "Disputes errors, writes letters, restores your credit" },
  { id: "revenue_rex", name: "Revenue Rex", role: "Revenue Growth", icon: DollarSign, color: "#4CAF50", description: "Sets up payment processing, pricing, sales funnels — global processors" },
  { id: "koach_coin", name: "KOACHed Coin", role: "$KOACHED Tokens", icon: Coins, color: "#FF9800", description: "Tracks your token earnings and utility" },
  { id: "sales_closer", name: "Sales Closer", role: "Sales Strategy", icon: Target, color: "#F44336", description: "Creates sales scripts, funnels, and outreach based on what your buyers want" },
  { id: "biz_growth", name: "Growth Engine", role: "Get More Business", icon: TrendingUp, color: "#00E676", description: "Finds leads, partnerships, contracts, and new clients across every channel" },
];

interface JourneyData {
  phase: string;
  current_step: number;
  completed_phases: string[];
  agent_notes: Record<string, string>;
  next_agent: string;
}

function AIWorkersPage() {
  const { user, isAuthenticated } = useAuth();
  const [activeWorker, setActiveWorker] = useState("ceo_coach");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [dailyIntel, setDailyIntel] = useState<Array<{ id: string; category: string; title: string; content: string }>>([]);
  const [showIntel, setShowIntel] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [journey, setJourney] = useState<JourneyData | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const worker = WORKERS.find((w) => w.id === activeWorker) || WORKERS[0];

  // Fetch journey data
  useEffect(() => {
    if (!user) return;
    supabase
      .from("empire_journey")
      .select("*")
      .eq("user_id", user.id)
      .single()
      .then(({ data, error }) => {
        if (data) {
          setJourney(data as unknown as JourneyData);
        } else if (error?.code === "PGRST116") {
          // No journey yet — create one
          supabase.from("empire_journey").insert({ user_id: user.id }).then(({ data: newJ }) => {
            if (newJ) setJourney(newJ as unknown as JourneyData);
            else setJourney({ phase: "discovery", current_step: 1, completed_phases: [], agent_notes: {}, next_agent: "ceo_coach" });
          });
        }
      });
  }, [user]);

  // Fetch daily intel
  useEffect(() => {
    supabase
      .from("business_intel")
      .select("id, category, title, content")
      .order("intel_date", { ascending: false })
      .limit(12)
      .then(({ data }) => {
        if (data) setDailyIntel(data);
      });
  }, []);

  // Load chat history for active worker
  useEffect(() => {
    if (!user) return;
    supabase
      .from("chat_messages")
      .select("role, content")
      .eq("user_id", user.id)
      .eq("agent", activeWorker)
      .order("created_at", { ascending: true })
      .limit(50)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setMessages(data.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })));
        } else {
          if (activeWorker === "ceo_coach") {
            setMessages([{
              role: "assistant",
              content: `Welcome to AI KOACHED, CEO! 🏗️\n\nI'm **The Architect** — your Master AI Business Builder. I'm going to build your entire business from the ground up, even if you're starting with zero knowledge.\n\nI'll ask you every important question, create your business plan, then dispatch my team of AI specialists to handle each piece.\n\n**Let's start with the most important question:**\n\nWhat are you passionate about? What skills do you have? What do people always come to you for help with?`,
            }]);
          } else {
            setMessages([{
              role: "assistant",
              content: `Hey CEO! I'm **${worker.name}**, your ${worker.role} specialist. I have context from your other agents about your business. Let me pick up where they left off — what do you need help with?`,
            }]);
          }
        }
      });
  }, [user, activeWorker, worker.name, worker.role]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Process agent response for journey updates
  const processJourneyUpdates = useCallback(async (responseText: string) => {
    if (!user || !journey) return;

    let updated = false;
    const newJourney = { ...journey };

    // Check for step completion
    if (responseText.includes("[STEP_COMPLETE]")) {
      const currentPhase = EMPIRE_PHASES.find((p) => p.id === journey.phase);
      if (currentPhase && journey.current_step < currentPhase.steps.length) {
        newJourney.current_step = journey.current_step + 1;
        updated = true;
      }
    }

    // Check for phase completion
    if (responseText.includes("[PHASE_COMPLETE]")) {
      const currentPhase = EMPIRE_PHASES.find((p) => p.id === journey.phase);
      if (currentPhase) {
        const nextPhaseId = EMPIRE_PHASES[EMPIRE_PHASES.indexOf(currentPhase) + 1]?.id || journey.phase;
        const nextAgent = EMPIRE_PHASES.find((p) => p.id === nextPhaseId)?.agent || "ceo_coach";
        newJourney.completed_phases = [...journey.completed_phases, journey.phase];
        newJourney.phase = nextPhaseId;
        newJourney.current_step = 1;
        newJourney.next_agent = nextAgent;
        updated = true;
      }
    }

    // Check for agent notes
    const noteMatch = responseText.match(/\[AGENT_NOTE:\s*(.+?)\]/);
    if (noteMatch) {
      newJourney.agent_notes = { ...journey.agent_notes, [activeWorker]: noteMatch[1] };
      updated = true;
    }

    if (updated) {
      setJourney(newJourney);
      await supabase
        .from("empire_journey")
        .update({
          phase: newJourney.phase,
          current_step: newJourney.current_step,
          completed_phases: newJourney.completed_phases,
          agent_notes: newJourney.agent_notes,
          next_agent: newJourney.next_agent,
        })
        .eq("user_id", user.id);
    }
  }, [user, journey, activeWorker]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isStreaming) return;

    const userMsg = input.trim();
    setInput("");
    const userEntry: ChatMsg = { role: "user", content: userMsg };
    setMessages((prev) => [...prev, userEntry]);
    setIsStreaming(true);

    if (user) {
      supabase.from("chat_messages").insert({
        user_id: user.id, agent: activeWorker, role: "user", content: userMsg,
      }).then(() => {});
    }

    let assistantSoFar = "";
    const maxRetries = 2;
    let lastError = "";

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          await new Promise((r) => setTimeout(r, 1000 * attempt));
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant") return prev.slice(0, -1);
            return prev;
          });
        }

        const resp = await fetch(CHAT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [...messages, userEntry].map((m) => ({ role: m.role, content: m.content })),
            agent: activeWorker,
            user_id: user?.id,
          }),
        });

        if (!resp.ok || !resp.body) {
          const err = await resp.json().catch(() => ({ error: "Connection failed" }));
          lastError = err.error || "Something went wrong.";
          if (resp.status === 429 || resp.status >= 500) continue;
          setMessages((prev) => [...prev, { role: "assistant", content: `⚠️ ${lastError}` }]);
          setIsStreaming(false);
          return;
        }

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let buf = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });

          let nl: number;
          while ((nl = buf.indexOf("\n")) !== -1) {
            let line = buf.slice(0, nl);
            buf = buf.slice(nl + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (line.startsWith(":") || !line.trim() || !line.startsWith("data: ")) continue;
            const json = line.slice(6).trim();
            if (json === "[DONE]") break;
            try {
              const parsed = JSON.parse(json);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                assistantSoFar += content;
                // Strip hidden tags from display
                const displayText = assistantSoFar
                  .replace(/\[STEP_COMPLETE\]/g, "")
                  .replace(/\[PHASE_COMPLETE\]/g, "")
                  .replace(/\[AGENT_NOTE:.*?\]/g, "")
                  .trim();
                setMessages((prev) => {
                  const last = prev[prev.length - 1];
                  if (last?.role === "assistant" && prev.length > 1) {
                    return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: displayText } : m));
                  }
                  return [...prev, { role: "assistant", content: displayText }];
                });
              }
            } catch {
              buf = line + "\n" + buf;
              break;
            }
          }
        }

        // Save and process journey updates
        if (user && assistantSoFar) {
          const displayText = assistantSoFar
            .replace(/\[STEP_COMPLETE\]/g, "")
            .replace(/\[PHASE_COMPLETE\]/g, "")
            .replace(/\[AGENT_NOTE:.*?\]/g, "")
            .trim();
          supabase.from("chat_messages").insert({
            user_id: user.id, agent: activeWorker, role: "assistant", content: displayText,
          }).then(() => {});

          // Process journey updates from the raw response
          processJourneyUpdates(assistantSoFar);
        }
        break;
      } catch {
        if (attempt === maxRetries) {
          setMessages((prev) => [...prev, { role: "assistant", content: `⚠️ ${lastError || "Connection error. Please try again."}` }]);
        }
      }
    }

    setIsStreaming(false);
    inputRef.current?.focus();
  }, [input, isStreaming, messages, activeWorker, user, processJourneyUpdates]);

  if (!isAuthenticated) return null;

  // Figure out which phase the current worker belongs to
  const currentWorkerPhase = EMPIRE_PHASES.find((p) => p.agent === activeWorker);
  const isRecommendedAgent = journey?.next_agent === activeWorker;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex h-[calc(100vh-0px)]">
        {/* Worker sidebar */}
        <div className="w-72 border-r border-border bg-card flex flex-col shrink-0">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 mb-1">
              <Bot className="w-5 h-5 text-primary" />
              <h1 className="font-heading text-sm font-bold">AI Workers</h1>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Your AI team builds everything step by step
            </p>
          </div>

          {/* Empire Roadmap Toggle */}
          <div className="px-2 pt-2">
            <button
              onClick={() => setShowRoadmap(!showRoadmap)}
              className={cn(
                "w-full flex items-center gap-2 p-2.5 rounded-lg text-left transition-all text-xs font-semibold",
                showRoadmap
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "text-muted-foreground hover:bg-muted/50 border border-transparent"
              )}
            >
              <MapPin className="w-4 h-4" />
              <span>Empire Roadmap</span>
              {journey && (
                <span className="ml-auto text-[9px] font-mono bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                  {journey.completed_phases.length}/{EMPIRE_PHASES.length}
                </span>
              )}
            </button>
          </div>

          {/* Empire Roadmap Panel */}
          <AnimatePresence>
            {showRoadmap && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden px-2"
              >
                <div className="space-y-0.5 py-2 max-h-64 overflow-y-auto">
                  {EMPIRE_PHASES.map((phase, idx) => {
                    const isCompleted = journey?.completed_phases.includes(phase.id);
                    const isCurrent = journey?.phase === phase.id;
                    const PhaseIcon = phase.icon;
                    return (
                      <button
                        key={phase.id}
                        onClick={() => {
                          setActiveWorker(phase.agent);
                          setShowRoadmap(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-2 p-2 rounded-lg text-left transition-all text-xs",
                          isCurrent
                            ? "bg-primary/10 border border-primary/30 text-primary font-bold"
                            : isCompleted
                            ? "text-green-500/80 hover:bg-muted/30 border border-transparent"
                            : "text-muted-foreground hover:bg-muted/30 border border-transparent"
                        )}
                      >
                        <div className="relative">
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : isCurrent ? (
                            <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            </div>
                          ) : (
                            <Circle className="w-4 h-4 text-muted-foreground/40" />
                          )}
                          {idx < EMPIRE_PHASES.length - 1 && (
                            <div className={cn(
                              "absolute top-5 left-1.5 w-0.5 h-3",
                              isCompleted ? "bg-green-500/40" : "bg-muted-foreground/20"
                            )} />
                          )}
                        </div>
                        <PhaseIcon className="w-3.5 h-3.5" style={{ color: isCurrent ? phase.color : undefined }} />
                        <span className="truncate">{phase.name}</span>
                        {isCurrent && journey && (
                          <span className="ml-auto text-[8px] font-mono">
                            {journey.current_step}/{phase.steps.length}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {WORKERS.map((w) => {
              const isActive = w.id === activeWorker;
              const isRecommended = journey?.next_agent === w.id && !isActive;
              const phaseForWorker = EMPIRE_PHASES.find((p) => p.agent === w.id);
              const isPhaseComplete = phaseForWorker && journey?.completed_phases.includes(phaseForWorker.id);
              return (
                <button
                  key={w.id}
                  onClick={() => setActiveWorker(w.id)}
                  className={cn(
                    "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all",
                    isActive
                      ? "bg-primary/10 border border-primary/30"
                      : isRecommended
                      ? "bg-accent/5 border border-accent/30 animate-pulse"
                      : "hover:bg-muted/50 border border-transparent"
                  )}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 relative"
                    style={{ backgroundColor: w.color + "20" }}
                  >
                    <w.icon className="w-4 h-4" style={{ color: w.color }} />
                    {isPhaseComplete && (
                      <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className={cn("text-sm font-semibold truncate", isActive && "text-primary")}>
                      {w.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">{w.role}</p>
                    {isRecommended && (
                      <p className="text-[9px] text-accent font-bold mt-0.5">👈 NEXT STEP</p>
                    )}
                  </div>
                  {isActive && (
                    <div className="ml-auto mt-1">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Daily Intel Toggle */}
          {dailyIntel.length > 0 && (
            <div className="px-2 pb-1">
              <button
                onClick={() => setShowIntel(!showIntel)}
                className={cn(
                  "w-full flex items-center gap-2 p-2.5 rounded-lg text-left transition-all text-xs font-semibold",
                  showIntel
                    ? "bg-accent/10 text-accent border border-accent/30"
                    : "text-muted-foreground hover:bg-muted/50 border border-transparent"
                )}
              >
                <Newspaper className="w-4 h-4" />
                <span>Daily Intel</span>
                <Zap className="w-3 h-3 ml-auto text-accent" />
              </button>
            </div>
          )}

          <AnimatePresence>
            {showIntel && dailyIntel.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden px-2"
              >
                <div className="space-y-1.5 pb-2 max-h-48 overflow-y-auto">
                  {dailyIntel.slice(0, 8).map((item) => (
                    <div key={item.id} className="p-2 rounded-lg bg-muted/30 border border-border">
                      <span className="text-[8px] font-mono uppercase text-accent font-bold">{item.category.replace("_", " ")}</span>
                      <p className="text-[10px] font-medium leading-tight">{item.title}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-3 border-t border-border">
            <p className="text-[10px] text-muted-foreground text-center mb-2">
              {journey?.next_agent ? (
                <>Next: <strong>{WORKERS.find((w) => w.id === journey.next_agent)?.name || "The Architect"}</strong></>
              ) : (
                <>Start with <strong>The Architect</strong></>
              )}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs gap-1"
              onClick={() => setActiveWorker(journey?.next_agent || "ceo_coach")}
            >
              <ArrowRight className="w-3 h-3" />
              {journey?.next_agent && journey.next_agent !== "ceo_coach" ? "Continue Building" : "Start Building"}
            </Button>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {/* Chat header with journey progress */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card/50">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: worker.color + "15" }}
            >
              <worker.icon className="w-5 h-5" style={{ color: worker.color }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-base font-bold" style={{ color: worker.color }}>
                  {worker.name}
                </h2>
                {isRecommendedAgent && (
                  <span className="text-[9px] font-bold bg-accent/20 text-accent px-2 py-0.5 rounded-full">RECOMMENDED</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{worker.description}</p>
            </div>
            {currentWorkerPhase && journey && (
              <div className="text-right">
                <p className="text-[10px] font-mono text-muted-foreground">
                  Phase: {currentWorkerPhase.name}
                </p>
                <div className="flex gap-0.5 mt-1">
                  {currentWorkerPhase.steps.map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-3 h-1 rounded-full",
                        journey.phase === currentWorkerPhase.id && i < journey.current_step
                          ? "bg-primary"
                          : journey.completed_phases.includes(currentWorkerPhase.id)
                          ? "bg-green-500"
                          : "bg-muted-foreground/20"
                      )}
                    />
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center gap-1 text-[10px] text-green-500 font-mono">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              ONLINE
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {messages.map((msg, i) => (
              <motion.div
                key={`${activeWorker}-${i}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i < 3 ? i * 0.05 : 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={cn("flex items-start gap-2 max-w-[75%]")}>
                  {msg.role === "assistant" && (
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-1"
                      style={{ backgroundColor: worker.color + "20" }}
                    >
                      <worker.icon className="w-3.5 h-3.5" style={{ color: worker.color }} />
                    </div>
                  )}
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))}

            {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="flex items-start gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: worker.color + "20" }}
                  >
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" style={{ color: worker.color }} />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Working on it...</span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick action chips */}
          {activeWorker === "ceo_coach" && messages.length <= 2 && (
            <div className="px-6 pb-2 flex flex-wrap gap-2">
              {[
                "I want to start a business but don't know where to begin",
                "I have a business idea, help me build it",
                "I'm outside the US — help me start a business in my country",
                "I want to start an international online business",
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => { setInput(prompt); setTimeout(() => inputRef.current?.focus(), 50); }}
                  className="text-xs px-3 py-1.5 rounded-full border border-primary/20 text-primary/80 hover:bg-primary/5 hover:border-primary/40 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-border bg-card/30">
            <div className="flex items-center gap-3 max-w-3xl mx-auto">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={`Talk to ${worker.name}...`}
                className="bg-muted border-border rounded-xl"
                disabled={isStreaming}
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!input.trim() || isStreaming}
                className="shrink-0 rounded-xl"
                style={{ backgroundColor: worker.color }}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground text-center">
              +5 $KOACHED per interaction • Agents share context about your business 🤖
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
