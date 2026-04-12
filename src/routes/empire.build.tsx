import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Building2, CreditCard, DollarSign, Coins, CheckCircle2,
  ChevronRight, ChevronLeft, Sparkles, ArrowRight, Lock,
  Send, Rocket, Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/empire/build")({
  head: () => ({
    meta: [
      { title: "Build Your Empire — AI KOACHED" },
      { name: "description", content: "Step-by-step guided wizard to build your full business." },
    ],
  }),
  component: BuildWizardPage,
});

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

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

function BuildWizardPage() {
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<TaskCompletion>({});
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const step = STEPS[currentStep];

  // Load milestones to pre-check tasks
  useEffect(() => {
    if (!user) return;
    supabase
      .from("milestones")
      .select("milestone_key, completed")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (data) {
          const map: TaskCompletion = {};
          data.forEach((m) => {
            if (m.completed) map[m.milestone_key] = true;
          });
          setCompletedTasks(map);
        }
      });
  }, [user]);

  // Reset chat when step changes
  useEffect(() => {
    setChatMessages([
      {
        role: "assistant",
        content: `Hey CEO! 👋 I'm ${step.agentName}. Let's work on **${step.title}** together. Ask me anything about this step, or I'll guide you through each task!`,
      },
    ]);
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
    const done = STEPS.reduce(
      (sum, s) => sum + s.tasks.filter((t) => completedTasks[t.key]).length,
      0
    );
    return Math.round((done / total) * 100);
  };

  const toggleTask = async (key: string) => {
    if (!user) return;
    const newVal = !completedTasks[key];
    setCompletedTasks((prev) => ({ ...prev, [key]: newVal }));

    // Upsert milestone
    const taskMeta = STEPS.flatMap((s) => s.tasks).find((t) => t.key === key);
    if (newVal) {
      await supabase.from("milestones").upsert(
        {
          user_id: user.id,
          milestone_key: key,
          title: taskMeta?.label || key,
          completed: true,
          completed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,milestone_key" }
      );
    } else {
      await supabase
        .from("milestones")
        .update({ completed: false, completed_at: null })
        .eq("user_id", user.id)
        .eq("milestone_key", key);
    }
  };

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
        }),
      });

      if (!resp.ok || !resp.body) {
        const err = await resp.json().catch(() => ({ error: "Connection failed" }));
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: `⚠️ ${err.error || "Something went wrong."}` },
        ]);
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
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Connection error. Please try again." },
      ]);
    } finally {
      setIsStreaming(false);
    }
  }, [chatInput, isStreaming, chatMessages, step.agent]);

  if (!isAuthenticated) return null;

  const pct = overallProgress();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Rocket className="w-7 h-7 text-primary" />
            <h1 className="font-heading text-2xl font-bold">Build Your Empire</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Follow this guided path to build your full business — entity, credit, revenue, and tokens.
          </p>

          {/* Overall progress */}
          <div className="mt-4 flex items-center gap-3">
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
        <div className="grid grid-cols-4 gap-2 mb-8">
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
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${prog}%`, backgroundColor: s.color }}
                  />
                </div>
                {prog === 100 && (
                  <CheckCircle2
                    className="absolute top-2 right-2 w-4 h-4"
                    style={{ color: s.color }}
                  />
                )}
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
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: step.color + "20" }}
                  >
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
                          isDone
                            ? "border-primary/30 bg-primary/5"
                            : "border-border hover:border-primary/20 hover:bg-muted/50"
                        )}
                      >
                        <div
                          className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                            isDone ? "border-primary bg-primary" : "border-muted-foreground/30"
                          )}
                        >
                          {isDone && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
                        </div>
                        <span
                          className={cn(
                            "text-sm",
                            isDone && "line-through text-muted-foreground"
                          )}
                        >
                          {task.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Link to full module */}
                <Link
                  to={step.empireLink}
                  className="mt-4 flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  {step.empireLabel}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Step navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentStep((p) => Math.max(0, p - 1))}
                  disabled={currentStep === 0}
                  className="gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </Button>
                <span className="text-xs text-muted-foreground font-mono">
                  Step {currentStep + 1} of {STEPS.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentStep((p) => Math.min(STEPS.length - 1, p + 1))}
                  disabled={currentStep === STEPS.length - 1}
                  className="gap-1"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Right: Embedded AI coach chat */}
            <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden" style={{ height: "520px" }}>
              {/* Chat header */}
              <div
                className="flex items-center gap-3 px-4 py-3 border-b border-border"
                style={{ backgroundColor: step.color + "08" }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: step.color + "20" }}
                >
                  <Sparkles className="w-4 h-4" style={{ color: step.color }} />
                </div>
                <div>
                  <h3 className="text-sm font-heading font-semibold" style={{ color: step.color }}>
                    {step.agentName}
                  </h3>
                  <p className="text-[10px] text-muted-foreground">Guiding you through {step.title.toLowerCase()}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-xl px-3.5 py-2 text-sm leading-relaxed",
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      )}
                    >
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

              {/* Input */}
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
                  <Button
                    size="icon"
                    onClick={handleChat}
                    disabled={!chatInput.trim() || isStreaming}
                    className="shrink-0"
                    style={{ backgroundColor: step.color }}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Completion celebration */}
        {pct === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 p-8 rounded-2xl border-2 border-primary bg-gradient-to-br from-primary/10 to-accent/10 text-center"
          >
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
