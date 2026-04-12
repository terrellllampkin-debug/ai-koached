import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  Sparkles, ArrowRight, CheckCircle, Building2, CreditCard,
  DollarSign, Coins, Briefcase, ShoppingCart, Code, Palette,
} from "lucide-react";

export const Route = createFileRoute("/empire/onboarding")({
  head: () => ({
    meta: [
      { title: "Welcome — AI KOACHED" },
      { name: "description", content: "Set up your empire profile." },
    ],
  }),
  component: OnboardingPage,
});

const businessTypes = [
  { id: "ecommerce", label: "E-Commerce", icon: ShoppingCart },
  { id: "agency", label: "Agency / Services", icon: Briefcase },
  { id: "saas", label: "SaaS / Tech", icon: Code },
  { id: "creative", label: "Creative / Content", icon: Palette },
  { id: "real_estate", label: "Real Estate", icon: Building2 },
  { id: "other", label: "Other", icon: Sparkles },
];

const goals = [
  { id: "credit", label: "Build Business Credit", icon: CreditCard },
  { id: "entity", label: "Form Business Entity", icon: Building2 },
  { id: "revenue", label: "Hit $12K/Month", icon: DollarSign },
  { id: "koach", label: "Earn $KOACH Rewards", icon: Coins },
];

function OnboardingPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  if (isLoading) return null;
  if (!isAuthenticated) {
    navigate({ to: "/login" });
    return null;
  }

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from("profiles").update({
      display_name: displayName || undefined,
      business_type: businessType || undefined,
      onboarding_complete: true,
    }).eq("user_id", user.id);

    // Create initial milestones based on goals
    const milestones = selectedGoals.map((g) => {
      const m: Record<string, { key: string; title: string; desc: string }> = {
        credit: { key: "first_credit_account", title: "Open First Credit Account", desc: "Open a Net-30 vendor account" },
        entity: { key: "first_entity", title: "Form First Entity", desc: "File your first LLC, Corp, or Trust" },
        revenue: { key: "first_1k", title: "Hit $1K/Month", desc: "Reach $1,000 in monthly revenue" },
        koach: { key: "earn_1000_koach", title: "Earn 1,000 $KOACH", desc: "Accumulate 1,000 $KOACH tokens" },
      };
      return m[g];
    }).filter(Boolean);

    if (milestones.length > 0) {
      await supabase.from("milestones").insert(
        milestones.map((m) => ({
          user_id: user.id,
          milestone_key: m!.key,
          title: m!.title,
          description: m!.desc,
        }))
      );
    }

    navigate({ to: "/empire" });
  };

  const steps = [
    // Step 0: Welcome
    <motion.div key="welcome" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
      <Logo size={64} />
      <h1 className="font-heading text-3xl font-bold mt-6">Welcome, CEO</h1>
      <p className="text-muted-foreground mt-2 max-w-md mx-auto">
        Let's set up your empire in 30 seconds. Your AI team is ready to work.
      </p>
      <div className="mt-6 p-4 rounded-xl border border-primary/20 bg-primary/5 inline-flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <span className="font-mono text-sm font-bold text-primary">+500 $KOACH</span>
        <span className="text-xs text-muted-foreground">welcome bonus credited!</span>
      </div>
      <div className="mt-8">
        <Button size="lg" onClick={() => setStep(1)} className="bg-primary text-primary-foreground gap-2 px-8">
          Let's Go <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>,

    // Step 1: Name + Business Type
    <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-md mx-auto">
      <h2 className="font-heading text-2xl font-bold text-center">What should we call you?</h2>
      <Input
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder="Your name"
        className="mt-6 bg-card border-border text-center text-lg"
      />
      <h3 className="font-heading text-lg font-semibold mt-8 mb-4 text-center">What's your business?</h3>
      <div className="grid grid-cols-2 gap-3">
        {businessTypes.map((bt) => (
          <button
            key={bt.id}
            onClick={() => setBusinessType(bt.id)}
            className={`p-4 rounded-xl border text-left transition-all ${
              businessType === bt.id
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/30"
            }`}
          >
            <bt.icon className={`w-5 h-5 mb-2 ${businessType === bt.id ? "text-primary" : "text-muted-foreground"}`} />
            <p className="text-sm font-medium">{bt.label}</p>
          </button>
        ))}
      </div>
      <Button
        size="lg"
        onClick={() => setStep(2)}
        className="w-full mt-6 bg-primary text-primary-foreground gap-2"
        disabled={!displayName.trim()}
      >
        Continue <ArrowRight className="w-4 h-4" />
      </Button>
    </motion.div>,

    // Step 2: Goals
    <motion.div key="goals" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-md mx-auto">
      <h2 className="font-heading text-2xl font-bold text-center">What are your goals?</h2>
      <p className="text-muted-foreground text-center mt-2">Select all that apply — we'll set up milestones for you.</p>
      <div className="space-y-3 mt-6">
        {goals.map((g) => (
          <button
            key={g.id}
            onClick={() => toggleGoal(g.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
              selectedGoals.includes(g.id)
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/30"
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              selectedGoals.includes(g.id) ? "bg-primary/20" : "bg-muted"
            }`}>
              <g.icon className={`w-5 h-5 ${selectedGoals.includes(g.id) ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <span className="font-medium text-sm">{g.label}</span>
            {selectedGoals.includes(g.id) && (
              <CheckCircle className="w-5 h-5 text-primary ml-auto" />
            )}
          </button>
        ))}
      </div>
      <Button
        size="lg"
        onClick={handleFinish}
        className="w-full mt-6 bg-primary text-primary-foreground gap-2"
        disabled={saving}
      >
        {saving ? "Setting up..." : "Enter Your Empire"} <ArrowRight className="w-4 h-4" />
      </Button>
    </motion.div>,
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      {/* Progress */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
        <motion.div
          className="h-full bg-primary"
          animate={{ width: `${((step + 1) / 3) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <AnimatePresence mode="wait">
        {steps[step]}
      </AnimatePresence>
    </div>
  );
}
