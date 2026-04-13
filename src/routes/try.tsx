import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Lightbulb, Sparkles, Loader2, MapPin, Banknote, ArrowRight,
  Building2, CreditCard, DollarSign, Target, TrendingUp, Calendar,
  Shield, Users, Wrench, CheckCircle2, ChevronDown, ChevronUp,
  Rocket, Lock, Bot, Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/try")({
  head: () => ({
    meta: [
      { title: "Try AI KOACHED Free — See What AI Would Build For You" },
      { name: "description", content: "Describe your business idea. AI instantly generates your full business plan, entity strategy, revenue model, and 90-day roadmap — completely free, no signup required." },
      { property: "og:title", content: "Try AI KOACHED Free — Your Business Plan in 60 Seconds" },
      { property: "og:description", content: "Type your idea. AI builds your entire business blueprint. No signup needed." },
    ],
  }),
  component: TryFreePage,
});

const PLAN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-business-plan`;

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

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const agentIcons: Record<string, typeof Building2> = {
  "The Architect": Lightbulb,
  "Empire Eva": Building2,
  "Brand Kit": Sparkles,
  "Doc Builder": Shield,
  "Site Builder": Wrench,
  "Compliance Coach": Calendar,
  "Max Credit": CreditCard,
  "Biz Builder Brock": TrendingUp,
  "Revenue Rex": DollarSign,
  "Growth Engine": Rocket,
};

function TryFreePage() {
  const [idea, setIdea] = useState("");
  const [country, setCountry] = useState("");
  const [budget, setBudget] = useState("");
  const [generating, setGenerating] = useState(false);
  const [plan, setPlan] = useState<BusinessPlan | null>(null);
  const [error, setError] = useState("");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    names: true, entity: true, market: false, revenue: false,
    costs: false, tools: false, plan90: false, agents: true,
    advantages: false, risks: false, projections: false,
  });

  const toggleSection = (key: string) =>
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleGenerate = async () => {
    if (!idea.trim() || generating) return;
    setGenerating(true);
    setError("");
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
        setError(err.error || "Failed to generate plan");
        setGenerating(false);
        return;
      }

      const result = await resp.json();
      if (result.plan) {
        setPlan(result.plan);
        // Save to database for later retrieval
        try {
          await supabase.from("trial_plans").insert({
            business_idea: idea.trim(),
            plan_content: JSON.stringify(result.plan),
            email: null,
            user_id: null,
          });
        } catch {
          // Non-critical — don't block the user
        }
      } else {
        setError("No plan was generated. Try a more detailed description.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setGenerating(false);
  };

  const Section = ({ id, title, icon: Icon, children, locked = false }: {
    id: string; title: string; icon: typeof Building2; children: React.ReactNode; locked?: boolean;
  }) => (
    <div className="border border-border rounded-xl overflow-hidden bg-card">
      <button
        onClick={() => !locked && toggleSection(id)}
        className={cn(
          "w-full flex items-center justify-between p-4 text-left transition-colors",
          locked ? "opacity-60 cursor-not-allowed" : "hover:bg-accent/30"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            {locked ? <Lock className="w-4 h-4 text-muted-foreground" /> : <Icon className="w-4 h-4 text-primary" />}
          </div>
          <span className="font-heading text-sm font-semibold">{title}</span>
          {locked && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              Sign up to unlock
            </span>
          )}
        </div>
        {!locked && (expandedSections[id] ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />)}
      </button>
      <AnimatePresence>
        {!locked && expandedSections[id] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 text-sm text-muted-foreground">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Logo size={28} />
            <span className="font-heading text-sm font-bold tracking-wider text-primary">AI KOACHED</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button size="sm" variant="ghost" className="text-muted-foreground text-xs">Login</Button>
            </Link>
            <Link to="/login">
              <Button size="sm" className="bg-primary text-primary-foreground text-xs">Sign Up Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 pt-24 pb-20">
        {/* Hero */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-medium mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            100% Free — No Signup Required
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Describe Your Idea.{" "}
            <span className="text-primary">AI Builds Your Blueprint.</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Type what you want to do. In 60 seconds, AI generates your business plan, entity strategy, revenue model, and 90-day roadmap.
          </p>
        </motion.div>

        {/* Input */}
        {!plan && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}>
            <div className="p-6 rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-bold">What's Your Business Idea?</h2>
                  <p className="text-xs text-muted-foreground">Even a vague idea works — AI will fill in the gaps.</p>
                </div>
              </div>

              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Example: I want to start a mobile car detailing business in Atlanta. I love cars but don't know anything about running a business..."
                className="w-full h-28 rounded-xl border border-border bg-background p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 mb-4"
                maxLength={5000}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    <MapPin className="w-3 h-3 inline mr-1" />Country (optional)
                  </label>
                  <Input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g. United States" className="bg-background text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    <Banknote className="w-3 h-3 inline mr-1" />Starting budget (optional)
                  </label>
                  <Input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g. $500" className="bg-background text-sm" />
                </div>
              </div>

              <Button onClick={handleGenerate} disabled={generating || !idea.trim()} size="lg" className="bg-primary text-primary-foreground gap-2 w-full">
                {generating ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> AI is building your plan (~60 seconds)...</>
                ) : (
                  <><Sparkles className="w-5 h-5" /> Generate My Free Business Plan</>
                )}
              </Button>

              {error && (
                <div className="mt-4 p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">{error}</div>
              )}
            </div>

            {/* Trust signals */}
            <div className="flex items-center justify-center gap-6 mt-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> No credit card</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> No signup</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Real AI, real plan</span>
            </div>
          </motion.div>
        )}

        {/* Plan Results */}
        {plan && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            {/* Summary Header */}
            <div className="p-5 rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="font-heading text-xl font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Your AI Business Blueprint
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">{plan.business_summary}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => setPlan(null)} className="text-xs shrink-0">
                  Try Another Idea
                </Button>
              </div>
            </div>

            {/* FREE Sections */}
            <Section id="names" title="Suggested Business Names" icon={Sparkles}>
              <div className="flex flex-wrap gap-2">
                {plan.business_name_suggestions.map((n) => (
                  <span key={n} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium">{n}</span>
                ))}
              </div>
            </Section>

            <Section id="entity" title={`Entity: ${plan.entity_recommendation.type} in ${plan.entity_recommendation.state}`} icon={Building2}>
              <p>{plan.entity_recommendation.why}</p>
            </Section>

            <Section id="agents" title="Your AI Agent Roadmap (10 Steps)" icon={Bot}>
              <div className="space-y-2">
                {plan.agent_roadmap.map((a) => {
                  const AgentIcon = agentIcons[a.agent] || Bot;
                  return (
                    <div key={a.step} className="flex items-start gap-3 p-2 rounded-lg bg-accent/20">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <AgentIcon className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground">Step {a.step}: {a.agent}</p>
                        <p className="text-xs text-muted-foreground">{a.action}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>

            <Section id="market" title="Target Market Analysis" icon={Target}>
              <p className="mb-2"><strong>Who:</strong> {plan.target_market.description}</p>
              <p className="mb-2"><strong>Demographics:</strong> {plan.target_market.demographics}</p>
              <p className="font-medium text-foreground mb-1">Pain Points:</p>
              <ul className="list-disc list-inside space-y-1">
                {plan.target_market.pain_points.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </Section>

            <Section id="revenue" title={`Revenue Model: ${plan.revenue_model.pricing_suggestion}`} icon={DollarSign}>
              <p className="mb-2"><strong>Primary:</strong> {plan.revenue_model.primary}</p>
              <p className="font-medium text-foreground mb-1">Secondary Streams:</p>
              <ul className="list-disc list-inside space-y-1">
                {plan.revenue_model.secondary_streams.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </Section>

            <Section id="projections" title="Revenue Projections" icon={TrendingUp}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                {[
                  { label: "Month 1", value: plan.revenue_projection.month_1 },
                  { label: "Month 3", value: plan.revenue_projection.month_3 },
                  { label: "Month 6", value: plan.revenue_projection.month_6 },
                  { label: "Month 12", value: plan.revenue_projection.month_12 },
                ].map((p) => (
                  <div key={p.label} className="p-3 rounded-lg bg-accent/20 text-center">
                    <p className="text-[10px] text-muted-foreground mb-1">{p.label}</p>
                    <p className="font-mono text-sm font-bold text-primary">{p.value}</p>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground italic">{plan.revenue_projection.disclaimer}</p>
            </Section>

            {/* LOCKED Sections — tease to sign up */}
            <Section id="costs" title="Full Startup Cost Breakdown" icon={Banknote} locked>
              <p>Sign up to see detailed costs</p>
            </Section>

            <Section id="tools" title="Tools & Software Stack" icon={Wrench} locked>
              <p>Sign up to see tools</p>
            </Section>

            <Section id="plan90" title="Full 90-Day Launch Plan" icon={Calendar} locked>
              <p>Sign up to see plan</p>
            </Section>

            <Section id="risks" title="Risk Analysis & Solutions" icon={Shield} locked>
              <p>Sign up to see risks</p>
            </Section>

            <Section id="advantages" title="Competitive Advantages" icon={Users} locked>
              <p>Sign up to see advantages</p>
            </Section>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 p-6 rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 to-accent/10 text-center"
            >
              <Crown className="w-10 h-10 text-primary mx-auto mb-3" />
              <h3 className="font-heading text-xl font-bold mb-2">
                Ready to Build This Business?
              </h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                Sign up to unlock your full plan, get AI agents working 24/7, and start building your empire — step by step.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
                <Link to="/login">
                  <Button size="lg" className="bg-primary text-primary-foreground gap-2 font-semibold px-8">
                    Sign Up Free & Start Building
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-primary" /> Free tier available</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-primary" /> No credit card needed</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-primary" /> Cancel anytime</span>
              </div>

              {/* Pay-as-you-go teaser */}
              <div className="mt-4 p-4 rounded-xl bg-background/50 border border-border">
                <p className="text-xs font-medium text-foreground mb-2">Or start with Pay-As-You-Go steps:</p>
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div className="p-2 rounded-lg bg-accent/20">
                    <p className="font-bold text-primary">$9</p>
                    <p className="text-muted-foreground">Business Plan Guide</p>
                  </div>
                  <div className="p-2 rounded-lg bg-accent/20">
                    <p className="font-bold text-primary">$19</p>
                    <p className="text-muted-foreground">Entity Formation</p>
                  </div>
                  <div className="p-2 rounded-lg bg-accent/20">
                    <p className="font-bold text-primary">$29</p>
                    <p className="text-muted-foreground">Credit Building</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
