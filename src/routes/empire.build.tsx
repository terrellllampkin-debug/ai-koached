import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Building2, CreditCard, DollarSign, Coins, CheckCircle2,
  ChevronRight, ChevronLeft, Sparkles, ArrowRight, Send,
  Rocket, Trophy, Lightbulb, Loader2, Target, TrendingUp,
  Wrench, Calendar, Shield, Users, MapPin, Banknote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/empire/build")({
  head: () => ({
    meta: [
      { title: "Build Your Empire — AI KOACHED" },
      { name: "description", content: "Describe your idea. AI builds your full business plan and guides every step." },
    ],
  }),
  component: BuildWizardPage,
});

/* ─── Business Plan Type ─── */
interface BusinessPlan {
  business_name_suggestions: string[];
  business_summary: string;
  entity_recommendation: { type: string; state: string; why: string };
  target_market: { description: string; demographics: string; pain_points: string[] };
  revenue_model: { primary: string; pricing_suggestion: string; secondary_streams: string[] };
  startup_costs: { total_estimate: string; breakdown: { item: string; cost: string }[] };
  tools_needed: { tool: string; purpose: string; cost: string }[];
  ninety_day_plan: { week: string; tasks: string[] }[];
  agent_roadmap: { step: number; agent: string; action: string }[];
  competitive_advantages: string[];
  risks_and_solutions: { risk: string; solution: string }[];
  revenue_projection: { month_1: string; month_3: string; month_6: string; month_12: string; disclaimer: string };
}

/* ─── Steps ─── */
const STEPS = [
  {
    id: "entity",
    title: "Form Your Entity",
    subtitle: "Establish your legal business structure",
    icon: Building2,
    color: "#7F77DD",
    agent: "empire_eva",
    agentName: "Empire Eva",
    tasks: [
      { key: "choose_structure", label: "Choose business structure (LLC, S-Corp, etc.)" },
      { key: "select_state", label: "Select formation state" },
      { key: "file_entity", label: "File your entity" },
      { key: "get_ein", label: "Get your EIN from the IRS" },
      { key: "operating_agreement", label: "Draft operating agreement" },
    ],
    empireLink: "/empire/entity",
    empireLabel: "Go to Entity Builder →",
  },
  {
    id: "credit",
    title: "Build Your Credit",
    subtitle: "Establish business & personal credit profiles",
    icon: CreditCard,
    color: "#D4AF37",
    agent: "max_credit",
    agentName: "Max Credit",
    tasks: [
      { key: "check_personal", label: "Check personal credit report" },
      { key: "open_biz_credit", label: "Open business credit file (D&B, Experian Biz)" },
      { key: "net30_vendors", label: "Apply for 3+ Net-30 vendor accounts" },
      { key: "first_biz_card", label: "Get your first business credit card" },
      { key: "monitor_paydex", label: "Monitor and grow Paydex score" },
    ],
    empireLink: "/empire/credit",
    empireLabel: "Go to Credit Empire →",
  },
  {
    id: "revenue",
    title: "Launch Revenue Streams",
    subtitle: "Build toward $12K/month revenue goal",
    icon: DollarSign,
    color: "#4CAF50",
    agent: "revenue_rex",
    agentName: "Revenue Rex",
    tasks: [
      { key: "payment_processor", label: "Set up payment processor (Stripe, Square, etc.)" },
      { key: "first_offer", label: "Create your first offer or product" },
      { key: "sales_funnel", label: "Build a sales funnel" },
      { key: "first_1k", label: "Hit $1,000/month milestone" },
      { key: "diversify", label: "Add a second revenue stream" },
    ],
    empireLink: "/empire/revenue",
    empireLabel: "Go to Revenue HQ →",
  },
  {
    id: "koach",
    title: "Grow Your $KOACHED",
    subtitle: "Earn tokens through milestones & engagement",
    icon: Coins,
    color: "#FF9800",
    agent: "koach_coin",
    agentName: "KOACHed Coin",
    tasks: [
      { key: "claim_signup", label: "Claim signup bonus (500 $KOACHED)" },
      { key: "complete_entity", label: "Earn entity formation reward" },
      { key: "daily_engage", label: "Engage with AI coaches daily" },
      { key: "hit_milestones", label: "Hit revenue milestones for bonus tokens" },
      { key: "explore_utility", label: "Explore token utility & governance" },
    ],
    empireLink: "/empire/koach",
    empireLabel: "Go to $KOACHED Tower →",
  },
];

