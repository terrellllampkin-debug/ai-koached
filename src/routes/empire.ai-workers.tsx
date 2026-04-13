import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Building2, CreditCard, DollarSign, Coins, Send, Sparkles,
  Bot, ChevronRight, ArrowRight, Wrench, Briefcase, Users,
  Newspaper, Zap, FileText, Palette, CalendarCheck, Globe,
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
];

function AIWorkersPage() {
  const { user, isAuthenticated } = useAuth();
  const [activeWorker, setActiveWorker] = useState("ceo_coach");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [dailyIntel, setDailyIntel] = useState<Array<{ id: string; category: string; title: string; content: string }>>([]);
  const [showIntel, setShowIntel] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const worker = WORKERS.find((w) => w.id === activeWorker) || WORKERS[0];

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
          // Welcome message
          if (activeWorker === "ceo_coach") {
            setMessages([
              {
                role: "assistant",
                content: `Welcome to AI KOACHED, CEO! 🏗️\n\nI'm **The Architect** — your Master AI Business Builder. I'm going to build your entire business from the ground up, even if you're starting with zero knowledge.\n\nI'll ask you every important question, create your business plan, then dispatch my team of AI specialists to handle each piece.\n\n**Let's start with the most important question:**\n\nWhat are you passionate about? What skills do you have? What do people always come to you for help with?`,
              },
            ]);
          } else {
            setMessages([
              {
                role: "assistant",
                content: `Hey CEO! I'm **${worker.name}**, your ${worker.role} specialist. I'm ready to work on this part of your business. What do you need help with?`,
              },
            ]);
          }
        }
      });
  }, [user, activeWorker, worker.name, worker.role]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isStreaming) return;

    const userMsg = input.trim();
    setInput("");
    const userEntry: ChatMsg = { role: "user", content: userMsg };
    setMessages((prev) => [...prev, userEntry]);
    setIsStreaming(true);

    // Save user message
    if (user) {
      supabase.from("chat_messages").insert({
        user_id: user.id,
        agent: activeWorker,
        role: "user",
        content: userMsg,
      }).then(() => {});
    }

    let assistantSoFar = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userEntry].map((m) => ({ role: m.role, content: m.content })),
          agent: activeWorker,
        }),
      });

      if (!resp.ok || !resp.body) {
        const err = await resp.json().catch(() => ({ error: "Connection failed" }));
        setMessages((prev) => [
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
              setMessages((prev) => {
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

      // Save assistant message
      if (user && assistantSoFar) {
        supabase.from("chat_messages").insert({
          user_id: user.id,
          agent: activeWorker,
          role: "assistant",
          content: assistantSoFar,
        }).then(() => {});
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Connection error. Please try again." },
      ]);
    } finally {
      setIsStreaming(false);
      inputRef.current?.focus();
    }
  }, [input, isStreaming, messages, activeWorker, user]);

  if (!isAuthenticated) return null;

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
              Your AI team builds everything
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {WORKERS.map((w) => {
              const isActive = w.id === activeWorker;
              return (
                <button
                  key={w.id}
                  onClick={() => setActiveWorker(w.id)}
                  className={cn(
                    "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all",
                    isActive
                      ? "bg-primary/10 border border-primary/30"
                      : "hover:bg-muted/50 border border-transparent"
                  )}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: w.color + "20" }}
                  >
                    <w.icon className="w-4 h-4" style={{ color: w.color }} />
                  </div>
                  <div className="min-w-0">
                    <p className={cn("text-sm font-semibold truncate", isActive && "text-primary")}>
                      {w.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">{w.role}</p>
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

          {/* Daily Intel Panel */}
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
                    <div
                      key={item.id}
                      className="p-2 rounded-lg bg-muted/30 border border-border"
                    >
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="text-[8px] font-mono uppercase text-accent font-bold">
                          {item.category.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-[10px] font-medium leading-tight">{item.title}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Start fresh */}
          <div className="p-3 border-t border-border">
            <p className="text-[10px] text-muted-foreground text-center mb-2">
              Start with <strong>The Architect</strong> if you're new
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs gap-1"
              onClick={() => setActiveWorker("ceo_coach")}
            >
              <Briefcase className="w-3 h-3" />
              Start Building
              <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card/50">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: worker.color + "15" }}
            >
              <worker.icon className="w-5 h-5" style={{ color: worker.color }} />
            </div>
            <div className="flex-1">
              <h2 className="font-heading text-base font-bold" style={{ color: worker.color }}>
                {worker.name}
              </h2>
              <p className="text-xs text-muted-foreground">{worker.description}</p>
            </div>
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
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
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

          {/* Quick action chips for Architect */}
          {activeWorker === "ceo_coach" && messages.length <= 2 && (
            <div className="px-6 pb-2 flex flex-wrap gap-2">
              {[
                "I want to start a business but don't know where to begin",
                "I have a business idea, help me build it",
                "I'm outside the US — help me start a business in my country",
                "I want to start an international online business",
                "Help me find a digital nomad visa so I can work remotely",
                "I want to join the B2B community and sell to other businesses",
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => {
                    setInput(prompt);
                    setTimeout(() => inputRef.current?.focus(), 50);
                  }}
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
              +5 $KOACHED per interaction • AI workers never sleep 🤖
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