type TaskCompletion = Record<string, boolean>;

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
const PLAN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-business-plan`;

interface ChatMsg { role: "user" | "assistant"; content: string }

function BuildWizardPage() {
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<TaskCompletion>({});
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Business plan state
  const [showIdeaInput, setShowIdeaInput] = useState(true);
  const [idea, setIdea] = useState("");
  const [country, setCountry] = useState("");
  const [budget, setBudget] = useState("");
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [plan, setPlan] = useState<BusinessPlan | null>(null);
  const [planError, setPlanError] = useState("");
  const [showPlanDetail, setShowPlanDetail] = useState<string | null>(null);

  const step = STEPS[currentStep];

  useEffect(() => {
    if (!user) return;
    supabase.from("milestones").select("milestone_key, completed").eq("user_id", user.id)
      .then(({ data }) => {
        if (data) {
          const map: TaskCompletion = {};
          data.forEach((m) => { if (m.completed) map[m.milestone_key] = true; });
          setCompletedTasks(map);
        }
      });
  }, [user]);

  useEffect(() => {
    setChatMessages([{
      role: "assistant",
      content: `Hey CEO! 👋 I'm ${step.agentName}. Let's work on **${step.title}** together. Ask me anything about this step, or I'll guide you through each task!`,
    }]);
    setChatInput("");
  }, [currentStep, step.agentName, step.title]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const stepProgress = (stepIndex: number) => {
    const s = STEPS[stepIndex];
    const completed = s.tasks.filter((t) => completedTasks[t.key]).length;
    return Math.round((completed / s.tasks.length) * 100);
  };

  const overallProgress = () => {
    const total = STEPS.reduce((sum, s) => sum + s.tasks.length, 0);
    const done = STEPS.reduce((sum, s) => sum + s.tasks.filter((t) => completedTasks[t.key]).length, 0);
    return Math.round((done / total) * 100);
  };

  const toggleTask = async (key: string) => {
    if (!user) return;
    const newVal = !completedTasks[key];
    setCompletedTasks((prev) => ({ ...prev, [key]: newVal }));
    const taskMeta = STEPS.flatMap((s) => s.tasks).find((t) => t.key === key);
    if (newVal) {
      await supabase.from("milestones").upsert({
        user_id: user.id, milestone_key: key,
        title: taskMeta?.label || key, completed: true, completed_at: new Date().toISOString(),
      }, { onConflict: "user_id,milestone_key" });
    } else {
      await supabase.from("milestones").update({ completed: false, completed_at: null })
        .eq("user_id", user.id).eq("milestone_key", key);
    }
  };

  /* ─── Generate Business Plan ─── */
  const handleGeneratePlan = async () => {
    if (!idea.trim() || generatingPlan) return;
    setGeneratingPlan(true);
    setPlanError("");
    setPlan(null);

    try {
      const resp = await fetch(PLAN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          idea: idea.trim(),
          country: country.trim() || undefined,
          budget: budget.trim() || undefined,
          experience_level: "beginner",
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Generation failed" }));
        setPlanError(err.error || "Failed to generate plan");
        setGeneratingPlan(false);
        return;
      }

      const result = await resp.json();
      if (result.plan) {
        setPlan(result.plan);
        setShowIdeaInput(false);
      } else {
        setPlanError("No plan was generated. Try a more detailed description.");
      }
    } catch {
      setPlanError("Something went wrong. Please try again.");
    }
    setGeneratingPlan(false);
  };

  /* ─── Chat handler ─── */
  const handleChat = useCallback(async () => {
    if (!chatInput.trim() || isStreaming) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    const userEntry: ChatMsg = { role: "user", content: userMsg };
    setChatMessages((prev) => [...prev, userEntry]);
    setIsStreaming(true);

    let assistantSoFar = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...chatMessages, userEntry].map((m) => ({ role: m.role, content: m.content })),
          agent: step.agent,
          user_id: user?.id,
        }),
      });

      if (!resp.ok || !resp.body) {
        const err = await resp.json().catch(() => ({ error: "Connection failed" }));
        setChatMessages((prev) => [...prev, { role: "assistant", content: `⚠️ ${err.error || "Something went wrong."}` }]);
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
              setChatMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && prev.length > 1) {
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
    } catch {
      setChatMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Connection error. Please try again." }]);
    } finally {
      setIsStreaming(false);
    }
  }, [chatInput, isStreaming, chatMessages, step.agent, user?.id]);

  if (!isAuthenticated) return null;

  const pct = overallProgress();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Rocket className="w-7 h-7 text-primary" />
            <h1 className="font-heading text-2xl font-bold">Build Your Empire</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Describe your idea → AI builds your plan → Follow the steps → Empire built.
          </p>
        </div>

        {/* ════════════════════════════════════════════════════ */}
        {/* STEP 0: Business Idea Input */}
        {/* ════════════════════════════════════════════════════ */}
        {showIdeaInput && !plan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="p-6 sm:p-8 rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-heading text-xl font-bold">What's Your Business Idea?</h2>
                  <p className="text-sm text-muted-foreground">
                    Describe it in your own words — AI will build your entire plan.
                  </p>
                </div>
              </div>

              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Example: I want to start a social media marketing agency helping small restaurants get more customers through Instagram and TikTok. I'm good at creating content but don't know anything about business..."
                className="w-full h-28 rounded-xl border border-border bg-background p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 mb-4"
                maxLength={5000}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    <MapPin className="w-3 h-3 inline mr-1" />What country are you in?
                  </label>
                  <Input
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. United States, Nigeria, UK..."
                    className="bg-background text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    <Banknote className="w-3 h-3 inline mr-1" />Starting budget? (optional)
                  </label>
                  <Input
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g. $0, $500, $5,000..."
                    className="bg-background text-sm"
                  />
                </div>
              </div>

              <Button
                onClick={handleGeneratePlan}
                disabled={generatingPlan || !idea.trim()}
                size="lg"
                className="bg-primary text-primary-foreground gap-2 w-full sm:w-auto"
              >
                {generatingPlan ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> AI is building your plan...</>
                ) : (
                  <><Sparkles className="w-5 h-5" /> Generate My Business Plan</>
                )}
              </Button>

              {planError && (
                <div className="mt-4 p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                  {planError}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════ */}
        {/* BUSINESS PLAN DISPLAY */}
        {/* ════════════════════════════════════════════════════ */}
        {plan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {/* Plan Header */}
            <div className="p-5 rounded-2xl border border-primary/30 bg-card mb-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="font-heading text-lg font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Your AI-Generated Business Plan
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">{plan.business_summary}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => { setPlan(null); setShowIdeaInput(true); }}
                  className="text-xs shrink-0"
                >
                  New Idea
                </Button>
              </div>

              {/* Name Suggestions */}
              <div className="flex flex-wrap gap-2 mb-3">
                {plan.business_name_suggestions?.map((name, i) => (
                  <span key={i} className="px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-xs font-medium text-primary">
                    {name}
                  </span>
                ))}
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <PlanCard
                  icon={Building2}
                  label="Entity"
                  value={`${plan.entity_recommendation?.type} in ${plan.entity_recommendation?.state}`}
                  detail={plan.entity_recommendation?.why}
                  isOpen={showPlanDetail === "entity"}
                  onToggle={() => setShowPlanDetail(showPlanDetail === "entity" ? null : "entity")}
                />
                <PlanCard
                  icon={Target}
                  label="Target Market"
                  value={plan.target_market?.description?.slice(0, 60) + "..."}
                  detail={`${plan.target_market?.demographics}\n\nPain Points:\n${plan.target_market?.pain_points?.map(p => `• ${p}`).join("\n")}`}
                  isOpen={showPlanDetail === "market"}
                  onToggle={() => setShowPlanDetail(showPlanDetail === "market" ? null : "market")}
                />
                <PlanCard
                  icon={DollarSign}
                  label="Revenue"
                  value={plan.revenue_model?.pricing_suggestion}
                  detail={`${plan.revenue_model?.primary}\n\nSecondary:\n${plan.revenue_model?.secondary_streams?.map(s => `• ${s}`).join("\n")}`}
                  isOpen={showPlanDetail === "revenue"}
                  onToggle={() => setShowPlanDetail(showPlanDetail === "revenue" ? null : "revenue")}
                />
                <PlanCard
                  icon={Banknote}
                  label="Startup Cost"
                  value={plan.startup_costs?.total_estimate}
                  detail={plan.startup_costs?.breakdown?.map(b => `• ${b.item}: ${b.cost}`).join("\n")}
                  isOpen={showPlanDetail === "costs"}
                  onToggle={() => setShowPlanDetail(showPlanDetail === "costs" ? null : "costs")}
                />
              </div>
            </div>

            {/* Expandable sections */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {/* 90-Day Plan */}
              <button
                onClick={() => setShowPlanDetail(showPlanDetail === "90day" ? null : "90day")}
                className="p-4 rounded-xl border border-border bg-card text-left hover:border-primary/30 transition-all"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="font-heading text-sm font-bold">90-Day Launch Plan</span>
                </div>
                <p className="text-[10px] text-muted-foreground">{plan.ninety_day_plan?.length} phases mapped out</p>
              </button>

              {/* Tools */}
              <button
                onClick={() => setShowPlanDetail(showPlanDetail === "tools" ? null : "tools")}
                className="p-4 rounded-xl border border-border bg-card text-left hover:border-primary/30 transition-all"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Wrench className="w-4 h-4 text-secondary" />
                  <span className="font-heading text-sm font-bold">Tools & Software</span>
                </div>
                <p className="text-[10px] text-muted-foreground">{plan.tools_needed?.length} tools recommended</p>
              </button>

              {/* Risks */}
              <button
                onClick={() => setShowPlanDetail(showPlanDetail === "risks" ? null : "risks")}
                className="p-4 rounded-xl border border-border bg-card text-left hover:border-primary/30 transition-all"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-destructive" />
                  <span className="font-heading text-sm font-bold">Risks & Solutions</span>
                </div>
                <p className="text-[10px] text-muted-foreground">{plan.risks_and_solutions?.length} risks identified</p>
              </button>

              {/* Revenue Projections */}
              <button
                onClick={() => setShowPlanDetail(showPlanDetail === "projections" ? null : "projections")}
                className="p-4 rounded-xl border border-border bg-card text-left hover:border-primary/30 transition-all"
              >
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="font-heading text-sm font-bold">Revenue Projections</span>
                </div>
                <p className="text-[10px] text-muted-foreground">Month 1 → Month 12 targets</p>
              </button>
            </div>

            {/* Detail Panels */}
            <AnimatePresence>
              {showPlanDetail === "90day" && (
                <DetailPanel title="90-Day Launch Plan" onClose={() => setShowPlanDetail(null)}>
                  {plan.ninety_day_plan?.map((phase, i) => (
                    <div key={i} className="mb-3">
                      <p className="font-heading text-sm font-bold text-primary">{phase.week}</p>
                      <ul className="mt-1 space-y-1">
                        {phase.tasks?.map((task, j) => (
                          <li key={j} className="text-xs text-muted-foreground flex items-start gap-2">
                            <ChevronRight className="w-3 h-3 mt-0.5 shrink-0 text-primary" />
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </DetailPanel>
              )}
              {showPlanDetail === "tools" && (
                <DetailPanel title="Recommended Tools" onClose={() => setShowPlanDetail(null)}>
                  <div className="space-y-2">
                    {plan.tools_needed?.map((tool, i) => (
                      <div key={i} className="flex items-start justify-between p-2 rounded-lg bg-muted/30">
                        <div>
                          <p className="text-xs font-medium">{tool.tool}</p>
                          <p className="text-[10px] text-muted-foreground">{tool.purpose}</p>
                        </div>
                        <span className="text-[10px] font-mono text-primary shrink-0">{tool.cost}</span>
                      </div>
                    ))}
                  </div>
                </DetailPanel>
              )}
              {showPlanDetail === "risks" && (
                <DetailPanel title="Risks & Solutions" onClose={() => setShowPlanDetail(null)}>
                  <div className="space-y-3">
                    {plan.risks_and_solutions?.map((r, i) => (
                      <div key={i}>
                        <p className="text-xs font-medium text-destructive">⚠️ {r.risk}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">✅ {r.solution}</p>
                      </div>
                    ))}
                  </div>
                </DetailPanel>
              )}
              {showPlanDetail === "projections" && (
                <DetailPanel title="Revenue Projections" onClose={() => setShowPlanDetail(null)}>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {[
                      { label: "Month 1", value: plan.revenue_projection?.month_1 },
                      { label: "Month 3", value: plan.revenue_projection?.month_3 },
                      { label: "Month 6", value: plan.revenue_projection?.month_6 },
                      { label: "Month 12", value: plan.revenue_projection?.month_12 },
                    ].map((p, i) => (
                      <div key={i} className="text-center p-3 rounded-lg bg-muted/30">
                        <p className="text-[10px] text-muted-foreground">{p.label}</p>
                        <p className="font-mono text-sm font-bold text-primary">{p.value}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[9px] text-muted-foreground italic">{plan.revenue_projection?.disclaimer}</p>
                </DetailPanel>
              )}
            </AnimatePresence>

            {/* Agent Roadmap */}
            {plan.agent_roadmap && plan.agent_roadmap.length > 0 && (
              <div className="p-4 rounded-xl border border-border bg-card mt-4">
                <h3 className="font-heading text-sm font-bold flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-secondary" />
                  Your AI Agent Roadmap
                </h3>
                <div className="space-y-2">
                  {plan.agent_roadmap.map((ar, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs">
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                        {ar.step}
                      </span>
                      <span className="font-medium text-secondary">{ar.agent}</span>
                      <span className="text-muted-foreground">→ {ar.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════ */}
        {/* EMPIRE BUILD STEPS (always visible below plan) */}
        {/* ════════════════════════════════════════════════════ */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
            <span className="font-mono text-sm font-bold text-primary">{pct}%</span>
          </div>
        </div>

        {/* Step tabs */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {STEPS.map((s, i) => {
            const prog = stepProgress(i);
            const isCurrent = i === currentStep;
            return (
              <button
                key={s.id}
                onClick={() => setCurrentStep(i)}
                className={cn(
                  "relative p-3 rounded-xl border transition-all text-left",
                  isCurrent
                    ? "border-primary/50 bg-primary/5 shadow-lg shadow-primary/10"
                    : "border-border bg-card hover:border-primary/30"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <s.icon className="w-4 h-4" style={{ color: s.color }} />
                  <span className={cn("text-xs font-semibold truncate", isCurrent && "text-primary")}>
                    {s.title}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${prog}%`, backgroundColor: s.color }} />
                </div>
                {prog === 100 && <CheckCircle2 className="absolute top-2 right-2 w-4 h-4" style={{ color: s.color }} />}
              </button>
            );
          })}
        </div>

        {/* Active step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Left: Tasks checklist */}
            <div className="space-y-4">
              <div className="p-6 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: step.color + "20" }}>
                    <step.icon className="w-5 h-5" style={{ color: step.color }} />
                  </div>
                  <div>
                    <h2 className="font-heading text-lg font-bold">{step.title}</h2>
                    <p className="text-xs text-muted-foreground">{step.subtitle}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {step.tasks.map((task, i) => {
                    const isDone = completedTasks[task.key];
                    return (
                      <motion.button
                        key={task.key}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => toggleTask(task.key)}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all",
                          isDone ? "border-primary/30 bg-primary/5" : "border-border hover:border-primary/20 hover:bg-muted/50"
                        )}
                      >
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                          isDone ? "border-primary bg-primary" : "border-muted-foreground/30"
                        )}>
                          {isDone && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
                        </div>
                        <span className={cn("text-sm", isDone && "line-through text-muted-foreground")}>
                          {task.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                <Link to={step.empireLink} className="mt-4 flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                  {step.empireLabel} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm" onClick={() => setCurrentStep((p) => Math.max(0, p - 1))} disabled={currentStep === 0} className="gap-1">
                  <ChevronLeft className="w-4 h-4" /> Previous
                </Button>
                <span className="text-xs text-muted-foreground font-mono">Step {currentStep + 1} of {STEPS.length}</span>
                <Button variant="outline" size="sm" onClick={() => setCurrentStep((p) => Math.min(STEPS.length - 1, p + 1))} disabled={currentStep === STEPS.length - 1} className="gap-1">
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Right: Embedded AI coach chat */}
            <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden" style={{ height: "520px" }}>
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border" style={{ backgroundColor: step.color + "08" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: step.color + "20" }}>
                  <Sparkles className="w-4 h-4" style={{ color: step.color }} />
                </div>
                <div>
                  <h3 className="text-sm font-heading font-semibold" style={{ color: step.color }}>{step.agentName}</h3>
                  <p className="text-[10px] text-muted-foreground">Guiding you through {step.title.toLowerCase()}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={cn(
                      "max-w-[85%] rounded-xl px-3.5 py-2 text-sm leading-relaxed",
                      msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    )}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
                {isStreaming && chatMessages[chatMessages.length - 1]?.role !== "assistant" && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-xl px-3.5 py-2 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" style={{ color: step.color }} />
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleChat()}
                    placeholder={`Ask ${step.agentName} about this step...`}
                    className="bg-muted border-border text-sm"
                    disabled={isStreaming}
                  />
                  <Button size="icon" onClick={handleChat} disabled={!chatInput.trim() || isStreaming} className="shrink-0" style={{ backgroundColor: step.color }}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {pct === 100 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 p-8 rounded-2xl border-2 border-primary bg-gradient-to-br from-primary/10 to-accent/10 text-center">
            <Trophy className="w-12 h-12 text-primary mx-auto mb-3" />
            <h2 className="font-heading text-2xl font-bold mb-2">Empire Built! 🎉</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              You've completed all steps. Your business foundation is set — keep growing with your AI coaches!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ─── Reusable Components ─── */
function PlanCard({
  icon: Icon,
  label,
  value,
  detail,
  isOpen,
  onToggle,
}: {
  icon: any;
  label: string;
  value: string;
  detail?: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className={cn(
          "w-full p-3 rounded-xl border text-left transition-all",
          isOpen ? "border-primary/50 bg-primary/5" : "border-border bg-muted/20 hover:border-primary/30"
        )}
      >
        <Icon className="w-4 h-4 text-primary mb-1" />
        <p className="text-[10px] text-muted-foreground">{label}</p>
        <p className="text-xs font-medium mt-0.5 line-clamp-2">{value}</p>
      </button>
      <AnimatePresence>
        {isOpen && detail && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1 p-3 rounded-lg bg-card border border-border text-xs text-muted-foreground whitespace-pre-line overflow-hidden"
          >
            {detail}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailPanel({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-4 p-5 rounded-xl border border-border bg-card overflow-hidden"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading text-sm font-bold">{title}</h3>
        <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground">Close ✕</button>
      </div>
      {children}
    </motion.div>
  );
}
